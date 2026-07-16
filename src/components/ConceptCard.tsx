import { Link } from 'react-router-dom';
import type { Concept } from '../types/concept';
import { AdPreviewScaler } from './AdPreview';
import { StatusBadge } from './StatusBadge';
import './ConceptCard.css';

interface ConceptCardProps {
  concept: Concept;
  onExport: (concept: Concept) => void;
}

export function ConceptCard({ concept, onExport }: ConceptCardProps) {
  return (
    <article className="concept-card">
      <div className="concept-card__preview">
        <AdPreviewScaler concept={concept} maxWidth={220} />
      </div>
      <div className="concept-card__body">
        <div className="concept-card__meta">
          <span className="concept-card__id">{concept.concept_id}</span>
          <StatusBadge status={concept.production_status} />
        </div>
        <p className="concept-card__role">{concept.role}</p>
        <p className="concept-card__angle">{concept.angle}</p>
        <h3 className="concept-card__hook">{concept.on_image_hook}</h3>
        <p className="concept-card__headline">{concept.headline}</p>
        <div className="concept-card__actions">
          <Link to={`/editor/${concept.concept_id}`} className="btn btn-secondary">
            Edit
          </Link>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onExport(concept)}
          >
            Export
          </button>
        </div>
      </div>
    </article>
  );
}
