import AppLink from '@/components/AppLink';

interface PartnerAdvertSpotProps {
  eyebrow?: string;
  title: string;
  text: string;
  badges?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  note?: string;
  variant?: 'banner' | 'compact';
}

export default function PartnerAdvertSpot({
  eyebrow = 'Partner advert placement',
  title,
  text,
  badges = [],
  ctaLabel = 'Request media kit',
  ctaHref = '/contact',
  note,
  variant = 'banner',
}: PartnerAdvertSpotProps) {
  if (variant === 'compact') {
    return (
      <aside className="card-shell relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(var(--primary),0.10),transparent_28%)]" />

        <div className="relative">
          <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
            {eyebrow}
          </span>

          <h3 className="mt-4 text-2xl font-semibold text-[rgb(var(--primary))]">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
            {text}
          </p>

          {badges.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <AppLink href={ctaHref} className="btn-primary px-5">
              {ctaLabel}
            </AppLink>
            {note ? (
              <p className="text-xs leading-6 text-[rgb(var(--muted))]">{note}</p>
            ) : null}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <section className="soft-band relative overflow-hidden px-6 py-7 sm:px-8 sm:py-9">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(var(--primary),0.08),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(15,23,42,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.12)_1px,transparent_1px)] [background-size:36px_36px]" />

      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <span className="ui-chip px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
            {eyebrow}
          </span>

          <h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[rgb(var(--muted))] sm:text-base">
            {text}
          </p>

          {badges.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="ui-chip px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          <AppLink
            href={ctaHref}
            className="btn-primary px-5"
          >
            {ctaLabel}
          </AppLink>

          {note ? (
            <p className="max-w-sm text-xs leading-6 text-[rgb(var(--muted))] lg:text-right">
              {note}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
