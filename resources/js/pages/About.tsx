import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { defaultAboutContent } from '@/lib/siteDefaults';
import type { AboutContent } from '@/types';

export default function About({
  about = defaultAboutContent,
  announcements,
}: {
  about: AboutContent;
  announcements?: [];
}) {
  return (
    <>
      <Head title={about.title} />

      <PublicLayout announcements={announcements}>
        <section className="section-shell">
          <div className="container-shell">
            <div className="heritage-hero overflow-hidden rounded-[2rem] border border-[rgb(var(--border))] p-6 sm:p-10">
              <p className="eyebrow">About FEMATA</p>
              <h1 className="mt-4 section-title">{about.title}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-[rgb(var(--muted))] sm:text-base">
                {about.body}
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="grid gap-6 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6 md:grid-cols-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                  Mission
                </p>
                <p className="mt-3 text-base leading-7 text-[rgb(var(--primary))]">{about.mission}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                  Vision
                </p>
                <p className="mt-3 text-base leading-7 text-[rgb(var(--primary))]">{about.vision}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                  Values
                </p>
                <p className="mt-3 text-base leading-7 text-[rgb(var(--primary))]">{about.values}</p>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
