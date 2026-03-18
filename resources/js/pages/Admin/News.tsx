import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import type { SharedPageProps } from '@/types';

type NewsItem = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  body: string;
  cover_image?: string | null;
  published_at?: string | null;
  is_published: boolean;
};

type NewsForm = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image: string;
  published_at: string;
  is_published: boolean;
};

function createEmptyNews(): NewsForm {
  return {
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    cover_image: '',
    published_at: '',
    is_published: false,
  };
}

function Field({
  label,
  error,
  children,
  hint,
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

export default function AdminNews({ news }: { news: NewsItem[] }) {
  const { props } = usePage<SharedPageProps>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<NewsForm>(createEmptyNews());

  const startCreate = () => {
    setEditingId(null);
    form.setData(createEmptyNews());
    form.clearErrors();
  };

  const startEdit = (item: NewsItem) => {
    setEditingId(item.id);
    form.setData({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt ?? '',
      body: item.body,
      cover_image: item.cover_image ?? '',
      published_at: item.published_at ?? '',
      is_published: item.is_published,
    });
    form.clearErrors();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      slug: data.slug.trim() || null,
      excerpt: data.excerpt.trim() || null,
      cover_image: data.cover_image.trim() || null,
      published_at: data.published_at || null,
    }));

    const onSuccess = () => {
      setEditingId(null);
      form.setData(createEmptyNews());
      form.clearErrors();
    };

    if (editingId) {
      const current = news.find((item) => item.id === editingId);
      if (!current) return;

      form.put(`/admin/news/${current.slug}`, {
        preserveScroll: true,
        onSuccess,
      });

      return;
    }

    form.post('/admin/news', {
      preserveScroll: true,
      onSuccess,
    });
  };

  const removeNews = (item: NewsItem) => {
    if (!window.confirm(`Delete "${item.title}"?`)) {
      return;
    }

    router.delete(`/admin/news/${item.slug}`, {
      preserveScroll: true,
      onSuccess: () => {
        if (editingId === item.id) {
          startCreate();
        }
      },
    });
  };

  const flashSuccess = props.flash?.success;
  const publishedCount = news.filter((item) => item.is_published).length;

  return (
    <>
      <Head title="News admin" />

      <AdminLayout title="News">
        <section className="soft-band overflow-hidden rounded-[1.8rem] px-5 py-6 text-white sm:px-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/68">
            Newsroom management
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Create stories, publish updates, and manage public visibility.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/82 sm:text-base">
            News posts power the FEMATA newsroom. Use them for articles, official releases, field
            updates, and stakeholder communication with optional cover imagery.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="rounded-full border border-white/16 bg-white/10 px-4 py-2">
              {news.length} total posts
            </div>
            <div className="rounded-full border border-white/16 bg-white/10 px-4 py-2">
              {publishedCount} published
            </div>
          </div>
        </section>

        {(flashSuccess || form.recentlySuccessful) ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess ?? 'News post saved successfully.'}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
          <form
            onSubmit={submit}
            className="card-shell h-fit p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  {editingId ? 'Editing news post' : 'Create news post'}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                  {editingId ? 'Update article' : 'New article'}
                </h3>
              </div>

              {editingId ? (
                <button
                  type="button"
                  onClick={startCreate}
                  className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
                >
                  New post
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4">
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

              <Field
                label="Excerpt"
                error={form.errors.excerpt}
                hint="Optional short summary used in list views and previews."
              >
                <textarea
                  value={form.data.excerpt}
                  onChange={(event) => form.setData('excerpt', event.target.value)}
                  rows={3}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm leading-7"
                />
              </Field>

              <Field label="Body" error={form.errors.body}>
                <textarea
                  value={form.data.body}
                  onChange={(event) => form.setData('body', event.target.value)}
                  rows={8}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm leading-7"
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Cover image URL"
                  error={form.errors.cover_image}
                  hint="Optional image shown on news cards and article pages."
                >
                  <input
                    value={form.data.cover_image}
                    onChange={(event) => form.setData('cover_image', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                  />
                </Field>

                <Field label="Published at" error={form.errors.published_at}>
                  <input
                    type="datetime-local"
                    value={form.data.published_at}
                    onChange={(event) => form.setData('published_at', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                  />
                </Field>
              </div>

              <div className="rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/65 px-4 py-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.data.is_published}
                    onChange={(event) => form.setData('is_published', event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[rgb(var(--border))]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[rgb(var(--primary))]">
                      Published
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[rgb(var(--muted))]">
                      Published posts appear in the public newsroom when their publication time has
                      been reached.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={form.processing}
                className="btn-primary"
              >
                {form.processing
                  ? 'Saving...'
                  : editingId
                    ? 'Update news post'
                    : 'Create news post'}
              </button>

              <button
                type="button"
                onClick={startCreate}
                className="btn-secondary"
              >
                Reset form
              </button>
            </div>
          </form>

          <section className="grid gap-4">
            {news.length === 0 ? (
              <div className="card-shell p-6 text-sm text-[rgb(var(--muted))]">
                No news posts yet. Create the first article using the form.
              </div>
            ) : (
              news.map((item) => (
                <article key={item.id} className="card-shell p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            item.is_published
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {item.is_published ? 'Published' : 'Draft'}
                        </span>
                        <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          {item.published_at || 'Not scheduled'}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-[rgb(var(--muted))]">{item.slug}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeNews(item)}
                        className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {item.cover_image ? (
                    <div className="mt-5 overflow-hidden rounded-[1.2rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  {item.excerpt ? (
                    <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))]">{item.excerpt}</p>
                  ) : null}

                  <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))]">
                    {item.body}
                  </p>
                </article>
              ))
            )}
          </section>
        </section>
      </AdminLayout>
    </>
  );
}
