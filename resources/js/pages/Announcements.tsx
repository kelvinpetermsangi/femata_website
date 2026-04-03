import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import type { Announcement } from '@/types';

type Advert = {
  id: number;
  label: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  theme: string;
};

export default function Announcements({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const featured = announcements?.[0];
  const sideNotices = announcements?.slice(1, 5) ?? [];
  const moreNotices = announcements?.slice(5) ?? [];

  const adverts: Advert[] = useMemo(
    () => [
      {
        id: 1,
        label: 'Partner Spotlight',
        title: 'Equipment & Technology Solutions',
        description:
          'Promote responsible mining tools, technical services, and member-facing productivity solutions.',
        cta: 'Explore Partner',
        href: '/documents',
        theme:
          'from-[rgba(255,252,247,0.98)] via-[rgba(236,248,244,0.96)] to-[rgba(225,239,232,0.92)]',
      },
      {
        id: 2,
        label: 'Member Service',
        title: 'Financial Access for Mining Communities',
        description:
          'Highlight formal financial services, savings products, credit access, and institutional banking support.',
        cta: 'Learn More',
        href: '/contact',
        theme:
          'from-[rgba(247,250,252,0.98)] via-[rgba(233,242,248,0.96)] to-[rgba(225,236,244,0.92)]',
      },
      {
        id: 3,
        label: 'Industry Notice',
        title: 'Training, Compliance & Safety Programs',
        description:
          'Feature professional training, safety campaigns, and practical field guidance for members.',
        cta: 'View Details',
        href: '/documents',
        theme:
          'from-[rgba(250,247,255,0.98)] via-[rgba(235,243,248,0.96)] to-[rgba(226,239,234,0.92)]',
      },
      {
        id: 4,
        label: 'Event Promotion',
        title: 'Upcoming Forums, Dialogues & Exhibitions',
        description:
          'Reserve space for event promotion without distracting from institutional communication.',
        cta: 'See Event',
        href: '/news',
        theme:
          'from-[rgba(255,248,241,0.98)] via-[rgba(240,247,243,0.96)] to-[rgba(232,243,238,0.92)]',
      },
      {
        id: 5,
        label: 'Corporate Notice',
        title: 'Professional Services for the Mining Ecosystem',
        description:
          'Showcase advisory, legal documentation, logistics, finance, audit support, and research services.',
        cta: 'Open Profile',
        href: '/contact',
        theme:
          'from-[rgba(248,249,251,0.98)] via-[rgba(235,242,246,0.96)] to-[rgba(228,239,235,0.92)]',
      },
      {
        id: 6,
        label: 'Public Campaign',
        title: 'Responsible Mining & Community Development',
        description:
          'Use this space for campaigns that align with formalization, inclusion, safety, and environmental care.',
        cta: 'Read Campaign',
        href: '/about',
        theme:
          'from-[rgba(244,251,248,0.98)] via-[rgba(234,245,248,0.96)] to-[rgba(224,239,244,0.92)]',
      },
    ],
    []
  );

  const [activeAdvert, setActiveAdvert] = useState(0);

  useEffect(() => {
    if (adverts.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveAdvert((current) => (current + 1) % adverts.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [adverts.length]);

  const getPriorityLabel = (priority?: number | string | null) => {
    if (priority === null || priority === undefined) return 'General Notice';

    const value = Number(priority);

    if (!Number.isNaN(value)) {
      if (value >= 8) return 'High Priority';
      if (value >= 5) return 'Important Notice';
      return 'General Update';
    }

    return String(priority);
  };

  const getPriorityStyle = (priority?: number | string | null) => {
    const value = Number(priority);

    if (!Number.isNaN(value)) {
      if (value >= 8) {
        return 'bg-red-50 text-red-700 ring-red-200';
      }
      if (value >= 5) {
        return 'bg-amber-50 text-amber-700 ring-amber-200';
      }
    }

    return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  };

  const truncateText = (text?: string | null, length = 180) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return `${text.slice(0, length).trim()}...`;
  };

  const nextAdvert = () => {
    setActiveAdvert((current) => (current + 1) % adverts.length);
  };

  const prevAdvert = () => {
    setActiveAdvert((current) => (current - 1 + adverts.length) % adverts.length);
  };

  return (
    <>
      <Head title="Announcements" />

      <PublicLayout announcements={announcements}>
        <section className="relative overflow-hidden border-b border-[rgb(var(--line))] bg-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(8,47,73,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,1))]" />

          <div className="relative container-shell py-14 sm:py-16 lg:py-20">
            <div className="max-w-5xl">
              <div className="ui-chip px-4 py-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  FEMATA Official Notices
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-5xl lg:text-6xl">
                Announcements & Notices
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-[rgb(var(--muted))] sm:text-lg">
                Important institutional communication, member guidance, official notices, and
                stakeholder-facing updates presented in a more editorial and modern FEMATA layout.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="ui-chip px-4 py-2 text-sm text-[rgb(var(--muted))]">
                  {announcements.length} {announcements.length === 1 ? 'active notice' : 'active notices'}
                </div>

                <div className="ui-chip px-4 py-2 text-sm text-[rgb(var(--muted))]">
                  Priority-based visibility
                </div>

                <div className="ui-chip px-4 py-2 text-sm text-[rgb(var(--muted))]">
                  Official FEMATA communication
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-transparent pb-16 pt-8 sm:pb-24 sm:pt-10">
          <div className="container-shell">
            {announcements.length === 0 ? (
              <div className="rounded-[30px] border border-dashed border-[rgb(var(--line))] bg-[rgb(var(--surface))] px-6 py-14 text-center shadow-sm sm:px-10">
                <div className="mx-auto max-w-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    No active notices
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))] sm:text-3xl">
                    No announcements available at the moment
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))] sm:text-base">
                    New member notices, institutional guidance, and official updates will appear
                    here once published.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_420px]">
                  {featured ? (
                    <article className="ui-section-layer group">
                      <div className="relative h-[300px] overflow-hidden sm:h-[360px] lg:h-[420px]">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(var(--surface),0.98),rgba(var(--surface-2),0.94),rgba(var(--accent),0.18))]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.14),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(var(--primary),0.08),transparent_28%)]" />
                        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(15,23,42,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.18)_1px,transparent_1px)] [background-size:42px_42px]" />

                        <div className="absolute left-0 top-0 flex w-full items-start justify-between gap-4 p-6 sm:p-8">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex rounded-full bg-[rgba(var(--surface),0.82)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ring-1 backdrop-blur-sm ${getPriorityStyle(
                                featured.priority
                              )}`}
                            >
                              {getPriorityLabel(featured.priority)}
                            </span>

                            <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                              Featured Announcement
                            </span>
                          </div>

                          <div className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            Notice 01
                          </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                          <div className="max-w-4xl">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                              Priority {featured.priority}
                            </p>
                            <h2 className="mt-4 text-3xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-4xl lg:text-5xl">
                              {featured.title}
                            </h2>
                            <p className="mt-5 max-w-3xl text-sm leading-7 text-[rgb(var(--muted))] sm:text-base sm:leading-8">
                              {truncateText(featured.body, 220)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="relative p-6 sm:p-8 lg:p-10">
                        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
                          <div>
                            <div className="ui-soft-panel p-5 sm:p-6">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                                Full notice
                              </p>
                              <p className="mt-4 text-sm leading-8 text-[rgb(var(--foreground))] sm:text-[15px]">
                                {featured.body}
                              </p>
                            </div>
                          </div>

                          <div className="ui-soft-panel p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                              Notice summary
                            </p>

                            <div className="mt-4 space-y-4 text-sm text-[rgb(var(--muted))]">
                              <div>
                                <p className="font-semibold text-[rgb(var(--foreground))]">Type</p>
                                <p>{getPriorityLabel(featured.priority)}</p>
                              </div>

                              <div>
                                <p className="font-semibold text-[rgb(var(--foreground))]">Audience</p>
                                <p>Members, partners, and stakeholders</p>
                              </div>

                              <div>
                                <p className="font-semibold text-[rgb(var(--foreground))]">Source</p>
                                <p>FEMATA Official Communication</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ) : null}

                  <aside className="space-y-4">
                    <div className="ui-soft-panel p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                        Notice stream
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-[rgb(var(--primary))]">
                        Other current notices
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                        A cleaner side panel for additional institutional notices and updates.
                      </p>
                    </div>

                    {sideNotices.length > 0 ? (
                      sideNotices.map((announcement, index) => (
                        <article
                          key={announcement.id}
                          className="card-shell card-shell-hover group overflow-hidden"
                        >
                          <div className="relative h-36 overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(var(--surface),0.98),rgba(var(--surface-2),0.94),rgba(var(--accent),0.16))]" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.12),transparent_24%)]" />
                            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                              <span
                                className={`inline-flex rounded-full bg-[rgba(var(--surface),0.82)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ring-1 backdrop-blur-sm ${getPriorityStyle(
                                  announcement.priority
                                )}`}
                              >
                                {getPriorityLabel(announcement.priority)}
                              </span>

                              <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                                {String(index + 2).padStart(2, '0')}
                              </span>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 p-4">
                              <h4 className="text-lg font-semibold leading-snug text-[rgb(var(--primary))]">
                                {announcement.title}
                              </h4>
                            </div>
                          </div>

                          <div className="p-5 sm:p-6">
                            <p className="text-sm leading-7 text-[rgb(var(--muted))]">
                              {truncateText(announcement.body, 140)}
                            </p>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="ui-soft-panel rounded-[24px] border-dashed p-6 text-sm text-[rgb(var(--muted))]">
                        No additional notices available.
                      </div>
                    )}

                    <div className="ui-shell sticky top-24 overflow-hidden">
                      <div className="border-b border-[rgb(var(--line))] bg-[rgba(var(--surface),0.52)] px-5 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                              Sponsored
                            </p>
                            <h3 className="mt-1 text-lg font-semibold text-[rgb(var(--primary))]">
                              Partner spotlight
                            </h3>
                          </div>

                          <div className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                            {String(activeAdvert + 1).padStart(2, '0')} / {String(adverts.length).padStart(2, '0')}
                          </div>
                        </div>
                      </div>

                      <div className="relative p-5">
                        <div className="relative h-[240px] overflow-hidden rounded-[24px]">
                          {adverts.map((advert, index) => (
                            <a
                              key={advert.id}
                              href={advert.href}
                              className={`absolute inset-0 block transition-all duration-500 ${
                                index === activeAdvert
                                  ? 'pointer-events-auto translate-x-0 opacity-100'
                                  : 'pointer-events-none translate-x-6 opacity-0'
                              }`}
                            >
                              <div
                                className={`relative h-full overflow-hidden rounded-[24px] bg-gradient-to-br ${advert.theme} p-5 text-[rgb(var(--primary))]`}
                              >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(var(--primary),0.08),transparent_28%)]" />
                                <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(15,23,42,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.18)_1px,transparent_1px)] [background-size:36px_36px]" />

                                <div className="relative flex h-full flex-col justify-between">
                                  <div>
                                    <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                                      {advert.label}
                                    </span>

                                    <h4 className="mt-4 text-2xl font-semibold leading-tight">
                                      {advert.title}
                                    </h4>

                                    <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
                                      {advert.description}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between gap-3">
                                    <span className="ui-chip px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))]">
                                      {advert.cta}
                                    </span>

                                    <span className="text-[10px] uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                                      Advertisement
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {adverts.map((advert, index) => (
                              <button
                                key={advert.id}
                                type="button"
                                onClick={() => setActiveAdvert(index)}
                                className={`h-2.5 rounded-full transition-all ${
                                  index === activeAdvert
                                    ? 'w-8 bg-[rgb(var(--primary))]'
                                    : 'w-2.5 bg-[rgb(var(--line))]'
                                }`}
                                aria-label={`Show advert ${index + 1}`}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={prevAdvert}
                              className="ui-chip inline-flex h-10 w-10 items-center justify-center text-[rgb(var(--primary))] transition hover:bg-[rgba(var(--surface),0.88)]"
                              aria-label="Previous advert"
                            >
                              ‹
                            </button>
                            <button
                              type="button"
                              onClick={nextAdvert}
                              className="ui-chip inline-flex h-10 w-10 items-center justify-center text-[rgb(var(--primary))] transition hover:bg-[rgba(var(--surface),0.88)]"
                              aria-label="Next advert"
                            >
                              ›
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>

                {moreNotices.length > 0 ? (
                  <section className="mt-12">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                          More notices
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))] sm:text-3xl">
                          Additional announcements
                        </h3>
                      </div>

                      <div className="text-sm text-[rgb(var(--muted))]">
                        Extended institutional communication archive
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {moreNotices.map((announcement, index) => (
                        <article
                          key={announcement.id}
                          className="card-shell card-shell-hover group overflow-hidden"
                        >
                          <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(var(--surface),0.98),rgba(var(--surface-2),0.94),rgba(var(--accent),0.16))]" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.12),transparent_24%)]" />

                            <div className="absolute inset-x-0 top-4 flex items-start justify-between px-4">
                              <span
                                className={`inline-flex rounded-full bg-[rgba(var(--surface),0.82)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ring-1 backdrop-blur-sm ${getPriorityStyle(
                                  announcement.priority
                                )}`}
                              >
                                {getPriorityLabel(announcement.priority)}
                              </span>

                              <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                                {String(index + 6).padStart(2, '0')}
                              </span>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 p-4">
                              <h4 className="text-xl font-semibold leading-snug text-[rgb(var(--primary))]">
                                {announcement.title}
                              </h4>
                            </div>
                          </div>

                          <div className="p-5 sm:p-6">
                            <p className="text-sm leading-7 text-[rgb(var(--muted))]">
                              {truncateText(announcement.body, 170)}
                            </p>

                            <div className="mt-5 border-t border-[rgb(var(--line))] pt-4 text-xs font-medium uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                              FEMATA official notice
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null}
              </>
            )}
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
