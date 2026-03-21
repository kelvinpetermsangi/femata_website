import type { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useSitePreferences } from '@/hooks/useSitePreferences';
import { copy } from '@/lib/copy';
import {
  defaultContactInfo,
  defaultSiteBranding,
  defaultSiteFooter,
} from '@/lib/siteDefaults';
import type { Announcement, SharedPageProps } from '@/types';

interface PublicLayoutProps {
  children: ReactNode;
  announcements?: Announcement[];
}

export default function PublicLayout({
  children,
  announcements = [],
}: PublicLayoutProps) {
  const { theme, setTheme, locale, setLocale } = useSitePreferences();
  const { props } = usePage<SharedPageProps>();
  const branding = props.siteBranding ?? defaultSiteBranding;
  const footer = props.siteFooter ?? defaultSiteFooter;
  const contact = props.siteContact ?? defaultContactInfo;
  const appVersion = props.appVersion;
  const appReleaseDate = props.appReleaseDate;
  const adminHref = props.auth?.user?.is_admin ? '/admin/dashboard' : '/admin/login';
  const adminLabel = props.auth?.user?.is_admin
    ? locale === 'sw'
      ? 'Dashibodi ya Admin'
      : 'Admin Dashboard'
    : locale === 'sw'
      ? 'Ingia Admin'
      : 'Admin Login';
  const t = copy[locale];
  const activeAnnouncements = announcements.slice(0, 4);
  const tickerLabel = locale === 'sw' ? 'Taarifa Muhimu' : 'Important Notices';
  const tickerAction = locale === 'sw' ? 'Tazama zote' : 'View all';

  return (
    <div className="relative overflow-x-hidden bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.10),transparent_34%),radial-gradient(circle_at_top_left,rgba(var(--primary),0.10),transparent_30%)]" />

      <Navbar
        theme={theme}
        setTheme={setTheme}
        locale={locale}
        setLocale={setLocale}
        branding={branding}
        adminHref={adminHref}
        adminLabel={adminLabel}
      />

      {activeAnnouncements.length > 0 ? (
        <section
          className="relative z-20 border-b bg-[rgb(var(--surface))]/96 backdrop-blur-xl"
          style={{ borderColor: 'rgba(var(--border),0.92)' }}
        >
          <div className="container-shell py-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-center gap-3 xl:flex-1">
                <div className="shrink-0 rounded-full border border-[rgb(var(--accent))]/20 bg-[rgb(var(--accent))]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--primary))] shadow-sm">
                  {tickerLabel}
                </div>

                <div
                  className="relative min-w-0 flex-1 overflow-hidden rounded-full border px-2 py-1"
                  style={{
                    borderColor: 'rgba(var(--border),0.92)',
                    background: 'rgba(var(--surface-2), 0.94)',
                  }}
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-[linear-gradient(to_right,rgba(var(--surface-2),0.98),transparent)]" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-[linear-gradient(to_left,rgba(var(--surface-2),0.98),transparent)]" />

                  <div className="flex animate-[marquee_24s_linear_infinite] gap-3 whitespace-nowrap pr-4">
                    {[...activeAnnouncements, ...activeAnnouncements].map(
                      (announcement, index) => (
                        <AppLink
                          key={`${announcement.id}-${index}`}
                          href="/announcements"
                          className="inline-flex items-center gap-3 rounded-full border bg-[rgb(var(--surface))] px-4 py-2 text-sm font-medium text-[rgb(var(--primary))] shadow-[0_6px_16px_rgba(0,0,0,0.05)] transition hover:border-[rgb(var(--accent))]/35 hover:bg-white hover:text-[rgb(var(--primary))]"
                          style={{ borderColor: 'rgba(var(--border),0.88)' }}
                        >
                          <span className="flex h-2 w-2 rounded-full bg-[rgb(var(--accent))]" />
                          <span>{announcement.title}</span>
                        </AppLink>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <AppLink
                href="/announcements"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-[rgb(var(--primary))] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.10)] transition hover:translate-y-[-1px] hover:bg-[rgb(var(--accent))]"
              >
                {tickerAction || t.viewAll}
              </AppLink>
            </div>
          </div>
        </section>
      ) : null}

      <main className="relative z-10 min-h-[40vh]">{children}</main>

      <Footer
        locale={locale}
        branding={branding}
        footer={footer}
        contact={contact}
        appVersion={appVersion}
        appReleaseDate={appReleaseDate}
      />
    </div>
  );
}
