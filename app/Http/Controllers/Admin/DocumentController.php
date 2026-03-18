<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(): Response
    {
        $documents = DocumentFile::query()
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (DocumentFile $document) => [
                'id' => $document->id,
                'title' => $document->title,
                'slug' => $document->slug,
                'description' => $document->description,
                'file_path' => $document->file_path,
                'file_type' => $document->file_type,
                'category' => $document->category,
                'is_public' => $document->is_public,
                'published_at' => $document->published_at?->format('Y-m-d\TH:i'),
            ])
            ->all();

        return Inertia::render('Admin/Documents', [
            'documents' => $documents,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        DocumentFile::query()->create($this->payload($data));

        return redirect()
            ->route('admin.documents.index')
            ->with('success', 'Document created successfully.');
    }

    public function update(Request $request, DocumentFile $documentFile): RedirectResponse
    {
        $data = $this->validatedData($request, $documentFile);

        $documentFile->update($this->payload($data, $documentFile->id));

        return redirect()
            ->route('admin.documents.index')
            ->with('success', 'Document updated successfully.');
    }

    public function destroy(DocumentFile $documentFile): RedirectResponse
    {
        $documentFile->delete();

        return redirect()
            ->route('admin.documents.index')
            ->with('success', 'Document deleted successfully.');
    }

    private function validatedData(Request $request, ?DocumentFile $documentFile = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('document_files', 'slug')->ignore($documentFile?->id),
            ],
            'description' => ['nullable', 'string'],
            'file_path' => ['required', 'string', 'max:2048'],
            'file_type' => ['nullable', 'string', 'max:50'],
            'category' => ['nullable', 'string', 'max:255'],
            'is_public' => ['required', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ]);
    }

    private function payload(array $data, ?int $ignoreId = null): array
    {
        return [
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['title'], $ignoreId),
            'description' => $data['description'],
            'file_path' => $data['file_path'],
            'file_type' => $data['file_type'],
            'category' => $data['category'],
            'is_public' => $data['is_public'],
            'published_at' => $data['published_at'],
        ];
    }

    private function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'document';
        $slug = $base;
        $suffix = 2;

        while (
            DocumentFile::query()
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
