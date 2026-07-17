import { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_BRAND } from './data/catalog';
import { BrandManager } from './components/BrandManager';
import { Dashboard } from './components/Dashboard';
import { Studio } from './components/Studio';
import { TemplateLibrary } from './components/TemplateLibrary';
import {
  deleteBrand,
  deleteProject,
  duplicateProject,
  saveBrand,
  saveProject,
  saveSettings,
  seedStudio,
} from './lib/storage';
import type { BrandKit, CreativeProject, WorkspaceView } from './types';
import './styles/product.css';

export default function ProductApp() {
  const [view, setView] = useState<WorkspaceView>('dashboard');
  const [projects, setProjects] = useState<CreativeProject[]>([]);
  const [brands, setBrands] = useState<BrandKit[]>([]);
  const [activeProject, setActiveProject] = useState<CreativeProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'error'>('saved');
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    void seedStudio()
      .then((data) => {
        setProjects(data.projects);
        setBrands(data.brands);
      })
      .catch(() => setLoadError('Local project storage is unavailable. You can still explore, but projects may not persist.'))
      .finally(() => setLoading(false));
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, []);

  const activeBrand = useMemo(
    () => brands.find((brand) => brand.id === activeProject?.brandKitId) ?? brands[0] ?? DEFAULT_BRAND,
    [activeProject?.brandKitId, brands],
  );

  const queueSave = (next: CreativeProject) => {
    setActiveProject(next);
    setProjects((current) => {
      const exists = current.some((project) => project.id === next.id);
      const updated = exists ? current.map((project) => project.id === next.id ? next : project) : [next, ...current];
      return updated.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    });
    setSaveState('saving');
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void saveProject(next)
        .then(() => Promise.all([
          saveSettings({ onboardingComplete: true, lastProjectId: next.id }),
          Promise.resolve(setSaveState('saved')),
        ]))
        .catch(() => setSaveState('error'));
    }, 450);
  };

  const openProject = (project: CreativeProject) => {
    setActiveProject(project);
    setView('studio');
  };

  const useTemplate = (project: CreativeProject) => {
    const next = { ...project, brandKitId: activeBrand.id };
    setProjects((current) => [next, ...current]);
    setActiveProject(next);
    setView('studio');
    void saveProject(next).catch(() => setSaveState('error'));
  };

  const handleDuplicate = (project: CreativeProject) => {
    const next = duplicateProject(project);
    setProjects((current) => [next, ...current]);
    void saveProject(next);
  };

  const handleDelete = (project: CreativeProject) => {
    if (!window.confirm(`Delete “${project.name}”? This cannot be undone.`)) return;
    setProjects((current) => current.filter((item) => item.id !== project.id));
    void deleteProject(project.id);
  };

  const handleBrandSave = (brand: BrandKit) => {
    setBrands((current) => {
      const exists = current.some((item) => item.id === brand.id);
      return exists ? current.map((item) => item.id === brand.id ? brand : item) : [brand, ...current];
    });
    void saveBrand(brand);
  };

  const handleBrandDelete = (brand: BrandKit) => {
    if (!window.confirm(`Delete the “${brand.name}” brand kit?`)) return;
    setBrands((current) => current.filter((item) => item.id !== brand.id));
    void deleteBrand(brand.id);
  };

  if (loading) {
    return <div className="os-loading"><span className="os-logo-mark">AS</span><p>Loading your creative system…</p></div>;
  }

  if (view === 'studio' && activeProject) {
    return <Studio project={activeProject} brands={brands.length ? brands : [DEFAULT_BRAND]} saveState={saveState} onChange={queueSave} onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="os-shell">
      <header className="os-header">
        <a className="os-brand" href="/" aria-label="Ad Studio OS home"><span className="os-logo-mark">AS</span><span>Ad Studio OS<small>Creative production system</small></span></a>
        <nav aria-label="Product">
          <button type="button" className={view === 'dashboard' ? 'is-active' : ''} onClick={() => setView('dashboard')}>Projects</button>
          <button type="button" className={view === 'templates' ? 'is-active' : ''} onClick={() => setView('templates')}>Templates</button>
          <button type="button" className={view === 'brands' ? 'is-active' : ''} onClick={() => setView('brands')}>Brand kits</button>
        </nav>
        <button className="os-button os-button--primary os-header__new" type="button" onClick={() => setView('templates')}>New family</button>
      </header>
      {loadError && <div className="os-storage-warning" role="alert">{loadError}</div>}
      <main>
        {view === 'dashboard' && <Dashboard projects={projects} brands={brands} onOpen={openProject} onCreate={() => setView('templates')} onDuplicate={handleDuplicate} onDelete={handleDelete} />}
        {view === 'templates' && <TemplateLibrary brand={activeBrand} onUse={useTemplate} />}
        {view === 'brands' && <BrandManager brands={brands} onSave={handleBrandSave} onDelete={handleBrandDelete} />}
      </main>
      <footer className="os-footer"><span>Ad Studio OS · Local-first beta</span><span>Projects and assets stay in this browser.</span></footer>
    </div>
  );
}
