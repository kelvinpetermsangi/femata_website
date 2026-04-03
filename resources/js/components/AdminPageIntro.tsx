type IntroMetric = {
  label: string;
  value: string;
};

export default function AdminPageIntro({
  eyebrow,
  title,
  text,
  metrics = [],
}: {
  eyebrow: string;
  title: string;
  text: string;
  metrics?: IntroMetric[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(2,132,199,0.08),transparent_34%),linear-gradient(180deg,#ffffff,#f8fafc)] px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-7 sm:py-7">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(15,23,42,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.22)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 sm:text-base">{text}</p>

        {metrics.length > 0 ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-none xl:auto-cols-fr xl:grid-flow-col">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[1.3rem] border border-slate-200 bg-white/92 px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{metric.value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
