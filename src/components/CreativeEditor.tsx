import { useRef, useState } from 'react';
import type { Concept, ExportSize, ProductionStatus } from '../types/concept';
import { PRODUCTION_STATUSES } from '../utils/constants';
import { AdPreview } from './AdPreview';
import { ExportSizeToggle } from './ExportButton';
import './CreativeEditor.css';

interface CreativeEditorProps {
  concept: Concept;
  onSave: (concept: Concept) => void;
  onDuplicate: () => void;
  onExport: (size: ExportSize, element: HTMLElement) => Promise<void>;
}

export function CreativeEditor({
  concept,
  onSave,
  onDuplicate,
  onExport,
}: CreativeEditorProps) {
  const [draft, setDraft] = useState<Concept>(concept);
  const [previewSize, setPreviewSize] = useState<ExportSize>('1080x1350');
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof Concept>(key: K, value: Concept[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update('image_file', url);
  };

  const handleSave = () => {
    onSave(draft);
  };

  const handleExport = async () => {
    const el = exportRef.current ?? previewRef.current;
    if (!el) return;
    setExporting(true);
    try {
      await onExport(previewSize, el);
      onSave({ ...draft, production_status: 'Exported' });
      setDraft((prev) => ({ ...prev, production_status: 'Exported' }));
    } finally {
      setExporting(false);
    }
  };

  const fullHeight =
    previewSize === '1080x1080' ? 1080 : previewSize === '1080x1920' ? 1920 : 1350;
  const scale = 380 / 1080;
  const previewHeight = fullHeight * scale;

  return (
    <div className="creative-editor">
      <div className="creative-editor__form">
        <h2 className="creative-editor__heading">Edit Concept</h2>
        <p className="creative-editor__id">{draft.concept_id}</p>

        <div className="form-group">
          <label>Background Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <input
            type="text"
            value={draft.image_file}
            onChange={(e) => update('image_file', e.target.value)}
            placeholder="Image URL or path"
          />
        </div>

        <div className="form-group">
          <label>On-Image Hook</label>
          <input
            type="text"
            value={draft.on_image_hook}
            onChange={(e) => update('on_image_hook', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Bullet 1</label>
          <input
            type="text"
            value={draft.bullet_1}
            onChange={(e) => update('bullet_1', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Bullet 2</label>
          <input
            type="text"
            value={draft.bullet_2}
            onChange={(e) => update('bullet_2', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Bullet 3</label>
          <input
            type="text"
            value={draft.bullet_3}
            onChange={(e) => update('bullet_3', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>CTA</label>
          <input
            type="text"
            value={draft.cta}
            onChange={(e) => update('cta', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Primary Text</label>
          <textarea
            rows={4}
            value={draft.primary_text}
            onChange={(e) => update('primary_text', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Headline</label>
          <input
            type="text"
            value={draft.headline}
            onChange={(e) => update('headline', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={draft.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Production status</label>
          <select
            value={draft.production_status}
            onChange={(e) =>
              update('production_status', e.target.value as ProductionStatus)
            }
          >
            {PRODUCTION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            rows={3}
            value={draft.notes}
            onChange={(e) => update('notes', e.target.value)}
          />
        </div>

        <div className="creative-editor__actions">
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
          <button type="button" className="btn btn-secondary" onClick={onDuplicate}>
            Duplicate
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Exporting…' : 'Export PNG'}
          </button>
        </div>
      </div>

      <div className="creative-editor__preview-panel">
        <div className="creative-editor__preview-header">
          <h3>Live Preview</h3>
          <ExportSizeToggle size={previewSize} onChange={setPreviewSize} />
        </div>
        <div
          className="creative-editor__preview-wrap"
          style={{ height: previewHeight + 20 }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
          >
            <AdPreview ref={previewRef} concept={draft} size={previewSize} />
          </div>
        </div>
        <p className="creative-editor__file-name">{draft.file_name}</p>
      </div>

      <div className="creative-editor__export-staging" aria-hidden="true">
        <AdPreview ref={exportRef} concept={draft} size={previewSize} />
      </div>
    </div>
  );
}
