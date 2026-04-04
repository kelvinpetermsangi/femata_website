import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useState } from 'react';
import AdminPageIntro from '@/components/AdminPageIntro';
import AdminLayout from '@/layouts/AdminLayout';
import type { SharedPageProps } from '@/types';

type DocumentItem = {
  id: number;
  public_id?: string | null;
  title: string;
  slug: string;
  description?: string | null;
  file_path: string;
  thumbnail_path?: string | null;
  file_type?: string | null;
  category?: string | null;
  year?: number | null;
  author_source?: string | null;
  source_organization?: string | null;
  status_id: number;
  status?: string | null;
  is_public: boolean;
  is_featured?: boolean;
  published_at?: string | null;
};

type CategoryOption = {
  id: number;
  name: string;
  slug: string;
};

type StatusOption = {
  id: number;
  name: string;
  slug: string;
};

type DocumentForm = {
  public_id: string;
  title: string;
  slug: string;
  description: string;
  file_path: string;
  thumbnail_path: string;
  file_type: string;
  category: string;
  year: string;
  author_source: string;
  source_organization: string;
  is_featured: boolean;
  status_id: string;
  is_public: boolean;
  published_at: string;
};

function createEmptyDocument(): DocumentForm {
  return {
    public_id: '',
    title: '',
    slug: '',
    description: '',
    file_path: '',
    thumbnail_path: '',
    file_type: '',
    category: '',
    year: '',
    author_source: '',
    source_organization: '',
    is_featured: false,
    status_id: '',
    is_public: true,
    published_at: '',
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

export default function AdminDocuments({
  documents,
  contentStatuses,
  documentCategories,
}: {
  documents: DocumentItem[];
  contentStatuses: StatusOption[];
  documentCategories: CategoryOption[];
}) {
  const { props } = usePage<SharedPageProps>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<DocumentForm>(createEmptyDocument());

  const startCreate = () => {
    setEditingId(null);
    form.setData(createEmptyDocument());
    form.clearErrors();
  };

  const startEdit = (document: DocumentItem) => {
    setEditingId(document.id);
    form.setData({
      public_id: document.public_id ?? '',
      title: document.title,
      slug: document.slug,
      description: document.description ?? '',
      file_path: document.file_path,
      thumbnail_path: document.thumbnail_path ?? '',
      file_type: document.file_type ?? '',
      category: document.category ?? '',
      year: document.year ? String(document.year) : '',
      author_source: document.author_source ?? '',
      source_organization: document.source_organization ?? '',
      is_featured: Boolean(document.is_featured),
      status_id: String(document.status_id),
      is_public: document.is_public,
      published_at: document.published_at ?? '',
    });
    form.clearErrors();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      public_id: data.public_id.trim() || null,
      slug: data.slug.trim() || null,
      description: data.description.trim() || null,
      thumbnail_path: data.thumbnail_path.trim() || null,
      file_type: data.file_type.trim() || null,
      category: data.category.trim() || null,
      year: data.year ? Number(data.year) : null,
      author_source: data.author_source.trim() || null,
      source_organization: data.source_organization.trim() || null,
      status_id: data.status_id ? Number(data.status_id) : null,
      published_at: data.published_at || null,
    }));

    const onSuccess = () => {
      setEditingId(null);
      form.setData(createEmptyDocument());
      form.clearErrors();
    };

    if (editingId) {
      const current = documents.find((item) => item.id === editingId);
      if (!current) return;

      form.put(`/admin/documents/${current.slug}`, {
        preserveScroll: true,
        onSuccess,
      });

      return;
    }

    form.post('/admin/documents', {
      preserveScroll: true,
      onSuccess,
    });
  };

  const removeDocument = (document: DocumentItem) => {
    if (!window.confirm(`Delete "${document.title}"?`)) {
      return;
    }

    router.delete(`/admin/documents/${document.slug}`, {
      preserveScroll: true,
      onSuccess: () => {
        if (editingId === document.id) {
          startCreate();
        }
      },
    });
  };

  const flashSuccess = props.flash?.success;
  const publicCount = documents.filter((document) => document.status === 'published').length;

  return (
    <>
      <Head title="Documents admin" />

      <AdminLayout title="Documents">
        <AdminPageIntro
          eyebrow="Resource management"
          title="Manage public documents, reports, and downloadable resources."
          text="Documents feed the public resource centre. Use this section to manage reports, strategic plans, reference files, and links to hosted content."
          metrics={[
            { label: 'Total resources', value: String(documents.length) },
            { label: 'Public documents', value: String(publicCount) },
          ]}
        />

        {(flashSuccess || form.recentlySuccessful) ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess ?? 'Document saved successfully.'}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
          <form onSubmit={submit} className="card-shell h-fit p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  {editingId ? 'Editing document' : 'Create document'}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                  {editingId ? 'Update resource' : 'New resource'}
                </h3>
              </div>

              {editingId ? (
                <button
                  type="button"
                  onClick={startCreate}
                  className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
                >
                  New document
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4">
              <Field
                label="Library index number"
                error={form.errors.public_id}
                hint="Use a library-style code such as FEM-LIB-2026-001. Leave blank to generate it automatically."
              >
                <input
                  value={form.data.public_id}
                  onChange={(event) => form.setData('public_id', event.target.value)}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Title" error={form.errors.title}>
                <input
                  value={form.data.title}
                  onChange={(event) => form.setData('title', event.target.value)}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field
                label="Slug"
                error={form.errors.slug}
                hint="Optional. Leave blank to generate it automatically from the title."
              >
                <input
                  value={form.data.slug}
                  onChange={(event) => form.setData('slug', event.target.value)}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Description" error={form.errors.description}>
                <textarea
                  value={form.data.description}
                  onChange={(event) => form.setData('description', event.target.value)}
                  rows={5}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm leading-7"
                />
              </Field>

              <Field
                label="File path or URL"
                error={form.errors.file_path}
                hint="Use a public URL or a storage path served by Laravel."
              >
                <input
                  value={form.data.file_path}
                  onChange={(event) => form.setData('file_path', event.target.value)}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field
                label="Cover image URL"
                error={form.errors.thumbnail_path}
                hint="This appears as the document cover in the public library tiles and on the detail page."
              >
                <input
                  value={form.data.thumbnail_path}
                  onChange={(event) => form.setData('thumbnail_path', event.target.value)}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="File type" error={form.errors.file_type}>
                  <input
                    value={form.data.file_type}
                    onChange={(event) => form.setData('file_type', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                    placeholder="application/pdf or image/jpeg"
                  />
                </Field>

                <Field label="Category" error={form.errors.category}>
                  <input
                    value={form.data.category}
                    onChange={(event) => form.setData('category', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                    placeholder="e.g. Circular, Policy, Guide, Report"
                    list="document-category-options"
                  />
                </Field>
              </div>

              <datalist id="document-category-options">
                {documentCategories.map((category) => (
                  <option key={category.id} value={category.name} />
                ))}
              </datalist>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Year of publication" error={form.errors.year}>
                  <input
                    value={form.data.year}
                    onChange={(event) => form.setData('year', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                    placeholder="2026"
                  />
                </Field>

                <Field label="Author" error={form.errors.author_source}>
                  <input
                    value={form.data.author_source}
                    onChange={(event) => form.setData('author_source', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                    placeholder="FEMATA Research Desk"
                  />
                </Field>

                <Field label="Publisher" error={form.errors.source_organization}>
                  <input
                    value={form.data.source_organization}
                    onChange={(event) => form.setData('source_organization', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                    placeholder="Federation of Miners’ Associations of Tanzania"
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Published at" error={form.errors.published_at}>
                  <input
                    type="datetime-local"
                    value={form.data.published_at}
                    onChange={(event) => form.setData('published_at', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                  />
                </Field>

                <Field
                  label="Workflow status"
                  error={form.errors.status_id}
                  hint="Published documents appear publicly when their publish time has been reached."
                >
                  <select
                    value={form.data.status_id}
                    onChange={(event) => form.setData('status_id', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                  >
                    <option value="">Select status</option>
                    {contentStatuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/65 px-4 py-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.data.is_public}
                      onChange={(event) => form.setData('is_public', event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-[rgb(var(--border))]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[rgb(var(--primary))]">
                        Publicly visible
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[rgb(var(--muted))]">
                        Only public and published documents appear in the open library.
                      </span>
                    </span>
                  </label>
                </div>

                <div className="rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/65 px-4 py-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.data.is_featured}
                      onChange={(event) => form.setData('is_featured', event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-[rgb(var(--border))]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[rgb(var(--primary))]">
                        Feature in library highlights
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[rgb(var(--muted))]">
                        Featured publications can be surfaced more prominently in the public library.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" disabled={form.processing} className="btn-primary">
                {form.processing
                  ? 'Saving...'
                  : editingId
                    ? 'Update document'
                    : 'Create document'}
              </button>

              <button type="button" onClick={startCreate} className="btn-secondary">
                Reset form
              </button>
            </div>
          </form>

          <section className="grid gap-4">
            {documents.length === 0 ? (
              <div className="card-shell p-6 text-sm text-[rgb(var(--muted))]">
                No FEMATA public documents have been uploaded yet. Add the first report, circular, guide, or policy resource using the form.
              </div>
            ) : (
              documents.map((document) => (
                <article key={document.id} className="card-shell p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {document.public_id ? (
                          <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            {document.public_id}
                          </span>
                        ) : null}
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            document.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {document.status ? document.status.replace('_', ' ') : 'Draft'}
                        </span>
                        {document.category ? (
                          <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            {document.category}
                          </span>
                        ) : null}
                        <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          {document.published_at || 'Unscheduled'}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                        {document.title}
                      </h3>
                      <p className="mt-2 text-sm text-[rgb(var(--muted))]">{document.slug}</p>
                      {(document.author_source || document.source_organization || document.year) ? (
                        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                          {[document.author_source, document.source_organization, document.year].filter(Boolean).join(' | ')}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(document)}
                        className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDocument(document)}
                        className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {document.description ? (
                    <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))]">
                      {document.description}
                    </p>
                  ) : null}

                  <div className="mt-5 grid gap-3 text-sm text-[rgb(var(--muted))] md:grid-cols-2">
                    <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                        File type
                      </p>
                      <p className="mt-1">{document.file_type || 'Not specified'}</p>
                    </div>
                    <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                        File path
                      </p>
                      <a
                        href={document.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex break-all text-[rgb(var(--primary))] underline decoration-[rgb(var(--accent))]/55 underline-offset-4"
                      >
                        {document.file_path}
                      </a>
                    </div>
                    <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                        Cover image
                      </p>
                      <p className="mt-1 break-all">{document.thumbnail_path || 'Not set'}</p>
                    </div>
                    <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                        Library profile
                      </p>
                      <p className="mt-1">
                        {[document.author_source, document.source_organization, document.year].filter(Boolean).join(' | ') || 'Metadata pending'}
                      </p>
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
