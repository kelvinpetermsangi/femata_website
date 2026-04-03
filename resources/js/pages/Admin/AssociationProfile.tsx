import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useState } from 'react';
import AdminPageIntro from '@/components/AdminPageIntro';
import AssociationRegionPicker from '@/components/AssociationRegionPicker';
import AppLink from '@/components/AppLink';
import AdminLayout from '@/layouts/AdminLayout';
import type { AssociationType, SharedPageProps } from '@/types';

type Highlight = {
  title: string;
  text: string;
};

type LeaderProfile = {
  name: string;
  title: string;
  bio: string;
  photo_path: string;
  email: string;
  phone: string;
  contact_qr_path: string;
};

type GalleryProfile = {
  image_path: string;
  caption: string;
};

type ProfilePage = {
  key: string;
  label: string;
  slug: string;
  visible: boolean;
  headline: string;
  intro: string;
  href?: string;
};

type SocialLink = {
  platform: string;
  label: string;
  url: string;
  visible: boolean;
};

type DocumentOption = {
  id: number;
  title: string;
  slug: string;
};

type AssociationProfile = {
  id: number;
  name: string;
  slug: string;
  association_type_id?: number | null;
  association_type?: Pick<AssociationType, 'id' | 'name' | 'slug'> | null;
  regions?: string[];
  district?: string | null;
  address?: string | null;
  postal_address?: string | null;
  phone?: string | null;
  email?: string | null;
  logo_path?: string | null;
  hero_image?: string | null;
  description?: string | null;
  homepage_title?: string | null;
  homepage_intro?: string | null;
  mission?: string | null;
  vision?: string | null;
  gender_commitment?: string | null;
  esg_commitment?: string | null;
  about_title?: string | null;
  about_body?: string | null;
  focus_areas?: string[] | string | null;
  chairperson_name?: string | null;
  secretary_name?: string | null;
  contact_title?: string | null;
  contact_body?: string | null;
  is_active: boolean;
  document_ids?: number[];
  highlights?: Highlight[];
  leaders?: LeaderProfile[];
  gallery?: GalleryProfile[];
  profile_pages?: ProfilePage[];
  social_links?: SocialLink[];
};

type AssociationForm = {
  name: string;
  association_type_id: string;
  slug: string;
  regions: string[];
  district: string;
  address: string;
  postal_address: string;
  phone: string;
  email: string;
  logo_path: string;
  hero_image: string;
  description: string;
  homepage_title: string;
  homepage_intro: string;
  mission: string;
  vision: string;
  gender_commitment: string;
  esg_commitment: string;
  about_title: string;
  about_body: string;
  focus_areas: string;
  chairperson_name: string;
  secretary_name: string;
  contact_title: string;
  contact_body: string;
  is_active: boolean;
  document_ids: number[];
  highlights: Highlight[];
  leaders: LeaderProfile[];
  gallery: GalleryProfile[];
  profile_pages: ProfilePage[];
  social_links: SocialLink[];
};

type BuilderSection = 'overview' | 'navigation' | 'content' | 'leaders' | 'media' | 'contact';

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

function BuilderSectionButton({
  active,
  label,
  note,
  onClick,
}: {
  active: boolean;
  label: string;
  note: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-[1.3rem] border px-4 py-4 text-left transition',
        active
          ? 'border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary))]/[0.08] text-[rgb(var(--primary))]'
          : 'border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface-2))]',
      ].join(' ')}
    >
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 text-xs leading-6">{note}</p>
    </button>
  );
}

function emptyHighlight(): Highlight {
  return { title: '', text: '' };
}

function emptyLeader(): LeaderProfile {
  return {
    name: '',
    title: '',
    bio: '',
    photo_path: '',
    email: '',
    phone: '',
    contact_qr_path: '',
  };
}

function emptyGallery(): GalleryProfile {
  return { image_path: '', caption: '' };
}

