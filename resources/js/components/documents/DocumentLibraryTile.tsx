import AppLink from '@/components/AppLink';
import type { DocumentItem } from '@/types';

function coverLabel(document: DocumentItem) {
  return document.category || document.file_type || 'Publication';
}

function coverImage(document: DocumentItem) {
  return document.thumbnail_path || (document.preview === 'image' ? document.file_path : null);
}

export default function DocumentLibraryTile({
  document,
  compact = false,
}: {
  document: DocumentItem;
  compact?: boolean;
}) {
  const readHref = document.read_url ?? `/documents/${document.slug}`;
  const shareHref = document.share_url ?? `${readHref}#document-discussion`;
  const image = coverImage(document);

  return (
    <article className="card-shell group flex h-full flex-col overflow-hidden border-[rgba(var(--border),0.92)] bg-[rgba(var(--surface),0.94)] shadow-[0_24px_50px_rgba(15,23,42,0.06)]">
      <div className={compact ? 'aspect-[4/5]' : 'aspect-[4/5]'} style={{ background: 'linear-gradient(160deg, rgba(var(--primary),0.12), rgba(var(--accent),0.14), rgba(var(--surface-2),0.94))' }}>
        {image ? (
          <img
            src={image}
            alt={document.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="relative flex h-full flex-col justify-between p-5 text-[rgb(var(--primary))]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full border border-[rgb(var(--primary))]/18 bg-white/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                {coverLabel(document)}
              </span>
              {document.year ? (
                <span className="rounded-full border border-[rgb(var(--primary))]/18 bg-white/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                  {document.year}
                </span>
              ) : null}
            </div>

            <div className="rounded-[1.5rem] border border-white/55 bg-white/75 p-5 shadow-[0_10px_26px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
                {document.index_number || 'Library record'}
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-tight text-[rgb(var(--primary))]">
                {document.title}
              </h3>
              {(document.author || document.publisher) ? (
                <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
                  {[document.author, document.publisher].filter(Boolean).join(' | ')}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {document.index_number ? (
            <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
              {document.index_number}
            </span>
          ) : null}
          {document.category ? (
            <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
              {document.category}
            </span>
          ) : null}
          {document.year ? (
            <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
              {document.year}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-xl font-semibold text-[rgb(var(--primary))] sm:text-[1.35rem]">
          {document.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
          {document.description || 'A FEMATA library record with public reading and download access.'}
        </p>

        <dl className="mt-5 grid gap-3 text-sm text-[rgb(var(--muted))]">
          <div className="flex items-start justify-between gap-4 border-b border-[rgba(var(--border),0.55)] pb-3">
            <dt className="font-semibold text-[rgb(var(--primary))]">Author</dt>
            <dd className="text-right">{document.author || 'FEMATA Secretariat'}</dd>
          </div>
          <div className="flex items-start justify-between gap-4 border-b border-[rgba(var(--border),0.55)] pb-3">
            <dt className="font-semibold text-[rgb(var(--primary))]">Publisher</dt>
            <dd className="text-right">{document.publisher || 'Federation of Miners’ Associations of Tanzania'}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="font-semibold text-[rgb(var(--primary))]">Discussion</dt>
            <dd className="text-right">{document.comments_count ?? 0} public comments</dd>
          </div>
        </dl>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <AppLink href={readHref} className="btn-secondary justify-center">
            Read online
          </AppLink>
          {document.download_url ? (
            <a
              href={document.download_url}
              className="btn-primary text-center"
              target="_blank"
              rel="noreferrer"
            >
              Download
            </a>
          ) : null}
        </div>

        <AppLink href={shareHref} className="mt-3 inline-flex items-center text-sm font-semibold text-[rgb(var(--primary))] transition hover:text-[rgb(var(--accent-2))]">
          Share your ideas
        </AppLink>
      </div>
    </article>
  );
}
