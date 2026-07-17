import { useMemo } from 'react';
import { renderCreativeSvg } from '../lib/render';
import type { BrandKit, CreativeProject, CreativeVariant, PlacementDefinition, TemplateDefinition } from '../types';

type Props = {
  project: CreativeProject;
  brand: BrandKit;
  template: TemplateDefinition;
  variant: CreativeVariant;
  placement: PlacementDefinition;
  showSafeArea?: boolean;
  motion?: boolean;
  actualSize?: boolean;
  className?: string;
};

export function CreativePreview({
  project,
  brand,
  template,
  variant,
  placement,
  showSafeArea = false,
  motion = false,
  actualSize = false,
  className = '',
}: Props) {
  const markup = useMemo(
    () => renderCreativeSvg({ project, brand, template, variant, placement, showSafeArea }),
    [brand, placement, project, showSafeArea, template, variant],
  );
  const style: React.CSSProperties & { '--motion-duration': string } = {
    ...(actualSize
    ? { width: `${placement.width}px`, aspectRatio: `${placement.width} / ${placement.height}` }
    : { aspectRatio: `${placement.width} / ${placement.height}` }),
    '--motion-duration': `${variant.motionDuration}s`,
  };
  const motionClass = motion && variant.motionPreset !== 'none' ? ` is-motion motion-${variant.motionPreset}` : '';
  return (
    <div
      className={`creative-preview ${className}${motionClass}`}
      style={style}
      aria-label={`${template.name} preview at ${placement.width} by ${placement.height}`}
    >
      <div className="creative-preview__scene" aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
  );
}
