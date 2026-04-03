import { useEffect, useMemo, useRef, useState } from 'react';
import AppLink from '@/components/AppLink';
import BrandMark from '@/components/BrandMark';
import { copy } from '@/lib/copy';
import { getPreviewPath } from '@/lib/previewRouting';
import type { Locale, SiteBranding, ThemeMode } from '@/types';

interface NavbarProps {
  theme: ThemeMode;
  setTheme: (value: ThemeMode) => void;
  locale: Locale;
  setLocale: (value: Locale) => void;
  branding: SiteBranding;
  adminHref: string;
  adminLabel: string;
}

function normalizePath(path?: string | null) {
  if (!path) return '';
  return path.replace(/\/+$/, '') || '/';
}

function IconSettings() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="m5.64 5.64 2.12 2.12" />
      <path d="m16.24 16.24 2.12 2.12" />
      <path d="m5.64 18.36 2.12-2.12" />
      <path d="m16.24 7.76 2.12-2.12" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function Navbar({
  theme,
  setTheme,
  locale,
  setLocale,
  branding,
  adminHref,
  adminLabel,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  const t = copy[locale];
  const pathname = typeof window !== 'undefined' ? getPreviewPath() : '/';
  const utilityLabel = locale === 'sw' ? 'Jukwaa la shirikisho' : 'National federation portal';
  const preferenceTitle = locale === 'sw' ? 'Mapendeleo ya matumizi' : 'Viewing preferences';
  const preferenceText =
    locale === 'sw'
      ? 'Badilisha mandhari na lugha ya tovuti kwa kivinjari hiki.'
      : 'Adjust the interface theme and language for this browser.';
  const menuLabel = locale === 'sw' ? 'Menyu' : 'Menu';
  const closeLabel = locale === 'sw' ? 'Funga' : 'Close';

  const reservedPaths = useMemo(() => {
    return new Set(
      [normalizePath(branding.navigation_cta_href), normalizePath(adminHref)].filter(Boolean),
    );
  }, [branding.navigation_cta_href, adminHref]);

  const navItems = useMemo(() => {
    const baseItems = [
      { label: t.nav.home, href: '/' },
      { label: t.nav.about, href: '/about' },
      { label: t.nav.leadership, href: '/leadership' },
      { label: t.nav.remas, href: '/associations' },
      { label: t.nav.news, href: '/news' },
      { label: t.nav.gallery, href: '/gallery' },
      { label: t.nav.documents, href: '/documents' },
      { label: t.nav.contact, href: '/contact' },
    ];

    return baseItems.filter((item) => !reservedPaths.has(normalizePath(item.href)));
  }, [t, reservedPaths]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSettingsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setSettingsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeAll = () => {
    setOpen(false);
    setSettingsOpen(false);
  };

  return (
    <header ref={rootRef} className="sticky top-0 z-50">
      <div className="hidden lg:block">
        <div className="container-shell pt-4">
          <div
            className="flex min-h-[62px] items-center justify-between gap-4 rounded-[1.7rem] border px-5 py-3 shadow-[0_18px_42px_rgba(7,21,18,0.07)] backdrop-blur-xl"
            style={{
              borderColor: 'rgba(var(--border),0.88)',
              background:
                'linear-gradient(180deg, rgba(var(--surface),0.88), rgba(var(--surface-2),0.74))',
            }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex shrink-0 items-center rounded-full border border-[rgb(var(--accent))]/20 bg-[rgb(var(--accent))]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent-2))]">
                {utilityLabel}
              </span>
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--fg))]">
                {branding.top_bar_primary}
              </p>
            </div>

            <div className="flex min-w-0 items-center gap-3">
              {branding.top_bar_secondary ? (
                <p className="hidden rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.74)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))] xl:block">
                  {branding.top_bar_secondary}
                </p>
              ) : null}

              <AppLink
                href={adminHref}
                className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(var(--surface),0.96),rgba(var(--surface-2),0.84))] px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
              >
                {adminLabel}
              </AppLink>
            </div>
          </div>
        </div>
      </div>

      <div
        className="backdrop-blur-2xl"
      >
        <div className="container-shell py-4">
          <div
            className="relative overflow-visible rounded-[2.15rem] border px-3 py-3 shadow-[0_26px_60px_rgba(7,21,18,0.08)]"
            style={{
              borderColor: 'rgba(var(--border),0.9)',
              background:
                'linear-gradient(180deg, rgba(var(--surface),0.92), rgba(var(--surface-2),0.74))',
            }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2.15rem] bg-[radial-gradient(circle_at_top_left,rgba(var(--primary),0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(var(--accent),0.14),transparent_24%)]" />

            <div className="relative flex items-center gap-3">
              <AppLink
                href="/"
                onClick={closeAll}
                className="group flex min-w-0 items-center gap-3 sm:gap-4 xl:w-[360px] xl:flex-none"
              >
                <div className="h-14 w-14 shrink-0 sm:h-16 sm:w-16">
                  <BrandMark
                    imageClassName="h-full w-full rounded-[1.2rem] object-contain bg-[rgb(var(--surface))] p-2.5 shadow-[0_18px_38px_rgba(0,0,0,0.12)]"
                    fallbackClassName="relative flex h-full w-full items-center justify-center rounded-[1.2rem] bg-[linear-gradient(145deg,rgba(var(--primary),1),rgba(var(--primary-soft),0.96),rgba(var(--accent),0.9))] text-xl font-bold text-white shadow-[0_18px_38px_rgba(0,0,0,0.16)]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--accent-2))] sm:text-xs">
                    National federation
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))] sm:text-base">
                    {branding.site_name}
                  </p>
                  <p className="truncate text-xs leading-5 text-[rgb(var(--muted))] sm:text-sm">
                    {branding.organization_name}
                  </p>
                </div>
              </AppLink>

              <div className="hidden flex-1 justify-center xl:flex">
                <nav className="flex items-center gap-1.5 rounded-full border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(var(--surface),0.8),rgba(var(--surface-2),0.68))] px-2 py-2 shadow-[0_14px_28px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.32)]">
                  {navItems.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <AppLink
                        key={item.href}
                        href={item.href}
                        className={`inline-flex min-h-[46px] items-center justify-center rounded-full px-4 text-sm font-semibold transition ${
                          active
                            ? 'border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(var(--surface),1),rgba(var(--surface-2),0.92))] text-[rgb(var(--primary))] shadow-[0_10px_22px_rgba(15,23,42,0.06)]'
                            : 'text-[rgb(var(--muted))] hover:bg-[rgba(var(--surface),0.92)] hover:text-[rgb(var(--primary))]'
                        }`}
                      >
                        {item.label}
                      </AppLink>
                    );
                  })}
                </nav>
              </div>

              <div className="ml-auto hidden items-center gap-2 xl:flex">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSettingsOpen((value) => !value)}
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(var(--surface),0.96),rgba(var(--surface-2),0.82))] px-4 text-sm font-semibold text-[rgb(var(--primary))] shadow-[0_12px_24px_rgba(15,23,42,0.05)] transition hover:bg-[rgb(var(--surface-2))]"
                    aria-expanded={settingsOpen}
                  >
                    <IconSettings />
                    <span>{branding.settings_label}</span>
                  </button>

                  {settingsOpen ? (
                    <div
                      className="absolute right-0 top-[calc(100%+14px)] z-30 w-[340px] overflow-hidden rounded-[1.6rem] border bg-[linear-gradient(180deg,rgba(var(--surface),0.98),rgba(var(--surface-2),0.88))] shadow-[0_28px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl"
                      style={{ borderColor: 'rgba(var(--border),0.95)' }}
                    >
                      <div className="border-b px-5 py-4" style={{ borderColor: 'rgba(var(--border),0.92)' }}>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                          {preferenceTitle}
                        </p>
                        <p className="mt-1 text-sm text-[rgb(var(--fg))]">
                          {preferenceText}
                        </p>
                      </div>

                      <div className="grid gap-4 p-5">
                        <label className="grid gap-2">
                          <span className="text-sm font-semibold text-[rgb(var(--primary))]">{t.theme}</span>
                          <select
                            value={theme}
                            onChange={(event) => setTheme(event.target.value as ThemeMode)}
                            className="min-h-[50px] rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] px-4 text-sm text-[rgb(var(--fg))] transition focus:border-[rgb(var(--accent))]"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="gray">Gray</option>
                          </select>
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-semibold text-[rgb(var(--primary))]">{t.language}</span>
                          <select
                            value={locale}
                            onChange={(event) => setLocale(event.target.value as Locale)}
                            className="min-h-[50px] rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] px-4 text-sm text-[rgb(var(--fg))] transition focus:border-[rgb(var(--accent))]"
                          >
                            <option value="en">English</option>
                            <option value="sw">Swahili</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  ) : null}
                </div>

                <AppLink
                  href={branding.navigation_cta_href}
                  className="btn-primary whitespace-nowrap px-5"
                >
                  {branding.navigation_cta_label}
                </AppLink>
              </div>

              <div className="ml-auto flex items-center gap-2 xl:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setSettingsOpen((previous) => !previous);
                    setOpen(false);
                  }}
                  className="inline-flex min-h-[46px] min-w-[46px] items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(var(--surface),0.96),rgba(var(--surface-2),0.82))] text-[rgb(var(--primary))] shadow-sm transition hover:bg-[rgb(var(--surface-2))]"
                  aria-expanded={settingsOpen}
                  aria-label="Toggle preferences"
                >
                  <IconSettings />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpen((previous) => !previous);
                    setSettingsOpen(false);
                  }}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(var(--surface),0.96),rgba(var(--surface-2),0.82))] px-4 text-sm font-semibold text-[rgb(var(--primary))] shadow-sm transition hover:bg-[rgb(var(--surface-2))]"
                  aria-expanded={open}
                  aria-label="Toggle menu"
                >
                  <span className="mr-2">{open ? closeLabel : menuLabel}</span>
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
              </div>

              {settingsOpen ? (
                <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-30 xl:hidden">
                  <div
                    className="overflow-hidden rounded-[1.6rem] border bg-[linear-gradient(180deg,rgba(var(--surface),0.98),rgba(var(--surface-2),0.88))] shadow-[0_24px_60px_rgba(0,0,0,0.14)] backdrop-blur-xl"
                    style={{ borderColor: 'rgba(var(--border),0.95)' }}
                  >
                    <div className="border-b px-5 py-4" style={{ borderColor: 'rgba(var(--border),0.92)' }}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                        {preferenceTitle}
                      </p>
                      <p className="mt-1 text-sm text-[rgb(var(--fg))]">
                        {preferenceText}
                      </p>
                    </div>

                    <div className="grid gap-4 p-5 sm:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-[rgb(var(--primary))]">{t.theme}</span>
                        <select
                          value={theme}
                          onChange={(event) => setTheme(event.target.value as ThemeMode)}
                          className="min-h-[50px] rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] px-4 text-sm text-[rgb(var(--fg))] transition focus:border-[rgb(var(--accent))]"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="gray">Gray</option>
                        </select>
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-[rgb(var(--primary))]">{t.language}</span>
                        <select
                          value={locale}
                          onChange={(event) => setLocale(event.target.value as Locale)}
                          className="min-h-[50px] rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] px-4 text-sm text-[rgb(var(--fg))] transition focus:border-[rgb(var(--accent))]"
                        >
                          <option value="en">English</option>
                          <option value="sw">Swahili</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {open ? (
        <div
          className="bg-[rgb(var(--surface))]/94 shadow-[0_20px_40px_rgba(0,0,0,0.07)] backdrop-blur-xl xl:hidden"
        >
          <div className="container-shell py-4">
            <div
              className="overflow-hidden rounded-[1.8rem] border bg-[linear-gradient(180deg,rgba(var(--surface),0.98),rgba(var(--surface-2),0.88))] shadow-[0_20px_48px_rgba(0,0,0,0.08)] backdrop-blur-xl"
              style={{ borderColor: 'rgba(var(--border),0.95)' }}
            >
              <div className="border-b px-5 py-5" style={{ borderColor: 'rgba(var(--border),0.92)' }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  {branding.site_name}
                </p>
                <p className="mt-1 text-sm leading-6 text-[rgb(var(--fg))]">
                  {branding.organization_name}
                </p>
              </div>

              <div className="grid gap-2 p-4">
                {navItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <AppLink
                      key={item.href}
                      href={item.href}
                      onClick={closeAll}
                      className={`flex min-h-[52px] items-center justify-between rounded-[1.1rem] px-4 text-sm font-semibold transition ${
                        active
                          ? 'bg-[rgb(var(--primary))]/[0.08] text-[rgb(var(--primary))]'
                          : 'text-[rgb(var(--fg))] hover:bg-[rgb(var(--surface-2))]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[rgb(var(--muted))]">
                        <IconChevronRight />
                      </span>
                    </AppLink>
                  );
                })}
              </div>

              <div
                className="grid gap-3 border-t px-4 py-4 sm:grid-cols-2"
                style={{ borderColor: 'rgba(var(--border),0.92)' }}
              >
                <AppLink
                  href={branding.navigation_cta_href}
                  onClick={closeAll}
                  className="btn-primary"
                >
                  {branding.navigation_cta_label}
                </AppLink>

                <AppLink
                  href={adminHref}
                  onClick={closeAll}
                  className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(var(--surface),0.96),rgba(var(--surface-2),0.82))] px-5 text-sm font-semibold text-[rgb(var(--primary))] transition hover:bg-[rgb(var(--surface-2))]"
                >
                  {adminLabel}
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
