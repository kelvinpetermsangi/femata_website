import { Head } from '@inertiajs/react';
import AppLink from '@/components/AppLink';
import AdminLayout from '@/layouts/AdminLayout';

type DashboardStat = {
  label: string;
  value: number;
  detail: string;
  href: string;
};

type DashboardItem = {
  id: number;
  title: string;
  meta: string;
  status: string;
};

function StatusPill({ value }: { value: string }) {
  const isPositive = value === 'Active' || value === 'Published' || value === 'Public';

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
        isPositive
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-amber-50 text-amber-700'
      }`}
    >
      {value}
    </span>
  );
}

function ItemList({
  title,
  href,
  items,
  emptyMessage,
}: {
  title: string;
  href: string;
  items: DashboardItem[];
  emptyMessage: string;
}) {
  return (
    <section className="card-shell p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
            Recently updated
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[rgb(var(--primary))]">{title}</h2>
        </div>

        <AppLink
          href={href}
          className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--primary))] shadow-sm transition hover:bg-[rgb(var(--surface-2))]"
        >
          Open
        </AppLink>
      </div>

      <div className="mt-5 grid gap-3">
        {items.length === 0 ? (
          <div className="rounded-[1.2rem] border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/55 px-4 py-5 text-sm text-[rgb(var(--muted))]">
            {emptyMessage}
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold leading-6 text-[rgb(var(--primary))]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-[rgb(var(--muted))]">{item.meta}</p>
                </div>

                <StatusPill value={item.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function AdminDashboard({
  stats,
  recentAnnouncements,
  recentNews,
  recentDocuments,
}: {
  stats: DashboardStat[];
  recentAnnouncements: DashboardItem[];
  recentNews: DashboardItem[];
  recentDocuments: DashboardItem[];
}) {
  return (
    <>
      <Head title="Dashboard" />

      <AdminLayout title="Dashboard">
        <section className="soft-band overflow-hidden rounded-[1.9rem] px-5 py-6 text-white sm:px-7 sm:py-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/68">
            Admin overview
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            FEMATA content operations at a glance.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/82 sm:text-base">
            This dashboard is connected to the backend models and shows the current content
            footprint across announcements, newsroom updates, leadership, gallery items, and
            public resources.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <AppLink
              href="/admin/settings"
              className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[rgb(var(--primary))] shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition hover:translate-y-[-1px]"
            >
              Open settings
            </AppLink>
            <AppLink
              href="/admin/news"
              className="inline-flex items-center rounded-full border border-white/18 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
            >
              Manage news
            </AppLink>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <AppLink
              key={stat.label}
              href={stat.href}
              className="card-shell card-shell-hover block p-5"
            >
              <p className="text-sm text-[rgb(var(--muted))]">{stat.label}</p>
              <p className="mt-3 text-4xl font-semibold text-[rgb(var(--primary))]">{stat.value}</p>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">{stat.detail}</p>
            </AppLink>
          ))}
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-3">
          <ItemList
            title="Announcements"
            href="/admin/announcements"
            items={recentAnnouncements}
            emptyMessage="No announcements have been added yet."
          />
          <ItemList
            title="News"
            href="/admin/news"
            items={recentNews}
            emptyMessage="No news entries are available yet."
          />
          <ItemList
            title="Documents"
            href="/admin/documents"
            items={recentDocuments}
            emptyMessage="No documents have been uploaded yet."
          />
        </section>
      </AdminLayout>
    </>
  );
}
