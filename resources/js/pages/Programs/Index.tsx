import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import PublicLayout from '@/layouts/PublicLayout';
import type { Program } from '@/types';

function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="card-shell card-shell-hover flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] border-b border-[rgb(var(--border))] bg-slate-950">
        {program.hero_image ? (
          <img src={program.hero_image} alt={program.name} className="h-full w-full object-cover" loading="lazy" />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.92),rgba(8,34,31,0.68),rgba(15,23,42,0.54))]" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="ui-shell max-w-[18rem] px-4 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.1)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              FEMATA Program
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[rgb(var(--primary))]">{program.name}</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {program.tagline ? (
          <p className="text-sm font-semibold text-[rgb(var(--accent-2))]">{program.tagline}</p>
        ) : null}

        <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
          {program.summary}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="ui-soft-panel px-3 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Team</p>
            <p className="mt-1 text-lg font-semibold text-[rgb(var(--primary))]">{program.team_count ?? 0}</p>
          </div>
          <div className="ui-soft-panel px-3 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Years</p>
            <p className="mt-1 text-lg font-semibold text-[rgb(var(--primary))]">{program.year_count ?? 0}</p>
          </div>
          <div className="ui-soft-panel px-3 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Current</p>
            <p className="mt-1 text-lg font-semibold text-[rgb(var(--primary))]">{program.current_year_value ?? 'Live'}</p>
          </div>
        </div>

        <div className="mt-auto grid gap-2 pt-4">
          <AppLink href={`/programs/${program.slug}`} className="btn-primary justify-center">
            Open profile
          </AppLink>
          <AppLink href={`/programs/${program.slug}/current-year`} className="btn-secondary justify-center">
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
        <section className="section-shell pb-2">
          <div className="container-shell flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-4xl">
              <p className="eyebrow">FEMATA Programs</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-[2.6rem]">
                Flagship programs presented like a corporate portfolio
              </h1>
              <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))] sm:text-base">
                Explore FEMATA initiatives, annual conferences, and project platforms through tighter program cards and dedicated profile pages.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="ui-chip px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))]">
                {programs.length} live programs
              </span>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            {programs.length === 0 ? (
              <div className="card-shell p-8 text-center sm:p-10">
                <h2 className="text-2xl font-semibold text-[rgb(var(--primary))]">Programs will appear here</h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
                  FEMATA flagship initiatives, annual conferences, and project-driven workstreams will appear once they are activated from the dashboard.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
