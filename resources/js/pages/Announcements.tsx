import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import type { Announcement } from '@/types';

export default function Announcements({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return (
    <>
      <Head title="Announcements" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell">
          <div className="container-shell">
            <h1 className="section-title">Latest Announcements</h1>
            <p className="section-copy">
              We highlight institutional guidance and updates for FEMATA members and stakeholders.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {announcements.length === 0 ? (
                <div className="card-shell p-6 text-sm text-[rgb(var(--muted))]">
                  No announcements available at the moment.
                </div>
              ) : (
                announcements.map((announcement) => (
                  <article key={announcement.id} className="card-shell p-6">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[rgb(var(--muted))]">
                      <span>Priority {announcement.priority}</span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                      {announcement.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))]">{announcement.body}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
