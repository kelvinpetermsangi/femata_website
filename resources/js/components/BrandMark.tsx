import { usePage } from '@inertiajs/react';
import { defaultSiteBranding } from '@/lib/siteDefaults';
import type { SharedPageProps } from '@/types';

type BrandMarkProps = {
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
};

export default function BrandMark({
  className = '',
  imageClassName = '',
  fallbackClassName = '',
}: BrandMarkProps) {
  const { props } = usePage<SharedPageProps>();
  const branding = props.siteBranding ?? defaultSiteBranding;
  const logoPath = branding.logo_path ?? defaultSiteBranding.logo_path;

  if (logoPath) {
    return (
      <img
        src={logoPath}
        alt={branding.logo_alt ?? branding.site_name}
        className={imageClassName || className}
      />
    );
  }

  return (
    <div
      className={
        fallbackClassName ||
        className ||
        'flex items-center justify-center rounded-[1.2rem] bg-[linear-gradient(145deg,rgba(var(--primary),1),rgba(var(--primary-soft),0.96),rgba(var(--accent),0.9))] text-xl font-bold text-white'
      }
    >
      {branding.site_name.slice(0, 1)}
    </div>
  );
}
