import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useState } from 'react';
import AdminPageIntro from '@/components/AdminPageIntro';
import AppLink from '@/components/AppLink';
import AdminLayout from '@/layouts/AdminLayout';
import type { SharedPageProps } from '@/types';

type Highlight = { title: string; text: string };
type Metric = { label: string; value: string; note: string };
type TeamMember = { name: string; title: string; bio: string; photo_path: string; email: string; phone: string };
type ProgramYearForm = {
  year: string;
  edition_label: string;
  region: string;
  venue: string;
  date_summary: string;
  theme: string;
  overview: string;
  highlights_text: string;
  vendor_registration_url: string;
  participant_registration_url: string;
  sponsor_registration_url: string;
  floor_plan_url: string;
  brochure_url: string;
  is_current: boolean;
};

type ProgramProfile = {
  id: number;
  name: string;
  slug: string;
  tagline?: string | null;
  summary?: string | null;
  hero_image?: string | null;
  home_title?: string | null;
  home_intro?: string | null;
  home_body?: string | null;
  about_title?: string | null;
  about_body?: string | null;
  team_intro?: string | null;
  years_intro?: string | null;
  current_year_intro?: string | null;
  highlights?: Array<{ title?: string | null; text?: string | null }>;
  metrics?: Array<{ label?: string | null; value?: string | null; note?: string | null }>;
  team?: Array<{ name: string; title?: string | null; bio?: string | null; photo_path?: string | null; email?: string | null; phone?: string | null }>;
  years?: Array<{ year?: number | null; edition_label?: string | null; region?: string | null; venue?: string | null; date_summary?: string | null; theme?: string | null; overview?: string | null; highlights?: string[]; vendor_registration_url?: string | null; participant_registration_url?: string | null; sponsor_registration_url?: string | null; floor_plan_url?: string | null; brochure_url?: string | null; is_current?: boolean }>;
  is_active: boolean;
};

type ProgramForm = {
  name: string;
  slug: string;
  tagline: string;
  summary: string;
  hero_image: string;
  home_title: string;
  home_intro: string;
  home_body: string;
  about_title: string;
  about_body: string;
  team_intro: string;
  years_intro: string;
  current_year_intro: string;
  highlights: Highlight[];
  metrics: Metric[];
  team: TeamMember[];
  years: ProgramYearForm[];
  is_active: boolean;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[rgb(var(--primary))]">{label}</span>
      {children}
    </label>
  );
}

const emptyHighlight = (): Highlight => ({ title: '', text: '' });
const emptyMetric = (): Metric => ({ label: '', value: '', note: '' });
const emptyTeam = (): TeamMember => ({ name: '', title: '', bio: '', photo_path: '', email: '', phone: '' });
const emptyYear = (): ProgramYearForm => ({ year: '', edition_label: '', region: '', venue: '', date_summary: '', theme: '', overview: '', highlights_text: '', vendor_registration_url: '', participant_registration_url: '', sponsor_registration_url: '', floor_plan_url: '', brochure_url: '', is_current: false });

