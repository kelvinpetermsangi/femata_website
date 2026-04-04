import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import PublicLayout from '@/layouts/PublicLayout';
import type { Program } from '@/types';

function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_54px_rgba(15,23,42,0.08)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        {program.hero_image ? (
          <img src={program.hero_image} alt={program.name} className="h-full w-full object-cover" loading="lazy" />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.92),rgba(8,34,31,0.68),rgba(15,23,42,0.5))]" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="max-w-lg rounded-[1.4rem] border border-white/14 bg-black/24 px-4 py-4 backdrop-blur-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
              FEMATA Program
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{program.name}</h2>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        {program.tagline ? (
          <p className="text-sm font-semibold text-[rgb(var(--accent-2))]">{program.tagline}</p>
        ) : null}

        <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">
          {program.summary}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="ui-soft-panel px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              Team
            </p>
            <p className="mt-2 text-xl font-semibold text-[rgb(var(--primary))]">{program.team_count ?? 0}</p>
          </div>
          <div className="ui-soft-panel px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              Editions
            </p>
            <p className="mt-2 text-xl font-semibold text-[rgb(var(--primary))]">{program.year_count ?? 0}</p>
          </div>
          <div className="ui-soft-panel px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              Current year
            </p>
            <p className="mt-2 text-xl font-semibold text-[rgb(var(--primary))]">{program.current_year_value ?? 'Live'}</p>
          </div>
        </div>

        {program.current_year?.theme ? (
          <div className="mt-5 rounded-[1.4rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)] px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              Current edition theme
            </p>
            <p className="mt-2 text-sm font-semibold text-[rgb(var(--primary))]">{program.current_year.theme}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <AppLink href={`/programs/${program.slug}`} className="btn-primary">
            Open profile
          </AppLink>
          <AppLink href={`/programs/${program.slug}/current-year`} className="btn-secondary">
            Current year
          </AppLink>
        </div>
      </div>
    </article>
  );
}

export default function ProgramsIndex({
  programs,
  announcements,
}: {
  programs: Program[];
  announcements?: [];
}) {
  return (
    <>
      <Head title="Programs" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell pb-6">
          <div className="container-shell">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 shadow-[0_35px_100px_rgba(15,23,42,0.18)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_18%),linear-gradient(135deg,#071a18,#0f3b34,#11243d)]" />
              <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                <div className="max-w-4xl">
                  <span className="inline-flex rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82">
                    FEMATA corporate programs
                  </span>
                  <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                    Flagship programs with their own identity, teams, and annual delivery cycle
                  </h1>
                  <p className="mt-6 max-w-3xl text-sm leading-8 text-white/82 sm:text-base">
                    This area showcases FEMATA programs as full corporate-style profiles rather than as ordinary news or static pages, making it easier for partners, exhibitors, sponsors, and participants to understand each initiative.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            {programs.length === 0 ? (
              <div className="card-shell p-8 text-center sm:p-12">
                <h2 className="text-2xl font-semibold text-[rgb(var(--primary))]">Programs will appear here</h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
                  FEMATA flagship initiatives, annual conferences, exhibition platforms, and project-driven workstreams will be published here once they are activated from the dashboard.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 xl:grid-cols-2">
                {programs.map((program) => (
                  <ProgramCard key={program.slug} program={program} />
                ))}
              </div>
            )}
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
