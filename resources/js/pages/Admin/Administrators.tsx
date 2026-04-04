import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type ReactNode, useState } from 'react';
import AdminPageIntro from '@/components/AdminPageIntro';
import AdminLayout from '@/layouts/AdminLayout';
import type { AdministratorUser, Association, AdminSection, SharedPageProps } from '@/types';

type FormShape = {
  name: string;
  email: string;
  password: string;
  role: string;
  admin_sections: string[];
  association_ids: number[];
};

function emptyForm(defaultRole: string): FormShape {
  return {
    name: '',
    email: '',
    password: '',
    role: defaultRole,
    admin_sections: [],
    association_ids: [],
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

export default function AdminAdministrators({
  users,
  roles,
  sections,
  associations,
}: {
  users: AdministratorUser[];
  roles: string[];
  sections: AdminSection[];
  associations: Pick<Association, 'id' | 'name' | 'slug'>[];
}) {
  const defaultRole = roles[0] ?? 'admin';
  const { props } = usePage<SharedPageProps>();
  const [editing, setEditing] = useState<AdministratorUser | null>(null);
  const form = useForm<FormShape>(emptyForm(defaultRole));
  const flashSuccess = props.flash?.success;

  const reset = () => {
    setEditing(null);
    form.setData(emptyForm(defaultRole));
    form.clearErrors();
  };

  const loadUser = (user: AdministratorUser) => {
    setEditing(user);
    form.setData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role || defaultRole,
      admin_sections: user.admin_sections ?? [],
      association_ids: user.association_ids ?? [],
    });
    form.clearErrors();
  };

  const toggleSection = (slug: string) => {
    if (form.data.admin_sections.includes(slug)) {
      form.setData('admin_sections', form.data.admin_sections.filter((item) => item !== slug));
      return;
    }

    form.setData('admin_sections', [...form.data.admin_sections, slug]);
  };

  const toggleAssociation = (id: number) => {
    if (form.data.association_ids.includes(id)) {
      form.setData('association_ids', form.data.association_ids.filter((item) => item !== id));
      return;
    }

    form.setData('association_ids', [...form.data.association_ids, id]);
  };

  const superAdminSelected = form.data.role === 'super-admin';

  return (
    <>
      <Head title="Administrators" />

      <AdminLayout title="Administrators">
        <AdminPageIntro
          eyebrow="Administrator scopes"
          title="Create admins for national modules, selected associations, or both."
          text="Super admin can assign each administrator a role, the national modules they can manage, and the association workspaces they should be allowed to edit."
          metrics={[
            { label: 'Admin users', value: String(users.length) },
            { label: 'Associations', value: String(associations.length) },
          ]}
        />

        {flashSuccess ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (editing) {
                form.put(`/admin/administrators/${editing.id}`);
                return;
              }

              form.post('/admin/administrators');
            }}
            className="card-shell h-fit p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  {editing ? 'Edit administrator' : 'Create administrator'}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                  {editing ? 'Update administrator scopes' : 'New administrator'}
                </h2>
              </div>

              {editing ? (
                <button type="button" onClick={reset} className="btn-secondary">
                  New admin
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4">
              <Field label="Name" error={form.errors.name}>
                <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
              </Field>

              <Field label="Email" error={form.errors.email}>
                <input value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
              </Field>

              <Field
                label={editing ? 'Password reset' : 'Password'}
                error={form.errors.password}
                hint={editing ? 'Leave blank to keep the current password.' : 'Minimum 8 characters.'}
              >
                <input type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
              </Field>

              <Field label="Role" error={form.errors.role}>
                <select value={form.data.role} onChange={(event) => form.setData('role', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]">
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </Field>

              <div className="rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.88)] p-4">
                <p className="text-sm font-semibold text-[rgb(var(--primary))]">National module access</p>
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                  Choose which parts of the national FEMATA backend this administrator can manage.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {sections.map((section) => (
                    <label key={section.id} className="flex items-start gap-3 rounded-[1rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/72 px-4 py-3 text-sm text-[rgb(var(--foreground))]">
                      <input
                        type="checkbox"
                        checked={superAdminSelected || form.data.admin_sections.includes(section.slug)}
                        disabled={superAdminSelected}
                        onChange={() => toggleSection(section.slug)}
                        className="mt-1 h-4 w-4 rounded border-[rgb(var(--border))]"
                      />
                      <span className="font-medium">{section.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.88)] p-4">
                <p className="text-sm font-semibold text-[rgb(var(--primary))]">Association workspace access</p>
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                  Pick the associations this administrator should be able to open and edit.
                </p>

                <div className="mt-4 grid gap-3">
                  {associations.map((association) => (
                    <label key={association.id} className="flex items-start gap-3 rounded-[1rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/72 px-4 py-3 text-sm text-[rgb(var(--foreground))]">
                      <input
                        type="checkbox"
                        checked={superAdminSelected || form.data.association_ids.includes(association.id)}
                        disabled={superAdminSelected}
                        onChange={() => toggleAssociation(association.id)}
                        className="mt-1 h-4 w-4 rounded border-[rgb(var(--border))]"
                      />
                      <span className="font-medium">{association.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" disabled={form.processing} className="btn-primary disabled:cursor-not-allowed disabled:opacity-70">
                {form.processing ? 'Saving...' : editing ? 'Save administrator' : 'Create administrator'}
              </button>
              <button type="button" onClick={reset} className="btn-secondary">
                Reset
              </button>
            </div>
          </form>

          <div className="grid gap-4">
            {users.map((user) => (
              <article key={user.id} className="card-shell p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
                        {user.role || 'Administrator'}
                      </span>
                      {user.managed_associations?.length ? (
                        <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
                          {user.managed_associations.length} associations
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">{user.name}</h2>
                    <p className="mt-1 text-sm text-[rgb(var(--muted))]">{user.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => loadUser(user)} className="btn-secondary">
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm(`Delete administrator "${user.name}"?`)) {
                          return;
                        }

                        router.delete(`/admin/administrators/${user.id}`);
                      }}
                      className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="ui-soft-panel p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      National modules
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(user.admin_sections ?? []).length > 0 ? (
                        (user.admin_sections ?? []).map((section) => (
                          <span key={section} className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
                            {section}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[rgb(var(--muted))]">No section overrides recorded.</span>
                      )}
                    </div>
                  </div>

                  <div className="ui-soft-panel p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      Association access
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(user.managed_associations ?? []).length > 0 ? (
                        (user.managed_associations ?? []).map((association) => (
                          <span key={association.id} className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
                            {association.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[rgb(var(--muted))]">National-only access.</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </AdminLayout>
    </>
  );
}