export default function AdminProgramProfile({ program }: { program: ProgramProfile }) {
  const { props } = usePage<SharedPageProps>();
  const [section, setSection] = useState<'overview' | 'story' | 'team' | 'years'>('overview');

  const form = useForm<ProgramForm>({
    name: program.name,
    slug: program.slug,
    tagline: program.tagline ?? '',
    summary: program.summary ?? '',
    hero_image: program.hero_image ?? '',
    home_title: program.home_title ?? '',
    home_intro: program.home_intro ?? '',
    home_body: program.home_body ?? '',
    about_title: program.about_title ?? '',
    about_body: program.about_body ?? '',
    team_intro: program.team_intro ?? '',
    years_intro: program.years_intro ?? '',
    current_year_intro: program.current_year_intro ?? '',
    highlights: program.highlights?.length ? program.highlights.map((item) => ({ title: item.title ?? '', text: item.text ?? '' })) : [emptyHighlight()],
    metrics: program.metrics?.length ? program.metrics.map((item) => ({ label: item.label ?? '', value: item.value ?? '', note: item.note ?? '' })) : [emptyMetric()],
    team: program.team?.length ? program.team.map((item) => ({ name: item.name, title: item.title ?? '', bio: item.bio ?? '', photo_path: item.photo_path ?? '', email: item.email ?? '', phone: item.phone ?? '' })) : [emptyTeam()],
    years: program.years?.length ? program.years.map((item) => ({ year: item.year ? String(item.year) : '', edition_label: item.edition_label ?? '', region: item.region ?? '', venue: item.venue ?? '', date_summary: item.date_summary ?? '', theme: item.theme ?? '', overview: item.overview ?? '', highlights_text: (item.highlights ?? []).join('\n'), vendor_registration_url: item.vendor_registration_url ?? '', participant_registration_url: item.participant_registration_url ?? '', sponsor_registration_url: item.sponsor_registration_url ?? '', floor_plan_url: item.floor_plan_url ?? '', brochure_url: item.brochure_url ?? '', is_current: Boolean(item.is_current) })) : [emptyYear()],
    is_active: program.is_active,
  });

  const flashSuccess = props.flash?.success;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.transform((data) => ({
      ...data,
      slug: data.slug.trim() || null,
      tagline: data.tagline.trim() || null,
      summary: data.summary.trim() || null,
      hero_image: data.hero_image.trim() || null,
      home_title: data.home_title.trim() || null,
      home_intro: data.home_intro.trim() || null,
      home_body: data.home_body.trim() || null,
      about_title: data.about_title.trim() || null,
      about_body: data.about_body.trim() || null,
      team_intro: data.team_intro.trim() || null,
      years_intro: data.years_intro.trim() || null,
      current_year_intro: data.current_year_intro.trim() || null,
      highlights: data.highlights.map((item) => ({ title: item.title.trim() || null, text: item.text.trim() || null })),
      metrics: data.metrics.map((item) => ({ label: item.label.trim() || null, value: item.value.trim() || null, note: item.note.trim() || null })),
      team: data.team.map((item) => ({ name: item.name.trim() || null, title: item.title.trim() || null, bio: item.bio.trim() || null, photo_path: item.photo_path.trim() || null, email: item.email.trim() || null, phone: item.phone.trim() || null })),
      years: data.years.map((item) => ({ year: item.year ? Number(item.year) : null, edition_label: item.edition_label.trim() || null, region: item.region.trim() || null, venue: item.venue.trim() || null, date_summary: item.date_summary.trim() || null, theme: item.theme.trim() || null, overview: item.overview.trim() || null, highlights: item.highlights_text.split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean), vendor_registration_url: item.vendor_registration_url.trim() || null, participant_registration_url: item.participant_registration_url.trim() || null, sponsor_registration_url: item.sponsor_registration_url.trim() || null, floor_plan_url: item.floor_plan_url.trim() || null, brochure_url: item.brochure_url.trim() || null, is_current: item.is_current })),
    }));
    form.put(`/admin/programs/${program.slug}`);
  };

  return (
    <>
      <Head title={`${program.name} builder`} />

      <AdminLayout title="Program Builder">
        <AdminPageIntro
          eyebrow="Program builder"
          title={`Build ${program.name} as a full program profile.`}
          text="This builder controls the public homepage, about page, team presentation, edition archive, and current-year registration surface for the selected FEMATA program."
          metrics={[
            { label: 'Highlights', value: String(form.data.highlights.length) },
            { label: 'Team', value: String(form.data.team.length) },
            { label: 'Editions', value: String(form.data.years.length) },
          ]}
        />

        {(flashSuccess || form.recentlySuccessful) ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess ?? 'Program profile saved successfully.'}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <AppLink href="/admin/programs" className="btn-secondary">Back to programs</AppLink>
          <AppLink href={`/programs/${program.slug}`} className="btn-primary">Preview public profile</AppLink>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-6">
          <section className="card-shell p-5 sm:p-6">
            <div className="flex flex-wrap gap-3">
              {[
                ['overview', 'Overview'],
                ['story', 'Home & About'],
                ['team', 'Team'],
                ['years', 'Editions'],
              ].map(([key, label]) => (
                <button key={key} type="button" onClick={() => setSection(key as 'overview' | 'story' | 'team' | 'years')} className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${section === key ? 'border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary))]/[0.08] text-[rgb(var(--primary))]' : 'border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] text-[rgb(var(--muted))]'}`}>
                  {label}
                </button>
              ))}
            </div>
          </section>

          {section === 'overview' ? (
            <section className="card-shell grid gap-4 p-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Program name"><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field>
                <Field label="Slug"><input value={form.data.slug} onChange={(event) => form.setData('slug', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field>
              </div>
              <Field label="Tagline"><input value={form.data.tagline} onChange={(event) => form.setData('tagline', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field>
              <Field label="Summary"><textarea value={form.data.summary} onChange={(event) => form.setData('summary', event.target.value)} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" /></Field>
              <Field label="Hero image URL"><input value={form.data.hero_image} onChange={(event) => form.setData('hero_image', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field>
              <label className="inline-flex items-center gap-3 rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/65 px-4 py-4 text-sm font-semibold text-[rgb(var(--primary))]">
                <input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="h-4 w-4 rounded border-[rgb(var(--border))]" />
                Active public program
              </label>
            </section>
          ) : null}

          {section === 'story' ? (
            <section className="grid gap-6">
              <section className="card-shell grid gap-4 p-5 sm:p-6">
                <Field label="Homepage title"><input value={form.data.home_title} onChange={(event) => form.setData('home_title', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field>
                <Field label="Homepage intro"><textarea value={form.data.home_intro} onChange={(event) => form.setData('home_intro', event.target.value)} rows={4} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" /></Field>
                <Field label="Homepage body"><textarea value={form.data.home_body} onChange={(event) => form.setData('home_body', event.target.value)} rows={7} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" /></Field>
                <Field label="About title"><input value={form.data.about_title} onChange={(event) => form.setData('about_title', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field>
                <Field label="About body"><textarea value={form.data.about_body} onChange={(event) => form.setData('about_body', event.target.value)} rows={7} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" /></Field>
              </section>
              <section className="card-shell p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold text-[rgb(var(--primary))]">Highlight cards</h2><button type="button" onClick={() => form.setData('highlights', [...form.data.highlights, emptyHighlight()])} className="btn-secondary">Add highlight</button></div>
                <div className="mt-6 grid gap-4">{form.data.highlights.map((item, index) => <div key={index} className="rounded-[1.4rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/55 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[rgb(var(--primary))]">Highlight {index + 1}</p>{form.data.highlights.length > 1 ? <button type="button" onClick={() => form.setData('highlights', form.data.highlights.filter((_, itemIndex) => itemIndex !== index))} className="text-sm font-semibold text-red-600">Remove</button> : null}</div><div className="mt-4 grid gap-4"><Field label="Title"><input value={item.title} onChange={(event) => form.setData('highlights', form.data.highlights.map((entry, itemIndex) => itemIndex === index ? { ...entry, title: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Text"><textarea value={item.text} onChange={(event) => form.setData('highlights', form.data.highlights.map((entry, itemIndex) => itemIndex === index ? { ...entry, text: event.target.value } : entry))} rows={4} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" /></Field></div></div>)}</div>
              </section>
              <section className="card-shell p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold text-[rgb(var(--primary))]">Metrics</h2><button type="button" onClick={() => form.setData('metrics', [...form.data.metrics, emptyMetric()])} className="btn-secondary">Add metric</button></div>
                <div className="mt-6 grid gap-4">{form.data.metrics.map((item, index) => <div key={index} className="rounded-[1.4rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/55 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[rgb(var(--primary))]">Metric {index + 1}</p>{form.data.metrics.length > 1 ? <button type="button" onClick={() => form.setData('metrics', form.data.metrics.filter((_, itemIndex) => itemIndex !== index))} className="text-sm font-semibold text-red-600">Remove</button> : null}</div><div className="mt-4 grid gap-4 md:grid-cols-3"><Field label="Label"><input value={item.label} onChange={(event) => form.setData('metrics', form.data.metrics.map((entry, itemIndex) => itemIndex === index ? { ...entry, label: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Value"><input value={item.value} onChange={(event) => form.setData('metrics', form.data.metrics.map((entry, itemIndex) => itemIndex === index ? { ...entry, value: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Note"><input value={item.note} onChange={(event) => form.setData('metrics', form.data.metrics.map((entry, itemIndex) => itemIndex === index ? { ...entry, note: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field></div></div>)}</div>
              </section>
            </section>
          ) : null}

          {section === 'team' ? (
            <section className="card-shell p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold text-[rgb(var(--primary))]">Team</h2><button type="button" onClick={() => form.setData('team', [...form.data.team, emptyTeam()])} className="btn-secondary">Add member</button></div>
              <div className="mt-6 grid gap-4">
                <Field label="Team intro"><textarea value={form.data.team_intro} onChange={(event) => form.setData('team_intro', event.target.value)} rows={4} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" /></Field>
                {form.data.team.map((item, index) => <div key={index} className="rounded-[1.4rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/55 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[rgb(var(--primary))]">Member {index + 1}</p>{form.data.team.length > 1 ? <button type="button" onClick={() => form.setData('team', form.data.team.filter((_, itemIndex) => itemIndex !== index))} className="text-sm font-semibold text-red-600">Remove</button> : null}</div><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Name"><input value={item.name} onChange={(event) => form.setData('team', form.data.team.map((entry, itemIndex) => itemIndex === index ? { ...entry, name: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Title"><input value={item.title} onChange={(event) => form.setData('team', form.data.team.map((entry, itemIndex) => itemIndex === index ? { ...entry, title: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Email"><input value={item.email} onChange={(event) => form.setData('team', form.data.team.map((entry, itemIndex) => itemIndex === index ? { ...entry, email: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Phone"><input value={item.phone} onChange={(event) => form.setData('team', form.data.team.map((entry, itemIndex) => itemIndex === index ? { ...entry, phone: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><div className="md:col-span-2"><Field label="Photo URL"><input value={item.photo_path} onChange={(event) => form.setData('team', form.data.team.map((entry, itemIndex) => itemIndex === index ? { ...entry, photo_path: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field></div><div className="md:col-span-2"><Field label="Bio"><textarea value={item.bio} onChange={(event) => form.setData('team', form.data.team.map((entry, itemIndex) => itemIndex === index ? { ...entry, bio: event.target.value } : entry))} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" /></Field></div></div></div>)}
              </div>
            </section>
          ) : null}

          {section === 'years' ? (
            <section className="grid gap-6">
              <section className="card-shell grid gap-4 p-5 sm:p-6">
                <Field label="Years page intro"><textarea value={form.data.years_intro} onChange={(event) => form.setData('years_intro', event.target.value)} rows={4} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" /></Field>
                <Field label="Current year page intro"><textarea value={form.data.current_year_intro} onChange={(event) => form.setData('current_year_intro', event.target.value)} rows={4} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" /></Field>
              </section>
              <section className="card-shell p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold text-[rgb(var(--primary))]">Editions</h2><button type="button" onClick={() => form.setData('years', [...form.data.years, emptyYear()])} className="btn-secondary">Add edition</button></div>
                <div className="mt-6 grid gap-4">
                  {form.data.years.map((item, index) => <div key={index} className="rounded-[1.4rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/55 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-[rgb(var(--primary))]">Edition {index + 1}</p><div className="flex items-center gap-3"><label className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--primary))]"><input type="checkbox" checked={item.is_current} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => ({ ...entry, is_current: itemIndex === index ? event.target.checked : false })))} className="h-4 w-4 rounded border-[rgb(var(--border))]" />Current year</label>{form.data.years.length > 1 ? <button type="button" onClick={() => form.setData('years', form.data.years.filter((_, itemIndex) => itemIndex !== index))} className="text-sm font-semibold text-red-600">Remove</button> : null}</div></div><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Field label="Year"><input value={item.year} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, year: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Edition label"><input value={item.edition_label} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, edition_label: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Theme"><input value={item.theme} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, theme: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Region"><input value={item.region} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, region: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Venue"><input value={item.venue} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, venue: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Date summary"><input value={item.date_summary} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, date_summary: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field></div><div className="mt-4 grid gap-4"><Field label="Overview"><textarea value={item.overview} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, overview: event.target.value } : entry))} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" /></Field><Field label="Highlights"><textarea value={item.highlights_text} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, highlights_text: event.target.value } : entry))} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" /></Field><div className="grid gap-4 md:grid-cols-2"><Field label="Vendor registration URL"><input value={item.vendor_registration_url} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, vendor_registration_url: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Participant registration URL"><input value={item.participant_registration_url} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, participant_registration_url: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Sponsor registration URL"><input value={item.sponsor_registration_url} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, sponsor_registration_url: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><Field label="Floor plan URL"><input value={item.floor_plan_url} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, floor_plan_url: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field><div className="md:col-span-2"><Field label="Brochure URL"><input value={item.brochure_url} onChange={(event) => form.setData('years', form.data.years.map((entry, itemIndex) => itemIndex === index ? { ...entry, brochure_url: event.target.value } : entry))} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" /></Field></div></div></div></div>)}
                </div>
              </section>
            </section>
          ) : null}

          <div className="flex justify-end">
            <button type="submit" disabled={form.processing} className="btn-primary min-w-[240px] disabled:cursor-not-allowed disabled:opacity-70">
              {form.processing ? 'Saving builder...' : 'Save program builder'}
            </button>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}
