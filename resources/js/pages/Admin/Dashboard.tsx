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

type AssociationWorkspace = {
  id: number;
  name: string;
  slug: string;
  regions?: string[];
  leaders_count?: number;
  gallery_count?: number;
  document_count?: number;
  is_active: boolean;
  href: string;
};

function statusTone(value: string) {
  if (value === 'Active' || value === 'Published' || value === 'Public') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }

  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function statTone(label: string) {
  switch (label) {
    case 'Announcements':
      return {
        badge: 'AN',
        chip: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        glow: 'bg-emerald-500/10',
      };
    case 'News posts':
      return {
        badge: 'NW',
        chip: 'border-sky-200 bg-sky-50 text-sky-700',
        glow: 'bg-sky-500/10',
      };
    case 'Videos':
      return {
        badge: 'VD',
        chip: 'border-violet-200 bg-violet-50 text-violet-700',
        glow: 'bg-violet-500/10',
      };
    case 'Leaders':
      return {
        badge: 'LD',
        chip: 'border-amber-200 bg-amber-50 text-amber-700',
        glow: 'bg-amber-500/10',
      };
    case 'Associations':
      return {
        badge: 'AS',
        chip: 'border-cyan-200 bg-cyan-50 text-cyan-700',
        glow: 'bg-cyan-500/10',
      };
    case 'Documents':
      return {
        badge: 'DC',
        chip: 'border-rose-200 bg-rose-50 text-rose-700',
        glow: 'bg-rose-500/10',
      };
    case 'Meetings':
      return {
        badge: 'MT',
        chip: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
        glow: 'bg-fuchsia-500/10',
      };
    default:
      return {
        badge: 'FM',
        chip: 'border-slate-200 bg-slate-50 text-slate-700',
        glow: 'bg-slate-500/10',
      };
  }
}

function StatCard({ stat }: { stat: DashboardStat }) {
  const tone = statTone(stat.label);

  return (
    <AppLink
      href={stat.href}
      className="group relative overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-[2px] hover:border-slate-300 hover:shadow-[0_20px_42px_rgba(15,23,42,0.08)]"
    >
      <div className={`absolute right-[-14px] top-[-18px] h-24 w-24 rounded-full blur-2xl ${tone.glow}`} />

      <div className="relative flex items-start justify-between gap-4">
        <div
          className={`inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border text-[11px] font-semibold uppercase tracking-[0.16em] ${tone.chip}`}
        >
          {tone.badge}
        </div>

        <span className="text-xs font-medium text-slate-400 transition group-hover:text-slate-600">
          Open
        </span>
      </div>

      <div className="relative mt-5">
        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
        <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
          {stat.value}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{stat.detail}</p>
      </div>
    </AppLink>
  );
}

