import { Link } from 'react-router-dom';
import type { Concept } from '../types/concept';
import { LAYOUT_LABELS } from '../utils/constants';
import { AdPreviewScaler } from './AdPreview';
import { StatusBadge } from './StatusBadge';
import './ContentDoc.css';

const QA_LABELS: Record<string, string> = {
  official_logo: 'Official logo used',
  image_clear: 'Image is clear',
  face_not_covered: 'Face is not covered',
  mobile_readable: 'Text readable on mobile',
  no_tiny_bullets: 'No tiny bullet text',
  no_unverified_claims: 'No unverified claims on image',
  cta_clear: 'CTA is clear',
  correct_aspect: 'Correct aspect ratio',
  naming_convention: 'File name follows convention',
};

interface ContentDocProps {
  concepts: Concept[];
}

export function ContentDoc({ concepts }: ContentDocProps) {
  return (
    <div className="content-doc">
      <header className="content-doc__header">
        <h1>MedVirtual Ad Production</h1>
        <p className="content-doc__subtitle">
          National Meta static ads · {concepts.length} concepts · production review for Chris
        </p>
        <p className="content-doc__date">
          Generated {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>
      </header>

      {concepts.map((concept, index) => (
        <section key={concept.concept_id} className="content-doc__block">
          <div className="content-doc__block-header">
            <div>
              <span className="content-doc__number">Concept {index + 1}</span>
              <h2 className="content-doc__title">{concept.file_name}</h2>
              <p className="content-doc__meta-line">
                <strong>{concept.angle}</strong> · {concept.role}
              </p>
            </div>
            <StatusBadge status={concept.production_status} />
          </div>

          {concept.layout_warning && (
            <p className="content-doc__warning no-print">⚠ {concept.layout_warning}</p>
          )}

          <p className="content-doc__edit no-print">
            <Link to={`/editor/${concept.concept_id}`}>Edit concept →</Link>
          </p>

          <div className="content-doc__production-meta">
            <div className="content-doc__meta-chip">
              <span>Template</span>
              <strong>{LAYOUT_LABELS[concept.layout_template] ?? concept.layout_template}</strong>
            </div>
            <div className="content-doc__meta-chip">
              <span>Image status</span>
              <strong>{concept.image_usage_status}</strong>
            </div>
            <div className="content-doc__meta-chip">
              <span>Concept ID</span>
              <strong>{concept.concept_id}</strong>
            </div>
          </div>

          <div className="content-doc__grid">
            <div className="content-doc__preview-col">
              <AdPreviewScaler concept={concept} maxWidth={420} />
              <p className="content-doc__file-name">{concept.file_name}</p>
              <p className="content-doc__preview-note">4:5 feed preview · export also 1:1 and 9:16</p>
            </div>

            <div className="content-doc__copy-col">
              <div className="content-doc__field">
                <label>Source image</label>
                <p className="content-doc__mono">{concept.image_file}</p>
              </div>

              <div className="content-doc__field">
                <label>Source URL</label>
                <a href={concept.source_url} target="_blank" rel="noreferrer">
                  {concept.source_url}
                </a>
              </div>

              <div className="content-doc__field">
                <label>On-image hook</label>
                <p>{concept.on_image_hook}</p>
              </div>

              {concept.supporting_line && (
                <div className="content-doc__field">
                  <label>Supporting line</label>
                  <p>{concept.supporting_line}</p>
                </div>
              )}

              <div className="content-doc__field">
                <label>Bullets (on image)</label>
                <ul>
                  <li>{concept.bullet_1}</li>
                  <li>{concept.bullet_2}</li>
                  {concept.bullet_3 && <li>{concept.bullet_3}</li>}
                </ul>
              </div>

              <div className="content-doc__field">
                <label>CTA</label>
                <p>{concept.cta}</p>
              </div>

              <div className="content-doc__field">
                <label>Primary text</label>
                <p>{concept.primary_text}</p>
              </div>

              <div className="content-doc__field">
                <label>Headline</label>
                <p>{concept.headline}</p>
              </div>

              {concept.description && (
                <div className="content-doc__field">
                  <label>Description</label>
                  <p>{concept.description}</p>
                </div>
              )}

              {concept.verify_flags && concept.verify_flags.length > 0 && (
                <div className="content-doc__field content-doc__field--verify">
                  <label>Verify before using</label>
                  <ul>
                    {concept.verify_flags.map((flag) => (
                      <li key={flag}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {concept.qa_checks && (
                <div className="content-doc__field content-doc__field--qa">
                  <label>Layout QA checklist</label>
                  <ul className="content-doc__qa-list">
                    {Object.entries(concept.qa_checks).map(([key, passed]) => (
                      <li key={key} className={passed ? 'pass' : 'fail'}>
                        {passed ? '✓' : '○'} {QA_LABELS[key] ?? key}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {concept.notes && (
                <div className="content-doc__field content-doc__field--notes">
                  <label>Notes for Chris</label>
                  <p>{concept.notes}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
