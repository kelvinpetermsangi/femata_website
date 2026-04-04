import { useForm, usePage } from '@inertiajs/react';
import { useMemo, useState, type ReactNode } from 'react';
import AppLink from '@/components/AppLink';
import BrandMark from '@/components/BrandMark';
import { getPreviewPath } from '@/lib/previewRouting';
import type { SharedPageProps } from '@/types';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

type NavItem = {
  label: string;
  href: string;
  note: string;
  badge: string;
  section?: string;
  superAdminOnly?: boolean;
};

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { post, processing } = useForm();
  const { props } = usePage<SharedPageProps>();
  const [open, setOpen] = useState(false);
  const pathname = typeof window !== 'undefined' ? getPreviewPath() : '/admin/dashboard';
  const adminSections = props.auth?.user?.admin_sections ?? [];
  const isSuperAdmin = props.auth?.user?.roles?.includes('super-admin') ?? false;

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        label: 'Dashboard',
        href: '/admin/dashboard',
        note: 'Overview, publishing health, and quick access',
        badge: 'DB',
      },
      {
        label: 'Announcements',
        href: '/admin/announcements',
        note: 'Official notices and priority public messages',
        badge: 'AN',
        section: 'announcements',
      },
      {
        label: 'News',
        href: '/admin/news',
        note: 'Editorial stories, updates, and publishing queue',
        badge: 'NW',
        section: 'newswire',
      },
      {
        label: 'Videos',
        href: '/admin/videos',
        note: 'YouTube highlights, clips, and featured media',
        badge: 'VD',
        section: 'online-tv',
      },
      {
        label: 'Pages',
        href: '/admin/pages',
        note: 'Static page content and supporting information',
        badge: 'PG',
        section: 'pages',
      },
      {
        label: 'Press Briefings',
        href: '/admin/press-briefings',
        note: 'Statements, briefings, and press-facing releases',
        badge: 'PB',
        section: 'press-briefings',
      },
      {
        label: 'Leaders',
        href: '/admin/leaders',
        note: 'Profiles, roles, and leadership presentation',
        badge: 'LD',
        section: 'leadership',
      },
      {
        label: 'Associations',
        href: '/admin/associations',
        note: 'Member associations, directories, and public profile builder',
        badge: 'AS',
        section: 'associations',
      },
      {
        label: 'Association Types',
        href: '/admin/association-types',
        note: 'Pre-register directory categories such as regional associations and sector networks',
        badge: 'AT',
        section: 'association-types',
      },
      {
        label: 'Programs',
        href: '/admin/programs',
        note: 'Flagship projects, annual exhibitions, and program mini-sites',
        badge: 'PR',
        section: 'programs',
      },
      {
        label: 'Adverts',
        href: '/admin/adverts',
        note: 'Image and video campaigns by slot, page, region, and association',
        badge: 'AD',
        section: 'adverts',
      },
      {
        label: 'Gallery',
        href: '/admin/gallery',
        note: 'Images, highlights, and featured visual content',
        badge: 'GL',
        section: 'media',
      },
      {
        label: 'Documents',
        href: '/admin/documents',
        note: 'Resource library, downloads, and public files',
        badge: 'DC',
        section: 'library',
      },
      {
        label: 'Meetings',
        href: '/admin/meetings',
        note: 'Meeting bookings, secretariat approvals, and response updates',
        badge: 'MT',
        section: 'meetings',
      },
      {
        label: 'Settings',
        href: '/admin/settings',
        note: 'Branding, homepage content, and site preferences',
        badge: 'ST',
        section: 'settings',
      },
      {
        label: 'Administrators',
        href: '/admin/administrators',
        note: 'Create scoped admins for national modules and association workspaces',
        badge: 'AU',
        superAdminOnly: true,
      },
    ],
    [],
  );

  const visibleNavItems = useMemo(
    () =>
      navItems.filter((item) => {
        if (item.superAdminOnly) {
          return isSuperAdmin;
        }

        if (!item.section) {
          return true;
        }

        return isSuperAdmin || adminSections.includes(item.section);
      }),
    [adminSections, isSuperAdmin, navItems],
  );

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard' || pathname === '/admin';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const NavContent = () => (
    <>
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(160deg,#ffffff,rgba(239,246,255,0.92),rgba(236,253,245,0.92))] p-6 shadow-[0_20px_48px_rgba(15,23,42,0.08)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(15,23,42,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.25)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="pointer-events-none absolute -right-10 top-8 h-36 w-36 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative flex items-start gap-4">
          <div className="h-14 w-14">
            <BrandMark
              imageClassName="h-full w-full rounded-[1.25rem] border border-white/60 bg-white object-contain p-2.5 shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
              fallbackClassName="flex h-full w-full items-center justify-center rounded-[1.25rem] border border-slate-200 bg-slate-950 text-sm font-semibold tracking-[0.2em] text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              FEMATA Secretariat
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Publishing & Profile Console</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Manage FEMATA notices, leadership, association mini-sites, adverts,
              documents, videos, and site presentation from one secretariat workspace.
            </p>
          </div>
        </div>

        <div className="relative mt-5 overflow-hidden rounded-[1.55rem] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_18px_34px_rgba(15,23,42,0.18)]">
          <div className="absolute inset-0 opacity-70">
            <img
              src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=900&q=80"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.88),rgba(15,23,42,0.76),rgba(6,78,59,0.66))]" />
          </div>

          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Secretariat workspace
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Clearer navigation for FEMATA publishing, profile management, and brand control.
            </p>
          </div>
        </div>

        <div className="relative mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[1.35rem] border border-slate-200 bg-white/94 px-4 py-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Platform
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">FEMATA website content backend</p>
          </div>

          <div className="rounded-[1.35rem] border border-slate-200 bg-white/94 px-4 py-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Focus
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">National site and association profiles</p>
          </div>
        </div>
      </div>

      <div className="mt-6 px-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Navigation
        </p>
      </div>

      <nav className="mt-3 flex flex-1 flex-col gap-2">
        {visibleNavItems.map((item) => {
          const active = isActive(item.href);

          return (
            <AppLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`group rounded-[1.35rem] border px-4 py-3 transition ${
                active
                  ? 'border-slate-900 bg-slate-900 text-white shadow-[0_16px_28px_rgba(15,23,42,0.18)]'
                  : 'border-transparent bg-transparent text-slate-700 hover:border-slate-200 hover:bg-white hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.95rem] text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                    active
                      ? 'bg-white/10 text-white'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white'
                  }`}
                >
                  {item.badge}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p
                    className={`mt-1 text-xs leading-5 ${
                      active ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-600'
                    }`}
                  >
                    {item.note}
                  </p>
                </div>
              </div>
            </AppLink>
          );
        })}
      </nav>

      <div className="mt-6 rounded-[1.35rem] border border-slate-200 bg-white p-3 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
        <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Session
        </p>

        <button
          type="button"
          onClick={() => post('/logout')}
          disabled={processing}
          className="btn-secondary mt-3 w-full rounded-[1rem] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {processing ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f9fb,#eef3f7)] text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(2,132,199,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0))]" />

      <div className="flex min-h-screen">
        <aside className="hidden w-[352px] shrink-0 border-r border-slate-200/90 bg-white/88 px-5 py-5 backdrop-blur xl:flex xl:flex-col">
          <NavContent />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
            <div className="flex min-h-[88px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen((prev) => !prev)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 xl:hidden"
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    FEMATA Secretariat
                  </p>
                  <h1 className="mt-1 text-xl font-semibold text-slate-950 sm:text-2xl">
                    {title ?? 'FEMATA Admin Console'}
                  </h1>
                </div>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                  FEMATA content backend
                </div>

                <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
                  Association profile CMS
                </div>

                <button
                  type="button"
                  onClick={() => post('/logout')}
                  disabled={processing}
                  className="btn-secondary min-h-[46px] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {processing ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          </header>

          {open ? (
            <div className="border-b border-slate-200 bg-white px-4 py-4 xl:hidden">
              <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-4 shadow-[0_22px_42px_rgba(15,23,42,0.08)]">
                <NavContent />
              </div>
            </div>
          ) : null}

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[1540px]">
              <div className="mb-5 rounded-[1.6rem] border border-slate-200 bg-white px-5 py-4 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Administrative workspace
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Work across the modules and association builders assigned to your account.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      Laravel
                    </span>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                      Inertia
                    </span>
                    {(props.auth?.user?.managed_associations ?? []).length > 0 ? (
                      <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
                        {(props.auth?.user?.managed_associations ?? []).length} associations
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white/92 p-4 shadow-[0_22px_52px_rgba(15,23,42,0.07)] backdrop-blur sm:p-5 lg:p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
