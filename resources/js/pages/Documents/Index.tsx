import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AdvertCarousel from '@/components/AdvertCarousel';
import DocumentLibraryTile from '@/components/documents/DocumentLibraryTile';
import { advertsForSlot } from '@/lib/adverts';
import PublicLayout from '@/layouts/PublicLayout';
import type { AdvertSlots, DocumentItem } from '@/types';

function uniqueValues(values: Array<string | number | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string | number => value !== null && value !== undefined && value !== '')))
    .sort((left, right) => String(left).localeCompare(String(right)));
}

export default function DocumentsIndex({
  documents,
  adverts,
  announcements,
}: {
  documents: DocumentItem[];
  adverts?: AdvertSlots;
  announcements?: [];
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [author, setAuthor] = useState('all');
  const [publisher, setPublisher] = useState('all');
  const [year, setYear] = useState('all');
  const [fileType, setFileType] = useState('all');

  const categories = uniqueValues(documents.map((document) => document.category));
  const authors = uniqueValues(documents.map((document) => document.author));
  const publishers = uniqueValues(documents.map((document) => document.publisher));
  const years = uniqueValues(documents.map((document) => document.year));
  const fileTypes = uniqueValues(documents.map((document) => document.file_type));

  const normalizedQuery = query.trim().toLowerCase();
  const filteredDocuments = documents.filter((document) => {
    const searchable = [
      document.title,
      document.description,
      document.category,
      document.author,
      document.publisher,
      document.index_number,
      document.file_type,
      document.year ? String(document.year) : '',
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return (normalizedQuery === '' || searchable.includes(normalizedQuery))
      && (category === 'all' || document.category === category)
      && (author === 'all' || document.author === author)
      && (publisher === 'all' || document.publisher === publisher)
      && (year === 'all' || String(document.year ?? '') === year)
      && (fileType === 'all' || document.file_type === fileType);
  });

  return (
    <>
      <Head title="Documents & Publications" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell pb-3">
          <div className="container-shell grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-4xl">
              <p className="eyebrow">FEMATA Open Library</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-[rgb(var(--primary))] sm:text-4xl">
                Documents and publications arranged like a living public library
              </h1>
              <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))] sm:text-base">
                Browse FEMATA strategies, guides, briefs, forms, policy references, and public publications using library-style index numbers, cover displays, metadata filters, read-online access, downloads, and document-specific discussion.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="ui-chip px-4 py-2.5 text-sm font-semibold text-[rgb(var(--primary))]">
                {documents.length} library titles
              </div>
              <div className="ui-chip px-4 py-2.5 text-sm font-semibold text-[rgb(var(--primary))]">
                {categories.length} categories
              </div>
              <div className="ui-chip px-4 py-2.5 text-sm font-semibold text-[rgb(var(--primary))]">
                {filteredDocuments.length} visible now
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="ui-shell h-fit p-4 sm:p-5 xl:sticky xl:top-24">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                Library filters
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[rgb(var(--primary))] sm:text-2xl">
                Find the exact publication
              </h2>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Search across titles, summaries, index numbers, and publication metadata, then narrow the shelf by category, author, publisher, year, or document type.
              </p>

              <div className="mt-5 grid gap-3.5">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[rgb(var(--primary))]">Search</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search titles, authors, publishers, index numbers..."
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[rgb(var(--primary))]">Category</span>
                  <select value={category} onChange={(event) => setCategory(event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]">
                    <option value="all">All categories</option>
                    {categories.map((value) => (
                      <option key={value} value={String(value)}>{value}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[rgb(var(--primary))]">Author</span>
                  <select value={author} onChange={(event) => setAuthor(event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]">
                    <option value="all">All authors</option>
                    {authors.map((value) => (
                      <option key={value} value={String(value)}>{value}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[rgb(var(--primary))]">Publisher</span>
                  <select value={publisher} onChange={(event) => setPublisher(event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]">
                    <option value="all">All publishers</option>
                    {publishers.map((value) => (
                      <option key={value} value={String(value)}>{value}</option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Year</span>
                    <select value={year} onChange={(event) => setYear(event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]">
                      <option value="all">All years</option>
                      {years.map((value) => (
                        <option key={value} value={String(value)}>{value}</option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Document type</span>
                    <select value={fileType} onChange={(event) => setFileType(event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]">
                      <option value="all">All types</option>
                      {fileTypes.map((value) => (
                        <option key={value} value={String(value)}>{value}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                    setAuthor('all');
                    setPublisher('all');
                    setYear('all');
                    setFileType('all');
                  }}
                  className="btn-secondary justify-center"
                >
                  Reset filters
                </button>
              </div>
            </aside>

            <div className="grid gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Library shelf
                  </p>
                  <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                    Showing {filteredDocuments.length} of {documents.length} FEMATA titles.
                  </p>
                </div>
              </div>

              {filteredDocuments.length === 0 ? (
                <div className="card-shell p-8 text-center sm:p-12">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    No matches found
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--primary))]">
                    Try widening the library filters
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
                    Adjust the search terms or clear one or more filters to bring more FEMATA publications back into view.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {filteredDocuments.map((document) => (
                    <DocumentLibraryTile key={document.id} document={document} />
                  ))}
                </div>
              )}

              <AdvertCarousel adverts={advertsForSlot(adverts, 1)} slotNumber={1} />
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
