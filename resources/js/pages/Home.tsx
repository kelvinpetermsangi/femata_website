import { Head } from '@inertiajs/react';
import AdvertCarousel from '@/components/AdvertCarousel';
import AppLink from '@/components/AppLink';
import { advertsForSlot } from '@/lib/adverts';
import {
  femataClosingNarrative,
  femataCorridors,
  femataExplorationSignals,
  femataFinanceSignals,
  femataFormalizationStats,
  femataGovernanceModel,
  femataGrowthSignals,
  femataHeroContext,
  femataHeroSummary,
  femataInclusionThemes,
  femataIntroductoryOverview,
  femataMineralFamilies,
  femataModernizationThemes,
  femataSectorMetrics,
  femataWhatMakesPossible,
} from '@/lib/femataNarrative';
import { defaultHomeContent } from '@/lib/siteDefaults';
import PublicLayout from '@/layouts/PublicLayout';
import type { HomePageProps } from '@/types';

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--accent-2))]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-8 text-[rgb(var(--muted))] sm:text-base">
        {text}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="card-shell card-shell-hover p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-[rgb(var(--primary))] sm:text-4xl">{value}</p>
      <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{note}</p>
    </div>
  );
}

function GrowthSignalCard({
  label,
  from,
  to,
  delta,
  note,
  widthClass,
}: {
  label: string;
  from: string;
  to: string;
  delta: string;
  note: string;
  widthClass: string;
}) {
  return (
    <div className="card-shell p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          {label}
        </p>
        <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
          {delta}
        </span>
      </div>

      <div className="mt-5">
        <div className="h-3 rounded-full bg-[rgba(var(--border),0.75)]">
          <div
            className={`h-3 rounded-full bg-[linear-gradient(90deg,rgba(var(--accent),0.96),rgba(var(--primary),0.96))] ${widthClass}`}
          />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">From</p>
          <p className="mt-1 text-lg font-semibold text-[rgb(var(--primary))]">{from}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">To</p>
          <p className="mt-1 text-lg font-semibold text-[rgb(var(--primary))]">{to}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))]">{note}</p>
    </div>
  );
}

