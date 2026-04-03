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
    <section className="section-shell pb-10 pt-3">
      <div className="container-shell">
        <div
          className="relative overflow-hidden rounded-[2.35rem] border border-[rgb(var(--border))] shadow-[0_28px_80px_rgba(0,0,0,0.12)]"
          style={{
            backgroundImage: `
              linear-gradient(
                118deg,
                rgba(255, 251, 244, 0.97) 0%,
                rgba(249, 252, 249, 0.95) 30%,
                rgba(236, 248, 244, 0.82) 56%,
                rgba(223, 238, 247, 0.58) 100%
              ),
              url('${image}')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.2),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(var(--primary),0.14),transparent_28%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(15,23,42,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.18)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(var(--surface),0.38),transparent)]" />
          <div className="absolute right-[-70px] top-[-70px] h-56 w-56 rounded-full border border-black/5 bg-[rgba(var(--surface),0.52)] blur-2xl" />
          <div className="absolute bottom-[-90px] left-[-40px] h-64 w-64 rounded-full border border-black/5 bg-[rgb(var(--accent))]/12 blur-3xl" />

          <div className="relative grid min-h-[360px] gap-8 px-6 py-10 sm:px-8 sm:py-12 lg:min-h-[420px] lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-16">
            <div className="flex max-w-3xl flex-col justify-between">
              <div>
                <div className="ui-chip w-fit px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--primary))] shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md">
                  {eyebrow}
                </div>

                <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-[rgb(var(--primary))] sm:text-5xl lg:text-[4.25rem]">
                  {title}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[rgb(var(--muted))] sm:text-lg">
                  {text}
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="ui-soft-panel px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Federation scope
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[rgb(var(--primary))]">
                    National coordination
                  </p>
                </div>

                <div className="ui-soft-panel px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Public access
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[rgb(var(--primary))]">
                    Notices and resources
                  </p>
                </div>

                <div className="ui-soft-panel px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Sector focus
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[rgb(var(--primary))]">
                    Responsible mining
                  </p>
                </div>
              </div>
            </div>

            {children ? (
              <div className="flex items-end lg:justify-end">
                <div className="ui-shell w-full max-w-[440px] p-3 shadow-[0_22px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                  <div className="rounded-[1.45rem] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(var(--surface),0.94),rgba(var(--surface-2),0.84))] p-5 text-[rgb(var(--primary))] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl sm:p-6">
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
