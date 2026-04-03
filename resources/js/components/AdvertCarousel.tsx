import { useEffect, useMemo, useState } from 'react';
import type { AdvertItem } from '@/types';

function formatDuration(advert: AdvertItem) {
  return `${advert.duration_seconds}s`;
}

function mediaPreview(advert: AdvertItem) {
  return advert.media_type === 'video'
    ? advert.poster_url || 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80'
    : advert.asset_url;
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
  const mode = compact ? 'compact' : 'billboard';

  return (
    <section
      className={[
        'card-shell overflow-hidden',
        mode === 'compact' ? 'p-4 sm:p-5' : 'p-0',
        className,
      ].join(' ')}
    >
      <div
        className={[
          'grid',
          mode === 'compact'
            ? 'gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.8fr)]'
            : 'lg:grid-cols-[minmax(0,1.16fr)_minmax(360px,0.84fr)]',
        ].join(' ')}
      >
        <div className="relative overflow-hidden bg-slate-950">
          {active.media_type === 'video' ? (
            <video
              key={active.slug}
              src={active.asset_url}
              poster={active.poster_url ?? undefined}
              className={[
                'w-full object-cover',
                mode === 'compact' ? 'aspect-[16/9] min-h-[260px]' : 'aspect-[16/9] min-h-[360px]',
              ].join(' ')}
              autoPlay
              muted
              playsInline
              loop
              preload="metadata"
            />
          ) : (
            <img
              src={active.asset_url}
              alt={active.headline || active.title}
              className={[
                'w-full object-cover',
                mode === 'compact' ? 'aspect-[16/9] min-h-[260px]' : 'aspect-[16/9] min-h-[360px]',
              ].join(' ')}
              loading="lazy"
            />
          )}

          <div className="absolute inset-0 bg-linear-to-r from-[rgba(4,13,12,0.78)] via-[rgba(4,13,12,0.28)] to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(217,180,74,0.18),transparent_22%)]" />

          <div className="absolute inset-x-0 top-0 flex flex-wrap items-center gap-2 p-4 sm:p-5">
            <span className="rounded-full border border-white/18 bg-black/28 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              Sponsored placement
            </span>
            {slotNumber ? (
              <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
                Slot {slotNumber}
              </span>
            ) : null}
            <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
              {active.media_type === 'video' ? 'Video campaign' : 'Display campaign'}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <div className="max-w-xl rounded-[1.45rem] border border-white/14 bg-[rgba(7,18,16,0.54)] px-4 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72">
                Featured campaign
              </p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                {active.headline || active.title}
              </h3>
            </div>
          </div>
        </div>

        <div className={mode === 'compact' ? 'flex min-w-0 flex-col justify-between p-1' : 'flex min-w-0 flex-col justify-between p-6 sm:p-8'}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                Partner visibility
              </span>
              <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                {formatDuration(active)}
              </span>
              {items.length > 1 ? (
                <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                  {activeIndex + 1} of {items.length}
                </span>
              ) : null}
            </div>

            <h4 className={`mt-4 font-semibold leading-tight text-[rgb(var(--primary))] ${mode === 'compact' ? 'text-2xl' : 'text-3xl sm:text-[2.4rem]'}`}>
              {active.headline || active.title}
            </h4>

            {active.body ? (
              <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">
                {active.body}
              </p>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="ui-soft-panel px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  Format
                </p>
                <p className="mt-2 text-sm font-semibold text-[rgb(var(--primary))]">
                  {active.media_type === 'video' ? 'Timed video placement' : 'Premium display placement'}
                </p>
              </div>

              <div className="ui-soft-panel px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  Rotation
                </p>
                <p className="mt-2 text-sm font-semibold text-[rgb(var(--primary))]">
                  Auto-rotates inside this slot with campaign sequencing.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
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
                <div className="flex items-center gap-2">
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
            </div>

            {items.length > 1 ? (
              <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={[
                      'relative min-w-[180px] overflow-hidden rounded-[1.25rem] border text-left transition',
                      index === activeIndex
                        ? 'border-[rgb(var(--primary))]/25 shadow-[0_18px_40px_rgba(15,23,42,0.12)]'
                        : 'border-[rgb(var(--border))] hover:border-[rgb(var(--accent))]/30',
                    ].join(' ')}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={mediaPreview(item)}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[rgba(7,18,16,0.92)] via-[rgba(7,18,16,0.38)] to-transparent" />
                    </div>

                    <div className="relative flex min-h-[120px] flex-col justify-end p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72">
                        Campaign {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-white">
                        {item.headline || item.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
