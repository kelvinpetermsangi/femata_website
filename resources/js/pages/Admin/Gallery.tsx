import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useState } from 'react';
import AdminPageIntro from '@/components/AdminPageIntro';
import AdminLayout from '@/layouts/AdminLayout';
import type { SharedPageProps } from '@/types';

type GalleryItemFormData = {
  id: number;
  title: string;
  slug: string;
  type: 'image';
  image_path?: string | null;
  youtube_url?: string | null;
  description?: string | null;
  event_name?: string | null;
  event_date?: string | null;
  is_featured: boolean;
  published_at?: string | null;
};

type GalleryForm = {
  title: string;
  slug: string;
  type: 'image';
  image_path: string;
  youtube_url: string;
  description: string;
  event_name: string;
  event_date: string;
  is_featured: boolean;
  published_at: string;
};

function createEmptyGalleryItem(): GalleryForm {
  return {
    title: '',
    slug: '',
    type: 'image',
    image_path: '',
    youtube_url: '',
    description: '',
    event_name: '',
    event_date: '',
    is_featured: false,
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

export default function AdminGallery({
  galleryItems,
}: {
  galleryItems: GalleryItemFormData[];
}) {
  const { props } = usePage<SharedPageProps>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<GalleryForm>(createEmptyGalleryItem());

  const startCreate = () => {
    setEditingId(null);
    form.setData(createEmptyGalleryItem());
    form.clearErrors();
  };

  const startEdit = (item: GalleryItemFormData) => {
    setEditingId(item.id);
    form.setData({
      title: item.title,
      slug: item.slug,
      type: item.type,
      image_path: item.image_path ?? '',
      youtube_url: item.youtube_url ?? '',
      description: item.description ?? '',
      event_name: item.event_name ?? '',
      event_date: item.event_date ?? '',
      is_featured: item.is_featured,
      published_at: item.published_at ?? '',
    });
    form.clearErrors();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      slug: data.slug.trim() || null,
      image_path: data.image_path.trim() || null,
      youtube_url: data.youtube_url.trim() || null,
      description: data.description.trim() || null,
      event_name: data.event_name.trim() || null,
      event_date: data.event_date || null,
      published_at: data.published_at || null,
    }));

    const onSuccess = () => {
      setEditingId(null);
      form.setData(createEmptyGalleryItem());
      form.clearErrors();
    };

    if (editingId) {
      const current = galleryItems.find((item) => item.id === editingId);
      if (!current) return;

      form.put(`/admin/gallery/${current.id}`, {
        preserveScroll: true,
        onSuccess,
      });

      return;
    }

    form.post('/admin/gallery', {
      preserveScroll: true,
      onSuccess,
    });
  };

  const removeItem = (item: GalleryItemFormData) => {
    if (!window.confirm(`Delete "${item.title}"?`)) {
      return;
    }

    router.delete(`/admin/gallery/${item.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        if (editingId === item.id) {
          startCreate();
        }
      },
    });
  };

  const flashSuccess = props.flash?.success;
  const featuredCount = galleryItems.filter((item) => item.is_featured).length;

  return (
    <>
      <Head title="Gallery admin" />

      <AdminLayout title="Gallery">
        <AdminPageIntro
          eyebrow="Media management"
          title="Curate field images for the public gallery."
          text="Gallery items help the FEMATA website feel active and credible. Use event titles and dates to group media into clear public storylines, while FEMATA Online TV entries stay in the dedicated video workflow."
          metrics={[
            { label: 'Total items', value: String(galleryItems.length) },
            { label: 'Featured items', value: String(featuredCount) },
          ]}
        />

        {(flashSuccess || form.recentlySuccessful) ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess ?? 'Gallery item saved successfully.'}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
          <form onSubmit={submit} className="card-shell h-fit p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  {editingId ? 'Editing gallery item' : 'Create gallery item'}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                  {editingId ? 'Update media entry' : 'New media entry'}
                </h3>
              </div>

              {editingId ? (
                <button
                  type="button"
                  onClick={startCreate}
                  className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
                >
                  New item
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
                label="Image URL"
                error={form.errors.image_path}
                hint="Required for gallery image items."
              >
                <input
                  value={form.data.image_path}
                  onChange={(event) => form.setData('image_path', event.target.value)}
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

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Event title" error={form.errors.event_name}>
                  <input
                    value={form.data.event_name}
                    onChange={(event) => form.setData('event_name', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                  />
                </Field>

                <Field label="Event date" error={form.errors.event_date}>
                  <input
                    type="date"
                    value={form.data.event_date}
                    onChange={(event) => form.setData('event_date', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
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
                        Featured item
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[rgb(var(--muted))]">
                        Featured media is prioritized in public gallery listings and homepage
                        highlights.
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
                    ? 'Update gallery item'
                    : 'Create gallery item'}
              </button>

              <button type="button" onClick={startCreate} className="btn-secondary">
                Reset form
              </button>
            </div>
          </form>

          <section className="grid gap-4">
            {galleryItems.length === 0 ? (
              <div className="card-shell p-6 text-sm text-[rgb(var(--muted))]">
                No FEMATA gallery items have been published yet. Add the first approved photo or media entry using the form.
              </div>
            ) : (
              galleryItems.map((item) => (
                <article key={item.id} className="card-shell p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          Image
                        </span>
                        {item.event_name ? (
                          <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            {item.event_name}
                          </span>
                        ) : null}
                        {item.is_featured ? (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                            Featured
                          </span>
                        ) : null}
                        <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          {item.published_at || 'Unscheduled'}
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
                        onClick={() => removeItem(item)}
                        className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[1.2rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
                    {item.image_path ? (
                      <img
                        src={item.image_path}
                        alt={item.title}
                        className="h-52 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex min-h-[208px] items-center justify-center px-6 text-center text-sm text-[rgb(var(--muted))]">
                        FEMATA media preview
                      </div>
                    )}
                  </div>

                  {item.description ? (
                    <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))]">{item.description}</p>
                  ) : null}

                  {item.event_date ? (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--accent-2))]">
                      Event date: {item.event_date}
                    </p>
                  ) : null}
                </article>
              ))
            )}
          </section>
        </section>
      </AdminLayout>
    </>
  );
}
