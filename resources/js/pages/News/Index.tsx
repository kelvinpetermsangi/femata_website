import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import PublicLayout from '@/layouts/PublicLayout';

type NewsArticle = {
  title: string;
  body: string;
  cover_image?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  category?: string | null;
  is_breaking?: boolean;
};

export default function NewsShow({
  news,
  announcements,
}: {
  news: NewsArticle;
  announcements?: [];
}) {
  const formatDate = (date?: string | null) => {
    if (!date) return null;

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const publishedDate = formatDate(news.published_at);
  const updatedDate = formatDate(news.updated_at);

  const wasEdited =
    news.updated_at &&
    news.published_at &&
    new Date(news.updated_at).getTime() > new Date(news.published_at).getTime();

  const paragraphs = news.body
    ? news.body.split('\n').filter((paragraph) => paragraph.trim() !== '')
    : [];

  return (
    <>
      <Head title={news.title} />

      <PublicLayout announcements={announcements}>
        <section className="border-b border-[rgb(var(--line))] bg-transparent">
          <div className="container-shell py-10 sm:py-14 lg:py-16">
            <div className="mx-auto max-w-6xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                {news.is_breaking ? (
                  <span className="inline-flex rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                    Breaking
                  </span>
                ) : null}

                <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  {news.category ?? 'News'}
                </span>

                <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  FEMATA Newsroom
                </span>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
                <div>
                  <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-5xl lg:text-6xl">
                    {news.title}
                  </h1>

                  <p className="mt-5 max-w-3xl text-base leading-8 text-[rgb(var(--muted))] sm:text-lg">
                    Official updates, announcements, and sector developments from the Federation of
                    Miners&apos; Associations of Tanzania.
                  </p>
                </div>

                <div className="ui-shell p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Article information
                  </p>

                  <div className="mt-4 space-y-4 text-sm text-[rgb(var(--muted))]">
                    <div>
                      <p className="font-semibold text-[rgb(var(--foreground))]">Published</p>
                      <p>{publishedDate ?? 'Recently'}</p>
                    </div>

                    {wasEdited ? (
                      <div>
                        <p className="font-semibold text-[rgb(var(--foreground))]">Last updated</p>
                        <p>{updatedDate}</p>
                      </div>
                    ) : null}

                    <div>
                      <p className="font-semibold text-[rgb(var(--foreground))]">Type</p>
                      <p>{news.category ?? 'News'}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-[rgb(var(--foreground))]">Publisher</p>
                      <p>FEMATA Newsroom</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {news.cover_image ? (
          <section className="bg-transparent">
            <div className="container-shell pt-6 sm:pt-8">
              <div className="card-shell mx-auto max-w-6xl overflow-hidden">
                <img
                  src={news.cover_image}
                  alt={news.title}
                  className="h-[240px] w-full object-cover sm:h-[360px] lg:h-[520px]"
                  loading="eager"
                />
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-transparent pb-16 pt-8 sm:pb-24 sm:pt-10">
          <div className="container-shell">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
              <aside className="lg:sticky lg:top-24 lg:h-fit">
                <div className="ui-shell p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Quick navigation
                  </p>

                  <div className="mt-4 flex flex-col gap-3">
                    <AppLink href="/news" className="btn-secondary">
                      Back to newsroom
                    </AppLink>

                    {wasEdited ? (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-800 backdrop-blur-sm">
                        This article was updated after its original publication.
                      </div>
                    ) : null}
                  </div>
                </div>
              </aside>

              <article className="ui-section-layer px-6 py-8 sm:px-10 sm:py-12 lg:px-14">
                <div className="mb-8 border-b border-[rgb(var(--line))] pb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Article
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
                    FEMATA shares official news, announcements, and sector-facing updates in a
                    clearer editorial format for members, partners, and the wider public.
                  </p>
                </div>

                <div className="space-y-6">
                  {paragraphs.map((paragraph, index) => {
                    const isQuote =
                      paragraph.startsWith('"') ||
                      paragraph.startsWith('\u201c') ||
                      paragraph.startsWith("'");

                    if (isQuote) {
                      return (
                        <blockquote
                          key={index}
                          className="rounded-r-2xl border-l-4 border-[rgb(var(--primary))] bg-[rgba(var(--surface),0.56)] px-5 py-4 text-lg leading-8 text-[rgb(var(--primary))] backdrop-blur-sm"
                        >
                          {paragraph}
                        </blockquote>
                      );
                    }

                    return (
                      <p
                        key={index}
                        className={`text-[16px] leading-8 text-[rgb(var(--foreground))] sm:text-[17px] ${
                          index === 0 ? 'text-lg leading-9 sm:text-[19px]' : ''
                        }`}
                      >
                        {index === 0 ? (
                          <span className="float-left mr-3 mt-1 text-5xl font-semibold leading-none text-[rgb(var(--primary))] sm:text-6xl">
                            {paragraph.charAt(0)}
                          </span>
                        ) : null}
                        {index === 0 ? paragraph.slice(1) : paragraph}
                      </p>
                    );
                  })}
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[rgb(var(--line))] pt-6">
                  <AppLink href="/news" className="btn-secondary">
                    Back to newsroom
                  </AppLink>

                  <div className="text-sm text-[rgb(var(--muted))]">
                    FEMATA | Official News & Updates
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
