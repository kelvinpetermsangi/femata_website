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
    month: 'short',
    year: 'numeric',
  });
}

function excerpt(value?: string | null) {
  const text = value?.trim();

  if (!text) {
    return 'Photos and short clips from a FEMATA event, field mission, or public-facing sector activity.';
  }

  return text.length > 120 ? `${text.slice(0, 120).trim()}...` : text;
}

function EventShelfCard({
  group,
}: {
  group: GalleryGroup;
}) {
  const cover = group.cover_item;
  const previewItems = group.items.slice(0, 3);

  return (
    <article className="card-shell card-shell-hover flex h-full flex-col overflow-hidden">
      <div className="aspect-[4/3] border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        {cover?.image_path ? (
          <img src={cover.image_path} alt={group.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-[rgb(var(--surface-2))] to-[rgba(var(--surface),0.82)] text-sm font-semibold text-[rgb(var(--primary))]">
            FEMATA event media
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-2">
          {group.date ? (
            <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
              {formatDate(group.date)}
            </span>
          ) : null}
          <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
            {group.item_count} items
          </span>
        </div>

        <h2 className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">
          {group.title}
        </h2>
        <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
          {excerpt(group.note)}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {previewItems.map((item) => (
            <div key={item.id} className="aspect-square overflow-hidden rounded-[0.95rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
              {item.image_path ? (
                <img src={item.image_path} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                  Video
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <AppLink href={group.href} className="btn-primary justify-center">
            Open event story
          </AppLink>
        </div>
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
  const heroAdverts = advertsForSlot(adverts, 1);
  const inlineAdverts = advertsForSlot(adverts, 2);
  const closingAdverts = advertsForSlot(adverts, 3);

  return (
    <>
      <Head title="Gallery" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell pb-2">
          <div className="container-shell flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-4xl">
              <p className="eyebrow">FEMATA Gallery</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-[2.6rem]">
                Event galleries arranged like a modern media shelf
              </h1>
              <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))] sm:text-base">
                Browse event albums, then open each story to see the full photo and video set with captions and context notes.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="ui-chip px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))]">
                {galleryGroups.length} event groups
              </span>
              <span className="ui-chip px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))]">
                {galleryItems.length} media items
              </span>
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
            {galleryGroups.length === 0 ? (
              <div className="card-shell p-8 text-center sm:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  Media archive
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
                  FEMATA field media will appear here
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
                  Event albums, public highlights, and field visuals will populate this media shelf once they are published.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {galleryGroups.map((group) => (
                  <EventShelfCard key={group.slug} group={group} />
                ))}
              </div>
            )}
          </div>
        </section>

        {inlineAdverts.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <AdvertCarousel adverts={inlineAdverts} slotNumber={2} compact />
            </div>
          </section>
        ) : null}

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
