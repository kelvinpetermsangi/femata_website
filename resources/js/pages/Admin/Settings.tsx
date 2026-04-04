import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import type {
  AboutContent,
  ContactInfo,
  SharedPageProps,
  SiteBranding,
} from '@/types';

type HomeSettingsForm = {
  hero_image?: string | null;
  hero_panel_label: string;
  why_eyebrow: string;
  why_title: string;
  why_text: string;
  mandate_label: string;
  mandate_title: string;
  mandate_text: string;
  highlights_text: string;
  pillars_text: string;
  footprint_eyebrow: string;
  footprint_title: string;
  footprint_text: string;
  zones_text: string;
  news_eyebrow: string;
  news_title: string;
  news_text: string;
  leadership_eyebrow: string;
  leadership_title: string;
  leadership_text: string;
  media_eyebrow: string;
  media_title: string;
  media_text: string;
  documents_eyebrow: string;
  documents_title: string;
  documents_text: string;
  partnerships_eyebrow: string;
  partnerships_title: string;
  partnerships_text: string;
  partners_text: string;
  secondary_cta_label: string;
};

type FooterSettingsForm = {
  strapline: string;
  description: string;
  chips_text: string;
  prompt_text: string;
  credit_name?: string | null;
  credit_url?: string | null;
};

type SettingsForm = {
  branding: SiteBranding;
  home: HomeSettingsForm;
  about: AboutContent;
  contact: ContactInfo;
  footer: FooterSettingsForm;
};

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[rgb(var(--primary))]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[rgb(var(--muted))]">{hint}</span> : null}
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}

