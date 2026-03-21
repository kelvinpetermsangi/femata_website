import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import PublicLayout from '@/layouts/PublicLayout';

export default function DocumentsIndex({
  documents,
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
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
