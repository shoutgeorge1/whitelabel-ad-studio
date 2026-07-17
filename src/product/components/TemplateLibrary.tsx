import { useMemo, useState } from 'react';
import { createProject, PLACEMENTS, TEMPLATES } from '../data/catalog';
import type { BrandKit, CreativeProject, TemplateCategory } from '../types';
import { CreativePreview } from './CreativePreview';

type Props = {
  brand: BrandKit;
  onUse: (project: CreativeProject) => void;
};

export function TemplateLibrary({ brand, onUse }: Props) {
  const [category, setCategory] = useState<TemplateCategory | 'All'>('All');
  const categories = useMemo(() => ['All', ...new Set(TEMPLATES.map((template) => template.category))] as const, []);
  const templates = category === 'All' ? TEMPLATES : TEMPLATES.filter((template) => template.category === category);
  return (
    <section className="os-page">
      <div className="os-page__heading">
        <div>
          <p className="os-kicker">Component systems</p>
          <h1>Template library</h1>
          <p>Each system defines composition, copy constraints, image behavior, banner simplification, and motion eligibility.</p>
        </div>
      </div>
      <div className="template-filters" aria-label="Template categories">
        {categories.map((item) => (
          <button key={item} type="button" className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
      <div className="template-grid">
        {templates.map((template) => {
          const project = createProject(template.id, brand.id);
          const variant = project.variants[0];
          const placement = PLACEMENTS[0];
          return (
            <article className="template-card" key={template.id}>
              <div className={`template-card__preview template-${template.thumbnailVariant}`}>
                <CreativePreview project={project} brand={brand} template={template} variant={variant} placement={placement} />
              </div>
              <div className="template-card__body">
                <span className="template-card__category">{template.category}</span>
                <h2>{template.name}</h2>
                <p>{template.description}</p>
                <div className="template-card__tags">{template.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="template-card__meta">
                  <span>{template.supportedPlacementIds.length} placements</span>
                  <span>{template.motionPresets.length > 1 ? 'Motion ready' : 'Static'}</span>
                </div>
                <button className="os-button os-button--primary" type="button" onClick={() => onUse(project)}>Use template</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
