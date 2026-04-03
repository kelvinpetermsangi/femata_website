import { Head } from '@inertiajs/react';
import AdvertCarousel from '@/components/AdvertCarousel';
import AppLink from '@/components/AppLink';
import { advertsForSlot } from '@/lib/adverts';
import { useSitePreferences } from '@/hooks/useSitePreferences';
import PublicLayout from '@/layouts/PublicLayout';
import { copy } from '@/lib/copy';
import type { AdvertSlots, NewsPost } from '@/types';

function formatDate(date?: string | null) {
  if (!date) {
    return 'Latest update';
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

export default function NewsArchive({
  news,
  adverts,
  announcements,
}: {
  news: NewsPost[];
  adverts?: AdvertSlots;
  announcements?: [];
}) {
  const { locale } = useSitePreferences();
  const t = copy[locale];

  return (
    <>
      <Head title="News" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell">
          <div className="container-shell">
            <div className="glass-shell p-6 sm:p-10">
              <p className="eyebrow">{t.sections.news}</p>
              <h1 className="mt-4 section-title">Newsroom</h1>
              <p className="section-copy">{t.sections.newsText}</p>
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
            {news.length === 0 ? (
              <div className="card-shell p-8 text-center sm:p-12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  Newsroom
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
                  FEMATA news stories will be published here
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
                  Official federation stories, sector briefings, public statements, and field updates will appear here as the FEMATA newsroom publishes them.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-3">
                {news.map((item) => (
                  <article key={item.id} className="card-shell overflow-hidden">
                    <div className="aspect-[16/10] bg-[rgb(var(--surface-2))]">
                      {item.cover_image ? (
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : null}
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
                        {item.is_breaking ? (
                          <span className="rounded-full bg-red-600 px-2.5 py-1 font-semibold text-white">
                            Breaking
                          </span>
                        ) : null}
                        <span className="text-[rgb(var(--muted))]">{formatDate(item.published_at)}</span>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold leading-snug text-[rgb(var(--primary))]">
                        {item.title}
                      </h3>

                      {item.category ? (
                        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--accent-2))]">
                          {item.category}
                        </p>
                      ) : null}

                      {item.excerpt ? (
                        <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
                          {item.excerpt}
                        </p>
                      ) : null}

                      <AppLink
                        href={`/news/${item.slug}`}
                        className="mt-5 inline-flex text-sm font-semibold text-[rgb(var(--primary))]"
                      >
                        {t.readMore}
                      </AppLink>
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
