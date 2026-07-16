import type { Concept } from '../types/concept';
import seedData from '../data/concepts.json';
import { generateSeedConcepts } from './seedConcepts';

const STORAGE_KEY = 'medvirtual-meta-concepts-v3';

export function loadConcepts(): Concept[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Concept[];
    }
  } catch {
    // fall through to seed
  }
  return seedData as Concept[];
}

export function saveConcepts(concepts: Concept[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(concepts));
}

export function resetConcepts(): Concept[] {
  const fresh = generateSeedConcepts();
  saveConcepts(fresh);
  return fresh;
}

export function getConceptById(concepts: Concept[], id: string): Concept | undefined {
  return concepts.find((c) => c.concept_id === id);
}

export function updateConcept(concepts: Concept[], updated: Concept): Concept[] {
  return concepts.map((c) => (c.concept_id === updated.concept_id ? updated : c));
}

export function duplicateConcept(
  concepts: Concept[],
  id: string
): { concepts: Concept[]; duplicate?: Concept } {
  const source = getConceptById(concepts, id);
  if (!source) return { concepts };

  const copyNum = concepts.filter((c) => c.concept_id.startsWith(`${id}-copy`)).length + 1;
  const duplicate: Concept = {
    ...source,
    concept_id: `${id}-copy-${copyNum}`,
    file_name: `${source.file_name}_COPY${copyNum}`,
    production_status: 'Needs layout review',
    notes: source.notes ? `${source.notes} (duplicated)` : 'Duplicated from original concept.',
  };

  const index = concepts.findIndex((c) => c.concept_id === id);
  const next = [...concepts];
  next.splice(index + 1, 0, duplicate);
  saveConcepts(next);
  return { concepts: next, duplicate };
}

export function filterConcepts(
  concepts: Concept[],
  filters: { role?: string; angle?: string; status?: string; search?: string }
): Concept[] {
  return concepts.filter((c) => {
    if (filters.role && filters.role !== 'all' && c.role !== filters.role) return false;
    if (filters.angle && filters.angle !== 'all' && c.angle !== filters.angle) return false;
    if (filters.status && filters.status !== 'all' && c.production_status !== filters.status)
      return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = [
        c.concept_id,
        c.role,
        c.angle,
        c.on_image_hook,
        c.headline,
        c.file_name,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
