import { Head, useForm, usePage } from '@inertiajs/react';
import AdvertCarousel from '@/components/AdvertCarousel';
import { advertsForSlot } from '@/lib/adverts';
import PublicLayout from '@/layouts/PublicLayout';
import { defaultContactInfo } from '@/lib/siteDefaults';
import type { AdvertSlots, ContactInfo, SharedPageProps } from '@/types';

export default function Contact({
  contact = defaultContactInfo,
  adverts,
  announcements,
}: {
  contact: ContactInfo;
  adverts?: AdvertSlots;
  announcements?: [];
}) {
  const { props } = usePage<SharedPageProps>();
  const flashSuccess = props.flash?.success;
  const form = useForm({
    name: '',
    email: '',
    message: '',
  });

  return (
    <>
      <Head title="Contact" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell">
          <div className="container-shell">
            <div className="heritage-hero overflow-hidden rounded-[2rem] border border-[rgb(var(--border))] p-6 sm:p-10">
              <h1 className="section-title">Contact FEMATA</h1>
              <p className="section-copy">{contact.description}</p>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <AdvertCarousel adverts={advertsForSlot(adverts, 1)} slotNumber={1} />
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="card-shell p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-[rgb(var(--muted))]">Headquarters</p>
                <h2 className="mt-2 text-xl font-semibold text-[rgb(var(--primary))]">{contact.address}</h2>
                {contact.postal_address ? (
                  <p className="mt-3 text-sm text-[rgb(var(--muted))]">Postal address: {contact.postal_address}</p>
                ) : null}
                <p className="mt-2 text-sm text-[rgb(var(--muted))]">Email: {contact.email}</p>
                <p className="text-sm text-[rgb(var(--muted))]">Phone: {contact.phone}</p>
                <div className="ui-soft-panel mt-5 px-4 py-4 text-sm text-[rgb(var(--muted))]">
                  Use this channel for partnership requests, membership questions, media engagement,
                  advert placement enquiries, and other matters that need attention from the FEMATA secretariat.
                </div>
              </div>
              <div className="card-shell p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-[rgb(var(--muted))]">Send a note</p>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    form.post('/contact', {
                      preserveScroll: true,
                      onSuccess: () => form.reset(),
                    });
                  }}
                  className="mt-4 flex flex-col gap-3"
                >
                  <input
                    value={form.data.name}
                    onChange={(event) => form.setData('name', event.target.value)}
                    className="field-shell px-4 py-3 text-sm"
                    placeholder="Your full name or organization name"
                    autoComplete="name"
                    required
                  />
                  {form.errors.name ? (
                    <p className="text-sm text-red-600">{form.errors.name}</p>
                  ) : null}
                  <input
                    value={form.data.email}
                    onChange={(event) => form.setData('email', event.target.value)}
                    className="field-shell px-4 py-3 text-sm"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                  />
                  {form.errors.email ? (
                    <p className="text-sm text-red-600">{form.errors.email}</p>
                  ) : null}
                  <textarea
                    value={form.data.message}
                    onChange={(event) => form.setData('message', event.target.value)}
                    className="field-shell min-h-[132px] px-4 py-3 text-sm"
                    placeholder="Tell FEMATA what you need support with, the region concerned, and any useful background."
                    rows={4}
                    required
                  />
                  {form.errors.message ? (
                    <p className="text-sm text-red-600">{form.errors.message}</p>
                  ) : null}
                  <button type="submit" className="btn-primary text-center" disabled={form.processing}>
                    {form.processing ? 'Sending to FEMATA...' : 'Send message to FEMATA'}
                  </button>
                </form>
                {flashSuccess ? (
                  <p className="mt-3 text-sm font-semibold text-[rgb(var(--primary))]">
                    {flashSuccess}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
