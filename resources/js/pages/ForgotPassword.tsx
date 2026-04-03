import { Head, useForm, usePage } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import AuthShell from '@/components/AuthShell';

export default function ForgotPassword() {
  const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
  const form = useForm({
    email: '',
  });

  return (
    <>
      <Head title="Forgot password" />

      <AuthShell
        eyebrow="Password recovery"
        title="Request a FEMATA password reset link."
        text="Enter the email address used for the FEMATA secretariat dashboard. The system will generate a reset link for that account. If mail is being logged locally, the link will be written to the application log."
      >
        <div className="grid gap-4">
          {flash?.success ? (
            <div className="ui-soft-panel rounded-2xl border-emerald-200/60 px-4 py-3 text-sm text-emerald-700">
              {flash.success}
            </div>
          ) : null}

          {flash?.error ? (
            <div className="ui-soft-panel rounded-2xl border-amber-200/60 px-4 py-3 text-sm text-amber-800">
              {flash.error}
            </div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              form.post('/admin/forgot-password');
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

            <button
              type="submit"
              className="btn-primary rounded-2xl"
              disabled={form.processing}
            >
              {form.processing ? 'Sending link...' : 'Send reset link'}
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
