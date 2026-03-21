<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreDocumentRequest;
use App\Models\ContentStatus;
use App\Models\Document;
use App\Models\DocumentCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Document::class);

        $documents = Document::query()
            ->with(['category', 'status', 'tags'])
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Document $document) => [
                'id' => $document->id,
                'title' => $document->title,
                'slug' => $document->slug,
                'description' => $document->description,
                'file_path' => $document->file_path,
                'file_type' => $document->document_type ?: $document->file_extension,
                'category' => $document->category?->name,
                'category_id' => $document->category_id,
                'is_public' => $document->is_public,
                'is_featured' => $document->is_featured,
                'published_at' => $document->published_at?->format('Y-m-d\TH:i'),
                'status_id' => $document->status_id,
                'status' => $document->status?->slug,
                'tag_ids' => $document->tags->pluck('id')->all(),
            ])
            ->all();

        return Inertia::render('Admin/Documents', [
            'documents' => $documents,
            'documentCategories' => DocumentCategory::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'contentStatuses' => ContentStatus::query()->orderBy('sort_order')->get(['id', 'name', 'slug', 'is_public']),
        ]);
    }

    public function store(StoreDocumentRequest $request): RedirectResponse
    {
        $this->authorize('create', Document::class);

        $data = $request->validated();
        $document = Document::query()->create($this->payload($request, $data));
        $document->tags()->sync($data['tag_ids'] ?? []);

        return redirect()
            ->route('admin.documents.index')
            ->with('success', 'Document created successfully.');
    }

    public function update(StoreDocumentRequest $request, Document $document): RedirectResponse
    {
        $this->authorize('update', $document);

        $data = $request->validated();
        $document->update($this->payload($request, $data, $document));
        $document->tags()->sync($data['tag_ids'] ?? []);

        return redirect()
            ->route('admin.documents.index')
            ->with('success', 'Document updated successfully.');
    }

    public function destroy(Request $request, Document $document): RedirectResponse
    {
        $this->authorize('delete', $document);

        $document->delete();

        return redirect()
            ->route('admin.documents.index')
            ->with('success', 'Document deleted successfully.');
    }

    private function payload(Request $request, array $data, ?Document $document = null): array
    {
        $categoryId = $data['category_id'] ?? $this->resolveCategoryId($data['category'] ?? null);
        $statusId = $data['status_id'] ?? $this->defaultStatusId($document);
        $extension = $data['file_extension'] ?? pathinfo($data['file_path'], PATHINFO_EXTENSION);

        return [
            'public_id' => $document?->public_id ?? (string) Str::ulid(),
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['title'], $document?->id),
            'description' => $data['description'] ?? null,
            'file_path' => $data['file_path'],
            'thumbnail_path' => $data['thumbnail_path'] ?? null,
            'file_extension' => $extension ?: null,
            'file_size' => $data['file_size'] ?? null,
            'document_type' => $data['document_type'] ?? ($data['file_type'] ?? null),
            'category_id' => $categoryId,
            'year' => $data['year'] ?? null,
            'author_source' => $data['author_source'] ?? null,
            'source_organization' => $data['source_organization'] ?? null,
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'is_public' => (bool) ($data['is_public'] ?? true),
            'created_by' => $document?->created_by ?? $request->user()?->id,
            ...$this->applyWorkflow(
                $request,
                $document ?? new Document(),
                $statusId,
                $data['published_at'] ?? null,
            ),
        ];
    }

    private function defaultStatusId(?Document $document = null): int
    {
        if ($document?->status_id) {
            return $document->status_id;
        }

        return (int) ContentStatus::query()
            ->where('slug', ContentStatus::DRAFT)
            ->value('id');
    }

    private function resolveCategoryId(?string $category): ?int
    {
        if (! $category) {
            return null;
        }

        $slug = Str::slug($category);

        return DocumentCategory::query()->firstOrCreate(
            ['slug' => $slug],
            ['name' => $category, 'description' => null, 'sort_order' => 0],
        )->id;
    }

    private function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'document';
        $slug = $base;
        $suffix = 2;

        while (
            Document::query()
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