export default function Home({
  announcements = [],
  associations = [],
  adverts = {},
  homeContent = defaultHomeContent,
}: HomePageProps) {
  const heroImage =
    homeContent.hero_image ??
    defaultHomeContent.hero_image ??
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80';

  const topSlotAdverts = advertsForSlot(adverts, 1);
  const bottomSlotAdverts = advertsForSlot(adverts, 2);
  const associationTypes = Array.from(
    new Set(
      associations
        .map((association) => association.association_type?.name)
        .filter((value): value is string => Boolean(value))
    )
  );

  return (
    <>
      <Head title="Home" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell pb-6">
          <div className="container-shell">
            <div className="relative overflow-hidden rounded-[2.6rem] border border-white/10 bg-slate-950 shadow-[0_35px_110px_rgba(15,23,42,0.24)]">
              <div className="absolute inset-0">
                <img src={heroImage} alt="FEMATA national homepage" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.96),rgba(7,28,24,0.88),rgba(15,23,42,0.72))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_18%)]" />
              </div>

              <div className="relative grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.1fr)_390px] lg:px-10 lg:py-12">
                <div className="max-w-4xl">
                  <span className="inline-flex rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82 backdrop-blur-md">
                    FEMATA national federation
                  </span>

                  <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[4.1rem]">
                    Federation of Miners&apos; Associations of Tanzania
                  </h1>

                  <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 sm:text-lg">
                    {femataHeroSummary}
                  </p>

                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    {femataHeroContext.map((item, index) => (
                      <div
                        key={item}
                        className={[
                          'rounded-[1.6rem] border px-5 py-5 backdrop-blur-md',
                          index === 0
                            ? 'border-emerald-300/18 bg-emerald-400/8'
                            : 'border-white/12 bg-white/7',
                        ].join(' ')}
                      >
                        <p className="text-sm leading-7 text-white/80">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <AppLink href="/about" className="btn-primary">
                      About FEMATA
                    </AppLink>
                    <AppLink
                      href="/associations"
                      className="btn-secondary border-white/18 bg-white/10 text-white hover:bg-white/16"
                    >
                      Explore the sector
                    </AppLink>
                    <AppLink
                      href="/contact"
                      className="btn-secondary border-white/16 bg-transparent text-white hover:bg-white/10"
                    >
                      Partner with FEMATA
                    </AppLink>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="ui-shell-strong p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--primary))]">
                      Sector snapshot
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="ui-soft-panel p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">GDP</p>
                        <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">10.1%</p>
                        <p className="mt-2 text-xs leading-6 text-[rgb(var(--muted))]">2024 contribution</p>
                      </div>
                      <div className="ui-soft-panel p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Exports</p>
                        <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">USD 4.9B</p>
                        <p className="mt-2 text-xs leading-6 text-[rgb(var(--muted))]">Year ending Jan 2026</p>
                      </div>
                      <div className="ui-soft-panel p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Jobs</p>
                        <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">1.2M+</p>
                        <p className="mt-2 text-xs leading-6 text-[rgb(var(--muted))]">Direct ASM employment</p>
                      </div>
                      <div className="ui-soft-panel p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Profiles</p>
                        <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                          {String(associations.length).padStart(2, '0')}
                        </p>
                        <p className="mt-2 text-xs leading-6 text-[rgb(var(--muted))]">Public association profiles</p>
                      </div>
                    </div>
                  </div>

                  <div className="ui-shell p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                      National reach
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
                      FEMATA connects association structures, regional leadership, and national coordination across
                      Tanzania&apos;s diverse mining corridors.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {associationTypes.length > 0 ? (
                        associationTypes.slice(0, 4).map((type) => (
                          <span
                            key={type}
                            className="ui-chip px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]"
                          >
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="ui-chip px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          National member network
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_0.95fr]">
            <div className="ui-section-layer p-6 sm:p-8 lg:p-10">
              <SectionHeader
                eyebrow="National overview"
                title="Mining has become central to Tanzania's economic story"
                text="The national homepage now focuses on the scale, momentum, and future-readiness of Tanzania's mining sector, and on the role FEMATA plays in helping that growth become more organized, productive, and visible."
              />

              <div className="mt-8 grid gap-5">
                {femataIntroductoryOverview.map((paragraph) => (
                  <div key={paragraph} className="ui-soft-panel p-5 sm:p-6">
                    <p className="text-sm leading-8 text-[rgb(var(--foreground))] sm:text-base">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="card-shell p-6 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
                  Why ASM matters
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-[rgb(var(--primary))] sm:text-3xl">
                  ASM is not peripheral to the economy
                </h3>
                <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">
                  Artisanal and small-scale mining is one of Tanzania&apos;s most important production and livelihood
                  systems. It supports miners, processors, traders, transport operators, equipment suppliers, food
                  vendors, and household economies linked to mining activity.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="ui-soft-panel p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Direct employment</p>
                    <p className="mt-2 text-3xl font-semibold text-[rgb(var(--primary))]">1.2M+</p>
                  </div>
                  <div className="ui-soft-panel p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                      Livelihood multiplier
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-[rgb(var(--primary))]">7.2M</p>
                  </div>
                </div>
              </div>

              <div className="card-shell p-6 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
                  FEMATA's practical role
                </p>
                <div className="mt-5 grid gap-4">
                  {femataGovernanceModel.map((item) => (
                    <div key={item.title} className="ui-soft-panel p-4">
                      <p className="text-sm font-semibold text-[rgb(var(--primary))]">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {topSlotAdverts.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <AdvertCarousel adverts={topSlotAdverts} slotNumber={1} />
            </div>
          </section>
        ) : null}

        <section className="section-shell pt-0">
          <div className="container-shell">
            <SectionHeader
              eyebrow="Sector snapshot"
              title="A stronger sector, measured in output, exports, and livelihoods"
              text="The numbers show a sector that is larger, more visible, and increasingly central to national growth. The opportunity is no longer theoretical. It is already material and nationally significant."
            />

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {femataSectorMetrics.map((metric) => (
                <MetricCard key={metric.label} label={metric.label} value={metric.value} note={metric.note} />
              ))}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {femataGrowthSignals.map((signal) => (
                <GrowthSignalCard key={signal.label} {...signal} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="grid gap-6">
              <div className="ui-section-layer p-6 sm:p-8">
                <SectionHeader
                  eyebrow="Mineral diversity"
                  title="The opportunity base is much broader than one mineral"
                  text="Tanzania's mining future is multi-layered. Precious metals, gemstones, strategic minerals, industrial minerals, and transition minerals all create different routes into value creation."
                />

                <div className="mt-8 grid gap-4">
                  {femataMineralFamilies.map((family) => (
                    <div key={family.title} className="ui-soft-panel p-5">
                      <h3 className="text-xl font-semibold text-[rgb(var(--primary))]">{family.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{family.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ui-section-layer p-6 sm:p-8">
              <SectionHeader
                eyebrow="Regional mining corridors"
                title="Different mineral corridors call for targeted strategies"
                text="Tanzania's mining opportunity is regional as well as national, which is why the sector needs both broad national coordination and place-specific support."
              />

              <div className="mt-8 grid gap-4">
                {femataCorridors.map((corridor) => (
                  <div key={corridor.title} className="card-shell p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="ui-chip px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                        {corridor.minerals}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-[rgb(var(--primary))]">{corridor.title}</h3>
                    <p className="mt-2 text-sm font-medium text-[rgb(var(--foreground))]">{corridor.regions}</p>
                    <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{corridor.opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="ui-section-layer p-6 sm:p-8">
              <SectionHeader
                eyebrow="Formalization"
                title="A more visible sector is easier to organize, support, and finance"
                text="Formalization is not just an administrative exercise. It improves visibility, traceability, market access, and the ability of institutions and partners to engage the sector more effectively."
              />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {femataFormalizationStats.map((item) => (
                  <div key={item.label} className="ui-soft-panel p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      {item.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">{item.value}</p>
                    <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="ui-section-layer p-6 sm:p-8">
              <SectionHeader
                eyebrow="Modernization need"
                title="The next stage depends on more productive licences, not just more licences"
                text="Many mining sites still operate with low recovery efficiency, weak geological intelligence, and limited processing technology. Productivity gains require better tools, better systems, and cleaner operational practices."
              />

              <div className="mt-8 grid gap-4">
                {femataModernizationThemes.map((item) => (
                  <div key={item.title} className="card-shell p-5">
                    <h3 className="text-lg font-semibold text-[rgb(var(--primary))]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {bottomSlotAdverts.length > 0 ? (
          <section className="section-shell pt-0">
            <div className="container-shell">
              <AdvertCarousel adverts={bottomSlotAdverts} slotNumber={2} compact />
            </div>
          </section>
        ) : null}

        <section className="section-shell pt-0">
          <div className="container-shell grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="ui-section-layer p-6 sm:p-8">
              <SectionHeader
                eyebrow="Finance and long-term growth"
                title="Bankability is improving, but stronger data and structure still matter"
                text="Formalization helps the sector become easier to lend to, easier to insure, easier to verify, and easier to support with working capital, equipment finance, and structured partnerships."
              />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {femataFinanceSignals.map((signal) => (
                  <div key={signal.label} className="card-shell p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      {signal.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">{signal.value}</p>
                    <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{signal.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] border border-[rgba(var(--border),0.9)] bg-[rgba(var(--surface),0.92)] p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent-2))]">
                  Exploration precision gap
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {femataExplorationSignals.map((item) => (
                    <div key={item.label} className="ui-soft-panel p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">{item.label}</p>
                      <p className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ui-section-layer p-6 sm:p-8">
              <SectionHeader
                eyebrow="Responsible and inclusive growth"
                title="Productivity, inclusion, and ESG need to move together"
                text="Tanzania's mining future will be stronger when better environmental performance, safer operations, more inclusive participation, and improved governance rise alongside output."
              />

              <div className="mt-8 grid gap-4">
                {femataInclusionThemes.map((theme) => (
                  <div key={theme.title} className="card-shell p-5 sm:p-6">
                    <h3 className="text-xl font-semibold text-[rgb(var(--primary))]">{theme.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{theme.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="ui-section-layer overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.09),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(8,47,73,0.09),transparent_24%)]" />

              <div className="relative z-10">
                <SectionHeader
                  eyebrow="What FEMATA makes possible"
                  title="From dispersed activity to structured progress"
                  text="FEMATA is not only a federation in name. It is a practical platform for helping Tanzania's artisanal and small-scale mining sector move from dispersed activity to structured progress."
                />

                <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {femataWhatMakesPossible.map((item) => (
                    <div key={item.title} className="card-shell p-5 sm:p-6">
                      <h3 className="text-xl font-semibold text-[rgb(var(--primary))]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[2rem] border border-[rgba(var(--border),0.9)] bg-[rgba(var(--surface),0.92)] p-6 sm:p-7">
                  <p className="text-sm leading-8 text-[rgb(var(--foreground))] sm:text-base">{femataClosingNarrative}</p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <AppLink href="/contact" className="btn-primary">
                      Partner with FEMATA
                    </AppLink>
                    <AppLink href="/about" className="btn-secondary">
                      Learn how FEMATA works
                    </AppLink>
                    <AppLink href="/associations" className="btn-secondary">
                      Browse association profiles
                    </AppLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
