import { Head } from '@inertiajs/react';
import AdvertCarousel from '@/components/AdvertCarousel';
import AppLink from '@/components/AppLink';
import { advertsForSlot } from '@/lib/adverts';
import PublicLayout from '@/layouts/PublicLayout';
import type { AdvertSlots } from '@/types';

export default function DocumentsIndex({
  documents,
  adverts,
  announcements,
}: {
  documents: {
    id: number;
    title: string;
    slug: string;
    description?: string | null;
    category?: string | null;
    file_path?: string | null;
    download_url?: string | null;
  }[];
  adverts?: AdvertSlots;
  announcements?: [];
}) {
  return (
    <>
      <Head title="Documents" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell">
          <div className="container-shell">
            <div className="glass-shell p-6 sm:p-10">
              <h1 className="section-title">Documents & Publications</h1>
              <p className="section-copy">
                Downloadable reports, policies, and filings curated for stakeholders.
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
          <div className="container-shell">
            {documents.length === 0 ? (
              <div className="card-shell p-8 text-center sm:p-12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  Resource centre
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
                  FEMATA publications and official downloads will appear here
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
                  Reports, circulars, member guidance, strategic briefs, forms, and other official federation documents will be listed here as they are approved for public access.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {documents.map((document) => (
                  <article
                    key={document.id}
                    className="card-shell flex flex-col gap-3 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                        {document.category ?? 'Document'}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-[rgb(var(--primary))] sm:text-xl">
                        {document.title}
                      </h3>
                      {document.description ? (
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-[rgb(var(--muted))]">
                          {document.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <AppLink href={`/documents/${document.slug}`} className="btn-secondary">
                        View details
                      </AppLink>
                      {document.file_path ? (
                        <a
                          href={document.download_url ?? document.file_path}
                          download
                          className="btn-primary text-center"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Download
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
