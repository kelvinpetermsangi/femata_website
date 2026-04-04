import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AdvertCarousel from '@/components/AdvertCarousel';
import AssociationLeaderFlipCard from '@/components/association/AssociationLeaderFlipCard';
import AssociationSocialLinks from '@/components/association/AssociationSocialLinks';
import AppLink from '@/components/AppLink';
import MeetingRequestWizard from '@/components/contact/MeetingRequestWizard';
import SectionLead from '@/components/SectionLead';
import { advertsForSlot } from '@/lib/adverts';
import PublicLayout from '@/layouts/PublicLayout';
import type { AdvertSlots, Announcement, Association } from '@/types';

function PageNavigation({
  pages,
  activeKey,
}: {
  pages: NonNullable<Association['profile_pages']>;
  activeKey: string;
}) {
  return (
    <section className="section-shell pt-0">
      <div className="container-shell">
        <div className="ui-shell p-3 sm:p-4">
          <div className="flex flex-wrap gap-2">
            {pages.map((page) => (
              <AppLink
                key={page.key}
                href={page.href ?? '#'}
                className={[
                  'inline-flex min-h-[48px] items-center justify-center rounded-full border px-4 text-sm font-semibold transition',
                  page.key === activeKey
                    ? 'border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary))]/[0.08] text-[rgb(var(--primary))]'
                    : 'border-[rgb(var(--border))] bg-[rgba(var(--surface),0.88)] text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--primary))]',
                ].join(' ')}
              >
                {page.label}
              </AppLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FactsPanel({ association }: { association: Association }) {
  return (
    <div className="ui-shell h-fit p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
        Profile summary
      </p>

      <div className="mt-5 grid gap-4 text-sm text-[rgb(var(--muted))]">
        {association.association_type?.name ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
              Type
            </p>
            <p className="mt-1">{association.association_type.name}</p>
          </div>
        ) : null}

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
            Regions
          </p>
          <p className="mt-1">{(association.regions ?? []).join(', ') || association.region}</p>
        </div>

        {association.district ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
              Base
            </p>
            <p className="mt-1">{association.district}</p>
          </div>
        ) : null}

        {association.postal_address ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
              Postal address
            </p>
            <p className="mt-1">{association.postal_address}</p>
          </div>
        ) : null}

        {association.chairperson_name ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
              Chairperson
            </p>
            <p className="mt-1">{association.chairperson_name}</p>
          </div>
        ) : null}

        {association.secretary_name ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
              Secretary
            </p>
            <p className="mt-1">{association.secretary_name}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="ui-shell p-8 text-center">
      <h3 className="text-xl font-semibold text-[rgb(var(--primary))]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{text}</p>
    </div>
  );
}

function associationHomepageLens(association: Association) {
  const coverage = (association.regions ?? []).join(', ') || association.region || 'its coverage area';

  switch (association.association_type?.slug) {
    case 'women-miners-network':
      return {
        publicRole:
          `This homepage positions ${association.name} as a visible platform for women-led mining enterprise, practical support, and stronger regional confidence across ${coverage}.`,
        opportunity:
          'Visitors can see how leadership development, finance access, shared learning, and enterprise visibility are translating into practical progress for women miners on the ground.',
      };
    case 'local-content-providers':
      return {
        publicRole:
          `${association.name} uses its homepage to show how local content businesses, fabricators, logistics teams, and technical partners are becoming more visible and market-ready across ${coverage}.`,
        opportunity:
          'Visitors can quickly understand supplier readiness, collaboration wins, and the role local content capacity plays in mining growth across the region.',
      };
    case 'service-providers':
      return {
        publicRole:
          `${association.name} acts as a public-facing coordination point for mining-aligned service businesses and technical support actors operating across ${coverage}.`,
        opportunity:
          'The landing page highlights service strength, coordination value, and partnership readiness for mines, associations, and sector institutions.',
      };
    default:
      return {
        publicRole:
          `${association.name} serves as a regional coordination platform linking miners, association leadership, and local priorities across ${coverage}.`,
        opportunity:
          'Visitors get a clear picture of where the association works, what it is advancing, and how it supports safer, more visible, and better-organized mining communities.',
      };
  }
}

function HomeContent({
  association,
  pages,
}: {
  association: Association;
  pages: NonNullable<Association['profile_pages']>;
}) {
  const lens = associationHomepageLens(association);
  const regions = association.regions ?? [];
  const focusAreas = Array.isArray(association.focus_areas)
    ? association.focus_areas
    : typeof association.focus_areas === 'string'
      ? association.focus_areas
          .split(/\r?\n/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
  const profileSignals = [
    {
      label: 'Regions covered',
      value: String(Math.max(regions.length, association.region ? 1 : 0)).padStart(2, '0'),
      note: regions.join(', ') || association.region || 'Regional coverage still being updated',
    },
    {
      label: 'Public pages',
      value: String(pages.length).padStart(2, '0'),
      note: 'The profile can show or hide individual subpages from the dashboard.',
    },
    {
      label: 'Leadership',
      value: String(association.leaders_count ?? association.leaders?.length ?? 0).padStart(2, '0'),
      note: 'Public leadership profiles configured for this association mini-site.',
    },
    {
      label: 'Resources',
      value: String((association.document_count ?? association.documents?.length ?? 0) + (association.gallery_count ?? association.gallery?.length ?? 0)).padStart(2, '0'),
      note: 'Association-specific documents and gallery assets linked to the profile.',
    },
  ];
  const commitmentCards = [
    {
      label: 'Mission',
      title: `What ${association.name} is here to do`,
      text:
        association.mission ||
        'The association exists to organize its network, strengthen coordination, and create more credible visibility for members and partners.',
    },
    {
      label: 'Vision',
      title: 'What long-term progress looks like',
      text:
        association.vision ||
        'The profile is designed to show a more visible, better-connected, and more opportunity-ready association ecosystem.',
    },
    {
      label: 'Gender',
      title: 'How inclusion is being approached',
      text:
        association.gender_commitment ||
        'The association can use this homepage to show how women and youth participation are being made more visible across leadership, enterprise, and support activity.',
    },
    {
      label: 'ESG',
      title: 'How responsible practice is being framed',
      text:
        association.esg_commitment ||
        'Responsible production, stronger records, safer routines, and better community-facing practice can all be made visible from this public homepage.',
    },
  ];

  return (
    <section className="section-shell pt-0">
      <div className="container-shell grid gap-8 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="grid gap-6">
          <div className="ui-section-layer p-6 sm:p-8">
            <SectionLead
              eyebrow="Association homepage"
              title={association.homepage_title || association.name}
              text={
                association.homepage_intro ||
                association.description ||
                'This association profile acts as a full public mini-site with its own internal navigation.'
              }
              align="left"
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {profileSignals.map((item) => (
                <div key={item.label} className="ui-soft-panel p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))]">{item.value}</p>
                  <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="card-shell p-6 sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent-2))]">
                Public role
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
                A profile that explains why this association matters
              </h3>
              <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">{lens.publicRole}</p>
            </div>

            <div className="card-shell p-6 sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent-2))]">
                Regional opportunity
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
                Built to stand on its own, not summarize other tabs
              </h3>
              <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">{lens.opportunity}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {commitmentCards.map((item) => (
              <div key={item.label} className="card-shell p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent-2))]">
                  {item.label}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.text}</p>
              </div>
            ))}
          </div>

          {(association.highlights ?? []).length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {(association.highlights ?? []).map((item, index) => (
                <div key={`${item.title}-${index}`} className="card-shell p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent-2))]">
                    Accomplishment {index + 1}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.text}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6">
          <FactsPanel association={association} />

          {focusAreas.length > 0 ? (
            <div className="card-shell p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                Focus areas
              </p>
              <div className="mt-5 grid gap-3">
                {focusAreas.map((item) => (
                  <div
                    key={item}
                    className="ui-soft-panel px-5 py-4 text-sm font-medium text-[rgb(var(--primary))]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="card-shell p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
              Regional footprint
            </p>
            <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
              This homepage is meant to explain where the association operates and why its regional footprint matters.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(regions.length > 0 ? regions : association.region ? [association.region] : []).map((item) => (
                <span
                  key={item}
                  className="ui-chip px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="card-shell p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
              Connect
            </p>
            <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
              Official social and website links appear here only when this association enables them in the admin dashboard.
            </p>
            <div className="mt-5">
              <AssociationSocialLinks links={association.social_links} compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutContent({ association }: { association: Association }) {
  return (
    <section className="section-shell pt-0">
      <div className="container-shell grid gap-8 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="card-shell p-6 sm:p-7">
          <SectionLead
            eyebrow="About this association"
            title={association.about_title || `About ${association.name}`}
            text={association.about_body || association.description || ''}
            align="left"
          />
        </div>

        <div className="grid gap-6">
          <FactsPanel association={association} />

          {(association.focus_areas ?? []).length > 0 ? (
            <div className="card-shell p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                Priority focus
              </p>
              <div className="mt-5 grid gap-3">
                {(association.focus_areas as string[]).map((item) => (
                  <div key={item} className="ui-soft-panel px-5 py-4 text-sm font-medium text-[rgb(var(--primary))]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function normalizeAssociationLeaderGroup(value?: string | null) {
  const normalized = (value ?? '').trim().toLowerCase();

  if (
    normalized === 'secretariat' ||
    normalized === 'secretariate' ||
    normalized.includes('secret')
  ) {
    return 'secretariat';
  }

  return 'management';
}

function labelForAssociationLeaderGroup(value: string) {
  return value === 'secretariat' ? 'Secretariat' : 'Management Team';
}

function AssociationLeadershipToggleBar({
  activeGroup,
  onChange,
  counts,
}: {
  activeGroup: 'management' | 'secretariat';
  onChange: (value: 'management' | 'secretariat') => void;
  counts: Record<'management' | 'secretariat', number>;
}) {
  const tabs: Array<'management' | 'secretariat'> = ['management', 'secretariat'];

  return (
    <div className="flex justify-center">
      <div className="ui-shell inline-flex p-2 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
        {tabs.map((tab) => {
          const active = activeGroup === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={[
                'inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200',
                active
                  ? 'border border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary))]/[0.08] text-[rgb(var(--primary))] shadow-sm'
                  : 'text-[rgb(var(--primary))] hover:bg-[rgb(var(--surface-2))]',
              ].join(' ')}
            >
              <span>{labelForAssociationLeaderGroup(tab)}</span>
              <span
                className={[
                  'inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px]',
                  active
                    ? 'bg-[rgba(var(--surface),0.94)] text-[rgb(var(--primary))]'
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

function formatAssociationEventDate(value?: string | null) {
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

function buildAssociationGalleryGroups(association: Association) {
  const gallery = association.gallery ?? [];
  const groups = new Map<string, {
    key: string;
    title: string;
    date?: string | null;
    items: NonNullable<Association['gallery']>;
  }>();

  gallery.forEach((item) => {
    const title = item.event_title || `${association.name} field archive`;
    const date = item.event_date || null;
    const key = `${title}::${date ?? 'undated'}`;
    const existing = groups.get(key);

    if (existing) {
      existing.items.push(item);
      return;
    }

    groups.set(key, {
      key,
      title,
      date,
      items: [item],
    });
  });

  return Array.from(groups.values()).sort((left, right) => {
      const leftDate = left.date ? new Date(left.date).getTime() : 0;
      const rightDate = right.date ? new Date(right.date).getTime() : 0;

      return rightDate - leftDate;
    });
}

function associationMapLinks(association: Association) {
  const query = encodeURIComponent(
    association.address
      || association.district
      || (association.regions ?? []).join(', ')
      || association.region
      || association.name,
  );

  return {
    embed: association.map_embed_url || `https://www.google.com/maps?q=${query}&output=embed`,
    google: association.google_map_url || `https://maps.google.com/?q=${query}`,
    apple: association.apple_map_url || `http://maps.apple.com/?q=${query}`,
  };
}

function LeadershipContent({ association }: { association: Association }) {
  const leaders = association.leaders ?? [];
  const groupedLeaders = {
    management: leaders.filter((leader) => normalizeAssociationLeaderGroup(leader.group || leader.title) === 'management'),
    secretariat: leaders.filter((leader) => normalizeAssociationLeaderGroup(leader.group || leader.title) === 'secretariat'),
  };
  const visibleGroups = (['management', 'secretariat'] as const).filter(
    (key) => groupedLeaders[key].length > 0,
  );
  const [activeGroup, setActiveGroup] = useState<'management' | 'secretariat'>('management');
  const currentGroup = visibleGroups.includes(activeGroup) ? activeGroup : (visibleGroups[0] ?? 'management');

  if (leaders.length === 0) {
    return (
      <section className="section-shell pt-0">
        <div className="container-shell">
          <EmptyState
            title="Leadership profiles will be published when this association approves them"
            text="The FEMATA dashboard can publish named leaders, bios, portraits, and QR contact cards for this association profile whenever the regional team is ready."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell pt-0">
      <div className="container-shell">
        <SectionLead
          eyebrow="Leadership"
          title="Management and secretariat leadership"
          text="Switch between the management team and secretariat using the same horizontal toggle pattern used on the main FEMATA leadership page."
        />

        <div className="grid gap-8">
          <AssociationLeadershipToggleBar
            activeGroup={currentGroup}
            onChange={setActiveGroup}
            counts={{
              management: groupedLeaders.management.length,
              secretariat: groupedLeaders.secretariat.length,
            }}
          />

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                {labelForAssociationLeaderGroup(currentGroup)}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                {labelForAssociationLeaderGroup(currentGroup)} profiles
              </h3>
            </div>

            <span className="ui-chip px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
              {groupedLeaders[currentGroup].length} published
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {groupedLeaders[currentGroup].map((leader, index) => (
              <AssociationLeaderFlipCard key={`${currentGroup}-${leader.name}-${index}`} leader={leader} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DocumentsContent({ association }: { association: Association }) {
  const documents = association.documents ?? [];

  if (documents.length === 0) {
    return (
      <section className="section-shell pt-0">
        <div className="container-shell">
          <EmptyState
            title="No public association documents have been linked yet"
            text="When this association uploads approved forms, guides, reports, or notices through the FEMATA dashboard, they will appear here for visitors to open or download."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell pt-0">
      <div className="container-shell">
        <SectionLead
          eyebrow="Documents"
          title="Linked public resources"
          text="Official documents, guidance, and downloads linked specifically to this association profile."
        />

        <div className="grid gap-4">
          {documents.map((document) => (
            <div key={document.id} className="card-shell p-5 sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                {document.category ?? 'Resource'}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                {document.title}
              </h3>
              {document.description ? (
                <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{document.description}</p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <AppLink href={`/documents/${document.slug}`} className="btn-secondary">
                  Open document
                </AppLink>
                <a href={document.download_url ?? document.file_path} className="btn-primary" download>
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryContent({ association }: { association: Association }) {
  const gallery = buildAssociationGalleryGroups(association);

  if (gallery.length === 0) {
    return (
      <section className="section-shell pt-0">
        <div className="container-shell">
          <EmptyState
            title="Association gallery will appear here once media is published"
            text="Photos from meetings, field visits, member events, and other approved association activities will appear here when they are added through the FEMATA dashboard."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell pt-0">
      <div className="container-shell">
        <SectionLead
          eyebrow="Gallery"
          title="Association gallery by event"
          text="Images uploaded for this association profile stay inside the association mini-site and can now be grouped by event, meeting, field visit, or milestone from the admin builder."
        />

        <div className="grid gap-8">
          {gallery.map((group) => {
            const leadItem = group.items[0];
            const remainingItems = group.items.slice(1);

            return (
              <section key={group.key} className="ui-section-layer p-5 sm:p-7">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      Association event
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                      {group.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {group.date ? (
                      <span className="ui-chip px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                        {formatAssociationEventDate(group.date)}
                      </span>
                    ) : null}
                    <span className="ui-chip px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                      {group.items.length} images
                    </span>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)]">
                  {leadItem ? (
                    <figure className="card-shell overflow-hidden">
                      <img src={leadItem.image_path} alt={leadItem.caption ?? association.name} className="h-full min-h-[320px] w-full object-cover" loading="lazy" />
                      {leadItem.caption ? (
                        <figcaption className="p-5 text-sm leading-7 text-[rgb(var(--muted))]">
                          {leadItem.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ) : null}

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
                    {remainingItems.length > 0 ? (
                      remainingItems.map((item, index) => (
                        <figure key={`${group.key}-${item.image_path}-${index}`} className="card-shell overflow-hidden">
                          <img src={item.image_path} alt={item.caption ?? association.name} className="h-72 w-full object-cover" loading="lazy" />
                          {item.caption ? (
                            <figcaption className="p-5 text-sm leading-7 text-[rgb(var(--muted))]">
                              {item.caption}
                            </figcaption>
                          ) : null}
                        </figure>
                      ))
                    ) : (
                      <div className="card-shell flex items-center justify-center p-6 text-center text-sm leading-7 text-[rgb(var(--muted))]">
                        This event currently has one published lead image on the association profile.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactContent({
  association,
  contactLeaders,
  meetingOptions,
}: {
  association: Association;
  contactLeaders: Array<{
    id: string;
    name: string;
    title?: string | null;
    email?: string | null;
    phone?: string | null;
    group?: string | null;
  }>;
  meetingOptions: {
    modes: Record<string, string>;
    slots: string[];
  };
}) {
  const maps = associationMapLinks(association);

  return (
    <section className="section-shell pt-0">
      <div className="container-shell grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <MeetingRequestWizard
          action={`/associations/${association.slug}/contact`}
          contact={{
            booking_sender_name: association.name,
            booking_email: association.email,
          }}
          leaders={contactLeaders}
          meetingOptions={meetingOptions}
          scopeLabel={association.name}
          scopeNote={
            association.contact_body
            || `Use the guided form to send an inquiry or request a meeting with ${association.name}'s published leadership contacts.`
          }
          submitLabel={`Send to ${association.name}`}
        />

        <div className="grid gap-4">
          <div className="ui-soft-panel p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              Association office
            </p>
            <div className="mt-4 grid gap-4 text-sm text-[rgb(var(--muted))]">
              {association.address ? (
                <div>
                  <p className="font-semibold text-[rgb(var(--primary))]">Address</p>
                  <p className="mt-1 leading-7">{association.address}</p>
                </div>
              ) : null}
              {association.postal_address ? (
                <div>
                  <p className="font-semibold text-[rgb(var(--primary))]">Postal address</p>
                  <p className="mt-1 leading-7">{association.postal_address}</p>
                </div>
              ) : null}
              {association.phone ? (
                <div>
                  <p className="font-semibold text-[rgb(var(--primary))]">Phone</p>
                  <a href={`tel:${association.phone}`} className="mt-1 block leading-7 text-[rgb(var(--primary))]">
                    {association.phone}
                  </a>
                </div>
              ) : null}
              {association.email ? (
                <div>
                  <p className="font-semibold text-[rgb(var(--primary))]">Email</p>
                  <a href={`mailto:${association.email}`} className="mt-1 block leading-7 text-[rgb(var(--primary))]">
                    {association.email}
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          <div className="ui-soft-panel overflow-hidden p-0">
            <div className="border-b border-[rgb(var(--border))] px-4 py-4 sm:px-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                Directions
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[rgb(var(--primary))]">
                Navigate to the association office
              </h3>
            </div>

            <div className="aspect-[4/3] border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
              <iframe
                src={maps.embed}
                title={`${association.name} office map`}
                loading="lazy"
                className="h-full w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="grid gap-3 px-4 py-4 sm:px-5">
              <a href={maps.google} target="_blank" rel="noreferrer" className="btn-primary justify-center">
                Open in Google Maps
              </a>
              <a href={maps.apple} target="_blank" rel="noreferrer" className="btn-secondary justify-center">
                Open in Apple Maps
              </a>
            </div>
          </div>

          <div className="ui-soft-panel p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              Public links
            </p>
            <div className="mt-4">
              <AssociationSocialLinks links={association.social_links} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <AppLink href="/contact" className="btn-secondary">
                Contact FEMATA Secretariat
              </AppLink>
              <AppLink href="/associations" className="btn-secondary">
                Back to directory
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AssociationShow({
  association,
  contactLeaders,
  meetingOptions,
  adverts,
  announcements,
}: {
  association: Association;
  contactLeaders: Array<{
    id: string;
    name: string;
    title?: string | null;
    email?: string | null;
    phone?: string | null;
    group?: string | null;
  }>;
  meetingOptions: {
    modes: Record<string, string>;
    slots: string[];
  };
  adverts?: AdvertSlots;
  announcements?: Announcement[];
}) {
  const heroImage =
    association.hero_image ||
    association.logo_path ||
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80';
  const pages = association.profile_pages ?? [];
  const currentPage = association.current_page ?? pages[0];
  const topSlotAdverts = advertsForSlot(adverts, 1);
  const bottomSlotAdverts = advertsForSlot(adverts, 2);
  const heroText =
    currentPage?.key === 'home'
      ? association.homepage_intro || currentPage?.intro || association.description || association.about_body || 'Association profile'
      : currentPage?.key === 'about'
        ? association.about_body || currentPage?.intro || association.description || 'Association profile'
        : currentPage?.intro || association.description || association.about_body || 'Association profile';

  return (
    <>
      <Head title={currentPage?.key === 'home' ? association.name : `${association.name} | ${currentPage?.label}`} />

      <PublicLayout announcements={announcements}>
        <section className="section-shell pb-6">
          <div className="container-shell">
            <div className="ui-section-layer overflow-hidden rounded-[2.3rem]">
              <div className="absolute inset-0">
                <img src={heroImage} alt={association.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-r from-[rgba(7,28,24,0.94)] via-[rgba(13,47,40,0.86)] to-[rgba(15,23,42,0.58)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(var(--accent),0.18),transparent_20%)]" />
              </div>

              <div className="relative grid gap-8 p-6 sm:p-8 lg:p-10 xl:grid-cols-[minmax(0,1.12fr)_360px] xl:items-end">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {association.association_type?.name ? (
                      <span className="ui-chip px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
                        {association.association_type.name}
                      </span>
                    ) : null}
                    <span className="ui-chip px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
                      {(association.regions ?? []).join(' | ') || association.region || 'Association profile'}
                    </span>
                  </div>

                  <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                    {association.name}
                  </h1>

                  <p className="mt-5 max-w-3xl text-sm leading-8 text-white/82 sm:text-base">
                    {heroText}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {(pages ?? []).map((page) => (
                      <span key={page.key} className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/82">
                        {page.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="ui-shell-strong p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      Contact
                    </p>
                    <div className="mt-3 grid gap-3 text-sm text-[rgb(var(--muted))]">
                      {association.address ? <p>{association.address}</p> : null}
                      {association.phone ? <p>{association.phone}</p> : null}
                      {association.email ? <p>{association.email}</p> : null}
                    </div>
                  </div>

                  <div className="card-shell p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      Link icons
                    </p>
                    <div className="mt-4">
                      <AssociationSocialLinks links={association.social_links} compact />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <AppLink href="/associations" className="btn-secondary justify-center">
                      Back to directory
                    </AppLink>
                    <AppLink href="/contact" className="btn-primary justify-center text-center">
                      Advertise in this region
                    </AppLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {currentPage ? <PageNavigation pages={pages} activeKey={currentPage.key} /> : null}

        {topSlotAdverts.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <AdvertCarousel adverts={topSlotAdverts} slotNumber={1} />
            </div>
          </section>
        ) : null}

        {currentPage?.key === 'home' ? <HomeContent association={association} pages={pages} /> : null}
        {currentPage?.key === 'about' ? <AboutContent association={association} /> : null}
        {currentPage?.key === 'leadership' ? <LeadershipContent association={association} /> : null}
        {currentPage?.key === 'documents' ? <DocumentsContent association={association} /> : null}
        {currentPage?.key === 'gallery' ? <GalleryContent association={association} /> : null}
        {currentPage?.key === 'contact' ? <ContactContent association={association} contactLeaders={contactLeaders} meetingOptions={meetingOptions} /> : null}

        {bottomSlotAdverts.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <AdvertCarousel adverts={bottomSlotAdverts} slotNumber={2} compact />
            </div>
          </section>
        ) : null}
      </PublicLayout>
    </>
  );
}
