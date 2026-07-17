import type { BrandKit, CreativeProject } from '../types';

type Props = {
  projects: CreativeProject[];
  brands: BrandKit[];
  onOpen: (project: CreativeProject) => void;
  onCreate: () => void;
  onDuplicate: (project: CreativeProject) => void;
  onDelete: (project: CreativeProject) => void;
};

function relativeDate(value: string): string {
  const timestamp = new Date(value).getTime();
  const delta = Date.now() - timestamp;
  if (delta < 60_000) return 'Just now';
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)}m ago`;
  if (delta < 86_400_000) return `${Math.floor(delta / 3_600_000)}h ago`;
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(timestamp);
}

export function Dashboard({ projects, brands, onOpen, onCreate, onDuplicate, onDelete }: Props) {
  return (
    <section className="os-page">
      <div className="os-page__heading">
        <div>
          <p className="os-kicker">Creative operations</p>
          <h1>Creative families</h1>
          <p>Build one controlled concept, review every placement, and hand off an organized package.</p>
        </div>
        <button className="os-button os-button--primary" type="button" onClick={onCreate}>
          New creative family
        </button>
      </div>

      <div className="os-stats" aria-label="Project overview">
        <div><strong>{projects.length}</strong><span>Projects</span></div>
        <div><strong>{projects.filter((project) => project.status === 'export-ready').length}</strong><span>Export ready</span></div>
        <div><strong>{brands.length}</strong><span>Brand kits</span></div>
        <div><strong>9</strong><span>Core placements</span></div>
      </div>

      {projects.length === 0 ? (
        <div className="os-empty">
          <span className="os-empty__mark">AS</span>
          <h2>Start your first creative system</h2>
          <p>Choose a template, add your brand and message, then review the full placement family.</p>
          <button className="os-button os-button--primary" type="button" onClick={onCreate}>Create project</button>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => {
            const brand = brands.find((item) => item.id === project.brandKitId);
            const variant = project.variants.find((item) => item.id === project.activeVariantId) ?? project.variants[0];
            return (
              <article className="project-card" key={project.id}>
                <button className="project-card__open" type="button" onClick={() => onOpen(project)}>
                  <span className="project-card__art" style={{ background: `linear-gradient(135deg, ${brand?.primary ?? '#08111f'} 0 58%, ${brand?.accent ?? '#c7f464'} 58%)` }}>
                    <span>{project.concept}</span>
                  </span>
                  <span className="project-card__body">
                    <span className={`os-status os-status--${project.status}`}>{project.status.replace('-', ' ')}</span>
                    <strong>{project.name}</strong>
                    <small>{brand?.name ?? 'Unknown brand'} · {project.campaign}</small>
                    <span className="project-card__meta">
                      <span>{variant?.name ?? 'Primary'} · V{String(variant?.version ?? 1).padStart(2, '0')}</span>
                      <span>{relativeDate(project.updatedAt)}</span>
                    </span>
                  </span>
                </button>
                <div className="project-card__actions">
                  <button type="button" onClick={() => onDuplicate(project)}>Duplicate</button>
                  <button type="button" className="is-danger" onClick={() => onDelete(project)}>Delete</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
