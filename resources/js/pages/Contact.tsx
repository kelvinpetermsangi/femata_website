import { Head, usePage } from '@inertiajs/react';
import AdvertCarousel from '@/components/AdvertCarousel';
import MeetingRequestWizard from '@/components/contact/MeetingRequestWizard';
import { advertsForSlot } from '@/lib/adverts';
import { defaultContactInfo } from '@/lib/siteDefaults';
import PublicLayout from '@/layouts/PublicLayout';
import type {
  AdvertSlots,
  ContactInfo,
  MeetingLeaderOption,
  SharedPageProps,
} from '@/types';

function mapUrls(contact: ContactInfo) {
  const query = encodeURIComponent(contact.address || contact.postal_address || 'Dar es Salaam Tanzania');

  return {
    embed: contact.map_embed_url || `https://www.google.com/maps?q=${query}&output=embed`,
    google: contact.google_map_url || `https://maps.google.com/?q=${query}`,
    apple: contact.apple_map_url || `http://maps.apple.com/?q=${query}`,
  };
}

export default function Contact({
  contact = defaultContactInfo,
  leaders = [],
  meetingOptions,
  adverts,
  announcements,
}: {
  contact: ContactInfo;
  leaders: MeetingLeaderOption[];
  meetingOptions: {
    modes: Record<string, string>;
    slots: string[];
  };
  adverts?: AdvertSlots;
  announcements?: [];
}) {
  const { props } = usePage<SharedPageProps>();
  const maps = mapUrls(contact);
  const flashSuccess = props.flash?.success;

  return (
    <>
      <Head title="Contact" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell pb-2">
          <div className="container-shell">
            <div className="max-w-4xl">
              <p className="eyebrow">FEMATA Secretariat</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-4xl">
                Contact FEMATA and book meetings through a guided secretariat workflow
              </h1>
              <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))] sm:text-base">
                {contact.description}
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <AdvertCarousel adverts={advertsForSlot(adverts, 1)} slotNumber={1} />
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_360px]">
            <MeetingRequestWizard
              action="/contact"
              contact={contact}
              leaders={leaders}
              meetingOptions={meetingOptions}
              scopeLabel="FEMATA"
              scopeNote="Use the wizard to send a general inquiry or request a meeting with the leadership and secretariat contacts published on the national site."
              flashSuccess={flashSuccess}
              submitLabel="Send to FEMATA"
            />

            <div className="grid gap-4">
              <div className="ui-soft-panel p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  Secretariat office
                </p>
                <div className="mt-4 grid gap-4 text-sm text-[rgb(var(--muted))]">
                  <div>
                    <p className="font-semibold text-[rgb(var(--primary))]">Address</p>
                    <p className="mt-1 leading-7">{contact.address}</p>
                  </div>
                  {contact.postal_address ? (
                    <div>
                      <p className="font-semibold text-[rgb(var(--primary))]">Postal address</p>
                      <p className="mt-1 leading-7">{contact.postal_address}</p>
                    </div>
                  ) : null}
                  <div>
                    <p className="font-semibold text-[rgb(var(--primary))]">Email</p>
                    <a href={`mailto:${contact.email}`} className="mt-1 block leading-7 text-[rgb(var(--primary))]">
                      {contact.email}
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold text-[rgb(var(--primary))]">Phone</p>
                    <a href={`tel:${contact.phone}`} className="mt-1 block leading-7 text-[rgb(var(--primary))]">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="ui-soft-panel overflow-hidden p-0">
                <div className="border-b border-[rgb(var(--border))] px-4 py-4 sm:px-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Directions
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[rgb(var(--primary))]">
                    Find the FEMATA office
                  </h2>
                </div>

                <div className="aspect-[4/3] border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
                  <iframe
                    src={maps.embed}
                    title="FEMATA office map"
                    loading="lazy"
                    className="h-full w-full border-0"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="grid gap-3 px-4 py-4 sm:px-5">
                  <a href={maps.google} target="_blank" rel="noreferrer" className="btn-primary justify-center">
                    Open in Google Maps
                  </a>
                  <a href={maps.apple} target="_blank" rel="noreferrer" className="btn-secondary justify-center">
                    Open in Apple Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
