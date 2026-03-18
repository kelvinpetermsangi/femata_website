import { useState } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { defaultContactInfo } from '@/lib/siteDefaults';
import type { ContactInfo } from '@/types';

export default function Contact({
  contact = defaultContactInfo,
  announcements,
}: {
  contact: ContactInfo;
  announcements?: [];
}) {
  const [submitted, setSubmitted] = useState(false);

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
            <div className="grid gap-6 md:grid-cols-2">
              <div className="card-shell p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-[rgb(var(--muted))]">Headquarters</p>
                <h2 className="mt-2 text-xl font-semibold text-[rgb(var(--primary))]">{contact.address}</h2>
                {contact.postal_address ? (
                  <p className="mt-3 text-sm text-[rgb(var(--muted))]">Postal address: {contact.postal_address}</p>
                ) : null}
                <p className="mt-2 text-sm text-[rgb(var(--muted))]">Email: {contact.email}</p>
                <p className="text-sm text-[rgb(var(--muted))]">Phone: {contact.phone}</p>
              </div>
              <div className="card-shell p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-[rgb(var(--muted))]">Send a note</p>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                  className="mt-4 flex flex-col gap-3"
                >
                  <input
                    className="rounded-2xl border bg-[rgb(var(--surface))] px-4 py-3 text-sm"
                    style={{ borderColor: 'rgb(var(--border))' }}
                    placeholder="Name"
                    required
                  />
                  <input
                    className="rounded-2xl border bg-[rgb(var(--surface))] px-4 py-3 text-sm"
                    style={{ borderColor: 'rgb(var(--border))' }}
                    type="email"
                    placeholder="Email"
                    required
                  />
                  <textarea
                    className="rounded-2xl border bg-[rgb(var(--surface))] px-4 py-3 text-sm"
                    style={{ borderColor: 'rgb(var(--border))' }}
                    placeholder="Your message"
                    rows={4}
                    required
                  />
                  <button type="submit" className="btn-primary text-center">
                    Submit
                  </button>
                </form>
                {submitted ? (
                  <p className="mt-3 text-sm font-semibold text-[rgb(var(--primary))]">
                    Thanks for reaching out. We will respond shortly.
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
