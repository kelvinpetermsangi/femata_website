import AppLink from '@/components/AppLink';

interface SectionLeadProps {
  eyebrow?: string;
  title: string;
  text: string;
  actionHref?: string;
  actionLabel?: string;
  align?: 'left' | 'split';
}

export default function SectionLead({
  eyebrow,
  title,
  text,
  actionHref,
  actionLabel,
  align = 'split',
}: SectionLeadProps) {
  return (
    <div
      className={`mb-12 gap-8 ${
        align === 'split'
          ? 'grid items-end lg:grid-cols-[minmax(0,1fr)_auto]'
          : 'max-w-3xl'
      }`}
    >
      <div>
        {eyebrow ? (
          <div className="inline-flex items-center rounded-full border border-[rgb(var(--accent))]/20 bg-[rgb(var(--accent))]/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent))] shadow-sm">
            {eyebrow}
          </div>
        ) : null}

        <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.02em] text-[rgb(var(--primary))] sm:text-4xl">
          {title}
        </h2>

        <p className="mt-5 max-w-3xl text-base leading-8 text-[rgb(var(--muted))] sm:text-lg">
          {text}
        </p>
      </div>

      {actionHref && actionLabel ? (
        <div className="flex items-end">
          <AppLink
            href={actionHref}
            className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-[rgb(var(--accent))]/25 bg-[linear-gradient(135deg,rgba(var(--primary),1),rgba(var(--accent),0.92))] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.12)] transition duration-200 hover:translate-y-[-1px] hover:shadow-[0_18px_36px_rgba(0,0,0,0.16)]"
          >
            {actionLabel}
          </AppLink>
        </div>
      ) : null}
    </div>
  );
}