import { Head, router, useForm } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

type Briefing = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  briefing_date?: string | null;
  status_id: number;
};

type Option = { id: number; name: string };

type BriefingForm = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  briefing_date: string;
  status_id: string;
};

const empty = (): BriefingForm => ({ title: '', slug: '', summary: '', content: '', briefing_date: '', status_id: '' });

export default function AdminPressBriefings({
  pressBriefings,
  contentStatuses,
}: {
  pressBriefings: Briefing[];
  contentStatuses: Option[];
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<BriefingForm>(empty());

  const edit = (item: Briefing) => {
    setEditingId(item.id);
    form.setData({
      title: item.title,
      slug: item.slug,
      summary: item.summary ?? '',
      content: item.content,
      briefing_date: item.briefing_date ?? '',
      status_id: String(item.status_id),
    });
  };

  const reset = () => {
    setEditingId(null);
    form.setData(empty());
    form.clearErrors();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.transform((data) => ({
      ...data,
      slug: data.slug.trim() || null,
      summary: data.summary.trim() || null,
      briefing_date: data.briefing_date || null,
      status_id: data.status_id ? Number(data.status_id) : null,
    }));

    if (editingId) {
      const current = pressBriefings.find((item) => item.id === editingId);
      if (!current) return;
      form.put(`/admin/press-briefings/${current.slug}`, { preserveScroll: true, onSuccess: reset });
      return;
    }

    form.post('/admin/press-briefings', { preserveScroll: true, onSuccess: reset });
  };

  const remove = (item: Briefing) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    router.delete(`/admin/press-briefings/${item.slug}`, { preserveScroll: true, onSuccess: reset });
  };

  return (
    <>
      <Head title="Press briefings admin" />
      <AdminLayout title="Press Briefings">
        <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-[rgb(var(--border))] p-4">
          <h2 className="text-lg font-semibold text-[rgb(var(--primary))]">{editingId ? 'Edit briefing' : 'Create briefing'}</h2>
          <input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="e.g. FEMATA statement on responsible mining" />
          <input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="femata-statement-on-responsible-mining" />
          <select value={form.data.status_id} onChange={(e) => form.setData('status_id', e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
            <option value="">Select status</option>
            {contentStatuses.map((status) => <option key={status.id} value={status.id}>{status.name}</option>)}
          </select>
          <textarea value={form.data.summary} onChange={(e) => form.setData('summary', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Short summary for the FEMATA press briefing..." />
          <textarea value={form.data.content} onChange={(e) => form.setData('content', e.target.value)} rows={7} className="rounded-xl border px-3 py-2 text-sm" placeholder="Write the full briefing or public statement here..." />
          <input type="date" value={form.data.briefing_date} onChange={(e) => form.setData('briefing_date', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" />
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">{editingId ? 'Update briefing' : 'Create briefing'}</button>
            <button type="button" onClick={reset} className="btn-secondary">Reset</button>
          </div>
        </form>

        <section className="mt-6 grid gap-3">
          {pressBriefings.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[rgb(var(--border))] p-4">
              <h3 className="font-semibold text-[rgb(var(--primary))]">{item.title}</h3>
              <p className="text-sm text-[rgb(var(--muted))]">{item.slug}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => edit(item)} className="btn-secondary">Edit</button>
                <button type="button" onClick={() => remove(item)} className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">Delete</button>
              </div>
            </article>
          ))}
        </section>
      </AdminLayout>
    </>
  );
}
