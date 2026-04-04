import { Head } from '@inertiajs/react';
import AdvertCarousel from '@/components/AdvertCarousel';
import AppLink from '@/components/AppLink';
import { advertsForSlot } from '@/lib/adverts';
import PublicLayout from '@/layouts/PublicLayout';
import type { AdvertSlots, GalleryGroup, GalleryItem } from '@/types';

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

function MediaTile({
  item,
  featured = false,
}: {
  item: GalleryItem;
  featured?: boolean;
}) {
  return (
    <article className="card-shell overflow-hidden">
      <div className={featured ? 'aspect-[16/10] bg-[rgb(var(--surface-2))]' : 'aspect-[4/3] bg-[rgb(var(--surface-2))]'}>
        {item.type === 'image' && item.image_path ? (
          <img
            src={item.image_path}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="relative flex h-full items-center justify-center overflow-hidden bg-slate-950">
            {item.image_path ? (
              <img
                src={item.image_path}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover opacity-45"
                loading="lazy"
              />
            ) : null}
            <div className="absolute inset-0 bg-linear-to-br from-slate-950/88 to-slate-900/72" />
            <div className="relative px-5 text-center text-sm font-semibold text-white">
              FEMATA video highlight
            </div>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="ui-chip mb-3 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
          {item.type === 'youtube' ? 'Video' : 'Image'}
        </div>

        <h3 className={`${featured ? 'text-2xl' : 'text-lg'} font-semibold text-[rgb(var(--primary))]`}>
          {item.title}
        </h3>

        {item.description ? (
          <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.description}</p>
        ) : null}

        {item.youtube_url ? (
          <a
            href={item.youtube_url}
            className="mt-4 inline-flex text-sm font-semibold text-[rgb(var(--primary))]"
            target="_blank"
            rel="noreferrer"
          >
            Watch video
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function Gallery({
  galleryItems,
  galleryGroups = [],
  adverts,
  announcements,
}: {
  galleryItems: GalleryItem[];
  galleryGroups?: GalleryGroup[];
  adverts?: AdvertSlots;
  announcements?: [];
}) {
  const groups = galleryGroups;
  const heroAdverts = advertsForSlot(adverts, 1);
  const inlineAdverts = advertsForSlot(adverts, 2);
  const closingAdverts = advertsForSlot(adverts, 3);

  return (
    <>
      <Head title="Gallery" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell">
          <div className="container-shell">
            <div className="glass-shell p-6 sm:p-10">
              <h1 className="section-title">Gallery &amp; Media</h1>
              <p className="section-copy">
                Event-based visual coverage from FEMATA meetings, field visits, stakeholder sessions, and public-facing sector activity.
              </p>
            </div>
          </div>
        </section>

        {heroAdverts.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <AdvertCarousel adverts={heroAdverts} slotNumber={1} />
            </div>
          </section>
        ) : null}

        <section className="section-shell pt-0">
          <div className="container-shell">
            {groups.length === 0 ? (
              <div className="card-shell p-8 text-center sm:p-12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  Media archive
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
                  FEMATA field media will be published here
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
                  This archive is reserved for FEMATA events, field visits, stakeholder meetings, member activities,
                  and approved video highlights from across the federation network.
                </p>
              </div>
            ) : (
              <div className="grid gap-8">
                {groups.map((group, index) => {
                  const leadItem = group.cover_item ?? group.items[0];
                  const remainingItems = group.items.slice(1, 3);

                  return (
                    <div key={group.slug} className="grid gap-8">
                      <section className="ui-section-layer p-5 sm:p-7">
                        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                              Event gallery
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))] sm:text-3xl">
                              {group.title}
                            </h2>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {group.date ? (
                              <span className="ui-chip px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                                {formatDate(group.date)}
                              </span>
                            ) : null}
                            <span className="ui-chip px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                              {group.item_count} items
                            </span>
                          </div>
                        </div>

                        <p className="mb-6 max-w-3xl text-sm leading-8 text-[rgb(var(--muted))]">
                          {group.note}
                        </p>

                        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.06fr)_minmax(340px,0.94fr)]">
                          {leadItem ? <MediaTile item={leadItem} featured /> : null}

                          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                            {remainingItems.length > 0 ? (
                              remainingItems.map((item) => (
                                <MediaTile key={item.id} item={item} />
                              ))
                            ) : leadItem ? (
                              <div className="card-shell flex items-center justify-center p-6 text-center text-sm leading-7 text-[rgb(var(--muted))]">
                                This event currently has one lead visual published on the FEMATA gallery.
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <AppLink href={group.href} className="btn-primary">
                            Open event story
                          </AppLink>
                          <span className="inline-flex min-h-[48px] items-center rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)] px-5 text-sm font-semibold text-[rgb(var(--primary))]">
                            Photos and videos with context notes
                          </span>
                        </div>
                      </section>

                      {index === 0 && inlineAdverts.length > 0 ? (
                        <AdvertCarousel adverts={inlineAdverts} slotNumber={2} compact />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {closingAdverts.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <AdvertCarousel adverts={closingAdverts} slotNumber={3} compact />
            </div>
          </section>
        ) : null}
      </PublicLayout>
    </>
  );
}
