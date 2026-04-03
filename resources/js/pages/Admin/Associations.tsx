import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useState } from 'react';
import AdminPageIntro from '@/components/AdminPageIntro';
import AssociationRegionPicker from '@/components/AssociationRegionPicker';
import AppLink from '@/components/AppLink';
import AdminLayout from '@/layouts/AdminLayout';
import type { AssociationType, SharedPageProps } from '@/types';

type AssociationItem = {
  id: number;
  name: string;
  slug: string;
  association_type_id?: number | null;
  association_type?: AssociationType | null;
  regions?: string[];
  district?: string | null;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  is_active: boolean;
  document_count?: number;
  leaders_count?: number;
  gallery_count?: number;
  visible_page_count?: number;
};

type AssociationForm = {
  name: string;
  association_type_id: string;
  slug: string;
  regions: string[];
  district: string;
  phone: string;
  email: string;
  description: string;
  is_active: boolean;
};

function emptyForm(): AssociationForm {
  return {
    name: '',
    association_type_id: '',
    slug: '',
    regions: [],
    district: '',
    phone: '',
    email: '',
    description: '',
    is_active: true,
  };
}

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

function BuilderStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="ui-soft-panel p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)] text-sm font-semibold text-[rgb(var(--primary))]">
          {number}
        </div>
        <div>
          <h3 className="text-base font-semibold text-[rgb(var(--primary))]">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminAssociations({
  associations,
  associationTypes,
  regionOptions,
}: {
  associations: AssociationItem[];
  associationTypes: Pick<AssociationType, 'id' | 'name' | 'slug'>[];
  regionOptions: string[];
}) {
  const { props } = usePage<SharedPageProps>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<AssociationForm>(emptyForm());

  const flashSuccess = props.flash?.success;
  const activeCount = associations.filter((item) => item.is_active).length;

  const edit = (item: AssociationItem) => {
    setEditingId(item.id);
    form.setData({
      name: item.name,
      association_type_id: item.association_type_id ? String(item.association_type_id) : '',
      slug: item.slug,
      regions: item.regions ?? [],
      district: item.district ?? '',
      phone: item.phone ?? '',
      email: item.email ?? '',
      description: item.description ?? '',
      is_active: item.is_active,
    });
    form.clearErrors();
  };

  const reset = () => {
    setEditingId(null);
    form.setData(emptyForm());
    form.clearErrors();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.transform((data) => ({
      ...data,
      association_type_id: data.association_type_id ? Number(data.association_type_id) : null,
      slug: data.slug.trim() || null,
      district: data.district.trim() || null,
      phone: data.phone.trim() || null,
      email: data.email.trim() || null,
      description: data.description.trim() || null,
    }));

    if (editingId) {
      const current = associations.find((item) => item.id === editingId);
      if (!current) {
        return;
      }

      form.put(`/admin/associations/${current.slug}`);
      return;
    }

    form.post('/admin/associations');
  };

  const remove = (item: AssociationItem) => {
    if (!window.confirm(`Delete "${item.name}"?`)) {
      return;
    }

    router.delete(`/admin/associations/${item.slug}`, {
      preserveScroll: true,
      onSuccess: () => {
        if (editingId === item.id) {
          reset();
        }
      },
    });
  };

  return (
    <>
      <Head title="Associations admin" />

      <AdminLayout title="Associations">
        <AdminPageIntro
          eyebrow="Association management"
          title="Create the association first, then open its public mini-site builder."
          text="The association workflow is staged. This page handles the initial record, directory type, and regional coverage. The next screen is where you configure navigation, page visibility, leadership, documents, gallery, contact details, and social links."
          metrics={[
            { label: 'Total associations', value: String(associations.length) },
            { label: 'Active profiles', value: String(activeCount) },
          ]}
        />

        {(flashSuccess || form.recentlySuccessful) ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess ?? 'Association saved successfully.'}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="grid gap-6">
            <form onSubmit={submit} className="card-shell h-fit p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                    {editingId ? 'Edit basics' : 'Create association'}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                    {editingId ? 'Update basic profile' : 'New association record'}
                  </h3>
                </div>

                {editingId ? (
                  <button type="button" onClick={reset} className="btn-secondary">
                    New association
                  </button>
                ) : null}
              </div>

              <div className="mt-6 grid gap-4">
                <Field label="Association name" error={form.errors.name}>
                  <input
                    value={form.data.name}
                    onChange={(event) => form.setData('name', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  />
                </Field>

                <Field
                  label="Association type"
                  error={form.errors.association_type_id}
                  hint="Types are pre-registered by the system admin and shape how the public directory can be filtered."
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

                <Field
                  label="Slug"
                  error={form.errors.slug}
                  hint="Optional. Leave blank to generate it automatically from the association name."
                >
                  <input
                    value={form.data.slug}
                    onChange={(event) => form.setData('slug', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  />
                </Field>

                <Field
                  label="Region coverage"
                  error={form.errors.regions}
                  hint="Associations can now cover multiple regions."
                >
                  <AssociationRegionPicker
                    value={form.data.regions}
                    onChange={(next) => form.setData('regions', next)}
                    options={regionOptions}
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="District or base town" error={form.errors.district}>
                    <input
                      value={form.data.district}
                      onChange={(event) => form.setData('district', event.target.value)}
                      className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                    />
                  </Field>

                  <Field label="Phone" error={form.errors.phone}>
                    <input
                      value={form.data.phone}
                      onChange={(event) => form.setData('phone', event.target.value)}
                      className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                    />
                  </Field>
                </div>

                <Field label="Email" error={form.errors.email}>
                  <input
                    value={form.data.email}
                    onChange={(event) => form.setData('email', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  />
                </Field>

                <Field
                  label="Short description"
                  error={form.errors.description}
                  hint="Used on directory cards and as the short profile summary."
                >
                  <textarea
                    value={form.data.description}
                    onChange={(event) => form.setData('description', event.target.value)}
                    rows={5}
                    className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]"
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
                        Publicly active association
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[rgb(var(--muted))]">
                        Once created, open the FEMATA profile builder to decide which pages are visible and how the association mini-site should look.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button type="submit" disabled={form.processing} className="btn-primary">
                  {form.processing
                    ? 'Saving...'
                    : editingId
                      ? 'Save basics'
                      : 'Create and continue'}
                </button>

                <button type="button" onClick={reset} className="btn-secondary">
                  Reset form
                </button>
              </div>
            </form>

            <div className="grid gap-4">
              <BuilderStep
                number="01"
                title="Create the association record"
                text="Set the name, regions, base location, and essential contact details here."
              />
              <BuilderStep
                number="02"
                title="Open the mini-site builder"
                text="Configure navigation tabs, page visibility, homepage content, about copy, and contact-page details."
              />
              <BuilderStep
                number="03"
                title="Populate leaders, gallery, documents, and social icons"
                text="Finish the association subsite with profile-specific content and icon-based links for website and social platforms."
              />
            </div>
          </div>

          <section className="grid gap-4">
            {associations.length === 0 ? (
              <div className="card-shell p-6 text-sm text-[rgb(var(--muted))]">
                No association profiles have been created yet. Add the first FEMATA member organization to begin building the public directory.
              </div>
            ) : (
              associations.map((item) => (
                <article key={item.id} className="card-shell p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            item.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {(item.regions ?? []).slice(0, 3).map((region) => (
                          <span
                            key={region}
                            className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]"
                          >
                            {region}
                          </span>
                        ))}
                        {item.association_type?.name ? (
                          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                            {item.association_type.name}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                        {item.description || 'Add a short FEMATA-ready summary so visitors can immediately understand this association\'s role.'}
                      </p>

                      <div className="mt-4 grid gap-3 text-sm text-[rgb(var(--muted))] md:grid-cols-4">
                        <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            Visible pages
                          </p>
                          <p className="mt-1">{item.visible_page_count ?? 0} enabled</p>
                        </div>
                        <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            Documents
                          </p>
                          <p className="mt-1">{item.document_count ?? 0} linked</p>
                        </div>
                        <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            Leaders
                          </p>
                          <p className="mt-1">{item.leaders_count ?? 0} added</p>
                        </div>
                        <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            Gallery
                          </p>
                          <p className="mt-1">{item.gallery_count ?? 0} images</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <AppLink href={`/admin/associations/${item.slug}`} className="btn-primary">
                        Open builder
                      </AppLink>
                      <AppLink href={`/associations/${item.slug}`} className="btn-secondary">
                        Preview
                      </AppLink>
                      <button type="button" onClick={() => edit(item)} className="btn-secondary">
                        Edit basics
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item)}
                        className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
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
