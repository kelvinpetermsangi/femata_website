import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import PublicLayout from '@/layouts/PublicLayout';

type Leader = {
  id: number;
  name: string;
  title: string;
  bio?: string | null;
  photo_path?: string | null;
  administration_level?: string | null;
  contact_qr_path?: string | null;
};

type LeadershipPageProps = {
  leaders: Leader[];
  announcements?: [];
};

type FilterKey = 'Management Team' | 'Secretariat';
type CardView = 'front' | 'bio' | 'contact';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function normalizeAdministrationLevel(value?: string | null): FilterKey | null {
  const normalized = (value ?? '').trim().toLowerCase();

  if (
    normalized === 'management team' ||
    normalized === 'management-team' ||
    normalized === 'management'
  ) {
    return 'Management Team';
  }

  if (normalized === 'secretariat' || normalized === 'secretariate') {
    return 'Secretariat';
  }

  return null;
}

function IconBook() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15.5a.5.5 0 0 1-.5.5H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" />
      <path d="M8 4v16" />
    </svg>
  );
}

function IconQr() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
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
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function HeroSection({ leaders }: { leaders: Leader[] }) {
  const heroImage = leaders.find((leader) => leader.photo_path)?.photo_path;

  return (
    <section className="section-shell">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950 shadow-2xl">
          <div className="absolute inset-0">
            {heroImage ? (
              <img
                src={heroImage}
                alt="Leadership"
                className="h-full w-full object-cover"
              />
            ) : null}

            <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/85 to-slate-900/70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.10),transparent_20%)]" />
          </div>

          <div className="relative z-10 grid min-h-105 items-end px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-12 lg:px-14">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/85 backdrop-blur-md">
                Leadership
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Leadership &amp; Administration
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-8 text-white/80 sm:text-base">
                FEMATA is guided by an institutional structure that combines
                strategic leadership and administrative coordination to support
                representation, governance, and implementation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToggleBar({
  activeFilter,
  onChange,
  counts,
}: {
  activeFilter: FilterKey;
  onChange: (value: FilterKey) => void;
  counts: Record<FilterKey, number>;
}) {
  const tabs: FilterKey[] = ['Management Team', 'Secretariat'];

  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-full border border-[rgb(var(--border))] bg-white p-2 shadow-sm">
        {tabs.map((tab) => {
          const active = activeFilter === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={[
                'inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200',
                active
                  ? 'bg-[rgb(var(--primary))] text-white shadow-sm'
                  : 'text-[rgb(var(--primary))] hover:bg-[rgb(var(--surface-2))]',
              ].join(' ')}
            >
              <span>{tab}</span>
              <span
                className={[
                  'inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px]',
                  active
                    ? 'bg-white/15 text-white'
                    : 'bg-[rgb(var(--surface-2))] text-[rgb(var(--muted))]',
                ].join(' ')}
              >
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function LeaderCard({
  leader,
  index,
}: {
  leader: Leader;
  index: number;
}) {
  const [view, setView] = useState<CardView>('front');

  const frontRef = useRef<HTMLDivElement | null>(null);
  const bioRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  const bioText =
    leader.bio ||
    'Profile details will be updated soon. This role contributes to institutional stewardship, coordination, and sector representation.';

  const isLongBio = bioText.length > 320;
  const isVeryLongBio = bioText.length > 650;

  const [panelHeight, setPanelHeight] = useState(460);

  useEffect(() => {
    const measure = () => {
      const activeNode =
        view === 'front'
          ? frontRef.current
          : view === 'bio'
            ? bioRef.current
            : contactRef.current;

      if (!activeNode) return;

      const nextHeight = Math.max(activeNode.scrollHeight, 420);
      setPanelHeight(nextHeight);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [view, bioText]);

  const wrapperTransform =
    view === 'bio'
      ? 'rotateY(180deg)'
      : view === 'contact'
        ? 'rotateY(-180deg)'
        : 'rotateY(0deg)';

  const spanClass =
    view === 'bio' && isVeryLongBio ? 'md:col-span-2 xl:col-span-2' : '';

  return (
    <div className={spanClass}>
      <div
        className="relative transition-[height] duration-500"
        style={{ height: `${panelHeight}px`, perspective: '1800px' }}
      >
        <div
          className="relative h-full w-full transition-transform duration-700"
          style={{
            transform: wrapperTransform,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front */}
          <article
            className="absolute inset-0 overflow-hidden rounded-[1.75rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] shadow-sm"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div ref={frontRef}>
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-500/80 via-sky-500/70 to-emerald-500/80" />

              <div className="relative overflow-hidden border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
                {leader.photo_path ? (
                  <img
                    src={leader.photo_path}
                    alt={leader.name}
                    className="h-56 w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-linear-to-br from-[rgb(var(--surface-2))] to-white">
                    <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-[rgb(var(--border))] bg-white text-2xl font-semibold text-[rgb(var(--primary))] shadow-sm">
                      {getInitials(leader.name)}
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />

                <div className="absolute left-5 top-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur-md">
                  Profile {String(index + 1).padStart(2, '0')}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                    {leader.title}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {leader.name}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm leading-7 text-[rgb(var(--muted))]">
                  Click below to read the full bio or open the contact card.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <ActionButton
                    icon={<IconBook />}
                    label="Read Bio"
                    onClick={() => setView('bio')}
                  />
                  <ActionButton
                    icon={<IconQr />}
                    label="View Contact Card"
                    onClick={() => setView('contact')}
                  />
                </div>
              </div>
            </div>
          </article>

          {/* Bio */}
          {view === 'bio' && (
            <article
              className="absolute inset-0 overflow-hidden rounded-[1.75rem] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] shadow-xl"
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
              }}
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
                        {leader.title}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setView('front')}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))] transition-all duration-200 hover:bg-[rgb(var(--surface-2))]"
                    >
                      <IconBack />
                      Back
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div
                    className={[
                      'rounded-3xl border border-[rgb(var(--border))] bg-white/80 p-5 shadow-sm',
                      !isLongBio ? 'mx-auto max-w-105' : '',
                    ].join(' ')}
                  >
                    <p className="text-sm leading-8 text-[rgb(var(--muted))]">
                      {bioText}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Contact */}
          {view === 'contact' && (
            <article
              className="absolute inset-0 overflow-hidden rounded-[1.75rem] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] shadow-xl"
              style={{
                transform: 'rotateY(-180deg)',
                backfaceVisibility: 'hidden',
              }}
            >
              <div ref={contactRef}>
                <div className="absolute inset-x-0 top-0 h-1 bg-sky-500/80" />

                <div className="border-b border-[rgb(var(--border))] px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
                        Contact Card
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                        {leader.name}
                      </h3>
                      <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                        Scan to save or share this leadership contact card.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setView('front')}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))] transition-all duration-200 hover:bg-[rgb(var(--surface-2))]"
                    >
                      <IconBack />
                      Back
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="mx-auto max-w-90 rounded-[1.75rem] border border-[rgb(var(--border))] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-[rgb(var(--border))] pb-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                          Digital card
                        </p>
                        <p className="mt-2 text-base font-semibold text-[rgb(var(--primary))]">
                          {leader.name}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] text-[rgb(var(--primary))]">
                        <IconQr />
                      </div>
                    </div>

                    <div className="mt-5 rounded-3xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
                      {leader.contact_qr_path ? (
                        <img
                          src={leader.contact_qr_path}
                          alt={`${leader.name} contact QR code`}
                          className="mx-auto h-52 w-52 object-contain"
                        />
                      ) : (
                        <div className="flex h-52 items-center justify-center rounded-2xl bg-white text-center">
                          <div>
                            <p className="text-sm font-semibold text-[rgb(var(--primary))]">
                              QR code not uploaded
                            </p>
                            <p className="mt-2 text-xs leading-6 text-[rgb(var(--muted))]">
                              Add <code>contact_qr_path</code> from the backend
                              to display the QR image.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-center text-xs leading-6 text-[rgb(var(--muted))]">
                      Scan the QR code to open or save the contact card.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Leadership({
  leaders,
  announcements,
}: LeadershipPageProps) {
  const preparedLeaders = useMemo(
    () =>
      leaders.map((leader) => ({
        ...leader,
        normalized_level: normalizeAdministrationLevel(
          leader.administration_level
        ),
      })),
    [leaders]
  );

  const counts = useMemo(
    () => ({
      'Management Team': preparedLeaders.filter(
        (leader) => leader.normalized_level === 'Management Team'
      ).length,
      Secretariat: preparedLeaders.filter(
        (leader) => leader.normalized_level === 'Secretariat'
      ).length,
    }),
    [preparedLeaders]
  );

  const [activeFilter, setActiveFilter] =
    useState<FilterKey>('Management Team');

  const filteredLeaders = useMemo(
    () =>
      preparedLeaders.filter(
        (leader) => leader.normalized_level === activeFilter
      ),
    [preparedLeaders, activeFilter]
  );

  return (
    <>
      <Head title="Leadership" />

      <PublicLayout announcements={announcements}>
        <HeroSection leaders={leaders} />

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="rounded-4xl border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.97))] p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[rgb(var(--muted))]">
                  Administrative Structure
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))] sm:text-3xl">
                  Browse by administration level
                </h2>

                <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))] sm:text-base">
                  Switch between the Management Team and Secretariat to view
                  profiles by institutional role grouping.
                </p>
              </div>

              <div className="mt-8">
                <ToggleBar
                  activeFilter={activeFilter}
                  onChange={setActiveFilter}
                  counts={counts}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            {filteredLeaders.length === 0 ? (
              <div className="rounded-[1.75rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-8 text-sm text-[rgb(var(--muted))] shadow-sm">
                No profiles found under{' '}
                <span className="font-semibold text-[rgb(var(--primary))]">
                  {activeFilter}
                </span>
                .
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredLeaders.map((leader, index) => (
                  <LeaderCard key={leader.id} leader={leader} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </PublicLayout>
    </>
  );
}