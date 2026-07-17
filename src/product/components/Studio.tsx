import { useMemo, useState } from 'react';
import { getPlacement, getTemplate, PLACEMENTS, TEMPLATES } from '../data/catalog';
import { duplicateVariant, getCreativeWarnings } from '../lib/creative';
import { exportFamily, exportPlacement } from '../lib/export';
import type {
  BrandKit,
  CreativeContent,
  CreativeProject,
  CreativeVariant,
  ExportFormat,
  MotionPreset,
  StudioPanel,
} from '../types';
import { CreativePreview } from './CreativePreview';

type Props = {
  project: CreativeProject;
  brands: BrandKit[];
  saveState: 'saved' | 'saving' | 'error';
  onChange: (project: CreativeProject) => void;
  onBack: () => void;
};

const CONTENT_FIELDS: Array<{ key: keyof CreativeContent; label: string; guidance: string; rows?: number }> = [
  { key: 'eyebrow', label: 'Eyebrow', guidance: 'Short category or hook' },
  { key: 'headline', label: 'Headline', guidance: 'Aim for 35–60 characters', rows: 3 },
  { key: 'highlight', label: 'Highlighted phrase', guidance: 'A phrase from the headline' },
  { key: 'supportingText', label: 'Supporting copy', guidance: 'One clear supporting thought', rows: 3 },
  { key: 'offer', label: 'Offer / proof', guidance: 'Price, offer, or proof point' },
  { key: 'cta', label: 'CTA', guidance: 'Two to four words' },
  { key: 'disclaimer', label: 'Disclaimer', guidance: 'Hidden in extreme banners', rows: 2 },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function Studio({ project, brands, saveState, onChange, onBack }: Props) {
  const [panel, setPanel] = useState<StudioPanel>('edit');
  const [placementId, setPlacementId] = useState(project.selectedPlacementIds[0] ?? PLACEMENTS[0].id);
  const [safeArea, setSafeArea] = useState(false);
  const [motionPreview, setMotionPreview] = useState(true);
  const [actualSize, setActualSize] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('Ready to build a production package.');

  const variant = project.variants.find((item) => item.id === project.activeVariantId) ?? project.variants[0];
  const brand = brands.find((item) => item.id === project.brandKitId) ?? brands[0];
  const template = getTemplate(project.templateId);
  const placement = getPlacement(placementId);
  const warnings = getCreativeWarnings(variant, placement);

  const supportedPlacements = useMemo(
    () => PLACEMENTS.filter((item) => template.supportedPlacementIds.includes(item.id)),
    [template],
  );

  const updateProject = (patch: Partial<CreativeProject>) => onChange({
    ...project,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
  const updateVariant = (patch: Partial<CreativeVariant>) => updateProject({
    variants: project.variants.map((item) => item.id === variant.id ? { ...item, ...patch } : item),
  });
  const updateContent = (key: keyof CreativeContent, value: string) => updateVariant({
    content: { ...variant.content, [key]: value },
  });

  const uploadImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 12 * 1024 * 1024) {
      setExportStatus('Choose a PNG, JPG, or WebP image under 12 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const image = new Image();
      image.onload = () => {
        updateVariant({
          image: {
            dataUrl,
            name: file.name,
            width: image.naturalWidth,
            height: image.naturalHeight,
            focalX: 50,
            focalY: 50,
            zoom: 1,
            overlay: 0.08,
            tint: false,
          },
        });
        setExportStatus('Image added. Check the focal point across the family.');
      };
      image.onerror = () => setExportStatus('That image could not be loaded.');
      image.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const togglePlacement = (id: string) => {
    const selected = project.selectedPlacementIds.includes(id);
    const next = selected
      ? project.selectedPlacementIds.filter((item) => item !== id)
      : [...project.selectedPlacementIds, id];
    updateProject({ selectedPlacementIds: next });
  };

  const doExportCurrent = async () => {
    setExporting(true);
    setExportStatus(`Rendering ${placement.name}…`);
    try {
      const result = await exportPlacement(project, brand, variant, placement.id, exportFormat);
      setExportStatus(`${result.filename} downloaded · ${formatBytes(result.bytes)}`);
    } catch (error) {
      setExportStatus(error instanceof Error ? error.message : 'Export failed.');
    } finally {
      setExporting(false);
    }
  };

  const doExportFamily = async () => {
    setExporting(true);
    try {
      const result = await exportFamily(project, brand, variant, project.selectedPlacementIds, exportFormat, setExportStatus);
      setExportStatus(`${result.filename} downloaded · ${result.files} placements · ${formatBytes(result.bytes)}`);
    } catch (error) {
      setExportStatus(error instanceof Error ? error.message : 'Export failed.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="studio">
      <header className="studio-topbar">
        <button className="studio-topbar__back" type="button" onClick={onBack} aria-label="Back to projects">←</button>
        <label className="studio-topbar__name">
          <span>Project</span>
          <input value={project.name} onChange={(event) => updateProject({ name: event.target.value })} />
        </label>
        <div className="studio-topbar__center">
          {(['edit', 'family', 'export'] as StudioPanel[]).map((item) => (
            <button key={item} type="button" className={panel === item ? 'is-active' : ''} onClick={() => setPanel(item)}>
              {item === 'edit' ? 'Studio' : item === 'family' ? 'Family preview' : 'Export center'}
            </button>
          ))}
        </div>
        <div className={`save-state save-state--${saveState}`} role="status">
          <i /> {saveState === 'saved' ? 'Saved locally' : saveState === 'saving' ? 'Saving…' : 'Save failed'}
        </div>
        <select value={project.status} onChange={(event) => updateProject({ status: event.target.value as CreativeProject['status'] })} aria-label="Project status">
          <option value="draft">Draft</option>
          <option value="review">In review</option>
          <option value="export-ready">Export ready</option>
        </select>
      </header>

      {panel === 'edit' && (
        <div className="studio-layout">
          <aside className="studio-left">
            <div className="studio-section">
              <span className="studio-section__label">Creative system</span>
              <label><span>Template</span><select value={project.templateId} onChange={(event) => {
                const nextTemplate = getTemplate(event.target.value);
                const retained = project.selectedPlacementIds.filter((id) => nextTemplate.supportedPlacementIds.includes(id));
                updateProject({
                  templateId: nextTemplate.id,
                  concept: nextTemplate.name,
                  selectedPlacementIds: retained.length ? retained : [...nextTemplate.supportedPlacementIds],
                });
              }}>{TEMPLATES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
              <label><span>Brand kit</span><select value={project.brandKitId} onChange={(event) => updateProject({ brandKitId: event.target.value })}>{brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
              <button className="studio-reset" type="button" onClick={() => updateVariant({ content: { ...template.defaultContent } })}>Reset template copy</button>
            </div>
            <div className="studio-section">
              <div className="studio-section__heading">
                <span className="studio-section__label">Variants</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = duplicateVariant(variant);
                    updateProject({ variants: [...project.variants, next], activeVariantId: next.id });
                  }}
                >+ Duplicate</button>
              </div>
              <div className="variant-list">
                {project.variants.map((item) => (
                  <button key={item.id} type="button" className={item.id === variant.id ? 'is-active' : ''} onClick={() => updateProject({ activeVariantId: item.id })}>
                    <span>{item.name}</span><small>{item.language} · V{String(item.version).padStart(2, '0')}</small>
                  </button>
                ))}
              </div>
              <label><span>Variant name</span><input value={variant.name} onChange={(event) => updateVariant({ name: event.target.value })} /></label>
              <div className="studio-two-up">
                <label><span>Language</span><select value={variant.language} onChange={(event) => {
                  const language = event.target.value as CreativeVariant['language'];
                  updateProject({
                    language,
                    variants: project.variants.map((item) => item.id === variant.id ? { ...item, language } : item),
                  });
                }}><option>EN</option><option>ES</option><option>Bilingual</option></select></label>
                <label><span>Version</span><input type="number" min="1" max="99" value={variant.version} onChange={(event) => updateVariant({ version: Number(event.target.value) || 1 })} /></label>
              </div>
              {project.variants.length > 1 && (
                <button className="studio-reset is-danger" type="button" onClick={() => {
                  const remaining = project.variants.filter((item) => item.id !== variant.id);
                  updateProject({ variants: remaining, activeVariantId: remaining[0].id });
                }}>Delete variant</button>
              )}
            </div>
            <div className="studio-section">
              <span className="studio-section__label">Production metadata</span>
              {([
                ['campaign', 'Campaign'],
                ['concept', 'Concept'],
                ['angle', 'Angle'],
                ['audience', 'Audience'],
                ['offer', 'Offer'],
              ] as const).map(([key, label]) => <label key={key}><span>{label}</span><input value={project[key]} onChange={(event) => updateProject({ [key]: event.target.value })} /></label>)}
              <label><span>Funnel stage</span><select value={project.funnelStage} onChange={(event) => updateProject({ funnelStage: event.target.value as CreativeProject['funnelStage'] })}><option>Awareness</option><option>Consideration</option><option>Conversion</option><option>Retention</option></select></label>
            </div>
          </aside>

          <main className="studio-canvas">
            <div className="canvas-toolbar">
              <div className="placement-select">
                {supportedPlacements.map((item) => (
                  <button key={item.id} type="button" className={item.id === placement.id ? 'is-active' : ''} onClick={() => setPlacementId(item.id)}>
                    <strong>{item.shortName}</strong><small>{item.name}</small>
                  </button>
                ))}
              </div>
              <div className="canvas-toggles">
                <label><input type="checkbox" checked={safeArea} onChange={(event) => setSafeArea(event.target.checked)} /> Safe area</label>
                {placement.actualSizePreview && <label><input type="checkbox" checked={actualSize} onChange={(event) => setActualSize(event.target.checked)} /> Actual size</label>}
                <button type="button" onClick={() => setMotionPreview((current) => !current)}>{motionPreview ? 'Pause motion' : 'Play motion'}</button>
              </div>
            </div>
            <div className={`canvas-stage${actualSize ? ' is-actual-size' : ''}`}>
              <CreativePreview project={project} brand={brand} template={template} variant={variant} placement={placement} showSafeArea={safeArea} motion={motionPreview} actualSize={actualSize} />
            </div>
            <div className="canvas-status">
              <span><strong>{placement.width} × {placement.height}</strong> · {placement.platform} · {template.name}</span>
              <span>{warnings.filter((warning) => warning.level === 'warning').length === 0 ? 'Composition ready' : `${warnings.filter((warning) => warning.level === 'warning').length} checks need attention`}</span>
            </div>
          </main>

          <aside className="studio-right">
            <div className="studio-section">
              <span className="studio-section__label">Message</span>
              {CONTENT_FIELDS.map((field) => (
                <label className={warnings.some((warning) => warning.field === field.key && warning.level === 'warning') ? 'has-warning' : ''} key={field.key}>
                  <span>{field.label}<small>{variant.content[field.key].length} chars</small></span>
                  {field.rows ? <textarea rows={field.rows} value={variant.content[field.key]} onChange={(event) => updateContent(field.key, event.target.value)} /> : <input value={variant.content[field.key]} onChange={(event) => updateContent(field.key, event.target.value)} />}
                  <em>{field.guidance}</em>
                </label>
              ))}
            </div>
            <div className="studio-section">
              <span className="studio-section__label">Image</span>
              <label className="image-drop">
                {variant.image ? <img src={variant.image.dataUrl} alt="" /> : <span><strong>Add campaign image</strong><small>PNG, JPG, WebP · 12 MB max</small></span>}
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadImage(event.target.files?.[0])} />
              </label>
              {variant.image && (
                <>
                  <label><span>Horizontal focus <small>{variant.image.focalX}%</small></span><input type="range" min="0" max="100" value={variant.image.focalX} onChange={(event) => updateVariant({ image: { ...variant.image!, focalX: Number(event.target.value) } })} /></label>
                  <label><span>Vertical focus <small>{variant.image.focalY}%</small></span><input type="range" min="0" max="100" value={variant.image.focalY} onChange={(event) => updateVariant({ image: { ...variant.image!, focalY: Number(event.target.value) } })} /></label>
                  <label><span>Zoom <small>{variant.image.zoom.toFixed(2)}×</small></span><input type="range" min="1" max="2" step=".01" value={variant.image.zoom} onChange={(event) => updateVariant({ image: { ...variant.image!, zoom: Number(event.target.value) } })} /></label>
                  <label><span>Overlay <small>{Math.round(variant.image.overlay * 100)}%</small></span><input type="range" min="0" max=".7" step=".01" value={variant.image.overlay} onChange={(event) => updateVariant({ image: { ...variant.image!, overlay: Number(event.target.value) } })} /></label>
                  <label className="studio-check"><input type="checkbox" checked={variant.image.tint} onChange={(event) => updateVariant({ image: { ...variant.image!, tint: event.target.checked } })} /> Use brand-color tint</label>
                  <button className="studio-reset" type="button" onClick={() => updateVariant({ image: undefined })}>Remove image</button>
                </>
              )}
            </div>
            <div className="studio-section">
              <span className="studio-section__label">Treatment</span>
              <div className="color-modes">
                {(['brand', 'inverse', 'accent'] as const).map((mode) => <button key={mode} type="button" className={variant.colorMode === mode ? 'is-active' : ''} onClick={() => updateVariant({ colorMode: mode })}>{mode}</button>)}
              </div>
              <label><span>Motion preset</span><select value={variant.motionPreset} onChange={(event) => updateVariant({ motionPreset: event.target.value as MotionPreset })}>{template.motionPresets.map((preset) => <option key={preset} value={preset}>{preset.replace('-', ' ')}</option>)}</select></label>
              {variant.motionPreset !== 'none' && <label><span>Duration <small>{variant.motionDuration}s</small></span><input type="range" min="2" max="8" step=".5" value={variant.motionDuration} onChange={(event) => updateVariant({ motionDuration: Number(event.target.value) })} /></label>}
              <small className="motion-note">Motion is preview-only. Static exports use the final composed frame.</small>
            </div>
            {warnings.length > 0 && (
              <div className="studio-section studio-warnings">
                <span className="studio-section__label">Placement checks</span>
                {warnings.map((warning, index) => <p className={`is-${warning.level}`} key={`${warning.field}-${index}`}>{warning.message}</p>)}
              </div>
            )}
          </aside>
        </div>
      )}

      {panel === 'family' && (
        <div className="family-view">
          <div className="family-view__heading">
            <div><p className="os-kicker">One concept, responsive by design</p><h2>Creative family</h2><p>Review the message hierarchy, crop, CTA, and simplification rules across every selected placement.</p></div>
            <button className="os-button os-button--primary" type="button" onClick={() => setPanel('export')}>Prepare exports</button>
          </div>
          <div className="family-grid">
            {supportedPlacements.map((item) => {
              const itemWarnings = getCreativeWarnings(variant, item);
              const selected = project.selectedPlacementIds.includes(item.id);
              return (
                <article className={`family-card${selected ? '' : ' is-unselected'}`} key={item.id}>
                  <div className="family-card__top">
                    <span><strong>{item.name}</strong><small>{item.platform} · {item.width}×{item.height}</small></span>
                    <label><input type="checkbox" checked={selected} onChange={() => togglePlacement(item.id)} /> Export</label>
                  </div>
                  <div className="family-card__stage"><CreativePreview project={project} brand={brand} template={template} variant={variant} placement={item} /></div>
                  <div className="family-card__bottom">
                    <button type="button" onClick={() => { setPlacementId(item.id); setPanel('edit'); }}>Tune placement</button>
                    <span className={itemWarnings.some((warning) => warning.level === 'warning') ? 'has-warning' : ''}>{itemWarnings.some((warning) => warning.level === 'warning') ? 'Needs review' : itemWarnings.length ? 'Adapted' : 'Ready'}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {panel === 'export' && (
        <div className="export-center">
          <div className="export-center__main">
            <p className="os-kicker">Campaign-ready handoff</p>
            <h2>Export center</h2>
            <p>Exact-size creative files, predictable naming, structured metadata, and a media-buyer launch sheet.</p>
            <div className="export-summary">
              <div><span>Brand</span><strong>{brand.name}</strong></div>
              <div><span>Campaign</span><strong>{project.campaign}</strong></div>
              <div><span>Concept</span><strong>{project.concept}</strong></div>
              <div><span>Variant</span><strong>{variant.name} · V{String(variant.version).padStart(2, '0')}</strong></div>
            </div>
            <div className="export-options">
              <div>
                <span>File format</span>
                <div>{(['png', 'jpeg'] as ExportFormat[]).map((item) => <button key={item} type="button" className={exportFormat === item ? 'is-active' : ''} onClick={() => setExportFormat(item)}>{item === 'jpeg' ? 'JPEG' : 'PNG'}</button>)}</div>
              </div>
              <div>
                <span>Selected placements</span>
                <strong>{project.selectedPlacementIds.length} of {supportedPlacements.length}</strong>
              </div>
            </div>
            <div className="export-placement-list">
              {supportedPlacements.map((item) => (
                <label key={item.id}><input type="checkbox" checked={project.selectedPlacementIds.includes(item.id)} onChange={() => togglePlacement(item.id)} /><span><strong>{item.name}</strong><small>{item.width} × {item.height} · {item.platform}</small></span></label>
              ))}
            </div>
          </div>
          <aside className="export-package">
            <span className="export-package__icon">ZIP</span>
            <h3>Production package</h3>
            <ul><li>{project.selectedPlacementIds.length} exact-size creative files</li><li>JSON manifest with campaign metadata</li><li>CSV launch sheet for media handoff</li><li>Readable, filesystem-safe naming</li></ul>
            <button className="os-button os-button--primary" type="button" disabled={exporting || project.selectedPlacementIds.length === 0} onClick={doExportFamily}>{exporting ? 'Building package…' : 'Download creative family'}</button>
            <button className="os-button os-button--secondary" type="button" disabled={exporting} onClick={doExportCurrent}>Download current placement</button>
            <p role="status">{exportStatus}</p>
            <small>Static files only. Motion presets are not included in exports.</small>
          </aside>
        </div>
      )}
    </section>
  );
}
