import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { AssociationLeaderProfile } from '@/types';

type CardView = 'front' | 'bio' | 'contact';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function buildVCard(leader: AssociationLeaderProfile) {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${leader.name}`,
    leader.title ? `TITLE:${leader.title}` : '',
    leader.email ? `EMAIL:${leader.email}` : '',
    leader.phone ? `TEL:${leader.phone}` : '',
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\n');
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15.5a.5.5 0 0 1-.5.5H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" />
      <path d="M8 4v16" />
    </svg>
  );
}

function IconQr() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M15 15h3" />
      <path d="M18 12v3" />
      <path d="M21 15v6" />
      <path d="M15 18h3" />
      <path d="M18 21h3" />
    </svg>
  );
}

function IconBack() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ui-chip inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))] transition hover:-translate-y-[1px] hover:shadow-sm"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function AssociationLeaderFlipCard({
  leader,
  index,
}: {
  leader: AssociationLeaderProfile;
  index: number;
}) {
  const [view, setView] = useState<CardView>('front');
  const [height, setHeight] = useState(440);
  const frontRef = useRef<HTMLDivElement | null>(null);
  const bioRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  const bio =
    leader.bio ||
    'This leadership profile will be expanded with more background details as the association updates its public mini-site.';
  const vCard = buildVCard(leader);
  const qrSource = leader.contact_qr_path || `https://quickchart.io/qr?text=${encodeURIComponent(vCard)}&size=240`;
  const vCardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard)}`;

  useEffect(() => {
    const measure = () => {
      const node =
        view === 'front' ? frontRef.current : view === 'bio' ? bioRef.current : contactRef.current;

      if (!node) {
        return;
      }

      setHeight(Math.max(node.scrollHeight, 420));
    };

    measure();
    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  }, [view, bio]);

  const transform =
    view === 'bio' ? 'rotateY(180deg)' : view === 'contact' ? 'rotateY(-180deg)' : 'rotateY(0deg)';

  return (
    <div className="relative transition-[height] duration-500" style={{ height: `${height}px`, perspective: '1800px' }}>
      <div className="relative h-full w-full transition-transform duration-700" style={{ transform, transformStyle: 'preserve-3d' }}>
        <article className="card-shell absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          <div ref={frontRef}>
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-500/80 via-sky-500/70 to-emerald-500/80" />
            <div className="relative overflow-hidden border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
              {leader.photo_path ? (
                <img src={leader.photo_path} alt={leader.name} className="h-60 w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
              ) : (
                <div className="flex h-60 items-center justify-center bg-linear-to-br from-[rgb(var(--surface-2))] to-[rgba(var(--surface),0.72)]">
                  <div className="ui-soft-panel flex h-24 w-24 items-center justify-center text-2xl font-semibold text-[rgb(var(--primary))] shadow-sm">
                    {initials(leader.name)}
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/22 via-transparent to-transparent" />
              <div className="ui-chip absolute left-5 top-5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--primary))]">
                Leader {String(index + 1).padStart(2, '0')}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="ui-shell max-w-[18rem] px-4 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.1)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
                    {leader.title || 'Association leader'}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                    {leader.name}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm leading-7 text-[rgb(var(--muted))]">
                Open the bio side for the profile story or flip again to scan the vCard QR code.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <ActionButton label="Read Bio" icon={<IconBook />} onClick={() => setView('bio')} />
                <ActionButton label="View QR Card" icon={<IconQr />} onClick={() => setView('contact')} />
              </div>
            </div>
          </div>
        </article>

        {view === 'bio' ? (
          <article
            className="ui-shell-strong absolute inset-0 overflow-hidden shadow-xl"
            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
          >
            <div ref={bioRef}>
              <div className="absolute inset-x-0 top-0 h-1 bg-amber-500/80" />
              <div className="border-b border-[rgb(var(--border))] px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
                      Biography
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                      {leader.name}
                    </h3>
                    <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                      {leader.title || 'Association leader'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setView('front')}
                    className="ui-chip inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]"
                  >
                    <IconBack />
                    Back
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="ui-soft-panel p-5 shadow-sm">
                  <p className="text-sm leading-8 text-[rgb(var(--muted))]">{bio}</p>
                </div>
              </div>
            </div>
          </article>
        ) : null}

        {view === 'contact' ? (
          <article
            className="ui-shell-strong absolute inset-0 overflow-hidden shadow-xl"
            style={{ transform: 'rotateY(-180deg)', backfaceVisibility: 'hidden' }}
          >
            <div ref={contactRef}>
              <div className="absolute inset-x-0 top-0 h-1 bg-sky-500/80" />
              <div className="border-b border-[rgb(var(--border))] px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
                      vCard QR
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                      {leader.name}
                    </h3>
                    <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                      Scan to save the contact card or download the vCard directly.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setView('front')}
                    className="ui-chip inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]"
                  >
                    <IconBack />
                    Back
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="ui-shell mx-auto max-w-90 p-5 shadow-sm">
                  <div className="rounded-3xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
                    <img src={qrSource} alt={`${leader.name} vCard QR code`} className="mx-auto h-56 w-56 object-contain" loading="lazy" />
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-[rgb(var(--muted))]">
                    {leader.email ? <p>{leader.email}</p> : null}
                    {leader.phone ? <p>{leader.phone}</p> : null}
                  </div>

                  <a
                    href={vCardHref}
                    download={`${leader.name.toLowerCase().replace(/\s+/g, '-')}.vcf`}
                    className="btn-secondary mt-5 w-full"
                  >
                    Download vCard
                  </a>
                </div>
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
