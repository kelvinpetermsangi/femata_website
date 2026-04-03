import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AdvertCarousel from '@/components/AdvertCarousel';
import AppLink from '@/components/AppLink';
import PageHero from '@/components/PageHero';
import SectionLead from '@/components/SectionLead';
import { advertsForSlot } from '@/lib/adverts';
import PublicLayout from '@/layouts/PublicLayout';
import type { AdvertSlots, Association, Announcement } from '@/types';

function regionSummary(association: Association) {
  const regions = association.regions ?? [];
  if (regions.length === 0) return association.region ?? 'Regional profile';
  if (regions.length <= 3) return regions.join(', ');
  return `${regions.slice(0, 3).join(', ')} +${regions.length - 3} more`;
}

export default function AssociationsIndex({
  associations,
  adverts,
  announcements,
}: {
  associations: Association[];
  adverts?: AdvertSlots;
  announcements?: Announcement[];
}) {
  const heroImage =
    associations[0]?.hero_image ||
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80';

  const typeOptions = useMemo(
    () =>
      Array.from(
        new Map(
          associations
            .filter((association) => association.association_type?.slug)
            .map((association) => [
              association.association_type?.slug ?? '',
              association.association_type?.name ?? 'Association',
            ]),
        ),
      ).map(([slug, name]) => ({ slug, name })),
    [associations],
  );
  const [activeType, setActiveType] = useState<string>('all');

  const filteredAssociations = useMemo(() => {
    if (activeType === 'all') {
      return associations;
    }

    return associations.filter((association) => association.association_type?.slug === activeType);
  }, [activeType, associations]);

  const coveredRegions = new Set(associations.flatMap((item) => item.regions ?? [])).size;

  return (
    <>
      <Head title="Associations Directory" />

      <PublicLayout announcements={announcements}>
        <PageHero
          eyebrow="Association Network"
          title="Explore FEMATA's association directory."
          text="Browse active regional associations, women miners networks, local content groups, and other organized sector profiles through one searchable public directory."
          image={heroImage}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="ui-soft-panel p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                Active profiles
              </p>
              <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                {String(associations.length).padStart(2, '0')}
              </p>
            </div>
            <div className="ui-soft-panel p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                Regions covered
              </p>
              <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                {coveredRegions}
              </p>
            </div>
          </div>
        </PageHero>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <SectionLead
              eyebrow="Association profiles"
              title="A richer directory for multiple association types."
              text="The public directory can now host more than regional associations alone. System-defined association types make it easier for visitors to filter the network and open each organization's own full public mini-site."
            />

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveType('all')}
                className={[
                  'rounded-full border px-4 py-2 text-sm font-semibold transition',
                  activeType === 'all'
                    ? 'border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary))]/[0.08] text-[rgb(var(--primary))]'
                    : 'border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)] text-[rgb(var(--muted))] hover:text-[rgb(var(--primary))]',
                ].join(' ')}
              >
                All associations
              </button>
              {typeOptions.map((type) => (
                <button
                  key={type.slug}
                  type="button"
                  onClick={() => setActiveType(type.slug)}
                  className={[
                    'rounded-full border px-4 py-2 text-sm font-semibold transition',
                    activeType === type.slug
                      ? 'border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary))]/[0.08] text-[rgb(var(--primary))]'
                      : 'border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)] text-[rgb(var(--muted))] hover:text-[rgb(var(--primary))]',
                  ].join(' ')}
                >
                  {type.name}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <AdvertCarousel adverts={advertsForSlot(adverts, 1)} slotNumber={1} />
            </div>

            {filteredAssociations.length === 0 ? (
              <div className="mt-6 card-shell p-8 text-center sm:p-12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  Association directory
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
                  No FEMATA profiles match this directory filter yet
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
                  Switch the association type filter or publish additional association profiles from the FEMATA dashboard to expand what visitors can browse here.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredAssociations.map((association) => (
                  <article key={association.id} className="card-shell card-shell-hover">
                    <div className="h-52 overflow-hidden bg-[rgb(var(--surface-2))]">
                      {association.hero_image || association.logo_path ? (
                        <img
                          src={association.hero_image || association.logo_path || ''}
                          alt={association.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[rgb(var(--muted))]">
                          FEMATA association profile image
                        </div>
                      )}
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {association.association_type?.name ? (
                          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                            {association.association_type.name}
                          </span>
                        ) : null}
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
                          {regionSummary(association)}
                        </span>
                      </div>

                      <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
                        {association.name}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
                        {association.description || 'This FEMATA association profile is active and ready for a tailored public summary from the secretariat dashboard.'}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <AppLink href={`/associations/${association.slug}`} className="story-link">
                          Open profile
                        </AppLink>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-6">
              <AdvertCarousel adverts={advertsForSlot(adverts, 2)} slotNumber={2} compact />
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
