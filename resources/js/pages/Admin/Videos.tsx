import { Head, router, useForm } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

type VideoItem = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  youtube_url: string;
  thumbnail?: string | null;
  category_id?: number | null;
  status_id: number;
  is_featured: boolean;
  published_at?: string | null;
};

type Option = { id: number; name: string };

type VideoForm = {
  title: string;
  slug: string;
  summary: string;
  youtube_url: string;
  thumbnail: string;
  category_id: string;
  status_id: string;
  is_featured: boolean;
  published_at: string;
};

const emptyForm = (): VideoForm => ({
  title: '',
  slug: '',
  summary: '',
  youtube_url: '',
  thumbnail: '',
  category_id: '',
  status_id: '',
  is_featured: false,
  published_at: '',
});

export default function AdminVideos({
  videos,
  videoCategories,
  contentStatuses,
}: {
  videos: VideoItem[];
  videoCategories: Option[];
  contentStatuses: Option[];
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<VideoForm>(emptyForm());

  const edit = (video: VideoItem) => {
    setEditingId(video.id);
    form.setData({
      title: video.title,
      slug: video.slug,
      summary: video.summary ?? '',
      youtube_url: video.youtube_url,
      thumbnail: video.thumbnail ?? '',
      category_id: video.category_id ? String(video.category_id) : '',
      status_id: String(video.status_id),
      is_featured: video.is_featured,
      published_at: video.published_at ?? '',
    });
  };

  const reset = () => {
    setEditingId(null);
    form.setData(emptyForm());
    form.clearErrors();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      slug: data.slug.trim() || null,
      summary: data.summary.trim() || null,
      thumbnail: data.thumbnail.trim() || null,
      category_id: data.category_id ? Number(data.category_id) : null,
      status_id: data.status_id ? Number(data.status_id) : null,
      published_at: data.published_at || null,
    }));

    if (editingId) {
      const current = videos.find((item) => item.id === editingId);
      if (!current) return;
      form.put(`/admin/videos/${current.slug}`, { preserveScroll: true, onSuccess: reset });
      return;
    }

    form.post('/admin/videos', { preserveScroll: true, onSuccess: reset });
  };

  const removeItem = (video: VideoItem) => {
    if (!window.confirm(`Delete "${video.title}"?`)) return;
    router.delete(`/admin/videos/${video.slug}`, { preserveScroll: true, onSuccess: reset });
  };

  return (
    <>
      <Head title="Videos admin" />
      <AdminLayout title="Online TV">
        <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-[rgb(var(--border))] p-4">
          <h2 className="text-lg font-semibold text-[rgb(var(--primary))]">
            {editingId ? 'Edit Video' : 'Create Video'}
          </h2>
          <input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Title" />
          <input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Slug (optional)" />
          <input value={form.data.youtube_url} onChange={(e) => form.setData('youtube_url', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="YouTube URL" />
          <textarea value={form.data.summary} onChange={(e) => form.setData('summary', e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Summary" />
          <div className="grid gap-3 md:grid-cols-2">
            <select value={form.data.category_id} onChange={(e) => form.setData('category_id', e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
              <option value="">Select category</option>
              {videoCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <select value={form.data.status_id} onChange={(e) => form.setData('status_id', e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
              <option value="">Select status</option>
              {contentStatuses.map((status) => <option key={status.id} value={status.id}>{status.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">{editingId ? 'Update video' : 'Create video'}</button>
            <button type="button" onClick={reset} className="btn-secondary">Reset</button>
          </div>
        </form>

        <section className="mt-6 grid gap-3">
          {videos.map((video) => (
            <article key={video.id} className="rounded-2xl border border-[rgb(var(--border))] p-4">
              <h3 className="font-semibold text-[rgb(var(--primary))]">{video.title}</h3>
              <p className="text-sm text-[rgb(var(--muted))]">{video.youtube_url}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => edit(video)} className="btn-secondary">Edit</button>
                <button type="button" onClick={() => removeItem(video)} className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">Delete</button>
              </div>
            </article>
          ))}
        </section>
      </AdminLayout>
    </>
  );
}
