import { useForm } from '@inertiajs/react';
import { useMemo, useState, type ReactNode } from 'react';
import AppLink from '@/components/AppLink';
import { getPreviewPath } from '@/lib/previewRouting';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { post, processing } = useForm();
  const [open, setOpen] = useState(false);
  const pathname = typeof window !== 'undefined' ? getPreviewPath() : '/admin/dashboard';

  const navItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Announcements', href: '/admin/announcements' },
      { label: 'News', href: '/admin/news' },
      { label: 'Videos', href: '/admin/videos' },
      { label: 'Pages', href: '/admin/pages' },
      { label: 'Press Briefings', href: '/admin/press-briefings' },
      { label: 'Leaders', href: '/admin/leaders' },
      { label: 'Associations', href: '/admin/associations' },
      { label: 'Gallery', href: '/admin/gallery' },
      { label: 'Documents', href: '/admin/documents' },
      { label: 'Settings', href: '/admin/settings' },
    ],
    [],
  );

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard' || pathname === '/admin';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const NavContent = () => (
    <>
      <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(var(--primary),1),rgba(var(--accent),0.9))] p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-sm font-bold text-white">
            <span className="absolute inset-[4px] rounded-[0.85rem] border border-white/20" />
            <span className="relative">F</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.12em]">FEMATA</p>
            <p className="text-xs text-white/75">Admin Console</p>
          </div>
        </div>

        <div className="mt-4 rounded-[1.1rem] border border-white/10 bg-white/10 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">
            Management Portal
          </p>
          <p className="mt-1 text-sm leading-6 text-white/88">
            Manage public content, updates, resources, member visibility, and sector communication.
          </p>
        </div>
      </div>

      <div className="mb-3 px-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
          Navigation
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <AppLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`group flex items-center justify-between rounded-[1.15rem] px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'bg-[linear-gradient(135deg,rgba(var(--primary),1),rgba(var(--accent),0.92))] text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)]'
                  : 'text-[rgb(var(--primary))] hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--primary))]'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`h-2.5 w-2.5 rounded-full transition ${
                  active ? 'bg-white/90' : 'bg-[rgb(var(--accent))]/25 group-hover:bg-[rgb(var(--accent))]/55'
                }`}
              />
            </AppLink>
          );
        })}
      </nav>

      <div className="mt-6 rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-3">
        <button
          type="button"
          onClick={() => post('/logout')}
          disabled={processing}
          className="inline-flex w-full items-center justify-center rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {processing ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[310px] shrink-0 border-r border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-5 py-5 xl:flex xl:flex-col">
          <NavContent />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))]/90 backdrop-blur-xl">
            <div className="flex min-h-[86px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen((prev) => !prev)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-white/70 text-[rgb(var(--primary))] shadow-sm transition hover:bg-white xl:hidden"
                  aria-expanded={open}
                  aria-label="Toggle admin menu"
                >
                  <span className="relative flex h-4 w-4 flex-col items-center justify-center">
                    <span
                      className={`absolute h-[2px] w-4 rounded-full bg-current transition ${
                        open ? 'rotate-45' : '-translate-y-[5px]'
                      }`}
                    />
                    <span
                      className={`absolute h-[2px] w-4 rounded-full bg-current transition ${
                        open ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                    <span
                      className={`absolute h-[2px] w-4 rounded-full bg-current transition ${
                        open ? '-rotate-45' : 'translate-y-[5px]'
                      }`}
                    />
                  </span>
                </button>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
                    FEMATA Administration
                  </p>
                  <h1 className="mt-1 text-xl font-semibold text-[rgb(var(--primary))] sm:text-2xl">
                    {title ?? 'Admin Console'}
                  </h1>
                </div>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <div className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-2 text-sm text-[rgb(var(--muted))]">
                  FEMATA Content Management
                </div>

                <button
                  type="button"
                  onClick={() => post('/logout')}
                  disabled={processing}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {processing ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          </header>

          {open ? (
            <div className="border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-4 xl:hidden">
              <div className="overflow-hidden rounded-[1.6rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
                <NavContent />
              </div>
            </div>
          ) : null}

          <main className="flex-1 bg-[rgb(var(--surface-3))] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[1500px]">
              <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="rounded-[1.5rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-5 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
                    Administrative Workspace
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                    Use this panel to manage public information, association visibility, documents, media, and official updates across the FEMATA website.
                  </p>
                </div>

                <div className="hidden lg:flex">
                  <div className="rounded-[1.35rem] border border-[rgb(var(--border))] bg-[linear-gradient(135deg,rgba(var(--primary),1),rgba(var(--accent),0.92))] px-5 py-4 text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                      Content Control
                    </p>
                    <p className="mt-1 text-sm text-white/90">
                      Secure internal area for managing FEMATA public communication.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.06)] sm:p-5 lg:p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
