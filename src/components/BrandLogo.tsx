import './BrandLogo.css';

const LOGO_HORIZONTAL = '/assets/logo/medvirtual-logo.svg';
const LOGO_FALLBACK = '/assets/logo/medvirtual-logo-horizontal.png';

interface BrandLogoProps {
  variant?: 'horizontal' | 'compact';
  onDark?: boolean;
  className?: string;
}

export function BrandLogo({
  variant = 'horizontal',
  onDark = false,
  className = '',
}: BrandLogoProps) {
  const src = LOGO_HORIZONTAL;

  return (
    <div
      className={`brand-logo brand-logo--${variant} ${onDark ? 'brand-logo--on-dark' : ''} ${className}`}
    >
      <img
        src={src}
        alt="MedVirtual"
        className="brand-logo__img"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src.includes('.svg')) {
            img.src = LOGO_FALLBACK;
          } else {
            img.style.display = 'none';
            img.parentElement?.classList.add('brand-logo--missing');
          }
        }}
      />
      <span className="brand-logo__fallback">[LOGO NEEDED] MedVirtual</span>
    </div>
  );
}
