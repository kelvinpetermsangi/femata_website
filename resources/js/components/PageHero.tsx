import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  children?: ReactNode;
}

export default function PageHero({
  eyebrow,
  title,
  text,
  image,
  children,
}: PageHeroProps) {
  return (
    <section className="section-shell pb-10 pt-2">
      <div className="container-shell">
        <div
          className="relative overflow-hidden rounded-[2rem] border border-[rgb(var(--border))] shadow-[0_24px_70px_rgba(0,0,0,0.12)]"
          style={{
            backgroundImage: `
              linear-gradient(
                110deg,
                rgba(6, 25, 34, 0.94) 0%,
                rgba(10, 39, 50, 0.9) 34%,
                rgba(14, 61, 74, 0.74) 58%,
                rgba(14, 61, 74, 0.36) 100%
              ),
              url('${image}')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.22),transparent_34%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(0,0,0,0.18),transparent)]" />
          <div className="absolute right-[-70px] top-[-70px] h-56 w-56 rounded-full border border-white/10 bg-white/5 blur-2xl" />
          <div className="absolute bottom-[-90px] left-[-40px] h-64 w-64 rounded-full border border-white/8 bg-[rgb(var(--accent))]/10 blur-3xl" />

          <div className="relative grid min-h-[340px] gap-8 px-6 py-10 sm:px-8 sm:py-12 lg:min-h-[400px] lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-16">
            <div className="flex max-w-3xl flex-col justify-center">
              <div className="inline-flex w-fit items-center rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/78 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md">
                {eyebrow}
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                {text}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/76">
                  National Representation
                </span>
                <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/76">
                  Responsible Mining
                </span>
                <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/76">
                  Sector Coordination
                </span>
              </div>
            </div>

            {children ? (
              <div className="flex items-end lg:justify-end">
                <div className="w-full max-w-md rounded-[1.6rem] border border-white/12 bg-white/10 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/92 p-5 text-[rgb(var(--primary))] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                    {children}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
