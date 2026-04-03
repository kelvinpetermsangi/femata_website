import { Head, useForm, usePage } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import AuthShell from '@/components/AuthShell';

export default function ResetPassword({
  token,
  email,
}: {
  token: string;
  email?: string;
}) {
  const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
  const form = useForm({
    token,
    email: email ?? '',
    password: '',
    password_confirmation: '',
  });

  return (
    <>
      <Head title="Reset password" />

      <AuthShell
        eyebrow="Set a new password"
        title="Create a new FEMATA dashboard password."
        text="Choose a strong password for your FEMATA secretariat account, then return to the sign-in page once the reset has been completed."
      >
        <div className="grid gap-4">
          {flash?.error ? (
            <div className="ui-soft-panel rounded-2xl border-amber-200/60 px-4 py-3 text-sm text-amber-800">
              {flash.error}
            </div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              form.post('/admin/reset-password');
            }}
            className="grid gap-4"
          >
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-900">Email address</span>
              <input
                value={form.data.email}
                onChange={(event) => form.setData('email', event.target.value)}
                className="field-shell px-4 text-sm text-slate-900"
                type="email"
                autoComplete="email"
                required
              />
              {form.errors.email ? (
                <span className="text-xs font-medium text-red-600">{form.errors.email}</span>
              ) : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-900">New password</span>
              <input
                value={form.data.password}
                onChange={(event) => form.setData('password', event.target.value)}
                className="field-shell px-4 text-sm text-slate-900"
                type="password"
                autoComplete="new-password"
                required
              />
              {form.errors.password ? (
                <span className="text-xs font-medium text-red-600">{form.errors.password}</span>
              ) : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-900">Confirm password</span>
              <input
                value={form.data.password_confirmation}
                onChange={(event) => form.setData('password_confirmation', event.target.value)}
                className="field-shell px-4 text-sm text-slate-900"
                type="password"
                autoComplete="new-password"
                required
              />
            </label>

            <button
              type="submit"
              className="btn-primary rounded-2xl"
              disabled={form.processing}
            >
              {form.processing ? 'Resetting password...' : 'Reset password'}
            </button>
          </form>

          <AppLink
            href="/admin/login"
            className="text-sm font-semibold text-slate-900 underline underline-offset-4"
          >
            Back to sign in
          </AppLink>
        </div>
      </AuthShell>
    </>
  );
}
