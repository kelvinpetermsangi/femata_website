import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import PublicLayout from '@/layouts/PublicLayout';
import type { Program } from '@/types';

function ProgramNavigation({
  pages,
  activeKey,
}: {
  pages: NonNullable<Program['pages']>;
  activeKey: string;
}) {
  return (
    <section className="section-shell pt-0">
      <div className="container-shell">
        <div className="ui-shell p-3 sm:p-4">
          <div className="flex flex-wrap gap-2">
            {pages.map((page) => (
              <AppLink
                key={page.key}
                href={page.href ?? '#'}
                className={[
                  'inline-flex min-h-[48px] items-center justify-center rounded-full border px-4 text-sm font-semibold transition',
                  page.key === activeKey
                    ? 'border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary))]/[0.08] text-[rgb(var(--primary))]'
                    : 'border-[rgb(var(--border))] bg-[rgba(var(--surface),0.88)] text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--primary))]',
                ].join(' ')}
              >
                {page.label}
              </AppLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramMetricGrid({ metrics = [] }: { metrics?: Program['metrics'] }) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <div key={`${metric.label}-${index}`} className="ui-soft-panel p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
            {metric.label}
          </p>
          <p className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">{metric.value}</p>
          {metric.note ? (
            <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{metric.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function HomeContent({ program }: { program: Program }) {
  return (
    <section className="section-shell pt-0">
      <div className="container-shell grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="ui-section-layer p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
            Program homepage
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">
            {program.home_title}
          </h2>
          <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">
            {program.home_intro}
          </p>
          <div className="mt-6 rounded-[1.8rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] p-5 sm:p-6">
            <p className="text-sm leading-8 text-[rgb(var(--foreground))]">{program.home_body}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="card-shell p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
              Current edition
            </p>
            <p className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
              {program.current_year?.edition_label || program.current_year_value || 'Live'}
            </p>
            <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
              {program.current_year?.theme || 'Current-year information and registration routes are published on the dedicated current-year page.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <AppLink href={`/programs/${program.slug}/current-year`} className="btn-primary">
                Open current year
              </AppLink>
              <AppLink href={`/programs/${program.slug}/years`} className="btn-secondary">
                Browse editions
              </AppLink>
            </div>
          </div>

          {(program.highlights ?? []).length > 0 ? (
            <div className="card-shell p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                Strategic highlights
              </p>
              <div className="mt-5 grid gap-4">
                {(program.highlights ?? []).slice(0, 3).map((item, index) => (
                  <div key={`${item.title}-${index}`} className="ui-soft-panel p-4">
                    <p className="text-base font-semibold text-[rgb(var(--primary))]">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="container-shell mt-8">
        <ProgramMetricGrid metrics={program.metrics} />
      </div>
    </section>
  );
}

function AboutContent({ program }: { program: Program }) {
  return (
    <section className="section-shell pt-0">
      <div className="container-shell grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="ui-section-layer p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
            About the program
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">
            {program.about_title}
          </h2>
          <div className="mt-6 rounded-[1.8rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] p-5 sm:p-6">
            <p className="text-sm leading-8 text-[rgb(var(--foreground))]">{program.about_body}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="card-shell p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
              Program summary
            </p>
            <p className="mt-3 text-sm leading-8 text-[rgb(var(--muted))]">{program.summary}</p>
          </div>
          <ProgramMetricGrid metrics={(program.metrics ?? []).slice(0, 2)} />
        </div>
      </div>
    </section>
  );
}

function TeamContent({ program }: { program: Program }) {
  const team = program.team ?? [];

  return (
    <section className="section-shell pt-0">
      <div className="container-shell">
        <div className="ui-section-layer p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
            Program team
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">
            Delivery team and focal points
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[rgb(var(--muted))]">
            {program.team_intro}
          </p>

          {team.length === 0 ? (
            <div className="card-shell mt-6 p-6 text-sm leading-7 text-[rgb(var(--muted))]">
              Team profiles will appear here when the program builder publishes named focal points.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {team.map((member, index) => (
                <article key={`${member.name}-${index}`} className="card-shell overflow-hidden">
                  <div className="aspect-[4/3] bg-[rgb(var(--surface-2))]">
                    {member.photo_path ? (
                      <img src={member.photo_path} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      {member.title}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[rgb(var(--primary))]">{member.name}</h3>
                    {member.bio ? (
                      <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{member.bio}</p>
                    ) : null}
                    {(member.email || member.phone) ? (
                      <div className="mt-4 rounded-[1.2rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)] px-4 py-4 text-sm text-[rgb(var(--muted))]">
                        {member.email ? <p>{member.email}</p> : null}
                        {member.phone ? <p className="mt-1">{member.phone}</p> : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function YearsContent({ program }: { program: Program }) {
  const years = program.years ?? [];

  return (
    <section className="section-shell pt-0">
      <div className="container-shell">
        <div className="ui-section-layer p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
            Program editions
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">
            Annual cycle, host regions, and edition themes
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[rgb(var(--muted))]">
            {program.years_intro}
          </p>

          {years.length === 0 ? (
            <div className="card-shell mt-6 p-6 text-sm leading-7 text-[rgb(var(--muted))]">
              Edition history will appear here once the program builder publishes it.
            </div>
          ) : (
            <div className="mt-8 grid gap-5">
              {years.map((year, index) => (
                <article key={`${year.year}-${index}`} className="card-shell p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          {year.year}
                        </span>
                        {year.is_current ? (
                          <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            Current edition
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
                        {year.edition_label || `${year.year} edition`}
                      </h3>
                    </div>

                    <div className="text-sm text-[rgb(var(--muted))]">
                      {year.region ? <p>{year.region}</p> : null}
                      {year.venue ? <p className="mt-1">{year.venue}</p> : null}
                      {year.date_summary ? <p className="mt-1">{year.date_summary}</p> : null}
                    </div>
                  </div>

                  {year.theme ? (
                    <p className="mt-4 text-base font-semibold text-[rgb(var(--accent-2))]">{year.theme}</p>
                  ) : null}
                  {year.overview ? (
                    <p className="mt-3 text-sm leading-8 text-[rgb(var(--muted))]">{year.overview}</p>
                  ) : null}

                  {(year.highlights ?? []).length > 0 ? (
                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {(year.highlights ?? []).map((highlight, highlightIndex) => (
                        <div key={`${highlight}-${highlightIndex}`} className="ui-soft-panel px-4 py-4 text-sm font-medium text-[rgb(var(--primary))]">
                          {highlight}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CurrentYearContent({ program }: { program: Program }) {
  const year = program.current_year;

  if (!year) {
    return (
      <section className="section-shell pt-0">
        <div className="container-shell">
          <div className="card-shell p-8 text-center text-sm leading-7 text-[rgb(var(--muted))]">
            Current-year program details will appear here once the active edition is configured.
          </div>
        </div>
      </section>
    );
  }

  const actionCards = [
    { label: 'Vendor registration', href: year.vendor_registration_url },
    { label: 'Participant registration', href: year.participant_registration_url },
    { label: 'Sponsor registration', href: year.sponsor_registration_url },
    { label: 'Floor planning', href: year.floor_plan_url },
    { label: 'Programme brochure', href: year.brochure_url },
  ].filter((item) => item.href);

  return (
    <section className="section-shell pt-0">
      <div className="container-shell grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="ui-section-layer p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
            Current year program
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">
            {year.edition_label || `${year.year} edition`}
          </h2>
          <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">
            {program.current_year_intro}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="ui-soft-panel p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                Theme
              </p>
              <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{year.theme || 'To be announced'}</p>
            </div>
            <div className="ui-soft-panel p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                Venue
              </p>
              <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">
                {[year.venue, year.region].filter(Boolean).join(', ') || 'To be announced'}
              </p>
            </div>
            <div className="ui-soft-panel p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                Date window
              </p>
              <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{year.date_summary || 'To be announced'}</p>
            </div>
            <div className="ui-soft-panel p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                Edition
              </p>
              <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{year.year || 'Current'}</p>
            </div>
          </div>

          {year.overview ? (
            <div className="mt-6 rounded-[1.8rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] p-5 sm:p-6">
              <p className="text-sm leading-8 text-[rgb(var(--foreground))]">{year.overview}</p>
            </div>
          ) : null}
        </div>

        <div className="grid gap-6">
          {actionCards.length > 0 ? (
            <div className="card-shell p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                Registration and planning
              </p>
              <div className="mt-5 grid gap-3">
                {actionCards.map((item) => (
                  <a
                    key={item.label}
                    href={item.href ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.94)] px-4 py-4 text-sm font-semibold text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {(year.highlights ?? []).length > 0 ? (
            <div className="card-shell p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                Delivery focus
              </p>
              <div className="mt-5 grid gap-3">
                {(year.highlights ?? []).map((item, index) => (
                  <div key={`${item}-${index}`} className="ui-soft-panel px-4 py-4 text-sm font-medium text-[rgb(var(--primary))]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function ProgramShow({
  program,
  announcements,
}: {
  program: Program;
  announcements?: [];
}) {
  const pages = program.pages ?? [];
  const currentPage = program.current_page ?? pages[0];
  const heroText =
    currentPage?.key === 'about'
      ? program.about_body || program.summary
      : currentPage?.key === 'team'
        ? program.team_intro || program.summary
        : currentPage?.key === 'years'
          ? program.years_intro || program.summary
          : currentPage?.key === 'current-year'
            ? program.current_year_intro || program.summary
            : program.home_intro || program.summary;

  return (
    <>
      <Head title={currentPage?.key === 'home' ? program.name : `${program.name} | ${currentPage?.label}`} />

      <PublicLayout announcements={announcements}>
        <section className="section-shell pb-6">
          <div className="container-shell">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 shadow-[0_35px_100px_rgba(15,23,42,0.18)]">
              <div className="absolute inset-0">
                {program.hero_image ? <img src={program.hero_image} alt={program.name} className="h-full w-full object-cover" /> : null}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.95),rgba(7,28,24,0.84),rgba(14,31,52,0.72))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_18%)]" />
              </div>

              <div className="relative grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.08fr)_340px] lg:px-10 lg:py-12">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82">
                      FEMATA program
                    </span>
                    {program.current_year_value ? (
                      <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82">
                        {program.current_year_value} edition
                      </span>
                    ) : null}
                  </div>

                  <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                    {program.name}
                  </h1>
                  {program.tagline ? (
                    <p className="mt-4 text-lg font-semibold text-emerald-200">{program.tagline}</p>
                  ) : null}
                  <p className="mt-5 max-w-3xl text-sm leading-8 text-white/82 sm:text-base">
                    {heroText}
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="ui-shell-strong p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      Current edition
                    </p>
                    <p className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                      {program.current_year?.edition_label || program.current_year_value || 'Live'}
                    </p>
                    {program.current_year?.theme ? (
                      <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{program.current_year.theme}</p>
                    ) : null}
                  </div>

                  <div className="card-shell p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      Quick links
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <AppLink href="/programs" className="btn-secondary justify-center">
                        All programs
                      </AppLink>
                      <AppLink href={`/programs/${program.slug}/current-year`} className="btn-primary justify-center">
                        Current year
                      </AppLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {currentPage ? <ProgramNavigation pages={pages} activeKey={currentPage.key} /> : null}

        {currentPage?.key === 'home' ? <HomeContent program={program} /> : null}
        {currentPage?.key === 'about' ? <AboutContent program={program} /> : null}
        {currentPage?.key === 'team' ? <TeamContent program={program} /> : null}
        {currentPage?.key === 'years' ? <YearsContent program={program} /> : null}
        {currentPage?.key === 'current-year' ? <CurrentYearContent program={program} /> : null}
      </PublicLayout>
    </>
  );
}
