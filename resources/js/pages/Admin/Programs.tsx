import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode } from 'react';
import AdminPageIntro from '@/components/AdminPageIntro';
import AppLink from '@/components/AppLink';
import AdminLayout from '@/layouts/AdminLayout';
import type { SharedPageProps } from '@/types';

type ProgramSummary = {
  id: number;
  name: string;
  slug: string;
  tagline?: string | null;
  summary?: string | null;
  hero_image?: string | null;
  is_active?: boolean;
  team_count?: number;
  year_count?: number;
  current_year?: number | null;
};

type ProgramForm = {
  name: string;
  slug: string;
  tagline: string;
  summary: string;
  hero_image: string;
  is_active: boolean;
};

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[rgb(var(--primary))]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[rgb(var(--muted))]">{hint}</span> : null}
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}

function emptyForm(): ProgramForm {
  return {
    name: '',
    slug: '',
    tagline: '',
    summary: '',
    hero_image: '',
    is_active: true,
  };
}

export default function AdminPrograms({
  programs,
}: {
  programs: ProgramSummary[];
}) {
  const { props } = usePage<SharedPageProps>();
  const form = useForm<ProgramForm>(emptyForm());

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      slug: data.slug.trim() || null,
      tagline: data.tagline.trim() || null,
      summary: data.summary.trim() || null,
      hero_image: data.hero_image.trim() || null,
    }));

    form.post('/admin/programs', {
      preserveScroll: true,
      onSuccess: () => form.setData(emptyForm()),
    });
  };

  const removeProgram = (program: ProgramSummary) => {
    if (!window.confirm(`Delete "${program.name}"?`)) {
      return;
    }

    router.delete(`/admin/programs/${program.slug}`, {
      preserveScroll: true,
    });
  };

  const flashSuccess = props.flash?.success;
  const activePrograms = programs.filter((program) => program.is_active).length;

  return (
    <>
      <Head title="Programs admin" />

      <AdminLayout title="Programs">
        <AdminPageIntro
          eyebrow="Program management"
          title="Build FEMATA program mini-sites in a staged workflow."
          text="Create the program record here first, then open the builder to shape the public homepage, about page, delivery team, edition history, and current-year registration surface."
          metrics={[
            { label: 'Programs', value: String(programs.length) },
            { label: 'Active', value: String(activePrograms) },
          ]}
        />

        {(flashSuccess || form.recentlySuccessful) ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess ?? 'Program saved successfully.'}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <form onSubmit={submit} className="card-shell h-fit p-5 sm:p-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                Create a program
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                Start with the main identity
              </h2>
              <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                This stage creates the program record. The richer public structure is configured on the next screen.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              <Field label="Program name" error={form.errors.name}>
                <input
                  value={form.data.name}
                  onChange={(event) => form.setData('name', event.target.value)}
                  className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                />
              </Field>

              <Field label="Slug" error={form.errors.slug} hint="Optional. Leave blank to generate it automatically from the name.">
                <input
                  value={form.data.slug}
                  onChange={(event) => form.setData('slug', event.target.value)}
                  className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                />
              </Field>

              <Field label="Tagline" error={form.errors.tagline}>
                <input
                  value={form.data.tagline}
                  onChange={(event) => form.setData('tagline', event.target.value)}
                  className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                />
              </Field>

              <Field label="Short summary" error={form.errors.summary}>
                <textarea
                  value={form.data.summary}
                  onChange={(event) => form.setData('summary', event.target.value)}
                  rows={5}
                  className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]"
                />
              </Field>

              <Field label="Hero image URL" error={form.errors.hero_image}>
                <input
                  value={form.data.hero_image}
                  onChange={(event) => form.setData('hero_image', event.target.value)}
                  className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                />
              </Field>

              <div className="rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/65 px-4 py-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.data.is_active}
                    onChange={(event) => form.setData('is_active', event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[rgb(var(--border))]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[rgb(var(--primary))]">
                      Active public program
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[rgb(var(--muted))]">
                      Inactive programs stay editable in admin but do not show publicly.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <button type="submit" disabled={form.processing} className="btn-primary min-w-[220px] disabled:cursor-not-allowed disabled:opacity-70">
                {form.processing ? 'Creating program...' : 'Create program'}
              </button>
            </div>
          </form>

          <section className="grid gap-4">
            {programs.length === 0 ? (
              <div className="card-shell p-6 text-sm leading-7 text-[rgb(var(--muted))]">
                No FEMATA programs have been created yet. Create the first program record to open the public mini-site builder.
              </div>
            ) : (
              programs.map((program) => (
                <article key={program.id} className="card-shell p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          Program
                        </span>
                        <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          {program.current_year ?? 'Draft'} current year
                        </span>
                        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${program.is_active ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-slate-200 bg-slate-50 text-slate-600'}`}>
                          {program.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>

                      <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">{program.name}</h2>
                      {program.tagline ? (
                        <p className="mt-2 text-sm font-medium text-[rgb(var(--accent-2))]">{program.tagline}</p>
                      ) : null}
                      <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{program.summary}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <AppLink href={`/admin/programs/${program.slug}`} className="btn-primary">
                        Open builder
                      </AppLink>
                      <AppLink href={`/programs/${program.slug}`} className="btn-secondary">
                        Preview
                      </AppLink>
                      <button type="button" onClick={() => removeProgram(program)} className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="ui-soft-panel px-4 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                        Team members
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">{program.team_count ?? 0}</p>
                    </div>
                    <div className="ui-soft-panel px-4 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                        Editions
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">{program.year_count ?? 0}</p>
                    </div>
                    <div className="ui-soft-panel px-4 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                        Public slug
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[rgb(var(--primary))]">{program.slug}</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </section>
      </AdminLayout>
    </>
  );
}