export default function AdminAssociationProfile({
  association,
  documents,
  associationTypes,
  regionOptions,
}: {
  association: AssociationProfile;
  documents: DocumentOption[];
  associationTypes: Pick<AssociationType, 'id' | 'name' | 'slug'>[];
  regionOptions: string[];
}) {
  const { props } = usePage<SharedPageProps>();
  const [activeSection, setActiveSection] = useState<BuilderSection>('overview');

  const form = useForm<AssociationForm>({
    name: association.name,
    association_type_id: association.association_type_id ? String(association.association_type_id) : '',
    slug: association.slug,
    regions: association.regions ?? [],
    district: association.district ?? '',
    address: association.address ?? '',
    postal_address: association.postal_address ?? '',
    phone: association.phone ?? '',
    email: association.email ?? '',
    logo_path: association.logo_path ?? '',
    hero_image: association.hero_image ?? '',
    description: association.description ?? '',
    homepage_title: association.homepage_title ?? '',
    homepage_intro: association.homepage_intro ?? '',
    mission: association.mission ?? '',
    vision: association.vision ?? '',
    gender_commitment: association.gender_commitment ?? '',
    esg_commitment: association.esg_commitment ?? '',
    about_title: association.about_title ?? '',
    about_body: association.about_body ?? '',
    focus_areas: Array.isArray(association.focus_areas)
      ? association.focus_areas.join('\n')
      : (association.focus_areas ?? ''),
    chairperson_name: association.chairperson_name ?? '',
    secretary_name: association.secretary_name ?? '',
    contact_title: association.contact_title ?? '',
    contact_body: association.contact_body ?? '',
    is_active: association.is_active,
    document_ids: association.document_ids ?? [],
    highlights: association.highlights?.length ? association.highlights : [emptyHighlight()],
    leaders: association.leaders?.length ? association.leaders : [emptyLeader()],
    gallery: association.gallery?.length ? association.gallery : [emptyGallery()],
    profile_pages: association.profile_pages ?? [],
    social_links: association.social_links ?? [],
  });

  const flashSuccess = props.flash?.success;
  const visiblePageCount = form.data.profile_pages.filter((page) => page.visible).length;
  const fieldError = (path: string) => form.errors[path as keyof typeof form.errors] as string | undefined;

  const updateProfilePage = (index: number, key: keyof ProfilePage, value: string | boolean) => {
    form.setData(
      'profile_pages',
      form.data.profile_pages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const updateHighlight = (index: number, key: keyof Highlight, value: string) => {
    form.setData(
      'highlights',
      form.data.highlights.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const updateLeader = (index: number, key: keyof LeaderProfile, value: string) => {
    form.setData(
      'leaders',
      form.data.leaders.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const updateGallery = (index: number, key: keyof GalleryProfile, value: string) => {
    form.setData(
      'gallery',
      form.data.gallery.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const updateSocialLink = (index: number, key: keyof SocialLink, value: string | boolean) => {
    form.setData(
      'social_links',
      form.data.social_links.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const toggleDocument = (id: number) => {
    if (form.data.document_ids.includes(id)) {
      form.setData(
        'document_ids',
        form.data.document_ids.filter((item) => item !== id),
      );
      return;
    }

    form.setData('document_ids', [...form.data.document_ids, id]);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.transform((data) => ({
      ...data,
      association_type_id: data.association_type_id ? Number(data.association_type_id) : null,
      slug: data.slug.trim() || null,
      district: data.district.trim() || null,
      address: data.address.trim() || null,
      postal_address: data.postal_address.trim() || null,
      phone: data.phone.trim() || null,
      email: data.email.trim() || null,
      logo_path: data.logo_path.trim() || null,
      hero_image: data.hero_image.trim() || null,
      description: data.description.trim() || null,
      homepage_title: data.homepage_title.trim() || null,
      homepage_intro: data.homepage_intro.trim() || null,
      mission: data.mission.trim() || null,
      vision: data.vision.trim() || null,
      gender_commitment: data.gender_commitment.trim() || null,
      esg_commitment: data.esg_commitment.trim() || null,
      about_title: data.about_title.trim() || null,
      about_body: data.about_body.trim() || null,
      focus_areas: data.focus_areas.trim() || null,
      chairperson_name: data.chairperson_name.trim() || null,
      secretary_name: data.secretary_name.trim() || null,
      contact_title: data.contact_title.trim() || null,
      contact_body: data.contact_body.trim() || null,
      profile_pages: data.profile_pages.map((page) => ({
        key: page.key,
        label: page.label,
        slug: page.slug,
        visible: page.visible,
        headline: page.headline,
        intro: page.intro,
      })),
      social_links: data.social_links.map((link) => ({
        platform: link.platform,
        url: link.url.trim() || null,
        visible: link.visible,
      })),
    }));

    form.put(`/admin/associations/${association.slug}`);
  };

  return (
    <>
      <Head title={`${association.name} profile`} />

      <AdminLayout title="Association Builder">
        <AdminPageIntro
          eyebrow="Association mini-site builder"
          title={`Build ${association.name} as a complete association subsite.`}
          text="This builder controls the public homepage, internal navigation, page visibility, leadership cards, QR contact cards, documents, gallery, contact details, and icon-based social links for this association profile."
          metrics={[
            { label: 'Visible pages', value: String(visiblePageCount) },
            { label: 'Profile leaders', value: String(form.data.leaders.length) },
            { label: 'Linked documents', value: String(form.data.document_ids.length) },
          ]}
        />

        {(flashSuccess || form.recentlySuccessful) ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess ?? 'Association profile saved successfully.'}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <AppLink href="/admin/associations" className="btn-secondary">
            Back to directory
          </AppLink>
          <AppLink href={`/associations/${association.slug}`} className="btn-primary">
            Preview public profile
          </AppLink>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-6">
          <section className="card-shell p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  Builder sections
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                  Edit one layer at a time
                </h2>
              </div>

              <div className="rounded-[1.2rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)] px-4 py-3 text-sm text-[rgb(var(--muted))]">
                Public status:{' '}
                <span className="font-semibold text-[rgb(var(--primary))]">
                  {form.data.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <BuilderSectionButton active={activeSection === 'overview'} label="Overview" note="Identity, regions, hero media, and profile summary." onClick={() => setActiveSection('overview')} />
              <BuilderSectionButton active={activeSection === 'navigation'} label="Navigation" note="Control page labels, slugs, visibility, and hero copy." onClick={() => setActiveSection('navigation')} />
              <BuilderSectionButton active={activeSection === 'content'} label="Home & About" note="Homepage text, mission, vision, gender, ESG, about copy, focus areas, and accomplishment cards." onClick={() => setActiveSection('content')} />
              <BuilderSectionButton active={activeSection === 'leaders'} label="Leadership" note="Leader cards, bios, photos, and QR contact support." onClick={() => setActiveSection('leaders')} />
              <BuilderSectionButton active={activeSection === 'media'} label="Documents & Gallery" note="Link documents and build an association-specific gallery." onClick={() => setActiveSection('media')} />
              <BuilderSectionButton active={activeSection === 'contact'} label="Contact & Links" note="Addresses, official contacts, and icon-based social links." onClick={() => setActiveSection('contact')} />
            </div>
          </section>

          {activeSection === 'overview' ? (
            <section className="card-shell p-5 sm:p-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  Identity and coverage
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                  Basic profile
                </h2>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Association name" error={fieldError('name')}>
                    <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                  </Field>

                  <Field label="Slug" error={fieldError('slug')}>
                    <input value={form.data.slug} onChange={(event) => form.setData('slug', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                  </Field>
                </div>

                <Field
                  label="Association type"
                  error={fieldError('association_type_id')}
                  hint="This controls how the association appears in the public directory filters."
                >
                  <select
                    value={form.data.association_type_id}
                    onChange={(event) => form.setData('association_type_id', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  >
                    <option value="">Select a type</option>
                    {associationTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Region coverage" error={fieldError('regions') || fieldError('region')} hint="Select every region covered by this association.">
                  <AssociationRegionPicker value={form.data.regions} onChange={(next) => form.setData('regions', next)} options={regionOptions} />
                </Field>

                <Field label="District or base town" error={fieldError('district')}>
                  <input value={form.data.district} onChange={(event) => form.setData('district', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                </Field>

                <Field label="Short description" error={fieldError('description')} hint="Used in cards and as the starting summary on the public mini-site.">
                  <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Logo image URL" error={fieldError('logo_path')}>
                    <input value={form.data.logo_path} onChange={(event) => form.setData('logo_path', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                  </Field>

                  <Field label="Hero image URL" error={fieldError('hero_image')} hint="This image is shared across the association mini-site.">
                    <input value={form.data.hero_image} onChange={(event) => form.setData('hero_image', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                  </Field>
                </div>

                <div className="rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/65 px-4 py-4">
                  <label className="flex items-start gap-3">
                    <input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="mt-1 h-4 w-4 rounded border-[rgb(var(--border))]" />
                    <span>
                      <span className="block text-sm font-semibold text-[rgb(var(--primary))]">
                        Active public profile
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[rgb(var(--muted))]">
                        Hidden association profiles stay editable in admin but do not appear publicly.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </section>
          ) : null}

          {activeSection === 'navigation' ? (
            <section className="card-shell p-5 sm:p-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  Public navigation
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                  Pages and visibility
                </h2>
              </div>

              <div className="mt-6 grid gap-4">
                {form.data.profile_pages.map((page, index) => (
                  <div key={page.key} className="rounded-[1.4rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/55 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[rgb(var(--primary))]">{page.key}</p>
                        <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                          Control the label, route slug, hero title, intro text, and visibility for this page.
                        </p>
                      </div>

                      <label className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)] px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))]">
                        <input type="checkbox" checked={page.visible} onChange={(event) => updateProfilePage(index, 'visible', event.target.checked)} className="h-4 w-4 rounded border-[rgb(var(--border))]" />
                        Visible
                      </label>
                    </div>

                    <div className="mt-4 grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Navigation label" error={fieldError(`profile_pages.${index}.label`)}>
                          <input value={page.label} onChange={(event) => updateProfilePage(index, 'label', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                        </Field>

                        <Field label="Page slug" error={fieldError(`profile_pages.${index}.slug`)} hint="Used after the association URL. The home page still opens on the base profile URL.">
                          <input value={page.slug} onChange={(event) => updateProfilePage(index, 'slug', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                        </Field>
                      </div>

                      <Field label="Hero headline" error={fieldError(`profile_pages.${index}.headline`)}>
                        <input value={page.headline} onChange={(event) => updateProfilePage(index, 'headline', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                      </Field>

                      <Field label="Page intro" error={fieldError(`profile_pages.${index}.intro`)}>
                        <textarea value={page.intro} onChange={(event) => updateProfilePage(index, 'intro', event.target.value)} rows={4} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeSection === 'content' ? (
            <section className="grid gap-6">
              <section className="card-shell p-5 sm:p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                    Homepage copy
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                    Home and about content
                  </h2>
                </div>

                <div className="mt-6 grid gap-4">
                  <Field label="Homepage title" error={fieldError('homepage_title')}>
                    <input value={form.data.homepage_title} onChange={(event) => form.setData('homepage_title', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                  </Field>

                  <Field
                    label="Homepage intro"
                    error={fieldError('homepage_intro')}
                    hint="Keep this distinct from the about page. Use it as a concise public introduction to accomplishments and current direction."
                  >
                    <textarea value={form.data.homepage_intro} onChange={(event) => form.setData('homepage_intro', event.target.value)} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Mission" error={fieldError('mission')}>
                      <textarea value={form.data.mission} onChange={(event) => form.setData('mission', event.target.value)} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                    </Field>

                    <Field label="Vision" error={fieldError('vision')}>
                      <textarea value={form.data.vision} onChange={(event) => form.setData('vision', event.target.value)} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                    </Field>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Gender commitment" error={fieldError('gender_commitment')}>
                      <textarea value={form.data.gender_commitment} onChange={(event) => form.setData('gender_commitment', event.target.value)} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                    </Field>

                    <Field label="ESG commitment" error={fieldError('esg_commitment')}>
                      <textarea value={form.data.esg_commitment} onChange={(event) => form.setData('esg_commitment', event.target.value)} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                    </Field>
                  </div>

                  <Field label="About title" error={fieldError('about_title')}>
                    <input value={form.data.about_title} onChange={(event) => form.setData('about_title', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                  </Field>

                  <Field label="About body" error={fieldError('about_body')}>
                    <textarea value={form.data.about_body} onChange={(event) => form.setData('about_body', event.target.value)} rows={8} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                  </Field>

                  <Field label="Focus areas" error={fieldError('focus_areas')} hint="One focus area per line.">
                    <textarea value={form.data.focus_areas} onChange={(event) => form.setData('focus_areas', event.target.value)} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                  </Field>
                </div>
              </section>

              <section className="card-shell p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                      Homepage cards
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                      Accomplishments and strategic highlights
                    </h2>
                  </div>

                  <button type="button" onClick={() => form.setData('highlights', [...form.data.highlights, emptyHighlight()])} className="btn-secondary">
                    Add highlight
                  </button>
                </div>

                <div className="mt-6 grid gap-4">
                  {form.data.highlights.map((item, index) => (
                    <div key={index} className="rounded-[1.4rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/55 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[rgb(var(--primary))]">Highlight {index + 1}</p>
                        {form.data.highlights.length > 1 ? (
                          <button type="button" onClick={() => form.setData('highlights', form.data.highlights.filter((_, itemIndex) => itemIndex !== index))} className="text-sm font-semibold text-red-600">
                            Remove
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-4">
                        <Field label="Title" error={fieldError(`highlights.${index}.title`)}>
                          <input value={item.title} onChange={(event) => updateHighlight(index, 'title', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                        </Field>

                        <Field label="Text" error={fieldError(`highlights.${index}.text`)}>
                          <textarea value={item.text} onChange={(event) => updateHighlight(index, 'text', event.target.value)} rows={4} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </section>
          ) : null}

          {activeSection === 'leaders' ? (
            <section className="card-shell p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                    Leaders
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                    Leadership profiles and QR cards
                  </h2>
                </div>

                <button type="button" onClick={() => form.setData('leaders', [...form.data.leaders, emptyLeader()])} className="btn-secondary">
                  Add leader
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                {form.data.leaders.map((item, index) => (
                  <div key={index} className="rounded-[1.4rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/55 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[rgb(var(--primary))]">Leader {index + 1}</p>
                      {form.data.leaders.length > 1 ? (
                        <button type="button" onClick={() => form.setData('leaders', form.data.leaders.filter((_, itemIndex) => itemIndex !== index))} className="text-sm font-semibold text-red-600">
                          Remove
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <Field label="Name" error={fieldError(`leaders.${index}.name`)}>
                        <input value={item.name} onChange={(event) => updateLeader(index, 'name', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                      </Field>

                      <Field label="Title" error={fieldError(`leaders.${index}.title`)}>
                        <input value={item.title} onChange={(event) => updateLeader(index, 'title', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                      </Field>

                      <Field label="Email" error={fieldError(`leaders.${index}.email`)}>
                        <input value={item.email} onChange={(event) => updateLeader(index, 'email', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                      </Field>

                      <Field label="Phone" error={fieldError(`leaders.${index}.phone`)}>
                        <input value={item.phone} onChange={(event) => updateLeader(index, 'phone', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                      </Field>

                      <div className="md:col-span-2">
                        <Field label="Photo URL" error={fieldError(`leaders.${index}.photo_path`)}>
                          <input value={item.photo_path} onChange={(event) => updateLeader(index, 'photo_path', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                        <Field label="QR code image URL" error={fieldError(`leaders.${index}.contact_qr_path`)} hint="Optional. Leave blank and the public card can still generate a QR from the vCard details.">
                          <input value={item.contact_qr_path} onChange={(event) => updateLeader(index, 'contact_qr_path', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                        <Field label="Bio" error={fieldError(`leaders.${index}.bio`)}>
                          <textarea value={item.bio} onChange={(event) => updateLeader(index, 'bio', event.target.value)} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeSection === 'media' ? (
            <section className="grid gap-6">
              <section className="card-shell p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                      Gallery
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                      Association gallery
                    </h2>
                  </div>

                  <button type="button" onClick={() => form.setData('gallery', [...form.data.gallery, emptyGallery()])} className="btn-secondary">
                    Add image
                  </button>
                </div>

                <div className="mt-6 grid gap-4">
                  {form.data.gallery.map((item, index) => (
                    <div key={index} className="rounded-[1.4rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/55 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[rgb(var(--primary))]">Gallery image {index + 1}</p>
                        {form.data.gallery.length > 1 ? (
                          <button type="button" onClick={() => form.setData('gallery', form.data.gallery.filter((_, itemIndex) => itemIndex !== index))} className="text-sm font-semibold text-red-600">
                            Remove
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-4">
                        <Field label="Image URL" error={fieldError(`gallery.${index}.image_path`)}>
                          <input value={item.image_path} onChange={(event) => updateGallery(index, 'image_path', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                        </Field>

                        <Field label="Caption" error={fieldError(`gallery.${index}.caption`)}>
                          <textarea value={item.caption} onChange={(event) => updateGallery(index, 'caption', event.target.value)} rows={4} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card-shell p-5 sm:p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                    Documents
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                    Link public resources
                  </h2>
                </div>

                <div className="mt-6 grid gap-3">
                  {documents.map((document) => (
                    <label key={document.id} className="flex items-start gap-3 rounded-[1.15rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.94)] px-4 py-4 text-sm text-[rgb(var(--foreground))]">
                      <input type="checkbox" checked={form.data.document_ids.includes(document.id)} onChange={() => toggleDocument(document.id)} className="mt-1 h-4 w-4 rounded border-[rgb(var(--border))]" />
                      <span>
                        <span className="block font-semibold text-[rgb(var(--primary))]">{document.title}</span>
                        <span className="mt-1 block text-[rgb(var(--muted))]">{document.slug}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </section>
          ) : null}

          {activeSection === 'contact' ? (
            <section className="grid gap-6">
              <section className="card-shell p-5 sm:p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                    Official contact page
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                    Contact details and footer identities
                  </h2>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Office address" error={fieldError('address')}>
                      <input value={form.data.address} onChange={(event) => form.setData('address', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                    </Field>

                    <Field label="Postal address" error={fieldError('postal_address')}>
                      <input value={form.data.postal_address} onChange={(event) => form.setData('postal_address', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                    </Field>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Phone" error={fieldError('phone')}>
                      <input value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                    </Field>

                    <Field label="Email" error={fieldError('email')}>
                      <input value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                    </Field>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Chairperson name" error={fieldError('chairperson_name')}>
                      <input value={form.data.chairperson_name} onChange={(event) => form.setData('chairperson_name', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                    </Field>

                    <Field label="Secretary name" error={fieldError('secretary_name')}>
                      <input value={form.data.secretary_name} onChange={(event) => form.setData('secretary_name', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                    </Field>
                  </div>

                  <Field label="Contact page title" error={fieldError('contact_title')}>
                    <input value={form.data.contact_title} onChange={(event) => form.setData('contact_title', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                  </Field>

                  <Field label="Contact page intro" error={fieldError('contact_body')} hint="Use this to explain how visitors should reach the association.">
                    <textarea value={form.data.contact_body} onChange={(event) => form.setData('contact_body', event.target.value)} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" />
                  </Field>
                </div>
              </section>

              <section className="card-shell p-5 sm:p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                    Social and website icons
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                    Platform links
                  </h2>
                </div>

                <div className="mt-6 grid gap-4">
                  {form.data.social_links.map((item, index) => (
                    <div key={item.platform} className="rounded-[1.35rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/55 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[rgb(var(--primary))]">{item.label}</p>
                          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                            Enable this icon only if you want it to appear on the public association profile.
                          </p>
                        </div>

                        <label className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)] px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))]">
                          <input type="checkbox" checked={item.visible} onChange={(event) => updateSocialLink(index, 'visible', event.target.checked)} className="h-4 w-4 rounded border-[rgb(var(--border))]" />
                          Visible
                        </label>
                      </div>

                      <div className="mt-4">
                        <Field label={`${item.label} URL`} error={fieldError(`social_links.${index}.url`)}>
                          <input value={item.url} onChange={(event) => updateSocialLink(index, 'url', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </section>
          ) : null}

          <div className="flex justify-end">
            <button type="submit" disabled={form.processing} className="btn-primary min-w-[240px] disabled:cursor-not-allowed disabled:opacity-70">
              {form.processing ? 'Saving builder...' : 'Save association builder'}
            </button>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}
