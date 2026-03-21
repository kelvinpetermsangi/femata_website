<?php

namespace App\Http\Requests\Admin;

use App\Support\YouTube;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVideoPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAdminAccess() ?? false;
    }

    public function rules(): array
    {
        $videoPost = $this->route('videoPost');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('video_posts', 'slug')->ignore($videoPost?->id)],
            'summary' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'youtube_url' => ['required', 'url', 'max:2048', function (string $attribute, mixed $value, \Closure $fail): void {
                if (! is_string($value) || ! YouTube::parseVideoId($value)) {
                    $fail('The video URL must be a valid YouTube link.');
                }
            }],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'duration' => ['nullable', 'string', 'max:50'],
            'category_id' => ['nullable', 'integer', 'exists:video_categories,id'],
            'is_featured' => ['required', 'boolean'],
            'status_id' => ['required', 'integer', 'exists:content_statuses,id'],
            'published_at' => ['nullable', 'date'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }
}
