import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';

export default function Gallery({
  galleryItems,
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
                        {item.youtube_url ? 'YouTube highlight' : 'No visual available'}
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="mb-3 inline-flex rounded-full bg-[rgb(var(--accent-soft))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
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
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
