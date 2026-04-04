import AppLink from '@/components/AppLink';
import type { DocumentItem } from '@/types';

function coverLabel(document: DocumentItem) {
  return document.category || document.file_type || 'Publication';
}

function coverImage(document: DocumentItem) {
  return document.thumbnail_path || (document.preview === 'image' ? document.file_path : null);
}

function summarize(document: DocumentItem, compact: boolean) {
  const source = document.description?.trim();
  const limit = compact ? 105 : 148;

  if (!source) {
    return 'A FEMATA library record with public reading and download access.';
  }

  return source.length > limit ? `${source.slice(0, limit).trim()}...` : source;
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
  const description = summarize(document, compact);

  return (
    <article className="card-shell group flex h-full flex-col overflow-hidden border-[rgba(var(--border),0.92)] bg-[rgba(var(--surface),0.94)] shadow-[0_20px_42px_rgba(15,23,42,0.06)]">
      <div className="aspect-[16/10] sm:aspect-[4/5]" style={{ background: 'linear-gradient(160deg, rgba(var(--primary),0.12), rgba(var(--accent),0.14), rgba(var(--surface-2),0.94))' }}>
        {image ? (
          <img
            src={image}
            alt={document.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="relative flex h-full flex-col justify-between p-4 sm:p-5 text-[rgb(var(--primary))]">
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

            <div className="rounded-[1.35rem] border border-white/55 bg-white/75 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
                {document.index_number || 'Library record'}
              </p>
              <h3 className="mt-2 text-lg font-semibold leading-tight text-[rgb(var(--primary))] sm:text-xl">
                {document.title}
              </h3>
              {(document.author || document.publisher) ? (
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                  {[document.author, document.publisher].filter(Boolean).join(' | ')}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
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

        <h3 className="mt-3 text-lg font-semibold text-[rgb(var(--primary))] sm:text-[1.2rem]">
          {document.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
          {description}
        </p>

        <dl className="mt-4 grid gap-2.5 text-sm text-[rgb(var(--muted))]">
          <div className="rounded-[1rem] border border-[rgba(var(--border),0.55)] bg-[rgba(var(--surface-2),0.55)] px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Author</dt>
            <dd className="mt-1 font-medium text-[rgb(var(--primary))]">{document.author || 'FEMATA Secretariat'}</dd>
          </div>
          <div className="rounded-[1rem] border border-[rgba(var(--border),0.55)] bg-[rgba(var(--surface-2),0.55)] px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Publisher</dt>
            <dd className="mt-1 font-medium text-[rgb(var(--primary))]">{document.publisher || "Federation of Miners' Associations of Tanzania"}</dd>
          </div>
          <div className="rounded-[1rem] border border-[rgba(var(--border),0.55)] bg-[rgba(var(--surface-2),0.55)] px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Discussion</dt>
            <dd className="mt-1 font-medium text-[rgb(var(--primary))]">{document.comments_count ?? 0} public comments</dd>
          </div>
        </dl>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
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