function FeedColumn({
  eyebrow,
  title,
  href,
  items,
  emptyMessage,
}: {
  eyebrow: string;
  title: string;
  href: string;
  items: DashboardItem[];
  emptyMessage: string;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2>
        </div>

        <AppLink
          href={href}
          className="inline-flex min-h-[42px] items-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          Manage
        </AppLink>
      </div>

      <div className="mt-5 grid gap-3">
        {items.length === 0 ? (
          <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm leading-7 text-slate-600">
            {emptyMessage}
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-[1.3rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-4 py-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.95rem] border border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold leading-6 text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">{item.meta}</p>
                    </div>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusTone(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function OperationsPanel({ stats }: { stats: DashboardStat[] }) {
  const totalContent = stats.reduce((sum, stat) => sum + stat.value, 0);
  const availableHrefs = new Set(stats.map((stat) => stat.href));
  const actions = [
    {
      title: 'Update FEMATA branding',
      text: 'Adjust the official logo path, footer presentation, homepage messaging, and secretariat contact information.',
      href: '/admin/settings',
    },
    {
      title: 'Manage FEMATA newsroom',
      text: 'Create, review, and publish the latest federation stories, statements, and sector updates.',
      href: '/admin/news',
    },
    {
      title: 'Review official notices',
      text: 'Keep current FEMATA notices visible and properly ordered by urgency, audience, and priority.',
      href: '/admin/announcements',
    },
    {
      title: 'Update resource library',
      text: 'Add reports, circulars, public forms, and other reference materials for FEMATA members and partners.',
      href: '/admin/documents',
    },
    {
      title: 'Review meeting bookings',
      text: 'Approve, adjust, or decline requested meeting slots and notify the requester by email.',
      href: '/admin/meetings',
    },
  ].filter((action) => action.href === '/admin/settings' || availableHrefs.has(action.href));

  return (
    <section className="grid gap-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(2,132,199,0.08),transparent_34%),linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Secretariat content pulse
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">FEMATA publishing system</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          FEMATA currently exposes a combined content footprint of{' '}
          <span className="font-semibold text-slate-950">{totalContent}</span> managed records
          across public-facing modules.
        </p>

        <div className="mt-5 grid gap-3">
          {stats.slice(0, 3).map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-950">{stat.label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                  {stat.detail}
                </p>
              </div>
              <p className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Quick actions
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Keep the federation current</h2>

        <div className="mt-5 grid gap-3">
          {actions.map((action) => (
            <AppLink
              key={action.href}
              href={action.href}
              className="rounded-[1.2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-4 py-4 transition hover:border-slate-300 hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)]"
            >
              <p className="text-sm font-semibold text-slate-950">{action.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{action.text}</p>
            </AppLink>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkspacePanel({
  workspaces,
}: {
  workspaces: AssociationWorkspace[];
}) {
  if (workspaces.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Association workspaces
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Assigned association builders</h2>
        </div>

        <AppLink
          href="/admin/associations"
          className="inline-flex min-h-[42px] items-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          Open all
        </AppLink>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {workspaces.map((workspace) => (
          <AppLink
            key={workspace.id}
            href={workspace.href}
            className="rounded-[1.35rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-4 transition hover:border-slate-300 hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)]"
          >
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  workspace.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {workspace.is_active ? 'Active' : 'Hidden'}
              </span>
              {(workspace.regions ?? []).slice(0, 2).map((region) => (
                <span key={region} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                  {region}
                </span>
              ))}
            </div>

            <h3 className="mt-3 text-lg font-semibold text-slate-950">{workspace.name}</h3>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-[1rem] border border-slate-200 bg-white px-2 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Leaders</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{workspace.leaders_count ?? 0}</p>
              </div>
              <div className="rounded-[1rem] border border-slate-200 bg-white px-2 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Gallery</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{workspace.gallery_count ?? 0}</p>
              </div>
              <div className="rounded-[1rem] border border-slate-200 bg-white px-2 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Docs</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{workspace.document_count ?? 0}</p>
              </div>
            </div>
          </AppLink>
        ))}
      </div>
    </section>
  );
}

export default function AdminDashboard({
  stats,
  recentAnnouncements,
  recentNews,
  recentDocuments,
  recentMeetings,
  associationWorkspaces,
}: {
  stats: DashboardStat[];
  recentAnnouncements: DashboardItem[];
  recentNews: DashboardItem[];
  recentDocuments: DashboardItem[];
  recentMeetings: DashboardItem[];
  associationWorkspaces: AssociationWorkspace[];
}) {
  return (
    <>
      <Head title="Dashboard" />

      <AdminLayout title="Dashboard">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(2,132,199,0.08),transparent_34%),linear-gradient(180deg,#ffffff,#f8fafc)] px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-7 sm:py-7">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_360px] xl:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Admin overview
              </p>
              <h2 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                A modern control room for FEMATA publishing, branding, and association operations.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 sm:text-base">
                The secretariat can use this dashboard to keep FEMATA's public communication,
                national brand presentation, and association mini-sites current through a clearer,
                faster editorial workflow.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <AppLink
                  href="/admin/settings"
                  className="btn-primary"
                >
                  Open FEMATA settings
                </AppLink>
                <AppLink
                  href="/admin/news"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Open newsroom
                </AppLink>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {stats.map((stat) => (
                  <span
                    key={stat.label}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700"
                  >
                    {stat.label}: {stat.value}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  FEMATA admin direction
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  Secretariat-first dashboard with Laravel still driving the backend.
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Cleaner cards, clearer spacing, stronger contrast, and quicker movement across
                  content modules without changing your existing server-side architecture.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Interface goals
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    Better readability across every card
                  </div>
                  <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    Faster scanning of content status and volume
                  </div>
                  <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    Cleaner navigation and action affordances
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_360px]">
          <FeedColumn
            eyebrow="Recent activity"
            title="Announcements"
            href="/admin/announcements"
            items={recentAnnouncements}
            emptyMessage="No FEMATA announcements have been published yet. Use the announcements module to post the next official notice."
          />
          <FeedColumn
            eyebrow="Publishing stream"
            title="News"
            href="/admin/news"
            items={recentNews}
            emptyMessage="No newsroom stories are available yet. Publish a FEMATA update to start the public news stream."
          />
          <div className="grid gap-6">
            <FeedColumn
              eyebrow="Resource library"
              title="Documents"
              href="/admin/documents"
              items={recentDocuments}
              emptyMessage="No FEMATA public documents have been uploaded yet. Add a circular, report, or guide to populate the resource library."
            />
            {recentMeetings.length > 0 ? (
              <FeedColumn
                eyebrow="Meeting queue"
                title="Meetings"
                href="/admin/meetings"
                items={recentMeetings}
                emptyMessage="No meeting requests are waiting right now."
              />
            ) : null}
            <OperationsPanel stats={stats} />
          </div>
        </section>

        <section className="mt-6">
          <WorkspacePanel workspaces={associationWorkspaces} />
        </section>
      </AdminLayout>
    </>
  );
}
