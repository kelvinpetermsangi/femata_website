<?php

namespace App\Http\Requests\Admin;

use App\Models\Program;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAdminAccess() ?? false;
    }

    public function rules(): array
    {
        $program = $this->route('program');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('programs', 'slug')->ignore($program?->id)],
            'tagline' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string'],
            'hero_image' => ['nullable', 'string', 'max:2048'],
            'home_title' => ['nullable', 'string', 'max:255'],
            'home_intro' => ['nullable', 'string'],
            'home_body' => ['nullable', 'string'],
            'about_title' => ['nullable', 'string', 'max:255'],
            'about_body' => ['nullable', 'string'],
            'team_intro' => ['nullable', 'string'],
            'years_intro' => ['nullable', 'string'],
            'current_year_intro' => ['nullable', 'string'],
            'highlights' => ['nullable', 'array'],
            'highlights.*.title' => ['nullable', 'string', 'max:140'],
            'highlights.*.text' => ['nullable', 'string', 'max:600'],
            'metrics' => ['nullable', 'array'],
            'metrics.*.label' => ['nullable', 'string', 'max:120'],
            'metrics.*.value' => ['nullable', 'string', 'max:120'],
            'metrics.*.note' => ['nullable', 'string', 'max:255'],
            'team' => ['nullable', 'array'],
            'team.*.name' => ['nullable', 'string', 'max:120'],
            'team.*.title' => ['nullable', 'string', 'max:120'],
            'team.*.bio' => ['nullable', 'string', 'max:1200'],
            'team.*.photo_path' => ['nullable', 'string', 'max:2048'],
            'team.*.email' => ['nullable', 'email', 'max:255'],
            'team.*.phone' => ['nullable', 'string', 'max:60'],
            'years' => ['nullable', 'array'],
            'years.*.year' => ['nullable', 'integer', 'between:2000,2100'],
            'years.*.edition_label' => ['nullable', 'string', 'max:120'],
            'years.*.region' => ['nullable', 'string', 'max:120'],
            'years.*.venue' => ['nullable', 'string', 'max:160'],
            'years.*.date_summary' => ['nullable', 'string', 'max:160'],
            'years.*.theme' => ['nullable', 'string', 'max:255'],
            'years.*.overview' => ['nullable', 'string', 'max:2000'],
            'years.*.highlights' => ['nullable', 'array'],
            'years.*.highlights.*' => ['nullable', 'string', 'max:180'],
            'years.*.vendor_registration_url' => ['nullable', 'url', 'max:255'],
            'years.*.participant_registration_url' => ['nullable', 'url', 'max:255'],
            'years.*.sponsor_registration_url' => ['nullable', 'url', 'max:255'],
            'years.*.floor_plan_url' => ['nullable', 'url', 'max:255'],
            'years.*.brochure_url' => ['nullable', 'url', 'max:255'],
            'years.*.is_current' => ['required_with:years', 'boolean'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
