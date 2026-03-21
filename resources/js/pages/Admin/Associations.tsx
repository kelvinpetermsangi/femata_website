import { Head, router, useForm } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

type AssociationItem = {
  id: number;
  name: string;
  slug: string;
  region?: string | null;
  district?: string | null;
  phone?: string | null;
  email?: string | null;
  is_active: boolean;
  document_ids?: number[];
};

type DocumentOption = { id: number; title: string };

type AssociationForm = {
  name: string;
  slug: string;
  region: string;
  district: string;
  phone: string;
  email: string;
  is_active: boolean;
  document_ids: number[];
};

const empty = (): AssociationForm => ({
  name: '',
  slug: '',
  region: '',
  district: '',
  phone: '',
  email: '',
  is_active: true,
  document_ids: [],
});

export default function AdminAssociations({
  associations,
  documents,
}: {
  associations: AssociationItem[];
  documents: DocumentOption[];
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<AssociationForm>(empty());

  const edit = (item: AssociationItem) => {
    setEditingId(item.id);
    form.setData({
      name: item.name,
      slug: item.slug,
      region: item.region ?? '',
      district: item.district ?? '',
      phone: item.phone ?? '',
      email: item.email ?? '',
      is_active: item.is_active,
      document_ids: item.document_ids ?? [],
    });
  };

  const reset = () => {
    setEditingId(null);
    form.setData(empty());
    form.clearErrors();
  };

  const toggleDocument = (id: number) => {
    if (form.data.document_ids.includes(id)) {
      form.setData('document_ids', form.data.document_ids.filter((item) => item !== id));
      return;
    }
    form.setData('document_ids', [...form.data.document_ids, id]);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.transform((data) => ({ ...data, slug: data.slug.trim() || null }));

    if (editingId) {
      const current = associations.find((item) => item.id === editingId);
      if (!current) return;
      form.put(`/admin/associations/${current.slug}`, { preserveScroll: true, onSuccess: reset });
      return;
    }

    form.post('/admin/associations', { preserveScroll: true, onSuccess: reset });
  };

  const remove = (item: AssociationItem) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    router.delete(`/admin/associations/${item.slug}`, { preserveScroll: true, onSuccess: reset });
  };

  return (
    <>
      <Head title="Associations admin" />
      <AdminLayout title="Associations">
        <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-[rgb(var(--border))] p-4">
          <h2 className="text-lg font-semibold text-[rgb(var(--primary))]">{editingId ? 'Edit association' : 'Create association'}</h2>
          <input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Association name" />
          <input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Slug (optional)" />
          <div className="grid gap-3 md:grid-cols-2">
            <input value={form.data.region} onChange={(e) => form.setData('region', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Region" />
            <input value={form.data.district} onChange={(e) => form.setData('district', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="District" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Phone" />
            <input value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Email" />
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Linked documents</p>
            <div className="mt-2 grid gap-2">
              {documents.map((document) => (
                <label key={document.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.data.document_ids.includes(document.id)} onChange={() => toggleDocument(document.id)} />
                  <span>{document.title}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
            <span>Active</span>
          </label>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">{editingId ? 'Update association' : 'Create association'}</button>
            <button type="button" onClick={reset} className="btn-secondary">Reset</button>
          </div>
        </form>

        <section className="mt-6 grid gap-3">
          {associations.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[rgb(var(--border))] p-4">
              <h3 className="font-semibold text-[rgb(var(--primary))]">{item.name}</h3>
              <p className="text-sm text-[rgb(var(--muted))]">{item.region ?? 'No region'}</p>
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
