import AppLink from '@/components/AppLink';
import { copy } from '@/lib/copy';
import type { ContactInfo, Locale, SiteBranding, SiteFooter } from '@/types';

interface FooterProps {
  locale: Locale;
  branding: SiteBranding;
  footer: SiteFooter;
  contact: ContactInfo;
  appVersion?: string;
  appReleaseDate?: string;
}

export default function Footer({
  locale,
  branding,
  footer,
  contact,
  appVersion,
  appReleaseDate,
}: FooterProps) {
  const t = copy[locale];
  const logo = branding.logo_path ? (
    <img
      src={branding.logo_path}
      alt={branding.logo_alt ?? branding.site_name}
      className="h-full w-full rounded-full object-contain bg-white p-2"
    />
  ) : (
    <div className="relative flex h-full w-full items-center justify-center rounded-full border-[3px] border-[rgb(var(--accent))] bg-white/10 text-lg font-bold text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
      <span className="absolute inset-[5px] rounded-full border border-white/25" />
      <span className="relative">{branding.site_name.slice(0, 1)}</span>
    </div>
  );

  return (
    <footer className="mt-16 bg-[linear-gradient(145deg,rgba(8,34,31,0.99),rgba(10,53,48,0.98),rgba(37,75,59,0.98))] text-white shadow-[0_-24px_70px_rgba(0,0,0,0.18)]">
      <div className="border-b border-white/10">
        <div className="container-shell py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_auto] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/58">
                {branding.organization_name}
              </p>
              <h2 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {footer.strapline}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-white/76 sm:text-base">
                {footer.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <AppLink href={branding.navigation_cta_href} className="btn-primary">
                {branding.navigation_cta_label}
              </AppLink>
              <AppLink
                href="/documents"
                className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                {t.nav.documents}
              </AppLink>
            </div>
          </div>
        </div>
      </div>

      <div className="container-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.85fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0">{logo}</div>

              <div>
                <h3 className="text-xl font-semibold tracking-[0.16em]">{branding.site_name}</h3>
                <p className="mt-1 text-sm text-white/68">{branding.organization_name}</p>
              </div>
            </div>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/74">
              {footer.prompt_text}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {footer.chips.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/72"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
              Navigation
            </h4>

            <div className="mt-5 grid gap-3 text-sm text-white/80">
              <AppLink href="/" className="transition hover:text-white">{t.nav.home}</AppLink>
              <AppLink href="/about" className="transition hover:text-white">{t.nav.about}</AppLink>
              <AppLink href="/leadership" className="transition hover:text-white">{t.nav.leadership}</AppLink>
              <AppLink href="/news" className="transition hover:text-white">{t.nav.news}</AppLink>
              <AppLink href="/gallery" className="transition hover:text-white">{t.nav.gallery}</AppLink>
              <AppLink href="/documents" className="transition hover:text-white">{t.nav.documents}</AppLink>
              <AppLink href="/contact" className="transition hover:text-white">{t.nav.contact}</AppLink>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
              Contact
            </h4>

            <div className="mt-5 space-y-4 text-sm text-white/80">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">Office</p>
                <p className="mt-1 leading-6">{contact.address}</p>
              </div>

              {contact.postal_address ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/50">Postal address</p>
                  <p className="mt-1">{contact.postal_address}</p>
                </div>
              ) : null}

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">Reach us</p>
                <div className="mt-1 space-y-1">
                  <p>{contact.phone}</p>
                  <p>{contact.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[1.4rem] border border-white/10 bg-white/5 px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-white/72">{footer.prompt_text}</p>

            <AppLink
              href={branding.navigation_cta_href}
              className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--accent))]/50 bg-[rgb(var(--accent))]/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[rgb(var(--accent))]/20"
            >
              {branding.navigation_cta_label}
            </AppLink>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-3 py-5 text-sm text-white/58 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p>&copy; {new Date().getFullYear()} {branding.site_name}. All rights reserved.</p>
            {appVersion ? (
              <p className="text-xs text-white/50">
                Version {appVersion}
                {appReleaseDate ? ` · Released ${appReleaseDate}` : ''}
              </p>
            ) : null}
          </div>

          {footer.credit_name ? (
            <p className="flex flex-wrap items-center gap-2">
              <span>Maintained by</span>
              {footer.credit_url ? (
                <a
                  href={footer.credit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white transition hover:text-[rgb(var(--accent))]"
                >
                  {footer.credit_name}
                </a>
              ) : (
                <span className="font-semibold text-white">{footer.credit_name}</span>
              )}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
