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
      ? 'Dashibodi ya Sekretarieti'
      : 'Secretariat Dashboard'
    : locale === 'sw'
      ? 'Ingia Sekretarieti'
      : 'Secretariat Login';
  const t = copy[locale];
  const activeAnnouncements = announcements.slice(0, 4);
  const tickerLabel = locale === 'sw' ? 'Taarifa Muhimu' : 'Important Notices';
  const tickerAction = locale === 'sw' ? 'Tazama zote' : 'View all';

  return (
    <div className="relative isolate overflow-x-hidden bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.14),transparent_28%),radial-gradient(circle_at_top_left,rgba(var(--primary),0.12),transparent_32%),radial-gradient(circle_at_center_top,rgba(var(--primary-soft),0.10),transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-180px] -z-10 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-[rgb(var(--accent))]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(rgba(15,23,42,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.18)_1px,transparent_1px)] [background-size:40px_40px]" />

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
        <section className="relative z-20 pt-4">
          <div className="container-shell">
            <div className="glass-shell relative overflow-hidden px-5 py-5 sm:px-6 sm:py-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(var(--primary),0.08),transparent_26%),radial-gradient(circle_at_right,rgba(var(--accent),0.12),transparent_30%)]" />

              <div className="relative grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_auto] xl:items-center">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--accent-2))]">
                    {tickerLabel}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                    {locale === 'sw'
                      ? 'Matangazo ya hivi karibuni na taarifa rasmi kutoka FEMATA.'
                      : 'Latest notices and official communications from FEMATA.'}
                  </p>
                </div>

                <div
                  className="relative min-w-0 overflow-hidden rounded-[1.4rem] border px-3 py-3"
                  style={{
                    borderColor: 'rgba(var(--border),0.92)',
                    background: 'linear-gradient(180deg, rgba(var(--surface),0.96), rgba(var(--surface-2),0.88))',
                  }}
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-[linear-gradient(to_right,rgba(var(--surface),0.98),transparent)]" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-[linear-gradient(to_left,rgba(var(--surface),0.98),transparent)]" />

                  <div className="flex animate-[marquee_24s_linear_infinite] gap-3 whitespace-nowrap pr-4">
                    {[...activeAnnouncements, ...activeAnnouncements].map(
                      (announcement, index) => (
                        <AppLink
                          key={`${announcement.id}-${index}`}
                          href="/announcements"
                          className="ui-chip inline-flex items-center gap-3 px-4 py-2 text-sm font-medium text-[rgb(var(--primary))] transition hover:border-[rgb(var(--accent))]/35 hover:-translate-y-[1px]"
                          style={{ borderColor: 'rgba(var(--border),0.88)' }}
                        >
                          <span className="flex h-2.5 w-2.5 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_0_6px_rgba(var(--accent),0.12)]" />
                          <span>{announcement.title}</span>
                        </AppLink>
                      ),
                    )}
                  </div>
                </div>

                <AppLink
                  href="/announcements"
                  className="btn-primary shrink-0 px-5"
                >
                  {tickerAction || t.viewAll}
                </AppLink>
              </div>
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
