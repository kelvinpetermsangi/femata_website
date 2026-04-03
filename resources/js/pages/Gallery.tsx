import { Head } from '@inertiajs/react';
import AdvertCarousel from '@/components/AdvertCarousel';
import { advertsForSlot } from '@/lib/adverts';
import PublicLayout from '@/layouts/PublicLayout';
import type { AdvertSlots } from '@/types';

export default function Gallery({
  galleryItems,
  adverts,
  announcements,
}: {
  galleryItems: {
    id: number;
    title: string;
    slug: string;
    type: 'image' | 'youtube';
    image_path?: string | null;
    youtube_url?: string | null;
    description?: string | null;
  }[];
  adverts?: AdvertSlots;
  announcements?: [];
}) {
  return (
    <>
      <Head title="Gallery" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell">
          <div className="container-shell">
            <div className="glass-shell p-6 sm:p-10">
              <h1 className="section-title">Gallery & Media</h1>
              <p className="section-copy">Visual highlights from FEMATA events and outreach.</p>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <AdvertCarousel adverts={advertsForSlot(adverts, 1)} slotNumber={1} />
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            {galleryItems.length === 0 ? (
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
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {galleryItems.map((item) => (
                  <article key={item.id} className="card-shell overflow-hidden">
                    <div className="aspect-[16/10] bg-[rgb(var(--surface-2))]">
                      {item.type === 'image' && item.image_path ? (
                        <img
                          src={item.image_path}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[rgb(var(--muted))]">
                          {item.youtube_url ? 'FEMATA video highlight' : 'FEMATA media preview'}
                        </div>
                      )}
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="ui-chip mb-3 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                        {item.type === 'youtube' ? 'Video' : 'Image'}
                      </div>

                      <h3 className="text-lg font-semibold text-[rgb(var(--primary))]">{item.title}</h3>
                      {item.description ? (
                        <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">{item.description}</p>
                      ) : null}
                      {item.youtube_url ? (
                        <a
                          href={item.youtube_url}
                          className="mt-3 inline-flex text-sm font-semibold text-[rgb(var(--primary))]"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Watch video
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
