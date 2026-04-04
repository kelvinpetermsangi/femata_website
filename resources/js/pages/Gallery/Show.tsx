import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import PublicLayout from '@/layouts/PublicLayout';
import type { GalleryGroup } from '@/types';

function formatDate(date?: string | null) {
  if (!date) {
    return null;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function EventMediaCard({
  item,
}: {
  item: GalleryGroup['items'][number];
}) {
  return (
    <article className="card-shell card-shell-hover overflow-hidden">
      <div className="aspect-[4/3] border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        {item.type === 'youtube' ? (
          <div className="relative flex h-full items-center justify-center overflow-hidden bg-slate-950">
            {item.image_path ? (
              <img src={item.image_path} alt={item.title ?? 'Event media'} className="absolute inset-0 h-full w-full object-cover opacity-45" loading="lazy" />
            ) : null}
            <div className="absolute inset-0 bg-linear-to-br from-slate-950/88 to-slate-900/72" />
            <div className="relative px-5 text-center text-sm font-semibold text-white">
              Video clip from this event
            </div>
          </div>
        ) : item.image_path ? (
          <img src={item.image_path} alt={item.title ?? 'Event media'} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full bg-[rgb(var(--surface-2))]" />
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
            {item.type === 'youtube' ? 'Video' : 'Image'}
          </span>
          {item.published_at ? (
            <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
              {formatDate(item.published_at)}
            </span>
          ) : null}
        </div>

        <h2 className="mt-3 text-base font-semibold text-[rgb(var(--primary))]">
          {item.title}
        </h2>

        <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
          {item.description || 'This media item forms part of the wider event story published on the FEMATA gallery.'}
        </p>

        {item.youtube_url ? (
          <a
            href={item.youtube_url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-sm font-semibold text-[rgb(var(--primary))]"
          >
            Watch clip
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function GalleryEventShow({
  event,
  relatedEvents = [],
  announcements,
}: {
  event: GalleryGroup;
  relatedEvents?: GalleryGroup[];
  announcements?: [];
}) {
  return (
    <>
      <Head title={event.title} />

      <PublicLayout announcements={announcements}>
        <section className="section-shell pb-2">
          <div className="container-shell flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-4xl">
              <p className="eyebrow">Event Story</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-[2.5rem]">
                {event.title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))] sm:text-base">
                {event.note}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {event.date ? (
                <span className="ui-chip px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))]">
                  {formatDate(event.date)}
                </span>
              ) : null}
              <span className="ui-chip px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))]">
                {event.item_count} media items
              </span>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="flex flex-wrap gap-3">
              <AppLink href="/gallery" className="btn-secondary">
                Back to gallery
              </AppLink>
              <AppLink href="/contact" className="btn-primary">
                Enquire about coverage
              </AppLink>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {event.items.map((item) => (
                <EventMediaCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {relatedEvents.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <div className="ui-section-layer p-4 sm:p-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                      More event galleries
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-[rgb(var(--primary))] sm:text-2xl">
                      Explore other FEMATA event stories
                    </h2>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {relatedEvents.map((item) => (
                    <article key={item.slug} className="card-shell card-shell-hover overflow-hidden">
                      <div className="aspect-[4/3] border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
                        {item.cover_item?.image_path ? (
                          <img src={item.cover_item.image_path} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                        ) : null}
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-[rgb(var(--primary))]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">{item.note}</p>
                        <AppLink href={item.href} className="btn-secondary mt-4 justify-center">
                          Open event
                        </AppLink>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </PublicLayout>
    </>
  );
}
