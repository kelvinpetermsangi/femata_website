import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import {
  femataClosingNarrative,
  femataFinanceSignals,
  femataFormalizationStats,
  femataGovernanceModel,
  femataHeroSummary,
  femataInclusionThemes,
  femataIntroductoryOverview,
  femataSectorMetrics,
  femataWhatMakesPossible,
} from '@/lib/femataNarrative';
import { defaultAboutContent } from '@/lib/siteDefaults';
import PublicLayout from '@/layouts/PublicLayout';
import type { AboutContent, Announcement } from '@/types';

interface AboutProps {
  about?: AboutContent;
  announcements?: Announcement[];
}

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

export default function About({
  about = defaultAboutContent,
  announcements,
}: AboutProps) {
  const images =
    about.gallery && about.gallery.length > 0
      ? about.gallery
      : [
          'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        ];
  const heroImage =
    about.featured_image ||
    images[0] ||
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80';

  const institutionalNarrative = [
    "FEMATA is the national federation for Tanzania's artisanal and small-scale mining community. Its role is to organize, represent, and strengthen miners across the country through a structured network that links local mining groups, associations, regional structures, and national coordination.",
    'The federation helps turn a fragmented production landscape into a more connected and credible one. By bringing miners into organized structures, FEMATA helps improve visibility, collective engagement, and practical coordination across the sector. It also helps create better pathways for formalization, skills development, access to equipment, financing readiness, partnership facilitation, policy dialogue, and responsible mining practices.',
    'This structure gives FEMATA both reach and relevance. It allows local priorities to move upward into national dialogue while national programs, technical initiatives, and partnership opportunities move downward into the regions where miners actually work.',
  ];

  const strategicAgenda = [
    {
      title: 'Formalization and sector structure',
      text: 'FEMATA supports a sector that is easier to identify, register, regulate, support, and finance through stronger organization and clearer engagement pathways.',
    },
    {
      title: 'Productivity and modernization',
      text: 'The federation helps create the conditions for better equipment use, cleaner recovery, stronger data, and more commercially sustainable mining models.',
    },
    {
      title: 'Finance and bankability',
      text: 'A better-organized mining sector is easier to lend to, easier to verify, and easier to support with working capital, equipment finance, and structured partnerships.',
    },
    {
      title: 'Responsible growth and inclusion',
      text: 'FEMATA helps align productivity with ESG priorities, women and youth inclusion, and stronger community outcomes across mining regions.',
    },
  ];

  return (
    <>
      <Head title={about.title} />

      <PublicLayout announcements={announcements}>
        <section className="section-shell pb-6">
          <div className="container-shell">
            <div className="relative overflow-hidden rounded-[2.6rem] border border-white/10 bg-slate-950 shadow-[0_35px_110px_rgba(15,23,42,0.22)]">
              <div className="absolute inset-0">
                <img src={heroImage} alt={about.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.96),rgba(15,23,42,0.86),rgba(7,28,24,0.72))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_20%)]" />
              </div>

              <div className="relative grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.08fr)_390px] lg:px-10 lg:py-12">
                <div className="max-w-4xl">
                  <span className="inline-flex rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82 backdrop-blur-md">
                    About FEMATA
                  </span>

                  <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[4rem]">
                    {about.title}
                  </h1>

                  <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 sm:text-lg">
                    {about.body || femataHeroSummary}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <AppLink href="/contact" className="btn-primary">
                      Partner with FEMATA
                    </AppLink>
                    <AppLink
                      href="/associations"
                      className="btn-secondary border-white/18 bg-white/10 text-white hover:bg-white/16"
                    >
                      Browse association profiles
                    </AppLink>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="ui-shell-strong p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--primary))]">
                      FEMATA in context
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {femataSectorMetrics.slice(0, 4).map((metric) => (
                        <div key={metric.label} className="ui-soft-panel p-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                            {metric.label}
                          </p>
                          <p className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="ui-shell p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                      National mandate
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
                      FEMATA helps link local mining realities to national dialogue while moving national initiatives
                      and structured support back into mining communities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell grid gap-8 xl:grid-cols-[1.04fr_0.96fr]">
            <div className="ui-section-layer p-6 sm:p-8 lg:p-10">
              <SectionHeader
                eyebrow="Institutional role"
                title="A federation built to organize, represent, and strengthen miners"
                text="This page explains FEMATA less as a homepage gateway and more as an institution: how it is structured, why it matters, and what it enables across Tanzania's mining ecosystem."
              />

              <div className="mt-8 grid gap-5">
                {institutionalNarrative.map((paragraph) => (
                  <div key={paragraph} className="ui-soft-panel p-5 sm:p-6">
                    <p className="text-sm leading-8 text-[rgb(var(--foreground))] sm:text-base">{paragraph}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] border border-[rgba(var(--border),0.9)] bg-[rgba(var(--surface),0.92)] p-6 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
                  Institutional significance
                </p>
                <p className="mt-4 text-sm leading-8 text-[rgb(var(--foreground))] sm:text-base">
                  In a sector that remains geographically dispersed and operationally diverse, FEMATA helps bring
                  coherence, visibility, and implementation readiness. That matters for public dialogue, finance
                  conversations, technical support, and long-term sector credibility.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="card-shell overflow-hidden">
                <div className="grid gap-0 sm:grid-cols-2">
                  {images.slice(0, 4).map((image, index) => (
                    <div key={image} className="min-h-[180px] overflow-hidden bg-[rgb(var(--surface-2))]">
                      <img
                        src={image}
                        alt={`FEMATA gallery ${index + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-shell p-6 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
                  Strategic context
                </p>
                <div className="mt-5 grid gap-4">
                  {femataIntroductoryOverview.map((paragraph) => (
                    <div key={paragraph} className="ui-soft-panel p-4">
                      <p className="text-sm leading-7 text-[rgb(var(--muted))]">{paragraph}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <SectionHeader
              eyebrow="Governance model"
              title="How FEMATA works from national leadership to regional execution"
              text="FEMATA operates through a member-based governance structure that gives it both legitimacy and operational reach across the country."
            />

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {femataGovernanceModel.map((item) => (
                <div key={item.title} className="card-shell p-5 sm:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Governance layer
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell grid gap-8 xl:grid-cols-[0.96fr_1.04fr]">
            <div className="ui-section-layer p-6 sm:p-8">
              <SectionHeader
                eyebrow="Mission and direction"
                title="The principles that shape FEMATA's national role"
                text="Mission, vision, and values matter because the federation works at the intersection of representation, sector development, institutional trust, and public coordination."
              />

              <div className="mt-8 grid gap-4">
                <div className="card-shell p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Mission
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{about.mission}</p>
                </div>
                <div className="card-shell p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Vision
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{about.vision}</p>
                </div>
                <div className="card-shell p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Values
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">{about.values}</p>
                </div>
              </div>
            </div>

            <div className="ui-section-layer p-6 sm:p-8">
              <SectionHeader
                eyebrow="Development agenda"
                title="What the federation is trying to unlock across the sector"
                text="FEMATA matters because it helps close the gap between the scale of Tanzania's mining opportunity and the systems needed to support it properly."
              />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {strategicAgenda.map((item) => (
                  <div key={item.title} className="card-shell p-5">
                    <h3 className="text-lg font-semibold text-[rgb(var(--primary))]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="ui-section-layer p-6 sm:p-8">
              <SectionHeader
                eyebrow="Bankability and formalization"
                title="A stronger federation helps the sector become easier to support"
                text="Formalization improves not only compliance, but also bankability, documentation quality, and the credibility needed for modern financing relationships."
              />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {femataFormalizationStats.slice(0, 4).map((item) => (
                  <div key={item.label} className="ui-soft-panel p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      {item.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">{item.value}</p>
                    <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {femataFinanceSignals.slice(0, 2).map((item) => (
                  <div key={item.label} className="card-shell p-5">
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
                eyebrow="Inclusion and responsibility"
                title="A future-ready sector must also be more inclusive and more responsible"
                text="Women, youth, communities, and environmental performance are not side issues. They are core to long-term sector resilience and credibility."
              />

              <div className="mt-8 grid gap-4">
                {femataInclusionThemes.map((item) => (
                  <div key={item.title} className="card-shell p-5">
                    <h3 className="text-xl font-semibold text-[rgb(var(--primary))]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="ui-section-layer overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.09),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(8,47,73,0.09),transparent_22%)]" />

              <div className="relative z-10">
                <SectionHeader
                  eyebrow="What FEMATA makes possible"
                  title="A practical platform for structured progress"
                  text="FEMATA's value is not only representational. It is also operational. It helps organize implementation pathways for miners, associations, partners, and public institutions."
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
                    <AppLink href="/" className="btn-secondary">
                      Return to homepage
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
