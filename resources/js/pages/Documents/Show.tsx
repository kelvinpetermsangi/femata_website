import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEvent } from 'react';
import AppLink from '@/components/AppLink';
import DocumentLibraryTile from '@/components/documents/DocumentLibraryTile';
import PublicLayout from '@/layouts/PublicLayout';
import type { DocumentComment, DocumentItem, SharedPageProps } from '@/types';

function formatCommentDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function DocumentDiscussion({
  document,
}: {
  document: DocumentItem;
}) {
  const { props } = usePage<SharedPageProps>();
  const form = useForm({
    name: '',
    email: '',
    comment: '',
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.post(`/documents/${document.slug}/comments`, {
      preserveScroll: true,
      onSuccess: () => form.reset(),
    });
  };

  const flashSuccess = props.flash?.success;
  const comments = document.comments ?? [];

  return (
    <section id="document-discussion" className="section-shell pt-0">
      <div className="container-shell grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
        <div className="ui-section-layer p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
            Document discussion
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">
            Public ideas and reactions for this publication
          </h2>
          <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">
            Readers can leave focused thoughts, implementation ideas, questions, or reactions tied specifically to this document.
          </p>

          <div className="mt-8 grid gap-4">
            {comments.length === 0 ? (
              <div className="rounded-[1.5rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] px-5 py-6 text-sm leading-7 text-[rgb(var(--muted))]">
                No public comments have been shared for this title yet. Be the first to contribute a practical thought or question.
              </div>
            ) : (
              comments.map((comment: DocumentComment) => (
                <article key={comment.id} className="rounded-[1.6rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[rgb(var(--primary))]">{comment.name}</p>
                      {comment.created_at ? (
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                          {formatCommentDate(comment.created_at)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">{comment.comment}</p>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="ui-shell h-fit p-5 sm:p-6 xl:sticky xl:top-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
            Share your ideas
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
            Add a document-specific comment
          </h3>
          <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
            Keep comments focused on the publication itself, including recommendations, questions, implementation reflections, or sector insight.
          </p>

          {flashSuccess ? (
            <div className="mt-5 rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {flashSuccess}
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[rgb(var(--primary))]">Name</span>
              <input
                value={form.data.name}
                onChange={(event) => form.setData('name', event.target.value)}
                className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
              />
              {form.errors.name ? <span className="text-xs font-medium text-red-600">{form.errors.name}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[rgb(var(--primary))]">Email</span>
              <input
                value={form.data.email}
                onChange={(event) => form.setData('email', event.target.value)}
                className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
              />
              {form.errors.email ? <span className="text-xs font-medium text-red-600">{form.errors.email}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[rgb(var(--primary))]">Comment</span>
              <textarea
                value={form.data.comment}
                onChange={(event) => form.setData('comment', event.target.value)}
                rows={6}
                className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]"
              />
              {form.errors.comment ? <span className="text-xs font-medium text-red-600">{form.errors.comment}</span> : null}
            </label>

            <button type="submit" disabled={form.processing} className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-70">
              {form.processing ? 'Posting comment...' : 'Post comment'}
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}

export default function DocumentShow({
  document,
  relatedDocuments = [],
  announcements,
}: {
  document: DocumentItem;
  relatedDocuments?: DocumentItem[];
  announcements?: [];
}) {
  const readHref = document.preview ? '#document-reader' : (document.file_path || document.read_url || '#');

  return (
    <>
      <Head title={document.title} />

      <PublicLayout announcements={announcements}>
        <section className="section-shell pb-6">
          <div className="container-shell grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="card-shell overflow-hidden">
              <div className="aspect-[4/5]" style={{ background: 'linear-gradient(160deg, rgba(var(--primary),0.12), rgba(var(--accent),0.16), rgba(var(--surface-2),0.96))' }}>
                {document.thumbnail_path ? (
                  <img src={document.thumbnail_path} alt={document.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full flex-col justify-between p-6 text-[rgb(var(--primary))]">
                    <span className="rounded-full border border-[rgb(var(--primary))]/18 bg-white/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                      {document.category || 'Publication'}
                    </span>
                    <div className="rounded-[1.5rem] border border-white/60 bg-white/78 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
                        {document.index_number || 'Library record'}
                      </p>
                      <h1 className="mt-3 text-2xl font-semibold leading-tight text-[rgb(var(--primary))]">
                        {document.title}
                      </h1>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6">
              <div>
                <p className="eyebrow">FEMATA Library Record</p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-5xl">
                  {document.title}
                </h1>
                <p className="mt-5 max-w-4xl text-sm leading-8 text-[rgb(var(--muted))] sm:text-base">
                  {document.description || 'A FEMATA publication made available through the public library.'}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="ui-soft-panel p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Index number</p>
                  <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{document.index_number || 'Library record'}</p>
                </div>
                <div className="ui-soft-panel p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Author</p>
                  <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{document.author || 'FEMATA Secretariat'}</p>
                </div>
                <div className="ui-soft-panel p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Publisher</p>
                  <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{document.publisher || 'Federation of Miners’ Associations of Tanzania'}</p>
                </div>
                <div className="ui-soft-panel p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Year</p>
                  <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{document.year || 'Not stated'}</p>
                </div>
                <div className="ui-soft-panel p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Category</p>
                  <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{document.category || 'Publication'}</p>
                </div>
                <div className="ui-soft-panel p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Discussion</p>
                  <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{document.comments_count ?? 0} public comments</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {document.preview ? (
                  <a href={readHref} className="btn-secondary">
                    Read online
                  </a>
                ) : document.file_path ? (
                  <a href={document.file_path} target="_blank" rel="noreferrer" className="btn-secondary">
                    Read online
                  </a>
                ) : null}
                {document.download_url ? (
                  <a href={document.download_url} target="_blank" rel="noreferrer" className="btn-primary">
                    Download
                  </a>
                ) : null}
                <a href="#document-discussion" className="btn-secondary">
                  Share your ideas
                </a>
                <AppLink href="/documents" className="btn-secondary">
                  Back to library
                </AppLink>
              </div>
            </div>
          </div>
        </section>

        {(document.preview || document.file_path) ? (
          <section id="document-reader" className="section-shell pt-0">
            <div className="container-shell">
              <div className="ui-section-layer p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
                  Read online
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">
                  Open the publication inside the FEMATA library
                </h2>

                <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.95)]">
                  {document.preview === 'pdf' && document.file_path ? (
                    <iframe src={document.file_path} className="h-[780px] w-full" title={document.title} loading="lazy" />
                  ) : document.preview === 'image' && document.file_path ? (
                    <img src={document.file_path} alt={document.title} className="h-auto w-full object-cover" loading="lazy" />
                  ) : document.file_path ? (
                    <div className="p-8">
                      <a href={document.file_path} target="_blank" rel="noreferrer" className="btn-primary">
                        Open the document in a new tab
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <DocumentDiscussion document={document} />

        {relatedDocuments.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <div className="ui-section-layer p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
                  Related titles
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">
                  Continue browsing the FEMATA library
                </h2>

                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {relatedDocuments.map((item) => (
                    <DocumentLibraryTile key={item.id} document={item} compact />
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </PublicLayout>
    </>
  );
}
