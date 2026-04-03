import { Head } from '@inertiajs/react';
import AdvertCarousel from '@/components/AdvertCarousel';
import AppLink from '@/components/AppLink';
import { useSitePreferences } from '@/hooks/useSitePreferences';
import { copy } from '@/lib/copy';
import { advertsForSlot } from '@/lib/adverts';
import PublicLayout from '@/layouts/PublicLayout';
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

function StoryCard({ item }: { item: NewsPost }) {
  return (
    <article className="card-shell overflow-hidden">
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
          Read full story
        </AppLink>
      </div>
    </article>
  );
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
  const leadStory = news[0];
  const supportingStories = news.slice(1, 4);
  const archiveStories = news.slice(4);
  const heroAdverts = advertsForSlot(adverts, 1);
  const inlineAdverts = advertsForSlot(adverts, 2);
  const closingAdverts = advertsForSlot(adverts, 3);

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

        {heroAdverts.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <AdvertCarousel adverts={heroAdverts} slotNumber={1} />
            </div>
          </section>
        ) : null}

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
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.14fr)_minmax(320px,0.86fr)]">
                <article className="card-shell overflow-hidden">
                  <div className="aspect-[16/9] bg-[rgb(var(--surface-2))]">
                    {leadStory?.cover_image ? (
                      <img
                        src={leadStory.cover_image}
                        alt={leadStory.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
                      {leadStory?.is_breaking ? (
                        <span className="rounded-full bg-red-600 px-2.5 py-1 font-semibold text-white">
                          Breaking
                        </span>
                      ) : null}
                      <span className="text-[rgb(var(--muted))]">{formatDate(leadStory?.published_at)}</span>
                      {leadStory?.category ? (
                        <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 font-semibold text-[rgb(var(--accent-2))]">
                          {leadStory.category}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="mt-4 text-3xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-4xl">
                      {leadStory?.title}
                    </h2>

                    {leadStory?.excerpt ? (
                      <p className="mt-4 max-w-3xl text-sm leading-8 text-[rgb(var(--muted))] sm:text-base">
                        {leadStory.excerpt}
                      </p>
                    ) : null}

                    <div className="mt-6 flex flex-wrap gap-3">
                      {leadStory ? (
                        <AppLink href={`/news/${leadStory.slug}`} className="btn-primary">
                          Open lead story
                        </AppLink>
                      ) : null}
                      <AppLink href="/contact" className="btn-secondary">
                        Submit a FEMATA update
                      </AppLink>
                    </div>
                  </div>
                </article>

                <div className="grid gap-4">
                  {supportingStories.map((item) => (
                    <article key={item.id} className="card-shell p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
                        <span className="text-[rgb(var(--muted))]">{formatDate(item.published_at)}</span>
                        {item.category ? (
                          <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 font-semibold text-[rgb(var(--accent-2))]">
                            {item.category}
                          </span>
                        ) : null}
                      </div>

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
                        className="mt-4 inline-flex text-sm font-semibold text-[rgb(var(--primary))]"
                      >
                        {t.readMore}
                      </AppLink>
                    </article>
                  ))}
                </div>
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

        {archiveStories.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                    Archive
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                    More newsroom updates
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
                  Additional federation stories, field reports, and sector updates remain available below the lead package.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {archiveStories.map((item) => (
                  <StoryCard key={item.id} item={item} />
                ))}
              </div>
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
