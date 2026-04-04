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
  featured = false,
}: {
  item: GalleryGroup['items'][number];
  featured?: boolean;
}) {
  return (
    <article className="card-shell overflow-hidden">
      <div className={featured ? 'aspect-[16/10] bg-[rgb(var(--surface-2))]' : 'aspect-[4/3] bg-[rgb(var(--surface-2))]'}>
        {item.type === 'youtube' ? (
          <div className="relative flex h-full items-center justify-center overflow-hidden bg-slate-950">
            {item.image_path ? (
              <img src={item.image_path} alt={item.title ?? 'Event media'} className="absolute inset-0 h-full w-full object-cover opacity-45" loading="lazy" />
            ) : null}
            <div className="absolute inset-0 bg-linear-to-br from-slate-950/88 to-slate-900/72" />
            <div className="relative px-5 text-center text-sm font-semibold text-white">
              Video clip from this FEMATA event
            </div>
          </div>
        ) : item.image_path ? (
          <img src={item.image_path} alt={item.title ?? 'Event media'} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full bg-[rgb(var(--surface-2))]" />
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
            {item.type === 'youtube' ? 'Video' : 'Image'}
          </span>
          {item.published_at ? (
            <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
              {formatDate(item.published_at)}
            </span>
          ) : null}
        </div>

        <h2 className={`${featured ? 'text-2xl' : 'text-xl'} mt-4 font-semibold text-[rgb(var(--primary))]`}>
          {item.title}
        </h2>

        <p className="mt-3 text-sm leading-8 text-[rgb(var(--muted))]">
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
  const heroImage = event.cover_item?.image_path;
  const leadItem = event.cover_item ?? event.items[0];
  const remainingItems = event.items.slice(1);

  return (
    <>
      <Head title={event.title} />

      <PublicLayout announcements={announcements}>
        <section className="section-shell pb-6">
          <div className="container-shell">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 shadow-[0_35px_100px_rgba(15,23,42,0.2)]">
              <div className="absolute inset-0">
                {heroImage ? <img src={heroImage} alt={event.title} className="h-full w-full object-cover" /> : null}
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.94),rgba(7,28,24,0.84),rgba(15,23,42,0.68))]" />
              </div>

              <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82">
                      Event story
                    </span>
                    {event.date ? (
                      <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82">
                        {formatDate(event.date)}
                      </span>
                    ) : null}
                    <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82">
                      {event.item_count} media items
                    </span>
                  </div>

                  <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                    {event.title}
                  </h1>
                  <p className="mt-6 max-w-3xl text-sm leading-8 text-white/82 sm:text-base">
                    {event.note}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <AppLink href="/gallery" className="btn-secondary border-white/18 bg-white/10 text-white hover:bg-white/16">
                      Back to gallery
                    </AppLink>
                    <AppLink href="/contact" className="btn-primary">
                      Enquire about coverage
                    </AppLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell grid gap-6">
            {leadItem ? <EventMediaCard item={leadItem} featured /> : null}

            {remainingItems.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {remainingItems.map((item) => (
                  <EventMediaCard key={item.id} item={item} />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {relatedEvents.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <div className="ui-section-layer p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  More event galleries
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">
                  Explore other FEMATA event stories
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {relatedEvents.map((item) => (
                    <article key={item.slug} className="card-shell overflow-hidden">
                      <div className="aspect-[4/3] bg-[rgb(var(--surface-2))]">
                        {item.cover_item?.image_path ? (
                          <img src={item.cover_item.image_path} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                        ) : null}
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-[rgb(var(--primary))]">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.note}</p>
                        <AppLink href={item.href} className="btn-secondary mt-5">
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
