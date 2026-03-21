import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import type { SharedPageProps } from '@/types';

type AnnouncementItem = {
  id: number;
  title: string;
  slug: string;
  body: string;
  is_active: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  priority: number;
};

type AnnouncementForm = {
  title: string;
  slug: string;
  body: string;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
  priority: string;
};

function createEmptyAnnouncement(): AnnouncementForm {
  return {
    title: '',
    slug: '',
    body: '',
    is_active: true,
    starts_at: '',
    ends_at: '',
    priority: '10',
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

export default function AdminAnnouncements({
  announcements,
}: {
  announcements: AnnouncementItem[];
}) {
  const { props } = usePage<SharedPageProps>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<AnnouncementForm>(createEmptyAnnouncement());

  const startCreate = () => {
    setEditingId(null);
    form.setData(createEmptyAnnouncement());
    form.clearErrors();
  };

  const startEdit = (announcement: AnnouncementItem) => {
    setEditingId(announcement.id);
    form.setData({
      title: announcement.title,
      slug: announcement.slug,
      body: announcement.body,
      is_active: announcement.is_active,
      starts_at: announcement.starts_at ?? '',
      ends_at: announcement.ends_at ?? '',
      priority: String(announcement.priority),
    });
    form.clearErrors();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      slug: data.slug.trim() || null,
      starts_at: data.starts_at || null,
      ends_at: data.ends_at || null,
      priority: Number(data.priority || 0),
    }));

    const onSuccess = () => {
      setEditingId(null);
      form.setData(createEmptyAnnouncement());
      form.clearErrors();
    };

    if (editingId) {
      const current = announcements.find((item) => item.id === editingId);
      if (!current) return;

      form.put(`/admin/announcements/${current.id}`, {
        preserveScroll: true,
        onSuccess,
      });

      return;
    }

    form.post('/admin/announcements', {
      preserveScroll: true,
      onSuccess,
    });
  };

  const removeAnnouncement = (announcement: AnnouncementItem) => {
    if (!window.confirm(`Delete "${announcement.title}"?`)) {
      return;
    }

    router.delete(`/admin/announcements/${announcement.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        if (editingId === announcement.id) {
          startCreate();
        }
      },
    });
  };

  const flashSuccess = props.flash?.success;
  const activeCount = announcements.filter((item) => item.is_active).length;

  return (
    <>
      <Head title="Announcements admin" />

      <AdminLayout title="Announcements">
        <section className="soft-band overflow-hidden rounded-[1.8rem] px-5 py-6 text-white sm:px-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/68">
            Content management
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Publish, schedule, and prioritize official announcements.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/82 sm:text-base">
            Use announcements for public notices, homepage ticker items, and time-sensitive updates
            that need high visibility on the FEMATA website.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="rounded-full border border-white/16 bg-white/10 px-4 py-2">
              {announcements.length} total announcements
            </div>
            <div className="rounded-full border border-white/16 bg-white/10 px-4 py-2">
              {activeCount} currently active
            </div>
          </div>
        </section>

        {(flashSuccess || form.recentlySuccessful) ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess ?? 'Announcement saved successfully.'}
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
                  {editingId ? 'Editing announcement' : 'Create announcement'}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                  {editingId ? 'Update notice' : 'New notice'}
                </h3>
              </div>

              {editingId ? (
                <button
                  type="button"
                  onClick={startCreate}
                  className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
                >
                  New announcement
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

              <Field label="Body" error={form.errors.body}>
                <textarea
                  value={form.data.body}
                  onChange={(event) => form.setData('body', event.target.value)}
                  rows={7}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm leading-7"
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Start date" error={form.errors.starts_at}>
                  <input
                    type="datetime-local"
                    value={form.data.starts_at}
                    onChange={(event) => form.setData('starts_at', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                  />
                </Field>

                <Field label="End date" error={form.errors.ends_at}>
                  <input
                    type="datetime-local"
                    value={form.data.ends_at}
                    onChange={(event) => form.setData('ends_at', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)] md:items-start">
                <Field label="Priority" error={form.errors.priority}>
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={form.data.priority}
                    onChange={(event) => form.setData('priority', event.target.value)}
                    className="rounded-2xl border bg-white px-4 py-3 text-sm"
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
                        Active announcement
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[rgb(var(--muted))]">
                        Active announcements can appear on the website and in the notice ticker when
                        their schedule window allows it.
                      </span>
                    </span>
                  </label>
                </div>
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
                    ? 'Update announcement'
                    : 'Create announcement'}
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
            {announcements.length === 0 ? (
              <div className="card-shell p-6 text-sm text-[rgb(var(--muted))]">
                No announcements yet. Create the first official notice using the form.
              </div>
            ) : (
              announcements.map((announcement) => (
                <article key={announcement.id} className="card-shell p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            announcement.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {announcement.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          Priority {announcement.priority}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                        {announcement.title}
                      </h3>
                      <p className="mt-2 text-sm text-[rgb(var(--muted))]">{announcement.slug}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(announcement)}
                        className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAnnouncement(announcement)}
                        className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))]">
                    {announcement.body}
                  </p>

                  <div className="mt-5 grid gap-3 text-sm text-[rgb(var(--muted))] md:grid-cols-3">
                    <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                        Start
                      </p>
                      <p className="mt-1">{announcement.starts_at || 'Immediate'}</p>
                    </div>
                    <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                        End
                      </p>
                      <p className="mt-1">{announcement.ends_at || 'Open ended'}</p>
                    </div>
                    <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                        Visibility
                      </p>
                      <p className="mt-1">
                        {announcement.is_active ? 'Eligible for public display' : 'Hidden from public view'}
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