export default function AdminSettings({
  branding,
  home,
  about,
  contact,
  footer,
}: SettingsForm) {
  const { props } = usePage<SharedPageProps>();
  const { data, setData, put, processing, errors, recentlySuccessful } =
    useForm<SettingsForm>({
      branding,
      home,
      about,
      contact,
      footer,
    });
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const flashSuccess = props.flash?.success;
  const appVersion = props.appVersion ?? 'v0.3.0';
  const appReleaseDate = props.appReleaseDate ?? '2026-03-21';

  return (
    <>
      <Head title="Site settings" />

      <AdminLayout title="Site Settings">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            put('/admin/settings');
          }}
          className="grid gap-8"
        >
          <section className="grid gap-4 rounded-[1.5rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[rgb(var(--muted))]">
                System Release
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                  System version
                </p>
                <p className="mt-2 text-lg font-semibold text-[rgb(var(--primary))]">{appVersion}</p>
              </div>

              <div className="rounded-[1.2rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                  Release date
                </p>
                <p className="mt-2 text-lg font-semibold text-[rgb(var(--primary))]">{appReleaseDate}</p>
              </div>
            </div>

            <p className="text-sm text-[rgb(var(--muted))]">
              Values come from <code>APP_VERSION</code> and <code>APP_RELEASE_DATE</code> in the environment.
            </p>
          </section>

          {(flashSuccess || recentlySuccessful) ? (
            <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {flashSuccess ?? 'Site settings saved successfully.'}
            </div>
          ) : null}

          <section className="grid gap-4 rounded-[1.5rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/50 p-5">
            <div>
              <h2 className="text-xl font-semibold text-[rgb(var(--primary))]">Branding</h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Shared FEMATA organization name, public header text, official logo asset, and primary site call-to-action.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Short name" error={errors['branding.site_name']}>
                <input
                  value={data.branding.site_name}
                  onChange={(event) => setData('branding', { ...data.branding, site_name: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Organization name" error={errors['branding.organization_name']}>
                <input
                  value={data.branding.organization_name}
                  onChange={(event) =>
                    setData('branding', { ...data.branding, organization_name: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Top bar primary text" error={errors['branding.top_bar_primary']}>
                <input
                  value={data.branding.top_bar_primary}
                  onChange={(event) =>
                    setData('branding', { ...data.branding, top_bar_primary: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Top bar secondary text" error={errors['branding.top_bar_secondary']}>
                <input
                  value={data.branding.top_bar_secondary ?? ''}
                  onChange={(event) =>
                    setData('branding', { ...data.branding, top_bar_secondary: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field
                label="Logo path or URL"
                error={errors['branding.logo_path']}
                hint="Use /brand/femata-logo.png for the exported official logo, or another approved public PNG, JPG, or SVG asset."
              >
                <input
                  value={data.branding.logo_path ?? ''}
                  onChange={(event) =>
                    setData('branding', { ...data.branding, logo_path: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Logo alt text" error={errors['branding.logo_alt']}>
                <input
                  value={data.branding.logo_alt ?? ''}
                  onChange={(event) =>
                    setData('branding', { ...data.branding, logo_alt: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Settings label" error={errors['branding.settings_label']}>
                <input
                  value={data.branding.settings_label}
                  onChange={(event) =>
                    setData('branding', { ...data.branding, settings_label: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Primary CTA label" error={errors['branding.navigation_cta_label']}>
                <input
                  value={data.branding.navigation_cta_label}
                  onChange={(event) =>
                    setData('branding', { ...data.branding, navigation_cta_label: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Primary CTA link" error={errors['branding.navigation_cta_href']}>
                <input
                  value={data.branding.navigation_cta_href}
                  onChange={(event) =>
                    setData('branding', { ...data.branding, navigation_cta_href: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>
            </div>
          </section>

          <section className="grid gap-4 rounded-[1.5rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/50 p-5">
            <div>
              <h2 className="text-xl font-semibold text-[rgb(var(--primary))]">Homepage</h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Controls the hero, institutional blocks, zones, and partnership content on the homepage.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Hero image URL" error={errors['home.hero_image']}>
                <input
                  value={data.home.hero_image ?? ''}
                  onChange={(event) => setData('home', { ...data.home, hero_image: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Hero panel label" error={errors['home.hero_panel_label']}>
                <input
                  value={data.home.hero_panel_label}
                  onChange={(event) => setData('home', { ...data.home, hero_panel_label: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Why section eyebrow" error={errors['home.why_eyebrow']}>
                <input
                  value={data.home.why_eyebrow}
                  onChange={(event) => setData('home', { ...data.home, why_eyebrow: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Why section title" error={errors['home.why_title']}>
                <input
                  value={data.home.why_title}
                  onChange={(event) => setData('home', { ...data.home, why_title: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Why section body" error={errors['home.why_text']}>
                <textarea
                  value={data.home.why_text}
                  onChange={(event) => setData('home', { ...data.home, why_text: event.target.value })}
                  className="min-h-[120px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Mandate label" error={errors['home.mandate_label']}>
                <input
                  value={data.home.mandate_label}
                  onChange={(event) => setData('home', { ...data.home, mandate_label: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Mandate title" error={errors['home.mandate_title']}>
                <input
                  value={data.home.mandate_title}
                  onChange={(event) => setData('home', { ...data.home, mandate_title: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Mandate body" error={errors['home.mandate_text']}>
                <textarea
                  value={data.home.mandate_text}
                  onChange={(event) => setData('home', { ...data.home, mandate_text: event.target.value })}
                  className="min-h-[120px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field
                label="Highlights"
                error={errors['home.highlights_text']}
                hint="One per line: Label | Description"
              >
                <textarea
                  value={data.home.highlights_text}
                  onChange={(event) => setData('home', { ...data.home, highlights_text: event.target.value })}
                  className="min-h-[160px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field
                label="Strategic pillars"
                error={errors['home.pillars_text']}
                hint="One per line: Title | Description"
              >
                <textarea
                  value={data.home.pillars_text}
                  onChange={(event) => setData('home', { ...data.home, pillars_text: event.target.value })}
                  className="min-h-[160px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Footprint eyebrow" error={errors['home.footprint_eyebrow']}>
                <input
                  value={data.home.footprint_eyebrow}
                  onChange={(event) =>
                    setData('home', { ...data.home, footprint_eyebrow: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Footprint title" error={errors['home.footprint_title']}>
                <input
                  value={data.home.footprint_title}
                  onChange={(event) =>
                    setData('home', { ...data.home, footprint_title: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Footprint body" error={errors['home.footprint_text']}>
                <textarea
                  value={data.home.footprint_text}
                  onChange={(event) => setData('home', { ...data.home, footprint_text: event.target.value })}
                  className="min-h-[120px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field
                label="Zones"
                error={errors['home.zones_text']}
                hint="One per line: Zone name | Focus | Base"
              >
                <textarea
                  value={data.home.zones_text}
                  onChange={(event) => setData('home', { ...data.home, zones_text: event.target.value })}
                  className="min-h-[180px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="News eyebrow" error={errors['home.news_eyebrow']}>
                <input
                  value={data.home.news_eyebrow}
                  onChange={(event) => setData('home', { ...data.home, news_eyebrow: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="News title" error={errors['home.news_title']}>
                <input
                  value={data.home.news_title}
                  onChange={(event) => setData('home', { ...data.home, news_title: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="News body" error={errors['home.news_text']}>
                <textarea
                  value={data.home.news_text}
                  onChange={(event) => setData('home', { ...data.home, news_text: event.target.value })}
                  className="min-h-[120px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Leadership eyebrow" error={errors['home.leadership_eyebrow']}>
                <input
                  value={data.home.leadership_eyebrow}
                  onChange={(event) =>
                    setData('home', { ...data.home, leadership_eyebrow: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Leadership title" error={errors['home.leadership_title']}>
                <input
                  value={data.home.leadership_title}
                  onChange={(event) =>
                    setData('home', { ...data.home, leadership_title: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Leadership body" error={errors['home.leadership_text']}>
                <textarea
                  value={data.home.leadership_text}
                  onChange={(event) =>
                    setData('home', { ...data.home, leadership_text: event.target.value })
                  }
                  className="min-h-[120px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Media eyebrow" error={errors['home.media_eyebrow']}>
                <input
                  value={data.home.media_eyebrow}
                  onChange={(event) => setData('home', { ...data.home, media_eyebrow: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Media title" error={errors['home.media_title']}>
                <input
                  value={data.home.media_title}
                  onChange={(event) => setData('home', { ...data.home, media_title: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Media body" error={errors['home.media_text']}>
                <textarea
                  value={data.home.media_text}
                  onChange={(event) => setData('home', { ...data.home, media_text: event.target.value })}
                  className="min-h-[120px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Documents eyebrow" error={errors['home.documents_eyebrow']}>
                <input
                  value={data.home.documents_eyebrow}
                  onChange={(event) =>
                    setData('home', { ...data.home, documents_eyebrow: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Documents title" error={errors['home.documents_title']}>
                <input
                  value={data.home.documents_title}
                  onChange={(event) =>
                    setData('home', { ...data.home, documents_title: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Documents body" error={errors['home.documents_text']}>
                <textarea
                  value={data.home.documents_text}
                  onChange={(event) =>
                    setData('home', { ...data.home, documents_text: event.target.value })
                  }
                  className="min-h-[120px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Partnerships eyebrow" error={errors['home.partnerships_eyebrow']}>
                <input
                  value={data.home.partnerships_eyebrow}
                  onChange={(event) =>
                    setData('home', { ...data.home, partnerships_eyebrow: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Partnerships title" error={errors['home.partnerships_title']}>
                <input
                  value={data.home.partnerships_title}
                  onChange={(event) =>
                    setData('home', { ...data.home, partnerships_title: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Partnerships body" error={errors['home.partnerships_text']}>
                <textarea
                  value={data.home.partnerships_text}
                  onChange={(event) =>
                    setData('home', { ...data.home, partnerships_text: event.target.value })
                  }
                  className="min-h-[120px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field
                label="Partners"
                error={errors['home.partners_text']}
                hint="One partner name per line."
              >
                <textarea
                  value={data.home.partners_text}
                  onChange={(event) => setData('home', { ...data.home, partners_text: event.target.value })}
                  className="min-h-[160px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Secondary CTA label" error={errors['home.secondary_cta_label']}>
                <input
                  value={data.home.secondary_cta_label}
                  onChange={(event) =>
                    setData('home', { ...data.home, secondary_cta_label: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>
            </div>
          </section>

          <section className="grid gap-4 rounded-[1.5rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/50 p-5">
            <div>
              <h2 className="text-xl font-semibold text-[rgb(var(--primary))]">About and Contact</h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Core organization text, mission, vision, and public contact details.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="About title" error={errors['about.title']}>
                <input
                  value={data.about.title}
                  onChange={(event) => setData('about', { ...data.about, title: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Phone" error={errors['contact.phone']}>
                <input
                  value={data.contact.phone}
                  onChange={(event) => setData('contact', { ...data.contact, phone: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="About body" error={errors['about.body']}>
                <textarea
                  value={data.about.body}
                  onChange={(event) => setData('about', { ...data.about, body: event.target.value })}
                  className="min-h-[140px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Contact description" error={errors['contact.description']}>
                <textarea
                  value={data.contact.description}
                  onChange={(event) =>
                    setData('contact', { ...data.contact, description: event.target.value })
                  }
                  className="min-h-[140px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Mission" error={errors['about.mission']}>
                <textarea
                  value={data.about.mission}
                  onChange={(event) => setData('about', { ...data.about, mission: event.target.value })}
                  className="min-h-[110px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Email" error={errors['contact.email']}>
                <input
                  value={data.contact.email}
                  onChange={(event) => setData('contact', { ...data.contact, email: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Vision" error={errors['about.vision']}>
                <textarea
                  value={data.about.vision}
                  onChange={(event) => setData('about', { ...data.about, vision: event.target.value })}
                  className="min-h-[110px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Office address" error={errors['contact.address']}>
                <input
                  value={data.contact.address}
                  onChange={(event) => setData('contact', { ...data.contact, address: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Values" error={errors['about.values']}>
                <textarea
                  value={data.about.values}
                  onChange={(event) => setData('about', { ...data.about, values: event.target.value })}
                  className="min-h-[110px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Postal address" error={errors['contact.postal_address']}>
                <input
                  value={data.contact.postal_address ?? ''}
                  onChange={(event) =>
                    setData('contact', { ...data.contact, postal_address: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Booking email" error={errors['contact.booking_email']}>
                <input
                  value={data.contact.booking_email ?? ''}
                  onChange={(event) =>
                    setData('contact', { ...data.contact, booking_email: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Booking sender name" error={errors['contact.booking_sender_name']}>
                <input
                  value={data.contact.booking_sender_name ?? ''}
                  onChange={(event) =>
                    setData('contact', { ...data.contact, booking_sender_name: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Map embed URL" error={errors['contact.map_embed_url']}>
                <input
                  value={data.contact.map_embed_url ?? ''}
                  onChange={(event) =>
                    setData('contact', { ...data.contact, map_embed_url: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Google Maps URL" error={errors['contact.google_map_url']}>
                <input
                  value={data.contact.google_map_url ?? ''}
                  onChange={(event) =>
                    setData('contact', { ...data.contact, google_map_url: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Apple Maps URL" error={errors['contact.apple_map_url']}>
                <input
                  value={data.contact.apple_map_url ?? ''}
                  onChange={(event) =>
                    setData('contact', { ...data.contact, apple_map_url: event.target.value })
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>
            </div>
          </section>

          <section className="grid gap-4 rounded-[1.5rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/50 p-5">
            <div>
              <h2 className="text-xl font-semibold text-[rgb(var(--primary))]">Footer</h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Footer summary, chips, prompt band, and optional attribution.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Footer strapline" error={errors['footer.strapline']}>
                <input
                  value={data.footer.strapline}
                  onChange={(event) => setData('footer', { ...data.footer, strapline: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Prompt text" error={errors['footer.prompt_text']}>
                <textarea
                  value={data.footer.prompt_text}
                  onChange={(event) => setData('footer', { ...data.footer, prompt_text: event.target.value })}
                  className="min-h-[120px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Footer description" error={errors['footer.description']}>
                <textarea
                  value={data.footer.description}
                  onChange={(event) => setData('footer', { ...data.footer, description: event.target.value })}
                  className="min-h-[140px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field
                label="Footer chips"
                error={errors['footer.chips_text']}
                hint="One chip per line."
              >
                <textarea
                  value={data.footer.chips_text}
                  onChange={(event) => setData('footer', { ...data.footer, chips_text: event.target.value })}
                  className="min-h-[140px] rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Credit name" error={errors['footer.credit_name']}>
                <input
                  value={data.footer.credit_name ?? ''}
                  onChange={(event) => setData('footer', { ...data.footer, credit_name: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Credit URL" error={errors['footer.credit_url']}>
                <input
                  value={data.footer.credit_url ?? ''}
                  onChange={(event) => setData('footer', { ...data.footer, credit_url: event.target.value })}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>
            </div>
          </section>

          <section className="grid gap-4 rounded-[1.5rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/50 p-5">
            <div>
              <h2 className="text-xl font-semibold text-[rgb(var(--primary))]">Change Password</h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Update the current admin password from inside the settings area.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Current password" error={passwordForm.errors.current_password}>
                <input
                  type="password"
                  value={passwordForm.data.current_password}
                  onChange={(event) => passwordForm.setData('current_password', event.target.value)}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <div />

              <Field label="New password" error={passwordForm.errors.password}>
                <input
                  type="password"
                  value={passwordForm.data.password}
                  onChange={(event) => passwordForm.setData('password', event.target.value)}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>

              <Field
                label="Confirm new password"
                error={passwordForm.errors.password_confirmation}
              >
                <input
                  type="password"
                  value={passwordForm.data.password_confirmation}
                  onChange={(event) =>
                    passwordForm.setData('password_confirmation', event.target.value)
                  }
                  className="rounded-2xl border bg-white px-4 py-3 text-sm"
                />
              </Field>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  passwordForm.put('/admin/settings/password', {
                    preserveScroll: true,
                    onSuccess: () =>
                      passwordForm.reset('current_password', 'password', 'password_confirmation'),
                  })
                }
                disabled={passwordForm.processing}
                className="btn-secondary min-w-[220px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {passwordForm.processing ? 'Changing password...' : 'Change password'}
              </button>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="btn-primary min-w-[220px] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {processing ? 'Saving settings...' : 'Save site settings'}
            </button>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}
