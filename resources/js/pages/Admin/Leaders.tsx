import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import type { SharedPageProps } from '@/types';

type LeaderItem = {
  id: number;
  name: string;
  title: string;
  photo_path?: string | null;
  bio?: string | null;
  sort_order: number;
  is_active: boolean;
};

type LeaderForm = {
  name: string;
  title: string;
  photo_path: string;
  bio: string;
  sort_order: string;
  is_active: boolean;
};

function createEmptyLeader(): LeaderForm {
  return {
    name: '',
    title: '',
    photo_path: '',
    bio: '',
    sort_order: '0',
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

export default function AdminLeaders({ leaders }: { leaders: LeaderItem[] }) {
  const { props } = usePage<SharedPageProps>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<LeaderForm>(createEmptyLeader());

  const startCreate = () => {
    setEditingId(null);
    form.setData(createEmptyLeader());
    form.clearErrors();
  };

  const startEdit = (leader: LeaderItem) => {
    setEditingId(leader.id);
    form.setData({
      name: leader.name,
      title: leader.title,
      photo_path: leader.photo_path ?? '',
      bio: leader.bio ?? '',
      sort_order: String(leader.sort_order),
      is_active: leader.is_active,
    });
    form.clearErrors();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      photo_path: data.photo_path.trim() || null,
      bio: data.bio.trim() || null,
      sort_order: Number(data.sort_order || 0),
    }));

    const onSuccess = () => {
      setEditingId(null);
      form.setData(createEmptyLeader());
      form.clearErrors();
    };

    if (editingId) {
      form.put(`/admin/leaders/${editingId}`, {
        preserveScroll: true,
        onSuccess,
      });

      return;
    }

    form.post('/admin/leaders', {
      preserveScroll: true,
      onSuccess,
    });
  };

  const removeLeader = (leader: LeaderItem) => {
    if (!window.confirm(`Delete "${leader.name}"?`)) {
      return;
    }

    router.delete(`/admin/leaders/${leader.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        if (editingId === leader.id) {
          startCreate();
        }
      },
    });
  };

  const flashSuccess = props.flash?.success;
  const activeCount = leaders.filter((leader) => leader.is_active).length;

  return (
    <>
      <Head title="Leaders admin" />

      <AdminLayout title="Leaders">
        <section className="soft-band overflow-hidden rounded-[1.8rem] px-5 py-6 text-white sm:px-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/68">
            Leadership management
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Maintain public leadership profiles and executive visibility.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/82 sm:text-base">
            Use this section to manage chairpersons, directors, board members, and other official
            FEMATA leadership profiles shown on the public site.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="rounded-full border border-white/16 bg-white/10 px-4 py-2">
              {leaders.length} total profiles
            </div>
            <div className="rounded-full border border-white/16 bg-white/10 px-4 py-2">
              {activeCount} active leaders
            </div>
          </div>
        </section>

        {(flashSuccess || form.recentlySuccessful) ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess ?? 'Leader saved successfully.'}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
          <form onSubmit={submit} className="card-shell h-fit p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  {editingId ? 'Editing profile' : 'Create profile'}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                  {editingId ? 'Update leader' : 'New leader'}
                </h3>
              </div>

              {editingId ? (
                <button
                  type="button"
                  onClick={startCreate}
                  className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
                >
                  New leader
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4">
              <Field label="Full name" error={form.errors.name}>
                <input
                  value={form.data.name}
                  onChange={(event) => form.setData('name', event.target.value)}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Title / role" error={form.errors.title}>
                <input
                  value={form.data.title}
                  onChange={(event) => form.setData('title', event.target.value)}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field
                label="Photo URL"
                error={form.errors.photo_path}
                hint="Optional profile image shown on leadership cards."
              >
                <input
                  value={form.data.photo_path}
                  onChange={(event) => form.setData('photo_path', event.target.value)}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Bio" error={form.errors.bio}>
                <textarea
                  value={form.data.bio}
                  onChange={(event) => form.setData('bio', event.target.value)}
                  rows={6}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm leading-7"
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <Field
                  label="Sort order"
                  error={form.errors.sort_order}
                  hint="Lower numbers appear first."
                >
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={form.data.sort_order}
                    onChange={(event) => form.setData('sort_order', event.target.value)}
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
                        Active profile
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[rgb(var(--muted))]">
                        Active leaders can appear on the public leadership section and homepage.
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
                    ? 'Update leader'
                    : 'Create leader'}
              </button>

              <button type="button" onClick={startCreate} className="btn-secondary">
                Reset form
              </button>
            </div>
          </form>

          <section className="grid gap-4">
            {leaders.length === 0 ? (
              <div className="card-shell p-6 text-sm text-[rgb(var(--muted))]">
                No leadership profiles yet. Create the first public profile using the form.
              </div>
            ) : (
              leaders.map((leader) => (
                <article key={leader.id} className="card-shell p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-[1.4rem] bg-[rgb(var(--surface-2))]">
                        {leader.photo_path ? (
                          <img
                            src={leader.photo_path}
                            alt={leader.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-[rgb(var(--primary))]">
                            {leader.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                              leader.is_active
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {leader.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            Order {leader.sort_order}
                          </span>
                        </div>

                        <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                          {leader.name}
                        </h3>
                        <p className="mt-2 text-sm text-[rgb(var(--muted))]">{leader.title}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(leader)}
                        className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLeader(leader)}
                        className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {leader.bio ? (
                    <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))]">{leader.bio}</p>
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
