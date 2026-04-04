import { useEffect, useRef, useState } from 'react';
import AppLink from '@/components/AppLink';
import type { DocumentItem } from '@/types';

type CardView = 'front' | 'info' | 'read';

function coverLabel(document: DocumentItem) {
  return document.category || document.file_type || 'Publication';
}

function coverImage(document: DocumentItem) {
  return document.thumbnail_path || (document.preview === 'image' ? document.file_path : null);
}

function summarize(document: DocumentItem, compact: boolean) {
  const source = document.description?.trim();
  const limit = compact ? 150 : 210;

  if (!source) {
    return 'This FEMATA library record is available for reading, download, and public discussion.';
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
  const [view, setView] = useState<CardView>('front');
  const [height, setHeight] = useState(compact ? 340 : 390);
  const frontRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const readRef = useRef<HTMLDivElement | null>(null);

  const image = coverImage(document);
  const readHref = document.read_url ?? `/documents/${document.slug}`;
  const shareHref = document.share_url ?? `${readHref}#document-discussion`;
  const description = summarize(document, compact);

  useEffect(() => {
    const measure = () => {
      const node =
        view === 'front'
          ? frontRef.current
          : view === 'info'
            ? infoRef.current
            : readRef.current;

      if (!node) {
        return;
      }

      setHeight(Math.max(node.scrollHeight, compact ? 340 : 390));
    };

    measure();
    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  }, [compact, description, view]);

  const transform =
    view === 'info'
      ? 'rotateY(180deg)'
      : view === 'read'
        ? 'rotateY(-180deg)'
        : 'rotateY(0deg)';

  return (
    <div className="relative transition-[height] duration-500" style={{ height: `${height}px`, perspective: '1800px' }}>
      <div className="relative h-full w-full transition-transform duration-700" style={{ transform, transformStyle: 'preserve-3d' }}>
        <article className="card-shell absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          <div ref={frontRef} className="flex h-full flex-col">
            <div
              className="relative aspect-[16/10] overflow-hidden border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]"
              style={{ background: 'linear-gradient(160deg, rgba(var(--primary),0.12), rgba(var(--accent),0.16), rgba(var(--surface-2),0.94))' }}
            >
              {image ? (
                <img
                  src={image}
                  alt={document.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
                  {document.index_number || 'Library record'}
                </span>
                {document.year ? (
                  <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
                    {document.year}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="flex flex-wrap gap-2">
                <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
                  {coverLabel(document)}
                </span>
                {document.file_type ? (
                  <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
                    {document.file_type}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-3 text-lg font-semibold leading-snug text-[rgb(var(--primary))]">
                {document.title}
              </h3>

              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <button type="button" onClick={() => setView('info')} className="btn-secondary min-h-[42px] px-4">
                  Info
                </button>
                <button type="button" onClick={() => setView('read')} className="btn-primary min-h-[42px] px-4">
                  Read
                </button>
              </div>
            </div>
          </div>
        </article>

        {view === 'info' ? (
          <article
            className="ui-shell-strong absolute inset-0 overflow-hidden shadow-xl"
            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
          >
            <div ref={infoRef} className="flex h-full flex-col">
              <div className="border-b border-[rgb(var(--border))] px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      Document info
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[rgb(var(--primary))]">
                      {document.title}
                    </h3>
                  </div>

                  <button type="button" onClick={() => setView('front')} className="btn-secondary min-h-[40px] px-4">
                    Back
                  </button>
                </div>
              </div>

              <div className="grid flex-1 gap-3 p-4">
                <p className="text-sm leading-7 text-[rgb(var(--muted))]">
                  {description}
                </p>

                <div className="grid gap-2 text-sm text-[rgb(var(--muted))]">
                  <div className="rounded-[1rem] border border-[rgba(var(--border),0.7)] bg-[rgba(var(--surface),0.92)] px-3 py-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Author</span>
                    <p className="mt-1 font-semibold text-[rgb(var(--primary))]">{document.author || 'FEMATA Secretariat'}</p>
                  </div>
                  <div className="rounded-[1rem] border border-[rgba(var(--border),0.7)] bg-[rgba(var(--surface),0.92)] px-3 py-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Publisher</span>
                    <p className="mt-1 font-semibold text-[rgb(var(--primary))]">{document.publisher || "Federation of Miners' Associations of Tanzania"}</p>
                  </div>
                  <div className="rounded-[1rem] border border-[rgba(var(--border),0.7)] bg-[rgba(var(--surface),0.92)] px-3 py-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Discussion</span>
                    <p className="mt-1 font-semibold text-[rgb(var(--primary))]">{document.comments_count ?? 0} comments</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ) : null}

        {view === 'read' ? (
          <article
            className="ui-shell-strong absolute inset-0 overflow-hidden shadow-xl"
            style={{ transform: 'rotateY(-180deg)', backfaceVisibility: 'hidden' }}
          >
            <div ref={readRef} className="flex h-full flex-col">
              <div className="border-b border-[rgb(var(--border))] px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      Reading actions
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[rgb(var(--primary))]">
                      {document.title}
                    </h3>
                  </div>

                  <button type="button" onClick={() => setView('front')} className="btn-secondary min-h-[40px] px-4">
                    Back
                  </button>
                </div>
              </div>

              <div className="grid flex-1 gap-3 p-4">
                <AppLink href={readHref} className="btn-primary justify-center">
                  Read online
                </AppLink>
                <AppLink href={shareHref} className="btn-secondary justify-center">
                  Share ideas
                </AppLink>
                {document.download_url ? (
                  <a
                    href={document.download_url}
                    className="btn-secondary justify-center"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                ) : null}

                <div className="rounded-[1rem] border border-[rgba(var(--border),0.7)] bg-[rgba(var(--surface),0.92)] px-3 py-3 text-sm leading-7 text-[rgb(var(--muted))]">
                  Library ID: <span className="font-semibold text-[rgb(var(--primary))]">{document.index_number || 'Library record'}</span>
                </div>
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
