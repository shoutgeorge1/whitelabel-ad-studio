import { forwardRef } from 'react';
import type { Concept, ExportSize } from '../types/concept';
import { BrandLogo } from './BrandLogo';
import '../templates/AdTemplate.css';

interface AdPreviewProps {
  concept: Concept;
  size?: ExportSize;
  className?: string;
}

function getBullets(concept: Concept): string[] {
  return [concept.bullet_1, concept.bullet_2, concept.bullet_3].filter(Boolean);
}

function CopyBlock({
  concept,
  compact = false,
}: {
  concept: Concept;
  compact?: boolean;
}) {
  const bullets = getBullets(concept);

  return (
    <div className={`ad-copy ${compact ? 'ad-copy--compact' : ''}`}>
      <BrandLogo variant="compact" className="ad-copy__logo" />
      <h2 className="ad-copy__hook">{concept.on_image_hook}</h2>
      {concept.supporting_line && (
        <p className="ad-copy__support">{concept.supporting_line}</p>
      )}
      <ul className="ad-copy__bullets">
        {bullets.map((bullet, i) => (
          <li key={i}>{bullet}</li>
        ))}
      </ul>
      <div className="ad-copy__cta-wrap">
        <span className="ad-copy__cta">{concept.cta}</span>
      </div>
    </div>
  );
}

export const AdPreview = forwardRef<HTMLDivElement, AdPreviewProps>(
  function AdPreview({ concept, size = '1080x1350', className = '' }, ref) {
    const bullets = getBullets(concept);
    const sizeClass =
      size === '1080x1080'
        ? 'ad-preview--square'
        : size === '1080x1920'
          ? 'ad-preview--story'
          : 'ad-preview--vertical';

    const imageSide = concept.image_side ?? 'left';
    const template = concept.layout_template;

    if (template === 'comparison') {
      return (
        <div
          ref={ref}
          className={`ad-preview ad-preview--comparison ${sizeClass} ${className}`}
          data-export-size={size}
        >
          <div className="ad-comparison">
            <BrandLogo className="ad-comparison__logo" />
            <h2 className="ad-comparison__hook">{concept.on_image_hook}</h2>
            {concept.supporting_line && (
              <p className="ad-comparison__support">{concept.supporting_line}</p>
            )}
            <div className="ad-comparison__cols">
              <div className="ad-comparison__col ad-comparison__col--inhouse">
                <span className="ad-comparison__label">In-house hire</span>
                <ul>
                  <li>Longer hiring cycle</li>
                  <li>Higher overhead</li>
                  <li>Harder to scale</li>
                </ul>
              </div>
              <div className="ad-comparison__col ad-comparison__col--mv">
                <span className="ad-comparison__label">MedVirtual</span>
                <ul>
                  {bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
            <span className="ad-copy__cta ad-comparison__cta">{concept.cta}</span>
          </div>
        </div>
      );
    }

    if (template === 'split') {
      return (
        <div
          ref={ref}
          className={`ad-preview ad-preview--split ad-preview--split-${imageSide} ${sizeClass} ${className}`}
          data-export-size={size}
        >
          <div
            className="ad-preview__image-pane"
            style={{ backgroundImage: `url(${concept.image_file})` }}
          />
          <div className="ad-preview__copy-pane">
            <CopyBlock concept={concept} />
          </div>
        </div>
      );
    }

    if (template === 'side-rail') {
      const railLeft = imageSide === 'right';
      return (
        <div
          ref={ref}
          className={`ad-preview ad-preview--side-rail ${railLeft ? 'ad-preview--rail-left' : 'ad-preview--rail-right'} ${sizeClass} ${className}`}
          data-export-size={size}
        >
          <div
            className="ad-preview__bg ad-preview__bg--clear"
            style={{ backgroundImage: `url(${concept.image_file})` }}
          />
          <div className="ad-preview__rail">
            <CopyBlock concept={concept} compact={size === '1080x1080'} />
          </div>
        </div>
      );
    }

    if (template === 'bottom-band') {
      return (
        <div
          ref={ref}
          className={`ad-preview ad-preview--bottom-band ${sizeClass} ${className}`}
          data-export-size={size}
        >
          <div
            className="ad-preview__bg ad-preview__bg--clear"
            style={{ backgroundImage: `url(${concept.image_file})` }}
          />
          <div className="ad-preview__band">
            <BrandLogo variant="compact" onDark className="ad-band__logo" />
            <h2 className="ad-band__hook">{concept.on_image_hook}</h2>
            <ul className="ad-band__bullets">
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <span className="ad-copy__cta ad-band__cta">{concept.cta}</span>
          </div>
        </div>
      );
    }

    // top-hook
    return (
      <div
        ref={ref}
        className={`ad-preview ad-preview--top-hook ${sizeClass} ${className}`}
        data-export-size={size}
      >
        <div
          className="ad-preview__bg ad-preview__bg--clear"
          style={{ backgroundImage: `url(${concept.image_file})` }}
        />
        <div className="ad-preview__top-bar">
          <BrandLogo variant="compact" onDark />
          <h2 className="ad-top__hook">{concept.on_image_hook}</h2>
        </div>
        <div className="ad-preview__bottom-cta">
          <ul className="ad-top__bullets">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <span className="ad-copy__cta">{concept.cta}</span>
        </div>
      </div>
    );
  }
);

interface AdPreviewScalerProps {
  concept: Concept;
  size?: ExportSize;
  maxWidth?: number;
}

export function AdPreviewScaler({
  concept,
  size = '1080x1350',
  maxWidth = 400,
}: AdPreviewScalerProps) {
  const fullWidth = 1080;
  const fullHeight =
    size === '1080x1080' ? 1080 : size === '1080x1920' ? 1920 : 1350;
  const scale = maxWidth / fullWidth;

  return (
    <div
      className="ad-preview-scaler"
      style={{ width: maxWidth, height: fullHeight * scale }}
    >
      <div
        className="ad-preview-scaler__inner"
        style={{
          transform: `scale(${scale})`,
          width: fullWidth,
          height: fullHeight,
        }}
      >
        <AdPreview concept={concept} size={size} />
      </div>
    </div>
  );
}
