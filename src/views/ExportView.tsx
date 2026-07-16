import { useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdPreview, AdPreviewScaler } from '../components/AdPreview';
import { ExportSizeToggle } from '../components/ExportButton';
import { useConcepts } from '../context/ConceptsContext';
import type { Concept, ExportSize } from '../types/concept';
import { exportAdToPng, exportAllAds } from '../utils/export';
import './ExportView.css';

export function ExportView() {
  const { concepts, saveConcept } = useConcepts();
  const [searchParams] = useSearchParams();
  const [size, setSize] = useState<ExportSize>('1080x1350');
  const [selectedId, setSelectedId] = useState(
    searchParams.get('concept') ?? concepts[0]?.concept_id ?? ''
  );
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState('');
  const exportRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const selected = useMemo(
    () => concepts.find((c) => c.concept_id === selectedId) ?? concepts[0],
    [concepts, selectedId]
  );

  const setRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      exportRefs.current.set(id, el);
    } else {
      exportRefs.current.delete(id);
    }
  }, []);

  const handleSingleExport = async () => {
    if (!selected) return;
    const el = exportRefs.current.get(selected.concept_id);
    if (!el) return;

    setExporting(true);
    setProgress(`Exporting ${selected.file_name}…`);
    try {
      await exportAdToPng(el, selected.file_name, size);
      saveConcept({ ...selected, production_status: 'Exported' });
      setProgress('Export complete.');
    } catch {
      setProgress('Export failed. Try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    const targets = concepts
      .map((c) => ({
        concept: c,
        element: exportRefs.current.get(c.concept_id),
      }))
      .filter((t): t is { concept: Concept; element: HTMLDivElement } => !!t.element);

    if (targets.length === 0) return;

    setExporting(true);
    try {
      await exportAllAds(
        targets.map((t) => ({ element: t.element, fileName: t.concept.file_name })),
        size,
        (current, total) => setProgress(`Exporting ${current} of ${total}…`)
      );
      targets.forEach((t) => saveConcept({ ...t.concept, production_status: 'Exported' }));
      setProgress(`Exported ${targets.length} creatives.`);
    } catch {
      setProgress('Batch export failed. Try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-view">
      <div className="export-view__header">
        <div>
          <h2>Export for Meta</h2>
          <p>Download PNGs at 1080×1350 (4:5 feed) or 1080×1080 (square)</p>
        </div>
        <ExportSizeToggle size={size} onChange={setSize} />
      </div>

      <div className="export-view__layout">
        <div className="export-view__sidebar">
          <label className="export-view__label">Concept</label>
          <select
            className="export-view__select"
            value={selected?.concept_id ?? ''}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {concepts.map((c) => (
              <option key={c.concept_id} value={c.concept_id}>
                {c.file_name} — {c.angle}
              </option>
            ))}
          </select>

          <div className="export-view__actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSingleExport}
              disabled={exporting || !selected}
            >
              {exporting ? 'Exporting…' : 'Export selected'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExportAll}
              disabled={exporting || concepts.length === 0}
            >
              Export all ({concepts.length})
            </button>
          </div>

          {progress && <p className="export-view__progress">{progress}</p>}
        </div>

        <div className="export-view__preview">
          {selected && (
            <>
              <h3>{selected.file_name}</h3>
              <AdPreviewScaler concept={selected} size={size} maxWidth={320} />
            </>
          )}
        </div>
      </div>

      <div className="export-view__staging" aria-hidden="true">
        {concepts.map((concept) => (
          <AdPreview
            key={concept.concept_id}
            ref={(el) => setRef(concept.concept_id, el)}
            concept={concept}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}
