import { useState } from 'react';
import { createId } from '../data/catalog';
import type { BrandKit } from '../types';

type Props = {
  brands: BrandKit[];
  onSave: (brand: BrandKit) => void;
  onDelete: (brand: BrandKit) => void;
};

const FONT_OPTIONS = [
  'Arial Black, Arial, sans-serif',
  'Georgia, Times New Roman, serif',
  'Trebuchet MS, Arial, sans-serif',
  'Impact, Arial Narrow, sans-serif',
  'Arial, sans-serif',
];

function blankBrand(): BrandKit {
  const now = new Date().toISOString();
  return {
    id: createId('brand'),
    name: 'New brand',
    primary: '#14213d',
    secondary: '#2a9d8f',
    accent: '#fca311',
    background: '#f7f7f3',
    text: '#14213d',
    headingFont: FONT_OPTIONS[0],
    bodyFont: FONT_OPTIONS[4],
    defaultCta: 'Learn more',
    defaultDisclaimer: '',
    imageStyleNotes: '',
    createdAt: now,
    updatedAt: now,
  };
}

function ImageUpload({ label, value, onChange }: { label: string; value?: string; onChange: (dataUrl?: string) => void }) {
  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      window.alert('Choose an image smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };
  return (
    <div className="brand-logo-field">
      <span>{label}</span>
      <div>{value ? <img src={value} alt="Brand logo preview" /> : <span className="brand-logo-field__empty">Logo</span>}</div>
      <label className="os-button os-button--secondary">
        {value ? 'Replace logo' : 'Upload logo'}
        <input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
      </label>
      {value && <button type="button" onClick={() => onChange(undefined)}>Remove</button>}
    </div>
  );
}

export function BrandManager({ brands, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState<BrandKit>(() => structuredClone(brands[0] ?? blankBrand()));
  const update = <K extends keyof BrandKit>(key: K, value: BrandKit[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const save = () => onSave({ ...draft, name: draft.name.trim() || 'Untitled brand', updatedAt: new Date().toISOString() });
  return (
    <section className="os-page">
      <div className="os-page__heading">
        <div>
          <p className="os-kicker">Controlled design variables</p>
          <h1>Brand kits</h1>
          <p>Centralize the colors, logo, type, CTA, and compliance defaults every template should respect.</p>
        </div>
        <button className="os-button os-button--primary" type="button" onClick={() => setDraft(blankBrand())}>New brand kit</button>
      </div>
      <div className="brand-workspace">
        <aside className="brand-list" aria-label="Brand kits">
          {brands.map((brand) => (
            <button
              key={brand.id}
              type="button"
              className={brand.id === draft.id ? 'is-active' : ''}
              onClick={() => setDraft(structuredClone(brand))}
            >
              <i style={{ background: brand.primary }} />
              <span><strong>{brand.name}</strong><small>{brand.defaultCta || 'No default CTA'}</small></span>
            </button>
          ))}
        </aside>
        <div className="brand-editor">
          <div className="brand-editor__preview" style={{ background: draft.background, color: draft.text }}>
            <div className="brand-editor__preview-top">
              {draft.logoDataUrl ? <img src={draft.logoDataUrl} alt="" /> : <strong style={{ fontFamily: draft.headingFont }}>{draft.name}</strong>}
              <span style={{ background: draft.accent, color: draft.primary }}>{draft.defaultCta || 'Learn more'}</span>
            </div>
            <h2 style={{ fontFamily: draft.headingFont }}>One approved system.<br />Every placement.</h2>
            <p style={{ fontFamily: draft.bodyFont }}>Typography and colors stay controlled across the family.</p>
            <i style={{ background: draft.secondary }} />
          </div>
          <div className="brand-form">
            <label><span>Brand name</span><input value={draft.name} onChange={(event) => update('name', event.target.value)} /></label>
            <ImageUpload label="Logo" value={draft.logoDataUrl} onChange={(value) => update('logoDataUrl', value)} />
            <div className="brand-colors">
              {(['primary', 'secondary', 'accent', 'background', 'text'] as const).map((key) => (
                <label key={key}><span>{key}</span><input type="color" value={draft[key]} onChange={(event) => update(key, event.target.value)} /><code>{draft[key]}</code></label>
              ))}
            </div>
            <div className="brand-form__row">
              <label><span>Heading font</span><select value={draft.headingFont} onChange={(event) => update('headingFont', event.target.value)}>{FONT_OPTIONS.map((font) => <option key={font} value={font}>{font.split(',')[0]}</option>)}</select></label>
              <label><span>Body font</span><select value={draft.bodyFont} onChange={(event) => update('bodyFont', event.target.value)}>{FONT_OPTIONS.map((font) => <option key={font} value={font}>{font.split(',')[0]}</option>)}</select></label>
            </div>
            <div className="brand-form__row">
              <label><span>Default CTA</span><input value={draft.defaultCta} onChange={(event) => update('defaultCta', event.target.value)} /></label>
              <label><span>Default disclaimer</span><input value={draft.defaultDisclaimer} onChange={(event) => update('defaultDisclaimer', event.target.value)} /></label>
            </div>
            <label><span>Image style notes</span><textarea rows={3} value={draft.imageStyleNotes} onChange={(event) => update('imageStyleNotes', event.target.value)} placeholder="Human, high contrast, uncluttered…" /></label>
            <div className="brand-form__actions">
              <button className="os-button os-button--primary" type="button" onClick={save}>Save brand kit</button>
              {brands.some((brand) => brand.id === draft.id) && draft.id !== 'brand-ad-studio' && (
                <button className="os-button os-button--danger" type="button" onClick={() => onDelete(draft)}>Delete</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
