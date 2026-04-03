import type { ReactNode } from 'react';
import AppLink from '@/components/AppLink';
import BrandMark from '@/components/BrandMark';

export default function AuthShell({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef4f2,#f6f8fb)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(10,53,48,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(180,132,34,0.16),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(15,23,42,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.16)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(2,6,23,0.92),rgba(15,23,42,0.78),rgba(6,78,59,0.70))]" />
          </div>

          <div className="relative px-10 pb-10 pt-12 xl:px-14 xl:pb-14 xl:pt-14">
            <div className="h-18 w-18">
              <BrandMark
                imageClassName="h-full w-full rounded-[1.7rem] border border-white/14 bg-white/10 object-contain p-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-md"
                fallbackClassName="flex h-full w-full items-center justify-center rounded-[1.7rem] border border-white/14 bg-white/10 text-lg font-semibold tracking-[0.22em] text-white backdrop-blur-md"
              />
            </div>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/68">
              FEMATA Secretariat
            </p>
            <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-tight text-white xl:text-6xl">
              Secure publishing and association management for the FEMATA website.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/78">
              Sign in to manage FEMATA notices, leadership profiles, association mini-sites,
              documents, adverts, gallery media, and core website presentation from one
              branded secretariat workspace.
            </p>
          </div>

          <div className="relative grid gap-4 px-10 pb-12 xl:grid-cols-2 xl:px-14 xl:pb-14">
            <div className="rounded-[1.7rem] border border-white/12 bg-white/10 p-6 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/64">
                Secretariat access
              </p>
              <p className="mt-3 text-xl font-semibold text-white">
                Full-screen branded authentication
              </p>
              <p className="mt-3 text-sm leading-7 text-white/74">
                The FEMATA admin sign-in now runs edge to edge with clearer hierarchy,
                better contrast, and stronger brand presence.
              </p>
            </div>

            <div className="rounded-[1.7rem] border border-white/12 bg-white/10 p-6 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/64">
                What you can manage
              </p>
              <p className="mt-3 text-xl font-semibold text-white">
                Public communications, member profiles, and site settings
              </p>
              <p className="mt-3 text-sm leading-7 text-white/74">
                From announcements and documents to association pages and branding,
                the dashboard keeps FEMATA's digital presence organized and current.
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(10,53,48,0.08),transparent_28%)]" />

          <div className="relative mx-auto w-full max-w-xl">
            <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  FEMATA Secretariat
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  Website Management Console
                </p>
              </div>

              <div className="h-14 w-14">
                <BrandMark
                  imageClassName="h-full w-full rounded-[1.15rem] border border-slate-200 bg-white object-contain p-2 shadow-[0_12px_28px_rgba(15,23,42,0.18)]"
                  fallbackClassName="flex h-full w-full items-center justify-center rounded-[1.15rem] border border-slate-200 bg-slate-950 text-sm font-semibold tracking-[0.2em] text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]"
                />
              </div>
            </div>

            <div className="ui-shell-strong p-6 sm:p-8 lg:p-10">
              <span className="ui-chip px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--accent-2))]">
                {eyebrow}
              </span>

              <h2 className="mt-5 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-8 text-slate-600 sm:text-base">
                {text}
              </p>

              <div className="mt-8">{children}</div>

              <div className="mt-8 border-t border-[rgb(var(--border))] pt-6 text-sm text-slate-500">
                <AppLink
                  href="/"
                  className="font-semibold text-slate-900 underline underline-offset-4"
                >
                  Return to FEMATA website
                </AppLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
