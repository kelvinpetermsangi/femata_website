import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import PublicLayout from '@/layouts/PublicLayout';
import { copy } from '@/lib/copy';
import { useSitePreferences } from '@/hooks/useSitePreferences';
import type { NewsPost } from '@/types';

export default function NewsIndex({
  news,
  announcements,
}: {
  news: NewsPost[];
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
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      {item.published_at ?? 'Latest update'}
                    </p>

                    <h3 className="mt-3 text-xl font-semibold leading-snug text-[rgb(var(--primary))]">
                      {item.title}
                    </h3>

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
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
