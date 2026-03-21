import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { defaultAboutContent } from '@/lib/siteDefaults';
import type { AboutContent, Announcement } from '@/types';

interface AboutProps {
  about?: AboutContent;
  announcements?: Announcement[];
}

interface InfoCardProps {
  label: string;
  content: string;
  accent: string;
  icon: string;
  tag: string;
}

function InfoCard({
  label,
  content,
  accent,
  icon,
  tag,
}: InfoCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className={`absolute left-0 top-0 h-1 w-full ${accent}`} />

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-black/5 blur-2xl" />
      </div>

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-white/70 text-xl shadow-sm transition-transform duration-300 group-hover:scale-105">
              {icon}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[rgb(var(--muted))]">
                {label}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
            {tag}
          </span>
        </div>

        <p className="text-base leading-8 text-[rgb(var(--primary))]">
          {content}
        </p>
      </div>
    </div>
  );
}

function HeroSection({
  title,
  body,
  featured_image,
  gallery,
}: Pick<AboutContent, 'title' | 'body' | 'featured_image' | 'gallery'>) {
  const images =
    gallery && gallery.length > 0
      ? gallery
      : [
          '/images/about/miner-1.jpg',
          '/images/about/miner-2.jpg',
          '/images/about/miner-3.jpg',
          '/images/about/miner-4.jpg',
        ];

  const heroImage =
    featured_image || images[0] || '/images/about/about-hero.jpg';

  return (
    <section className="section-shell">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950 shadow-2xl">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-900/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.10),transparent_20%)]" />
          </div>

          {images[0] && (
            <div className="about-float-slow absolute right-8 top-8 hidden h-40 w-32 rotate-[-7deg] overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md lg:block">
              <img
                src={images[0]}
                alt="Mining activity"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {images[1] && (
            <div className="about-float-medium absolute bottom-10 right-24 hidden h-44 w-36 rotate-[8deg] overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md md:block lg:block">
              <img
                src={images[1]}
                alt="Miner at work"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {images[2] && (
            <div className="about-float-soft absolute right-52 top-24 hidden h-32 w-28 rotate-6 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md xl:block">
              <img
                src={images[2]}
                alt="Mining operations"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="relative z-10 grid min-h-[560px] items-end px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-12 lg:px-14">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/85 backdrop-blur-md">
                About Us
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-8 text-white/80 sm:text-base">
                {body}
              </p>
            </div>

            <div className="mt-8 lg:col-span-5 lg:mt-0 lg:pl-8">
              <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                  Our story
                </p>

                <p className="mt-4 text-sm leading-7 text-white/82">
                  We represent people, communities, and industry progress
                  through advocacy, coordination, visibility, and
                  institution-building.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {images.slice(0, 2).map((image, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                    >
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="h-28 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionVisionValuesSection({
  mission,
  vision,
  values,
  gallery,
}: Pick<AboutContent, 'mission' | 'vision' | 'values' | 'gallery'>) {
  const sectionImages =
    gallery && gallery.length > 0
      ? gallery
      : [
          '/images/about/miner-1.jpg',
          '/images/about/miner-2.jpg',
          '/images/about/miner-3.jpg',
          '/images/about/miner-4.jpg',
        ];

  const featureImage =
    sectionImages[1] || sectionImages[0] || '/images/about/miner-1.jpg';

  const infoCards = [
    {
      label: 'Mission',
      content:
        mission ||
        'To strengthen representation, support miners, and promote sustainable sector development.',
      accent: 'bg-amber-500',
      icon: '◎',
      tag: 'Purpose',
    },
    {
      label: 'Vision',
      content:
        vision ||
        'A respected, organized, and forward-looking mining sector that delivers value widely.',
      accent: 'bg-sky-500',
      icon: '◌',
      tag: 'Direction',
    },
    {
      label: 'Values',
      content:
        values ||
        'Integrity, collaboration, accountability, inclusion, and sustainable progress.',
      accent: 'bg-emerald-500',
      icon: '✦',
      tag: 'Standards',
    },
  ] as const;

  return (
    <section className="section-shell pt-0">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.97))] p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.55)] to-transparent" />
            <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-amber-200/20 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-slate-300/20 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:32px_32px]" />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div className="group overflow-hidden rounded-[1.75rem] border border-[rgb(var(--border))] bg-white/70 shadow-md">
                <div className="relative overflow-hidden">
                  <img
                    src={featureImage}
                    alt="FEMATA guiding principles"
                    className="h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/75">
                      Institutional foundation
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      What guides FEMATA
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-white/80">
                      A clear mission, a credible vision, and strong values
                      create confidence across communities, partners, and the
                      wider mining ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[rgb(var(--muted))]">
                Core Foundation
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))] sm:text-3xl lg:text-[2rem]">
                The principles that shape our direction
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))] sm:text-base">
                Our mission, vision, and values define how we represent miners,
                strengthen institutional credibility, and support long-term,
                responsible sector progress.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {['Advocacy', 'Representation', 'Coordination', 'Standards'].map(
                  (item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))] shadow-sm"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="relative mt-10 grid gap-6 lg:grid-cols-3">
            <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-8 hidden h-px bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.08)] to-transparent lg:block" />

            {infoCards.map((card) => (
              <InfoCard
                key={card.label}
                label={card.label}
                content={card.content}
                accent={card.accent}
                icon={card.icon}
                tag={card.tag}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function About({
  about = defaultAboutContent,
  announcements,
}: AboutProps) {
  const { title, body, mission, vision, values, featured_image, gallery } =
    about;

  return (
    <>
      <Head title={title} />

      <PublicLayout announcements={announcements}>
        <HeroSection
          title={title}
          body={body}
          featured_image={featured_image}
          gallery={gallery}
        />

        <MissionVisionValuesSection
          mission={mission}
          vision={vision}
          values={values}
          gallery={gallery}
        />
      </PublicLayout>
    </>
  );
}