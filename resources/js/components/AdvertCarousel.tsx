import { useEffect, useMemo, useState } from 'react';
import type { AdvertItem } from '@/types';

function formatDuration(advert: AdvertItem) {
  return `${advert.duration_seconds}s`;
}

export default function AdvertCarousel({
  adverts = [],
  slotNumber,
  className = '',
  compact = false,
}: {
  adverts?: AdvertItem[];
  slotNumber?: number | string;
  className?: string;
  compact?: boolean;
}) {
  const items = useMemo(
    () => adverts.filter((advert) => advert.is_active !== false),
    [adverts],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [items]);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const current = items[activeIndex] ?? items[0];
    const duration = Math.max(3, current?.duration_seconds ?? 6) * 1000;
    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % items.length);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [activeIndex, items]);

  if (items.length === 0) {
    return null;
  }

  const active = items[activeIndex] ?? items[0];

  return (
    <section
      className={[
        'card-shell overflow-hidden',
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6',
        className,
      ].join(' ')}
    >
      <div className={compact ? 'grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]' : 'grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]'}>
        <div className="overflow-hidden rounded-[1.55rem] border border-[rgb(var(--border))] bg-slate-950">
          {active.media_type === 'video' ? (
            <video
              key={active.slug}
              src={active.asset_url}
              poster={active.poster_url ?? undefined}
              className="aspect-[16/10] w-full object-cover"
              autoPlay
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={active.asset_url}
              alt={active.headline || active.title}
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                Partner advert
              </span>
              {slotNumber ? (
                <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                  Slot {slotNumber}
                </span>
              ) : null}
              <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                {active.media_type === 'video' ? 'Video' : 'Image'} · {formatDuration(active)}
              </span>
            </div>

            <h3 className={`mt-4 font-semibold text-[rgb(var(--primary))] ${compact ? 'text-2xl' : 'text-3xl'}`}>
              {active.headline || active.title}
            </h3>

            {active.body ? (
              <p className="mt-3 max-w-3xl text-sm leading-8 text-[rgb(var(--muted))]">
                {active.body}
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {active.cta_url ? (
              <a
                href={active.cta_url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                {active.cta_label || 'Open advert'}
              </a>
            ) : null}

            {items.length > 1 ? (
              <div className="flex flex-wrap items-center gap-2">
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={[
                      'h-2.5 rounded-full transition',
                      index === activeIndex
                        ? 'w-10 bg-[rgb(var(--primary))]'
                        : 'w-2.5 bg-[rgba(var(--border),0.95)] hover:bg-[rgb(var(--accent))]',
                    ].join(' ')}
                    aria-label={`Show advert ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}

            {items.length > 1 ? (
              <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                {activeIndex + 1} of {items.length}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
