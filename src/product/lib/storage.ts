import { createDemoProject, DEFAULT_BRAND } from '../data/catalog';
import type { BrandKit, CreativeProject } from '../types';

const DB_NAME = 'ad-studio-os';
const DB_VERSION = 2;
const PROJECTS = 'projects';
const BRANDS = 'brands';
const SETTINGS = 'settings';

type StudioSettings = {
  onboardingComplete: boolean;
  lastProjectId?: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PROJECTS)) {
        const store = db.createObjectStore(PROJECTS, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
      }
      if (!db.objectStoreNames.contains(BRANDS)) {
        const store = db.createObjectStore(BRANDS, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
      }
      if (!db.objectStoreNames.contains(SETTINGS)) db.createObjectStore(SETTINGS);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionRequest<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then((db) => new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const request = operation(transaction.objectStore(storeName));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  }));
}

function normalizeProject(value: unknown): CreativeProject | null {
  if (!value || typeof value !== 'object') return null;
  const project = value as Partial<CreativeProject>;
  if (project.schemaVersion !== 2 || !project.id || !Array.isArray(project.variants)) return null;
  return project as CreativeProject;
}

export async function listProjects(): Promise<CreativeProject[]> {
  const values = await transactionRequest<CreativeProject[]>(PROJECTS, 'readonly', (store) => store.getAll());
  return values.map(normalizeProject).filter((project): project is CreativeProject => project !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProject(id: string): Promise<CreativeProject | null> {
  const value = await transactionRequest<CreativeProject | undefined>(PROJECTS, 'readonly', (store) => store.get(id));
  return normalizeProject(value);
}

export async function saveProject(project: CreativeProject): Promise<void> {
  await transactionRequest<IDBValidKey>(PROJECTS, 'readwrite', (store) => store.put(project));
}

export async function deleteProject(id: string): Promise<void> {
  await transactionRequest<undefined>(PROJECTS, 'readwrite', (store) => store.delete(id));
}

export async function listBrands(): Promise<BrandKit[]> {
  const values = await transactionRequest<BrandKit[]>(BRANDS, 'readonly', (store) => store.getAll());
  return values.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveBrand(brand: BrandKit): Promise<void> {
  await transactionRequest<IDBValidKey>(BRANDS, 'readwrite', (store) => store.put(brand));
}

export async function deleteBrand(id: string): Promise<void> {
  if (id === DEFAULT_BRAND.id) throw new Error('The default brand cannot be deleted.');
  await transactionRequest<undefined>(BRANDS, 'readwrite', (store) => store.delete(id));
}

export async function getSettings(): Promise<StudioSettings> {
  const value = await transactionRequest<StudioSettings | undefined>(SETTINGS, 'readonly', (store) => store.get('studio'));
  return value ?? { onboardingComplete: false };
}

export async function saveSettings(settings: StudioSettings): Promise<void> {
  await transactionRequest<IDBValidKey>(SETTINGS, 'readwrite', (store) => store.put(settings, 'studio'));
}

export async function seedStudio(): Promise<{ projects: CreativeProject[]; brands: BrandKit[]; settings: StudioSettings }> {
  let [projects, brands, settings] = await Promise.all([listProjects(), listBrands(), getSettings()]);
  if (brands.length === 0) {
    await saveBrand(DEFAULT_BRAND);
    brands = [DEFAULT_BRAND];
  }
  if (projects.length === 0 && !settings.onboardingComplete) {
    const demo = createDemoProject();
    await saveProject(demo);
    settings = { onboardingComplete: true, lastProjectId: demo.id };
    await saveSettings(settings);
    projects = [demo];
  }
  return { projects, brands, settings };
}

export function duplicateProject(source: CreativeProject): CreativeProject {
  const now = new Date().toISOString();
  const variants = source.variants.map((variant) => ({
    ...structuredClone(variant),
    id: `variant-${crypto.randomUUID()}`,
  }));
  return {
    ...structuredClone(source),
    id: `project-${crypto.randomUUID()}`,
    name: `${source.name} copy`,
    variants,
    activeVariantId: variants[0]?.id ?? '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
}
