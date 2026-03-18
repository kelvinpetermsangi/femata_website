import { Head, useForm, usePage } from '@inertiajs/react';

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

      <div className="min-h-screen bg-[rgb(var(--bg))] px-4 py-12">
        <div className="mx-auto max-w-md rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-8 shadow-lg">
          <h1 className="text-2xl font-semibold text-[rgb(var(--primary))]">FEMATA Admin</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Sign in to manage announcements, news, leadership, gallery, and documents.
          </p>

          {flash?.error ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {flash.error}
            </div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              form.post('/admin/login');
            }}
            className="mt-6 flex flex-col gap-4"
          >
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
              Email
              <input
                value={form.data.email}
                onChange={(event) => form.setData('email', event.target.value)}
                className="mt-2 w-full rounded-2xl border bg-[rgb(var(--surface))] px-3 py-3 text-sm"
                style={{ borderColor: 'rgb(var(--border))' }}
                type="email"
                autoComplete="email"
                required
              />
            </label>

            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
              Password
              <input
                value={form.data.password}
                onChange={(event) => form.setData('password', event.target.value)}
                className="mt-2 w-full rounded-2xl border bg-[rgb(var(--surface))] px-3 py-3 text-sm"
                style={{ borderColor: 'rgb(var(--border))' }}
                type="password"
                autoComplete="current-password"
                required
              />
            </label>

            <label className="mt-2 flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
              <input
                type="checkbox"
                checked={form.data.remember}
                onChange={(event) => form.setData('remember', event.target.checked)}
                className="h-4 w-4 rounded border-[rgb(var(--border))]"
                style={{ borderColor: 'rgb(var(--border))' }}
              />
              Remember me
            </label>

            <button
              type="submit"
              className="mt-4 rounded-2xl bg-[rgb(var(--primary))] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              disabled={form.processing}
            >
              {form.processing ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
