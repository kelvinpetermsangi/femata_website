import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import PublicLayout from '@/layouts/PublicLayout';

export default function DocumentShow({
  document,
  announcements,
}: {
  document: {
    title: string;
    description?: string | null;
    category?: string | null;
    file_path?: string | null;
    file_type?: string | null;
    preview?: 'pdf' | 'image' | null;
  };
  announcements?: [];
}) {
  return (
    <>
      <Head title={document.title} />

      <PublicLayout announcements={announcements}>
        <section className="section-shell">
          <div className="container-shell">
            <div className="glass-shell p-6 sm:p-10">
              <p className="eyebrow">{document.category ?? 'Document'}</p>
              <h1 className="mt-4 section-title">{document.title}</h1>
              <p className="section-copy">{document.description}</p>
            </div>
          </div>
        </section>

        {document.preview === 'pdf' && document.file_path ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <div className="card-shell overflow-hidden">
                <iframe
                  src={document.file_path}
                  className="h-[500px] w-full"
                  title={document.title}
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        ) : document.preview === 'image' && document.file_path ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <div className="card-shell p-0">
                <img
                  src={document.file_path}
                  alt={document.title}
                  className="h-[420px] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        ) : null}

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="card-shell p-6">
                <p className="text-sm text-[rgb(var(--muted))]">Document details</p>
                <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))]">
                  {document.description ??
                    'This document is maintained by FEMATA and made available for the public.'}
                </p>
              </div>
              <div className="card-shell flex flex-col gap-4 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-[rgb(var(--muted))]">Actions</p>
                <AppLink href="/documents" className="btn-secondary">
                  Back to documents
                </AppLink>
                {document.file_path ? (
                  <a
                    href={document.file_path}
                    className="btn-primary text-center"
                    target="_blank"
                    rel="noreferrer"
                    download
                  >
                    Download
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
