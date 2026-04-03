import { Head, useForm, usePage } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import AuthShell from '@/components/AuthShell';

export default function Login() {
  const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
  const form = useForm({
    email: '',
    password: '',
    remember: false,
  });

  return (
    <>
      <Head title="Admin login" />

      <AuthShell
        eyebrow="Secure access"
        title="Sign in to the FEMATA secretariat dashboard."
        text="Use your approved FEMATA admin account to manage public communication, association profiles, documents, gallery media, adverts, and site branding."
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
              form.post('/admin/login');
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
              <span className="text-sm font-semibold text-slate-900">Password</span>
              <input
                value={form.data.password}
                onChange={(event) => form.setData('password', event.target.value)}
                className="field-shell px-4 text-sm text-slate-900"
                type="password"
                autoComplete="current-password"
                required
              />
              {form.errors.password ? (
                <span className="text-xs font-medium text-red-600">{form.errors.password}</span>
              ) : null}
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={form.data.remember}
                  onChange={(event) => form.setData('remember', event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Remember me
              </label>

              <AppLink
                href="/admin/forgot-password"
                className="font-semibold text-slate-900 underline underline-offset-4"
              >
                Forgot password?
              </AppLink>
            </div>

            <button
              type="submit"
              className="btn-primary mt-2 rounded-2xl"
              disabled={form.processing}
            >
              {form.processing ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </AuthShell>
    </>
  );
}
