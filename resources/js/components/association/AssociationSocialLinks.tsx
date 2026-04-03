import type { AssociationSocialLink } from '@/types';

function iconClassName(compact: boolean) {
  return compact ? 'h-4 w-4' : 'h-5 w-5';
}

function PlatformIcon({
  platform,
  compact,
}: {
  platform: string;
  compact: boolean;
}) {
  const className = iconClassName(compact);

  switch (platform) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M15 8h-2a2 2 0 0 0-2 2v3h4l-.5 3H11v5" />
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 4 20 20" />
          <path d="m20 4-6.6 7.54L9 20H4l6.77-7.73L4 4h5l4.19 4.78L17 4h3Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
          <path d="M2 9h4v12H2Z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M22 12s0-3.4-.44-5.05a2.87 2.87 0 0 0-2.01-2.01C17.9 4.5 12 4.5 12 4.5s-5.9 0-7.55.44A2.87 2.87 0 0 0 2.44 6.95C2 8.6 2 12 2 12s0 3.4.44 5.05a2.87 2.87 0 0 0 2.01 2.01C6.1 19.5 12 19.5 12 19.5s5.9 0 7.55-.44a2.87 2.87 0 0 0 2.01-2.01C22 15.4 22 12 22 12Z" />
          <path d="m10 15 5-3-5-3Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M20 11.5a8.5 8.5 0 0 1-12.9 7.3L3 20l1.3-4.1A8.5 8.5 0 1 1 20 11.5Z" />
          <path d="M9.2 8.8c.18-.4.35-.41.52-.42h.43c.16 0 .41.06.63.54.21.48.7 1.69.77 1.81.06.12.11.27.02.43-.08.16-.12.27-.24.41-.12.14-.25.31-.36.41-.12.11-.24.22-.1.44.15.22.65 1.06 1.4 1.72.96.84 1.76 1.11 1.98 1.23.22.11.35.1.48-.06.13-.16.56-.65.7-.87.15-.22.3-.18.51-.11.21.08 1.33.63 1.56.74.23.11.38.17.44.27.06.11.06.62-.14 1.22-.2.6-1.15 1.17-1.58 1.24-.42.06-.96.1-1.55-.1-.36-.12-.82-.27-1.42-.52-2.49-1.08-4.12-3.6-4.25-3.77-.13-.17-1.01-1.34-1.01-2.56 0-1.23.65-1.83.88-2.08Z" />
        </svg>
      );
    case 'website':
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14.5 14.5 0 0 1 0 18" />
          <path d="M12 3a14.5 14.5 0 0 0 0 18" />
        </svg>
      );
  }
}

export default function AssociationSocialLinks({
  links,
  compact = false,
}: {
  links?: AssociationSocialLink[];
  compact?: boolean;
}) {
  const visibleLinks = (links ?? []).filter((link) => link.visible && link.url);

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {visibleLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className={[
            'ui-chip inline-flex items-center gap-2 px-4 py-3 font-semibold text-[rgb(var(--primary))] transition hover:-translate-y-[1px] hover:border-[rgb(var(--accent))]/30 hover:shadow-sm',
            compact ? 'text-xs uppercase tracking-[0.16em]' : 'text-sm',
          ].join(' ')}
          aria-label={link.label}
          title={link.label}
        >
          <PlatformIcon platform={link.platform} compact={compact} />
          <span>{compact ? link.label : `Open ${link.label}`}</span>
        </a>
      ))}
    </div>
  );
}
