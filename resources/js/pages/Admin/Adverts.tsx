import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import AdminPageIntro from '@/components/AdminPageIntro';
import AdminLayout from '@/layouts/AdminLayout';
import type { AdvertItem, Association, AssociationType, SharedPageProps } from '@/types';

type Option = {
  value: string;
  label: string;
};

type AdvertForm = {
  title: string;
  slug: string;
  media_type: 'image' | 'video';
  asset_url: string;
  poster_url: string;
  headline: string;
  body: string;
  cta_label: string;
  cta_url: string;
  page_key: string;
  slot_number: number;
  placement_scope: string;
  association_id: string;
  association_type_id: string;
  region: string;
  display_order: number;
  duration_seconds: number;
  is_active: boolean;
};

function emptyForm(pageOptions: Option[], placementScopes: Option[]): AdvertForm {
  return {
    title: '',
    slug: '',
    media_type: 'image',
    asset_url: '',
    poster_url: '',
    headline: '',
    body: '',
    cta_label: '',
    cta_url: '',
    page_key: pageOptions[0]?.value ?? 'home',
    slot_number: 1,
    placement_scope: placementScopes[0]?.value ?? 'national',
    association_id: '',
    association_type_id: '',
    region: '',
    display_order: 0,
    duration_seconds: 6,
    is_active: true,
  };
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[rgb(var(--primary))]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[rgb(var(--muted))]">{hint}</span> : null}
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}

function targetSummary(advert: AdvertItem) {
  if (advert.placement_scope === 'association' && advert.association_name) {
    return advert.association_name;
  }

  if (advert.placement_scope === 'association_type' && advert.association_type_name) {
    return advert.association_type_name;
  }

  if (advert.placement_scope === 'region' && advert.region) {
    return advert.region;
  }

  return 'National';
}

