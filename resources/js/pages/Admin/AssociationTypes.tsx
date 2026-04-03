import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useState } from 'react';
import AdminPageIntro from '@/components/AdminPageIntro';
import AdminLayout from '@/layouts/AdminLayout';
import type { AssociationType, SharedPageProps } from '@/types';

type AssociationTypeForm = {
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

function emptyForm(): AssociationTypeForm {
  return {
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
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

export default function AssociationTypesPage({
  associationTypes,
}: {
  associationTypes: AssociationType[];
}) {
  const { props } = usePage<SharedPageProps>();
  const flashSuccess = props.flash?.success;
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<AssociationTypeForm>(emptyForm());

  const activeCount = associationTypes.filter((item) => item.is_active).length;

  const reset = () => {
    setEditingId(null);
    form.setData(emptyForm());
    form.clearErrors();
  };

  const edit = (item: AssociationType) => {
    setEditingId(item.id);
    form.setData({
      name: item.name,
      slug: item.slug,
      description: item.description ?? '',
      sort_order: item.sort_order ?? 0,
      is_active: item.is_active,
    });
    form.clearErrors();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      slug: data.slug.trim() || null,
      description: data.description.trim() || null,
    }));

    if (editingId) {
      form.put(`/admin/association-types/${editingId}`);
      return;
    }

    form.post('/admin/association-types');
  };

  const remove = (item: AssociationType) => {
    if (!window.confirm(`Delete "${item.name}"?`)) {
      return;
    }

    router.delete(`/admin/association-types/${item.id}`, {
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
      <Head title="Association types" />

      <AdminLayout title="Association Types">
        <AdminPageIntro
          eyebrow="Directory structure"
          title="Define association types before editors create new association profiles."
          text="System admins can register the categories used throughout the public directory and association builder, such as regional associations, women miners networks, local content providers, or other sector groups."
          metrics={[
            { label: 'Registered types', value: String(associationTypes.length) },
            { label: 'Active types', value: String(activeCount) },
          ]}
        />

        {(flashSuccess || form.recentlySuccessful) ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess ?? 'Association type saved successfully.'}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)]">
          <form onSubmit={submit} className="card-shell h-fit p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  {editingId ? 'Edit type' : 'Create type'}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                  {editingId ? 'Update association type' : 'New association type'}
                </h2>
              </div>

              {editingId ? (
                <button type="button" onClick={reset} className="btn-secondary">
                  New type
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4">
              <Field label="Name" error={form.errors.name}>
                <input
                  value={form.data.name}
                  onChange={(event) => form.setData('name', event.target.value)}
                  className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                />
              </Field>

              <Field
                label="Slug"
                error={form.errors.slug}
                hint="Optional. Leave blank to generate it automatically from the type name."
              >
                <input
                  value={form.data.slug}
                  onChange={(event) => form.setData('slug', event.target.value)}
                  className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                />
              </Field>

              <Field
                label="Description"
                error={form.errors.description}
                hint="Used to explain what belongs in this category."
              >
                <textarea
                  value={form.data.description}
                  onChange={(event) => form.setData('description', event.target.value)}
                  rows={5}
                  className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]"
                />
              </Field>

              <Field
                label="Sort order"
                error={form.errors.sort_order}
                hint="Lower numbers appear first in the admin and public directory filters."
              >
                <input
                  type="number"
                  min={0}
                  value={form.data.sort_order}
                  onChange={(event) => form.setData('sort_order', Number(event.target.value) || 0)}
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
                      Available to editors
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[rgb(var(--muted))]">
                      Inactive types stay on record but do not appear as choices when creating or updating association profiles.
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
                    ? 'Save changes'
                    : 'Create type'}
              </button>
              <button type="button" onClick={reset} className="btn-secondary">
                Reset form
              </button>
            </div>
          </form>

          <section className="grid gap-4">
            {associationTypes.length === 0 ? (
              <div className="card-shell p-6 text-sm text-[rgb(var(--muted))]">
                No FEMATA association types have been created yet. Add the first type to guide how organizations appear in the national directory and profile builder.
              </div>
            ) : (
              associationTypes.map((item) => (
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
                        <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          {item.association_count ?? 0} profiles
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                        {item.description || 'Add a short FEMATA-facing description so the secretariat can understand how this association type should appear in the directory.'}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                        <span>Slug: {item.slug}</span>
                        <span>Order: {item.sort_order ?? 0}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => edit(item)} className="btn-secondary">
                        Edit
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
