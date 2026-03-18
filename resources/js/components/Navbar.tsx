import { useMemo, useState } from 'react';
import AppLink from '@/components/AppLink';
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
  const t = copy[locale];
  const pathname = typeof window !== 'undefined' ? getPreviewPath() : '/';

  const navItems = useMemo(
    () => [
      { label: t.nav.home, href: '/' },
      { label: t.nav.about, href: '/about' },
      { label: t.nav.leadership, href: '/leadership' },
      { label: t.nav.news, href: '/news' },
      { label: t.nav.gallery, href: '/gallery' },
      { label: t.nav.documents, href: '/documents' },
      { label: t.nav.contact, href: '/contact' },
    ],
    [t],
  );

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const logo = branding.logo_path ? (
    <img
      src={branding.logo_path}
      alt={branding.logo_alt ?? branding.site_name}
      className="h-full w-full rounded-full object-contain bg-white p-2"
    />
  ) : (
    <div className="relative flex h-full w-full items-center justify-center rounded-full border-[3px] border-[rgb(var(--accent))] bg-[linear-gradient(145deg,rgba(var(--primary),1),rgba(var(--primary-soft),0.94))] text-lg font-bold text-white shadow-[0_14px_34px_rgba(0,0,0,0.18)]">
      <span className="absolute inset-[5px] rounded-full border border-white/28" />
      <span className="relative">{branding.site_name.slice(0, 1)}</span>
    </div>
  );

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[linear-gradient(90deg,rgba(var(--primary),1),rgba(var(--primary-soft),0.96),rgba(var(--accent),0.82))] text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
        <div className="container-shell flex min-h-[44px] flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/92 sm:justify-between sm:text-xs">
          <p>{branding.top_bar_primary}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {branding.top_bar_secondary ? (
              <p className="hidden lg:block text-white/80">{branding.top_bar_secondary}</p>
            ) : null}
            <AppLink
              href={adminHref}
              className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/16"
            >
              {adminLabel}
            </AppLink>
          </div>
        </div>
      </div>

      <div
        className="border-b bg-[rgb(var(--surface))]/96 shadow-[0_18px_50px_rgba(7,21,18,0.08)] backdrop-blur-2xl"
        style={{ borderColor: 'rgba(var(--border),0.92)' }}
      >
        <div className="container-shell">
          <div className="flex items-center justify-between gap-4 py-4">
            <AppLink
              href="/"
              className="group flex min-w-0 flex-1 items-center gap-4 xl:max-w-[380px] xl:flex-none"
              onClick={() => {
                setOpen(false);
                setSettingsOpen(false);
              }}
            >
              <div className="h-16 w-16 shrink-0">{logo}</div>

              <div className="min-w-0">
                <p className="text-base font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))] sm:text-lg">
                  {branding.site_name}
                </p>
                <p className="max-w-[280px] text-xs leading-5 text-[rgb(var(--muted))] sm:text-sm">
                  {branding.organization_name}
                </p>
              </div>
            </AppLink>

            <div className="hidden items-center gap-3 xl:flex">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSettingsOpen((value) => !value)}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border bg-white/80 px-5 text-sm font-semibold text-[rgb(var(--primary))] shadow-sm transition hover:bg-white"
                  style={{ borderColor: 'rgba(var(--border),0.95)' }}
                >
                  {branding.settings_label}
                </button>

                {settingsOpen ? (
                  <div
                    className="absolute right-0 top-full z-20 mt-3 w-[320px] rounded-[1.5rem] border bg-[rgb(var(--surface))] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
                    style={{ borderColor: 'rgba(var(--border),0.95)' }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
                      Display preferences
                    </p>

                    <div className="mt-4 grid gap-3">
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-[rgb(var(--primary))]">{t.theme}</span>
                        <select
                          value={theme}
                          onChange={(event) => setTheme(event.target.value as ThemeMode)}
                          className="min-h-[46px] rounded-2xl border bg-white px-4 text-sm text-[rgb(var(--primary))]"
                          style={{ borderColor: 'rgba(var(--border),0.95)' }}
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
                          className="min-h-[46px] rounded-2xl border bg-white px-4 text-sm text-[rgb(var(--primary))]"
                          style={{ borderColor: 'rgba(var(--border),0.95)' }}
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
                className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[rgb(var(--accent))] px-5 text-sm font-semibold whitespace-nowrap text-[rgb(var(--accent-foreground,255_255_255))] shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_34px_rgba(0,0,0,0.16)]"
              >
                {branding.navigation_cta_label}
              </AppLink>
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen((previous) => !previous);
                setSettingsOpen(false);
              }}
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border bg-white/80 px-4 text-sm font-semibold text-[rgb(var(--primary))] shadow-sm transition hover:bg-white xl:hidden"
              style={{ borderColor: 'rgba(var(--border),0.95)' }}
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              <span className="mr-2">{open ? 'Close' : 'Menu'}</span>
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

          <div className="hidden pb-4 xl:block">
            <div
              className="overflow-hidden rounded-[1.5rem] border bg-[linear-gradient(180deg,rgba(var(--surface-2),0.92),rgba(var(--surface),0.98))] p-2 shadow-[0_14px_34px_rgba(0,0,0,0.05)]"
              style={{ borderColor: 'rgba(var(--border),0.92)' }}
            >
              <nav className="flex flex-wrap items-center justify-center gap-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <AppLink
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                        active
                          ? 'bg-[linear-gradient(135deg,rgba(var(--primary),1),rgba(var(--accent),0.94))] text-white shadow-[0_10px_24px_rgba(0,0,0,0.14)]'
                          : 'bg-white/75 text-[rgb(var(--primary))] shadow-[0_6px_18px_rgba(0,0,0,0.04)] hover:bg-white hover:text-[rgb(var(--primary))]'
                      }`}
                    >
                      {item.label}
                    </AppLink>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {open ? (
        <div
          className="border-b bg-[rgb(var(--surface))]/98 shadow-[0_18px_40px_rgba(0,0,0,0.08)] xl:hidden"
          style={{ borderColor: 'rgba(var(--border),0.95)' }}
        >
          <div className="container-shell py-4">
            <div className="overflow-hidden rounded-[1.6rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.86))] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <div className="mb-4 rounded-[1.2rem] bg-[linear-gradient(135deg,rgba(var(--primary),1),rgba(var(--accent),0.92))] px-4 py-4 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">
                  {branding.site_name}
                </p>
                <p className="mt-1 text-sm leading-6 text-white/90">
                  {branding.organization_name}
                </p>
              </div>

              <div className="grid gap-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <AppLink
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-[1rem] px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? 'bg-[linear-gradient(135deg,rgba(var(--primary),1),rgba(var(--accent),0.94))] text-white shadow-sm'
                          : 'text-[rgb(var(--primary))] hover:bg-[rgb(var(--surface-2))]'
                      }`}
                    >
                      {item.label}
                    </AppLink>
                  );
                })}
              </div>

              <AppLink
                href={branding.navigation_cta_href}
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-[rgb(var(--accent))] px-5 text-sm font-semibold text-[rgb(var(--accent-foreground,255_255_255))] shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition hover:translate-y-[-1px]"
              >
                {branding.navigation_cta_label}
              </AppLink>

              <div className="mt-5 rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
                  {branding.settings_label}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">{t.theme}</span>
                    <select
                      value={theme}
                      onChange={(event) => setTheme(event.target.value as ThemeMode)}
                      className="min-h-[46px] rounded-2xl border bg-white px-3 text-sm font-medium text-[rgb(var(--primary))]"
                      style={{ borderColor: 'rgba(var(--border),0.95)' }}
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
                      className="min-h-[46px] rounded-2xl border bg-white px-3 text-sm font-medium text-[rgb(var(--primary))]"
                      style={{ borderColor: 'rgba(var(--border),0.95)' }}
                    >
                      <option value="en">English</option>
                      <option value="sw">Swahili</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
