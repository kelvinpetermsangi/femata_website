import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import PageHero from '@/components/PageHero';
import SectionLead from '@/components/SectionLead';
import { useSitePreferences } from '@/hooks/useSitePreferences';
import PublicLayout from '@/layouts/PublicLayout';
import { copy } from '@/lib/copy';
import { defaultHomeContent } from '@/lib/siteDefaults';
import type { GalleryItem, HomePageProps } from '@/types';

function youtubeThumb(url?: string | null) {
  if (!url) {
    return null;
  }

  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function GalleryFeature({ item }: { item: GalleryItem }) {
  const image = item.type === 'youtube' ? youtubeThumb(item.youtube_url) : item.image_path;

  return (
    <article className="media-frame relative min-h-[220px]">
      {image ? (
        <img
          src={image}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full min-h-[220px] items-center justify-center bg-[rgb(var(--surface-2))] text-sm text-[rgb(var(--muted))]">
          Media preview unavailable
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-5 text-white">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
          {item.type === 'youtube' ? 'Video highlight' : 'Field image'}
        </p>
        <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
        {item.description ? <p className="mt-2 text-sm text-white/75">{item.description}</p> : null}
      </div>
    </article>
  );
}

export default function Home({
  announcements = [],
  news = [],
  leaders = [],
  documents = [],
  galleryItems = [],
  homeContent = defaultHomeContent,
}: HomePageProps) {
  const { locale } = useSitePreferences();
  const t = copy[locale];
  const content = homeContent ?? defaultHomeContent;
  const featuredNews = news[0];
  const secondaryNews = news.slice(1, 4);
  const leadLeader = leaders[0];
  const leadershipTeam = leaders.slice(1, 4);
  const leadGallery = galleryItems[0];
  const supportingGallery = galleryItems.slice(1, 3);
  const highlights = content.highlights ?? [];
  const pillars = content.pillars ?? [];
  const zones = content.zones ?? [];
  const partners = content.partners ?? [];

  return (
    <>
      <Head title="Home" />

      <PublicLayout announcements={announcements}>
        <PageHero
          eyebrow={t.hero.eyebrow}
          title={t.hero.title}
          text={t.hero.text}
          image={content.hero_image ?? defaultHomeContent.hero_image ?? ''}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--primary))]">
              {content.hero_panel_label}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="metric-badge">
                <p className="text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Announcements</p>
                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">{announcements.length}</p>
              </div>
              <div className="metric-badge">
                <p className="text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))]">News</p>
                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">{news.length}</p>
              </div>
              <div className="metric-badge">
                <p className="text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Leadership</p>
                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">{leaders.length}</p>
              </div>
              <div className="metric-badge">
                <p className="text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Resources</p>
                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">{documents.length}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <AppLink href="/about" className="btn-primary">
                {t.hero.primary}
              </AppLink>
              <AppLink href="/news" className="btn-secondary">
                {t.hero.secondary}
              </AppLink>
            </div>
          </div>
        </PageHero>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <SectionLead
              eyebrow={content.why_eyebrow}
              title={content.why_title}
              text={content.why_text}
            />

            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="paper-panel subtle-grid">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  {content.mandate_label}
                </p>
                <h3 className="mt-4 text-3xl font-semibold leading-tight text-[rgb(var(--primary))]">
                  {content.mandate_title}
                </h3>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-[rgb(var(--muted))] sm:text-base">
                  {content.mandate_text}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight.label}
                      className="rounded-[1.25rem] border border-[rgb(var(--border))] bg-white/85 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                        {highlight.label}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[rgb(var(--fg))]">{highlight.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                {pillars.map((pillar) => (
                  <div key={pillar.title} className="paper-panel">
                    <div className="pillar-rail">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
                        Strategic pillar
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
                        {pillar.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="strata-overlay overflow-hidden rounded-[2rem] px-6 py-10 text-white sm:px-8 lg:px-10">
              <SectionLead
                eyebrow={content.footprint_eyebrow}
                title={content.footprint_title}
                text={content.footprint_text}
                align="left"
              />

              <div className="grid gap-4">
                {zones.map((zone) => (
                  <div key={zone.name} className="zone-row bg-white/10 text-white backdrop-blur-sm">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/68">Zone</p>
                      <h3 className="mt-2 text-2xl font-semibold">{zone.name}</h3>
                    </div>
                    <p className="text-sm leading-7 text-white/82">{zone.focus}</p>
                    <p className="text-sm font-medium text-white/72">{zone.base}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <SectionLead
              eyebrow={content.news_eyebrow}
              title={content.news_title}
              text={content.news_text}
              actionHref="/news"
              actionLabel={t.viewAll}
            />

            <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="paper-panel">
                {featuredNews ? (
                  <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="media-frame min-h-[320px]">
                      {featuredNews.cover_image ? (
                        <img
                          src={featuredNews.cover_image}
                          alt={featuredNews.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-center">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
                        Featured story
                      </p>
                      <h3 className="mt-3 text-3xl font-semibold leading-tight text-[rgb(var(--primary))]">
                        {featuredNews.title}
                      </h3>
                      {featuredNews.excerpt ? (
                        <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">
                          {featuredNews.excerpt}
                        </p>
                      ) : null}
                      <div className="mt-6 flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                          {featuredNews.published_at ?? 'Recent update'}
                        </p>
                        <AppLink href={`/news/${featuredNews.slug}`} className="story-link">
                          Continue reading
                        </AppLink>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-[rgb(var(--muted))]">
                    Featured news will appear here once published.
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="paper-panel">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
                    News stream
                  </p>
                  <div className="mt-5 divide-y" style={{ borderColor: 'rgba(var(--border), 0.9)' }}>
                    {secondaryNews.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                        <p className="text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                          {item.published_at ?? 'Recent update'}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold leading-tight text-[rgb(var(--primary))]">
                          {item.title}
                        </h3>
                        {item.excerpt ? (
                          <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                            {item.excerpt}
                          </p>
                        ) : null}
                        <AppLink href={`/news/${item.slug}`} className="story-link mt-3">
                          Read story
                        </AppLink>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="paper-panel">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
                    Noticeboard
                  </p>
                  <div className="mt-4 space-y-3">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="rounded-[1.2rem] border border-[rgb(var(--border))] bg-white/85 px-4 py-4"
                      >
                        <p className="text-sm font-semibold text-[rgb(var(--primary))]">
                          {announcement.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                          {announcement.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <SectionLead
              eyebrow={content.leadership_eyebrow}
              title={content.leadership_title}
              text={content.leadership_text}
              actionHref="/leadership"
              actionLabel={t.viewAll}
            />

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              {leadLeader ? (
                <div className="paper-panel">
                  <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                    <div className="media-frame min-h-[360px]">
                      {leadLeader.photo_path ? (
                        <img
                          src={leadLeader.photo_path}
                          alt={leadLeader.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-center">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
                        Leadership spotlight
                      </p>
                      <h3 className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">
                        {leadLeader.name}
                      </h3>
                      <p className="mt-2 text-base font-medium text-[rgb(var(--primary-soft))]">
                        {leadLeader.title}
                      </p>
                      {leadLeader.bio ? (
                        <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">
                          {leadLeader.bio}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-4">
                {leadershipTeam.map((leader) => (
                  <div key={leader.id} className="paper-panel">
                    <div className="grid gap-4 sm:grid-cols-[110px_1fr] sm:items-center">
                      <div className="media-frame h-[110px] w-[110px]">
                        {leader.photo_path ? (
                          <img
                            src={leader.photo_path}
                            alt={leader.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : null}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[rgb(var(--primary))]">{leader.name}</h3>
                        <p className="mt-1 text-sm font-medium text-[rgb(var(--primary-soft))]">{leader.title}</p>
                        {leader.bio ? (
                          <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{leader.bio}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <div>
                <SectionLead
                  eyebrow={content.media_eyebrow}
                  title={content.media_title}
                  text={content.media_text}
                  actionHref="/gallery"
                  actionLabel={t.viewAll}
                  align="left"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  {leadGallery ? (
                    <div className="md:col-span-2">
                      <GalleryFeature item={leadGallery} />
                    </div>
                  ) : null}

                  {supportingGallery.map((item) => (
                    <GalleryFeature key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <div>
                <SectionLead
                  eyebrow={content.documents_eyebrow}
                  title={content.documents_title}
                  text={content.documents_text}
                  actionHref="/documents"
                  actionLabel={t.viewAll}
                  align="left"
                />

                <div className="paper-panel">
                  {documents.map((document) => (
                    <div key={document.id} className="resource-row">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent-2))]">
                          {document.category ?? 'Resource'}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-[rgb(var(--primary))]">
                          {document.title}
                        </h3>
                        {document.description ? (
                          <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                            {document.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="text-sm text-[rgb(var(--muted))]">
                        {document.published_at ?? 'Current'}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                        <AppLink href={`/documents/${document.slug}`} className="story-link">
                          Open
                        </AppLink>
                        <a href={document.file_path} className="story-link" download>
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="soft-band px-6 py-10 text-white sm:px-8 lg:px-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                    {content.partnerships_eyebrow}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                    {content.partnerships_title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-white/82 sm:text-base">
                    {content.partnerships_text}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {partners.map((partner) => (
                      <span
                        key={partner}
                        className="rounded-full border border-white/16 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/82"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <AppLink href="/contact" className="btn-primary">
                    {t.contactBlockButton}
                  </AppLink>
                  <AppLink
                    href="/about"
                    className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    {content.secondary_cta_label}
                  </AppLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
