import { Head, router, useForm } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

type PageItem = {
  id: number;
  title: string;
  slug: string;
  content: string;
  status_id: number;
};

type StatusOption = { id: number; name: string };

type PageForm = {
  title: string;
  slug: string;
  content: string;
  status_id: string;
};

const empty = (): PageForm => ({ title: '', slug: '', content: '', status_id: '' });

export default function AdminPages({ pages, contentStatuses }: { pages: PageItem[]; contentStatuses: StatusOption[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<PageForm>(empty());

  const edit = (page: PageItem) => {
    setEditingId(page.id);
    form.setData({ title: page.title, slug: page.slug, content: page.content, status_id: String(page.status_id) });
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
      status_id: data.status_id ? Number(data.status_id) : null,
    }));
    if (editingId) {
      const current = pages.find((item) => item.id === editingId);
      if (!current) return;
      form.put(`/admin/pages/${current.slug}`, { preserveScroll: true, onSuccess: reset });
      return;
    }
    form.post('/admin/pages', { preserveScroll: true, onSuccess: reset });
  };

  const remove = (page: PageItem) => {
    if (!window.confirm(`Delete "${page.title}"?`)) return;
    router.delete(`/admin/pages/${page.slug}`, { preserveScroll: true, onSuccess: reset });
  };

  return (
    <>
      <Head title="Pages admin" />
      <AdminLayout title="Pages">
        <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-[rgb(var(--border))] p-4">
          <h2 className="text-lg font-semibold text-[rgb(var(--primary))]">{editingId ? 'Edit Page' : 'Create Page'}</h2>
          <input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Title" />
          <input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Slug (optional)" />
          <select value={form.data.status_id} onChange={(e) => form.setData('status_id', e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
            <option value="">Select status</option>
            {contentStatuses.map((status) => <option key={status.id} value={status.id}>{status.name}</option>)}
          </select>
          <textarea value={form.data.content} onChange={(e) => form.setData('content', e.target.value)} rows={8} className="rounded-xl border px-3 py-2 text-sm" placeholder="Content" />
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">{editingId ? 'Update page' : 'Create page'}</button>
            <button type="button" onClick={reset} className="btn-secondary">Reset</button>
          </div>
        </form>

        <section className="mt-6 grid gap-3">
          {pages.map((page) => (
            <article key={page.id} className="rounded-2xl border border-[rgb(var(--border))] p-4">
              <h3 className="font-semibold text-[rgb(var(--primary))]">{page.title}</h3>
              <p className="text-sm text-[rgb(var(--muted))]">{page.slug}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => edit(page)} className="btn-secondary">Edit</button>
                <button type="button" onClick={() => remove(page)} className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">Delete</button>
              </div>
            </article>
          ))}
        </section>
      </AdminLayout>
    </>
  );
}
