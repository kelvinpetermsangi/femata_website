import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import PublicLayout from '@/layouts/PublicLayout';

export default function NewsShow({
  news,
  announcements,
}: {
  news: {
    title: string;
    body: string;
    cover_image?: string | null;
    published_at?: string | null;
  };
  announcements?: [];
}) {
  const paragraphs = news.body
    ? news.body.split('\n').filter((paragraph) => paragraph.trim() !== '')
    : [];

  return (
    <>
      <Head title={news.title} />

      <PublicLayout announcements={announcements}>
        <section className="relative overflow-hidden">
          {news.cover_image ? (
            <div className="absolute inset-0">
              <img
                src={news.cover_image}
                alt={news.title}
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/55 to-[rgb(var(--background))]" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,47,73,1),rgba(15,23,42,1),rgba(6,78,59,1))]" />
          )}

          <div className="relative container-shell py-20 sm:py-24 lg:py-32">
            <div className="ui-shell-strong max-w-4xl p-6 sm:p-8 lg:p-10">
              <div className="ui-chip px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
                FEMATA Newsroom
              </div>

              <h1 className="mt-6 max-w-4xl text-3xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-5xl lg:text-6xl">
                {news.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[rgb(var(--muted))]">
                <span className="ui-chip px-3 py-1">
                  Published {news.published_at ?? 'recently'}
                </span>
                <span className="h-1 w-1 rounded-full bg-[rgb(var(--accent))]/60" />
                <span>Federation of Miners' Associations of Tanzania</span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative -mt-10 pb-16 sm:-mt-14 sm:pb-24">
          <div className="container-shell">
            <article className="card-shell">
              {news.cover_image ? (
                <div className="border-b border-[rgb(var(--line))] bg-[rgba(var(--surface),0.72)] p-3 sm:p-4">
                  <img
                    src={news.cover_image}
                    alt={news.title}
                    className="h-[240px] w-full rounded-2xl object-cover sm:h-[360px] lg:h-[460px]"
                    loading="lazy"
                  />
                </div>
              ) : null}

              <div className="mx-auto max-w-3xl px-6 py-8 sm:px-10 sm:py-12 lg:px-14">
                <div className="mb-8 border-b border-[rgb(var(--line))] pb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Official Update
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
                    This article is part of FEMATA&apos;s news and updates
                    section, designed to present institutional developments,
                    sector insights, announcements, and public-facing
                    organizational communication in a clear and modern format.
                  </p>
                </div>

                <div className="prose prose-lg max-w-none prose-p:mb-6 prose-p:leading-8 prose-p:text-[rgb(var(--foreground))]">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-base leading-8 text-[rgb(var(--foreground))] sm:text-[17px]"
                      >
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-base leading-8 text-[rgb(var(--foreground))] sm:text-[17px]">
                      {news.body}
                    </p>
                  )}
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[rgb(var(--line))] pt-6">
                  <AppLink href="/news" className="btn-secondary">
                    Back to newsroom
                  </AppLink>

                  <div className="text-sm text-[rgb(var(--muted))]">
                    FEMATA | News & Updates
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
