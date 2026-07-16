import { useState } from 'react';
import type { ExportSize } from '../types/concept';
import { EXPORT_SIZES } from '../utils/constants';
import './ExportButton.css';

interface ExportButtonProps {
  onExport: (size: ExportSize) => Promise<void>;
  label?: string;
  disabled?: boolean;
}

export function ExportButton({
  onExport,
  label = 'Export PNG',
  disabled = false,
}: ExportButtonProps) {
  const [size, setSize] = useState<ExportSize>('1080x1350');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await onExport(size);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-button-group">
      <select
        value={size}
        onChange={(e) => setSize(e.target.value as ExportSize)}
        className="export-button-group__size"
        disabled={loading || disabled}
      >
        {Object.entries(EXPORT_SIZES).map(([key, val]) => (
          <option key={key} value={key}>
            {val.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleExport}
        disabled={loading || disabled}
      >
        {loading ? 'Exporting…' : label}
      </button>
    </div>
  );
}

interface ExportSizeToggleProps {
  size: ExportSize;
  onChange: (size: ExportSize) => void;
}

export function ExportSizeToggle({ size, onChange }: ExportSizeToggleProps) {
  return (
    <div className="export-size-toggle">
      {(Object.keys(EXPORT_SIZES) as ExportSize[]).map((key) => (
        <button
          key={key}
          type="button"
          className={`export-size-toggle__btn ${size === key ? 'active' : ''}`}
          onClick={() => onChange(key)}
        >
          {EXPORT_SIZES[key].label}
        </button>
      ))}
    </div>
  );
}
