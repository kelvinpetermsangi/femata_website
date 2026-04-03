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
      className={`mb-12 gap-8 rounded-[1.9rem] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(var(--surface),0.86),rgba(var(--surface-2),0.62))] px-5 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:px-6 sm:py-7 ${
        align === 'split'
          ? 'grid items-end lg:grid-cols-[minmax(0,1fr)_auto]'
          : 'max-w-3xl'
      }`}
    >
      <div>
        {eyebrow ? (
          <div className="inline-flex items-center rounded-full border border-[rgb(var(--accent))]/20 bg-[rgb(var(--accent))]/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))] shadow-sm">
            {eyebrow}
          </div>
        ) : null}

        <h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-[rgb(var(--primary))] sm:text-4xl">
          {title}
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-8 text-[rgb(var(--muted))] sm:text-lg">
          {text}
        </p>
      </div>

      {actionHref && actionLabel ? (
        <div className="flex items-end">
          <AppLink
            href={actionHref}
            className="btn-primary px-6"
          >
            {actionLabel}
          </AppLink>
        </div>
      ) : null}
    </div>
  );
}