export default function AdminAdverts({
  adverts,
  associations,
  associationTypes,
  pageOptions,
  placementScopes,
  regionOptions,
}: {
  adverts: AdvertItem[];
  associations: Pick<Association, 'id' | 'name' | 'slug'>[];
  associationTypes: Pick<AssociationType, 'id' | 'name' | 'slug'>[];
  pageOptions: Option[];
  placementScopes: Option[];
  regionOptions: string[];
}) {
  const { props } = usePage<SharedPageProps>();
  const flashSuccess = props.flash?.success;
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<AdvertForm>(emptyForm(pageOptions, placementScopes));

  const videoDefault = form.data.media_type === 'video' ? 10 : 6;
  const activeCount = adverts.filter((item) => item.is_active).length;
  const slotCount = useMemo(
    () => new Set(adverts.map((item) => item.slot_number)).size,
    [adverts],
  );

  const fieldError = (path: string) => form.errors[path as keyof typeof form.errors] as string | undefined;

  const reset = () => {
    setEditingId(null);
    form.setData(emptyForm(pageOptions, placementScopes));
    form.clearErrors();
  };

  const edit = (item: AdvertItem) => {
    setEditingId(item.id);
    form.setData({
      title: item.title,
      slug: item.slug,
      media_type: item.media_type,
      asset_url: item.asset_url,
      poster_url: item.poster_url ?? '',
      headline: item.headline ?? '',
      body: item.body ?? '',
      cta_label: item.cta_label ?? '',
      cta_url: item.cta_url ?? '',
      page_key: item.page_key,
      slot_number: item.slot_number,
      placement_scope: item.placement_scope,
      association_id: item.association_id ? String(item.association_id) : '',
      association_type_id: item.association_type_id ? String(item.association_type_id) : '',
      region: item.region ?? '',
      display_order: item.display_order ?? 0,
      duration_seconds: item.duration_seconds,
      is_active: item.is_active,
    });
    form.clearErrors();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      slug: data.slug.trim() || null,
      poster_url: data.poster_url.trim() || null,
      headline: data.headline.trim() || null,
      body: data.body.trim() || null,
      cta_label: data.cta_label.trim() || null,
      cta_url: data.cta_url.trim() || null,
      association_id: data.placement_scope === 'association' && data.association_id
        ? Number(data.association_id)
        : null,
      association_type_id: data.placement_scope === 'association_type' && data.association_type_id
        ? Number(data.association_type_id)
        : null,
      region: data.placement_scope === 'region' ? data.region || null : null,
      duration_seconds: data.duration_seconds || videoDefault,
    }));

    if (editingId) {
      form.put(`/admin/adverts/${editingId}`);
      return;
    }

    form.post('/admin/adverts');
  };

  const remove = (item: AdvertItem) => {
    if (!window.confirm(`Delete "${item.title}"?`)) {
      return;
    }

    router.delete(`/admin/adverts/${item.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        if (editingId === item.id) {
          reset();
        }
      },
    });
  };

  return (
    <>
      <Head title="Adverts" />

      <AdminLayout title="Adverts">
        <AdminPageIntro
          eyebrow="Campaign placements"
          title="Manage rotating image and video adverts across FEMATA and association pages."
          text="Each advert can target a page, slot, and scope. Use national placements for the main website or narrow campaigns by region, association type, or a specific association profile."
          metrics={[
            { label: 'Adverts', value: String(adverts.length) },
            { label: 'Active', value: String(activeCount) },
            { label: 'Slots in use', value: String(slotCount) },
          ]}
        />

        {(flashSuccess || form.recentlySuccessful) ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess ?? 'Advert saved successfully.'}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <form onSubmit={submit} className="card-shell h-fit p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  {editingId ? 'Edit advert' : 'Create advert'}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                  {editingId ? 'Update placement' : 'New placement'}
                </h2>
              </div>

              {editingId ? (
                <button type="button" onClick={reset} className="btn-secondary">
                  New advert
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Campaign title" error={fieldError('title')}>
                  <input
                    value={form.data.title}
                    onChange={(event) => form.setData('title', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  />
                </Field>

                <Field
                  label="Slug"
                  error={fieldError('slug')}
                  hint="Optional. Leave blank to generate it automatically."
                >
                  <input
                    value={form.data.slug}
                    onChange={(event) => form.setData('slug', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Media type" error={fieldError('media_type')}>
                  <select
                    value={form.data.media_type}
                    onChange={(event) => {
                      const nextType = event.target.value as 'image' | 'video';
                      form.setData('media_type', nextType);
                      if (!form.data.duration_seconds) {
                        form.setData('duration_seconds', nextType === 'video' ? 10 : 6);
                      }
                    }}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </Field>

                <Field label="Duration (seconds)" error={fieldError('duration_seconds')}>
                  <input
                    type="number"
                    min={3}
                    max={30}
                    value={form.data.duration_seconds}
                    onChange={(event) => form.setData('duration_seconds', Number(event.target.value) || 0)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  />
                </Field>
              </div>

              <Field label="Asset URL" error={fieldError('asset_url')} hint="Use a direct image or MP4 video URL.">
                <input
                  value={form.data.asset_url}
                  onChange={(event) => form.setData('asset_url', event.target.value)}
                  className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                />
              </Field>

              <Field
                label="Poster URL"
                error={fieldError('poster_url')}
                hint="Recommended for video adverts so FEMATA visitors see a polished branded frame before playback begins."
              >
                <input
                  value={form.data.poster_url}
                  onChange={(event) => form.setData('poster_url', event.target.value)}
                  className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                />
              </Field>

              {form.data.asset_url ? (
                <div className="overflow-hidden rounded-[1.35rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)]">
                  <div className="border-b border-[rgb(var(--border))] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Live preview
                  </div>
                  <div className="p-4">
                    {form.data.media_type === 'video' ? (
                      <video
                        key={form.data.asset_url}
                        src={form.data.asset_url}
                        poster={form.data.poster_url || undefined}
                        className="aspect-[16/9] w-full rounded-[1.15rem] bg-slate-950 object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                      />
                    ) : (
                      <img
                        src={form.data.asset_url}
                        alt={form.data.title || 'Advert preview'}
                        className="aspect-[16/9] w-full rounded-[1.15rem] object-cover"
                      />
                    )}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Page" error={fieldError('page_key')}>
                  <select
                    value={form.data.page_key}
                    onChange={(event) => form.setData('page_key', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  >
                    {pageOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Slot number" error={fieldError('slot_number')} hint="Use slot 1, 2, 3, and so on for each page.">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={form.data.slot_number}
                    onChange={(event) => form.setData('slot_number', Number(event.target.value) || 1)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Placement scope" error={fieldError('placement_scope')}>
                  <select
                    value={form.data.placement_scope}
                    onChange={(event) => {
                      const nextScope = event.target.value;
                      form.setData('placement_scope', nextScope);
                      if (nextScope !== 'association') {
                        form.setData('association_id', '');
                      }
                      if (nextScope !== 'association_type') {
                        form.setData('association_type_id', '');
                      }
                      if (nextScope !== 'region') {
                        form.setData('region', '');
                      }
                    }}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  >
                    {placementScopes.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Display order" error={fieldError('display_order')}>
                  <input
                    type="number"
                    min={0}
                    value={form.data.display_order}
                    onChange={(event) => form.setData('display_order', Number(event.target.value) || 0)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  />
                </Field>
              </div>

              {form.data.placement_scope === 'association' ? (
                <Field label="Association target" error={fieldError('association_id')}>
                  <select
                    value={form.data.association_id}
                    onChange={(event) => form.setData('association_id', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  >
                    <option value="">Select an association</option>
                    {associations.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}

              {form.data.placement_scope === 'association_type' ? (
                <Field label="Association type target" error={fieldError('association_type_id')}>
                  <select
                    value={form.data.association_type_id}
                    onChange={(event) => form.setData('association_type_id', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  >
                    <option value="">Select an association type</option>
                    {associationTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}

              {form.data.placement_scope === 'region' ? (
                <Field label="Region target" error={fieldError('region')}>
                  <select
                    value={form.data.region}
                    onChange={(event) => form.setData('region', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  >
                    <option value="">Select a region</option>
                    {regionOptions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Headline" error={fieldError('headline')}>
                  <input
                    value={form.data.headline}
                    onChange={(event) => form.setData('headline', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  />
                </Field>

                <Field label="CTA label" error={fieldError('cta_label')}>
                  <input
                    value={form.data.cta_label}
                    onChange={(event) => form.setData('cta_label', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  />
                </Field>
              </div>

              <Field label="Body copy" error={fieldError('body')}>
                <textarea
                  value={form.data.body}
                  onChange={(event) => form.setData('body', event.target.value)}
                  rows={4}
                  className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]"
                />
              </Field>

              <Field label="CTA URL" error={fieldError('cta_url')}>
                <input
                  value={form.data.cta_url}
                  onChange={(event) => form.setData('cta_url', event.target.value)}
                  className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                />
              </Field>

              <div className="rounded-[1.25rem] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]/65 px-4 py-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.data.is_active}
                    onChange={(event) => form.setData('is_active', event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[rgb(var(--border))]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[rgb(var(--primary))]">
                      Active campaign
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[rgb(var(--muted))]">
                      Active adverts rotate on the chosen page and slot. Videos default to 10 seconds and image cards default to 6 seconds unless you override the timing.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" disabled={form.processing} className="btn-primary">
                {form.processing
                  ? 'Saving...'
                  : editingId
                    ? 'Save changes'
                    : 'Create advert'}
              </button>
              <button type="button" onClick={reset} className="btn-secondary">
                Reset form
              </button>
            </div>
          </form>

          <section className="grid gap-4">
            {adverts.length === 0 ? (
              <div className="card-shell p-6 text-sm text-[rgb(var(--muted))]">
                No advert campaigns have been created yet. Add the first FEMATA partner placement to populate the live rotating slots across national and association pages.
              </div>
            ) : (
              adverts.map((item) => (
                <article key={item.id} className="card-shell p-5 sm:p-6">
                  <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
                    <div className="overflow-hidden rounded-[1.35rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)]">
                      {item.media_type === 'video' ? (
                        <video
                          src={item.asset_url}
                          poster={item.poster_url ?? undefined}
                          className="aspect-[16/10] w-full object-cover"
                          muted
                          playsInline
                          controls
                        />
                      ) : (
                        <img
                          src={item.asset_url}
                          alt={item.title}
                          className="aspect-[16/10] w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            item.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          {item.media_type}
                        </span>
                        <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                          Slot {item.slot_number}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                        {item.title}
                      </h3>

                      <div className="mt-4 grid gap-3 text-sm text-[rgb(var(--muted))] md:grid-cols-2">
                        <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            Page
                          </p>
                          <p className="mt-1">{item.page_label ?? item.page_key}</p>
                        </div>
                        <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            Target
                          </p>
                          <p className="mt-1">
                            {item.placement_label}: {targetSummary(item)}
                          </p>
                        </div>
                        <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            Duration
                          </p>
                          <p className="mt-1">{item.duration_seconds} seconds</p>
                        </div>
                        <div className="rounded-[1rem] bg-[rgb(var(--surface-2))]/72 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                            Order
                          </p>
                          <p className="mt-1">{item.display_order ?? 0}</p>
                        </div>
                      </div>

                      {(item.headline || item.body) ? (
                        <div className="mt-4 rounded-[1rem] bg-[rgb(var(--surface-2))]/55 px-4 py-4 text-sm text-[rgb(var(--muted))]">
                          {item.headline ? (
                            <p className="font-semibold text-[rgb(var(--primary))]">{item.headline}</p>
                          ) : null}
                          {item.body ? <p className="mt-2 leading-7">{item.body}</p> : null}
                        </div>
                      ) : null}

                      <div className="mt-5 flex flex-wrap gap-2">
                        <button type="button" onClick={() => edit(item)} className="btn-secondary">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(item)}
                          className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </section>
      </AdminLayout>
    </>
  );
}
