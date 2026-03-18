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
  return (
    <>
      <Head title={news.title} />

      <PublicLayout announcements={announcements}>
        <section className="section-shell">
          <div className="container-shell">
            <div className="glass-shell p-6 sm:p-10">
              <p className="eyebrow">Newsroom</p>
              <h1 className="mt-4 section-title">{news.title}</h1>
              <p className="section-copy">Published {news.published_at ?? 'recently'}</p>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <article className="card-shell">
              {news.cover_image ? (
                <img
                  src={news.cover_image}
                  alt={news.title}
                  className="h-[360px] w-full object-cover"
                  loading="lazy"
                />
              ) : null}

              <div className="p-6">
                <p className="text-sm leading-7 text-[rgb(var(--muted))] whitespace-pre-line">
                  {news.body}
                </p>
                <div className="mt-6">
                  <AppLink href="/news" className="btn-secondary">
                    Back to newsroom
                  </AppLink>
                </div>
              </div>
            </article>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
