<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAdminAccess() ?? false;
    }

    public function rules(): array
    {
        $document = $this->route('document') ?? $this->route('documentFile');

        return [
            'public_id' => ['nullable', 'string', 'max:26', Rule::unique('documents', 'public_id')->ignore($document?->id)],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('documents', 'slug')->ignore($document?->id)],
            'description' => ['nullable', 'string'],
            'file_path' => ['required', 'string', 'max:2048'],
            'file_type' => ['nullable', 'string', 'max:100'],
            'thumbnail_path' => ['nullable', 'string', 'max:2048'],
            'file_extension' => ['nullable', 'string', 'max:20'],
            'file_size' => ['nullable', 'integer', 'min:0'],
            'category' => ['nullable', 'string', 'max:255'],
            'document_type' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'integer', 'exists:document_categories,id'],
            'year' => ['nullable', 'integer', 'between:1900,2100'],
            'author_source' => ['nullable', 'string', 'max:255'],
            'source_organization' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['nullable', 'boolean'],
            'is_public' => ['required', 'boolean'],
            'status_id' => ['nullable', 'integer', 'exists:content_statuses,id'],
            'published_at' => ['nullable', 'date'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }
}
