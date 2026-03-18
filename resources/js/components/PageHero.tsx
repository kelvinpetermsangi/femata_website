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
    <section className="section-shell pb-10">
      <div className="container-shell">
        <div
          className="page-hero overflow-hidden rounded-[2rem] border border-[rgb(var(--border))]"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(247, 243, 232, 0.97) 0%, rgba(247, 243, 232, 0.92) 40%, rgba(247, 243, 232, 0.52) 100%), url('${image}')`,
          }}
        >
          <div className="grid gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
            <div className="max-w-3xl">
              <span className="eyebrow-mark">{eyebrow}</span>
              <h1 className="display-title mt-5">{title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[rgb(var(--muted))] sm:text-lg">
                {text}
              </p>
            </div>

            {children ? (
              <div className="flex items-end lg:justify-end">
                <div className="surface-panel w-full max-w-md">{children}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
