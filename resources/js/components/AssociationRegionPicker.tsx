export default function AssociationRegionPicker({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  options: string[];
}) {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
      return;
    }

    onChange([...value, option]);
  };

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(options)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:bg-slate-50"
        >
          Select all
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:bg-slate-50"
        >
          Clear
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {options.map((option) => {
          const active = value.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`rounded-[1rem] border px-3 py-3 text-left text-sm font-medium transition ${
                active
                  ? 'border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary))]/[0.08] text-[rgb(var(--primary))] shadow-[0_12px_24px_rgba(15,23,42,0.08)]'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
