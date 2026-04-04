<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreProgramRequest;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProgramController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Program::class);

        return Inertia::render('Admin/Programs', [
            'programs' => Program::query()
                ->orderBy('name')
                ->get()
                ->map(fn (Program $program) => $this->mapProgram($program))
                ->all(),
        ]);
    }

    public function show(Request $request, Program $program): Response
    {
        $this->authorize('update', $program);

        return Inertia::render('Admin/ProgramProfile', [
            'program' => $this->mapProgram($program, true),
        ]);
    }

    public function store(StoreProgramRequest $request): RedirectResponse
    {
        $this->authorize('create', Program::class);

        $program = Program::query()->create($this->payload($request->validated()));

        return redirect()
            ->route('admin.programs.show', $program)
            ->with('success', 'Program created. Continue building its public profile.');
    }

    public function update(StoreProgramRequest $request, Program $program): RedirectResponse
    {
        $this->authorize('update', $program);

        $program->update($this->payload($request->validated(), $program));

        return redirect()
            ->route('admin.programs.show', $program)
            ->with('success', 'Program profile updated successfully.');
    }

    public function destroy(Request $request, Program $program): RedirectResponse
    {
        $this->authorize('delete', $program);
        $program->delete();

        return redirect()
            ->route('admin.programs.index')
            ->with('success', 'Program deleted successfully.');
    }

    private function payload(array $data, ?Program $program = null): array
    {
        return [
            'name' => $data['name'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['name'], $program?->id),
            'tagline' => $this->clean($data['tagline'] ?? null),
            'summary' => $this->clean($data['summary'] ?? null),
            'hero_image' => $this->clean($data['hero_image'] ?? null),
            'home_title' => $this->clean($data['home_title'] ?? null),
            'home_intro' => $this->clean($data['home_intro'] ?? null),
            'home_body' => $this->clean($data['home_body'] ?? null),
            'about_title' => $this->clean($data['about_title'] ?? null),
            'about_body' => $this->clean($data['about_body'] ?? null),
            'team_intro' => $this->clean($data['team_intro'] ?? null),
            'years_intro' => $this->clean($data['years_intro'] ?? null),
            'current_year_intro' => $this->clean($data['current_year_intro'] ?? null),
            'highlights' => $this->sanitizeHighlights($data['highlights'] ?? []),
            'metrics' => $this->sanitizeMetrics($data['metrics'] ?? []),
            'team' => $this->sanitizeTeam($data['team'] ?? []),
            'years' => $this->sanitizeYears($data['years'] ?? []),
            'is_active' => (bool) ($data['is_active'] ?? true),
        ];
    }

    private function mapProgram(Program $program, bool $withProfile = false): array
    {
        $years = collect($program->years ?? [])
            ->sortByDesc(fn ($item) => (int) data_get($item, 'year', 0))
            ->values()
            ->all();

        $currentYear = collect($years)->firstWhere('is_current', true) ?? ($years[0] ?? null);

        $payload = [
            'id' => $program->id,
            'name' => $program->name,
            'slug' => $program->slug,
            'tagline' => $program->tagline,
            'summary' => $program->summary,
            'hero_image' => $program->hero_image,
            'is_active' => $program->is_active,
            'team_count' => count($program->team ?? []),
            'year_count' => count($years),
            'current_year' => $currentYear ? data_get($currentYear, 'year') : null,
        ];

        if (! $withProfile) {
            return $payload;
        }

        return [
            ...$payload,
            'home_title' => $program->home_title,
            'home_intro' => $program->home_intro,
            'home_body' => $program->home_body,
            'about_title' => $program->about_title,
            'about_body' => $program->about_body,
            'team_intro' => $program->team_intro,
            'years_intro' => $program->years_intro,
            'current_year_intro' => $program->current_year_intro,
            'highlights' => collect($program->highlights ?? [])->values()->all(),
            'metrics' => collect($program->metrics ?? [])->values()->all(),
            'team' => collect($program->team ?? [])->values()->all(),
            'years' => $years,
        ];
    }

    private function sanitizeHighlights(array $items): array
    {
        return collect($items)
            ->map(fn ($item) => [
                'title' => trim((string) data_get($item, 'title')),
                'text' => trim((string) data_get($item, 'text')),
            ])
            ->filter(fn (array $item) => $item['title'] !== '' || $item['text'] !== '')
            ->values()
            ->all();
    }

    private function sanitizeMetrics(array $items): array
    {
        return collect($items)
            ->map(fn ($item) => [
                'label' => trim((string) data_get($item, 'label')),
                'value' => trim((string) data_get($item, 'value')),
                'note' => trim((string) data_get($item, 'note')),
            ])
            ->filter(fn (array $item) => $item['label'] !== '' || $item['value'] !== '' || $item['note'] !== '')
            ->values()
            ->all();
    }

    private function sanitizeTeam(array $items): array
    {
        return collect($items)
            ->map(fn ($item) => [
                'name' => trim((string) data_get($item, 'name')),
                'title' => trim((string) data_get($item, 'title')),
                'bio' => trim((string) data_get($item, 'bio')),
                'photo_path' => trim((string) data_get($item, 'photo_path')),
                'email' => trim((string) data_get($item, 'email')),
                'phone' => trim((string) data_get($item, 'phone')),
            ])
            ->filter(fn (array $item) => $item['name'] !== '')
            ->values()
            ->all();
    }

    private function sanitizeYears(array $items): array
    {
        $prepared = collect($items)
            ->map(fn ($item) => [
                'year' => data_get($item, 'year') !== null ? (int) data_get($item, 'year') : null,
                'edition_label' => trim((string) data_get($item, 'edition_label')),
                'region' => trim((string) data_get($item, 'region')),
                'venue' => trim((string) data_get($item, 'venue')),
                'date_summary' => trim((string) data_get($item, 'date_summary')),
                'theme' => trim((string) data_get($item, 'theme')),
                'overview' => trim((string) data_get($item, 'overview')),
                'highlights' => collect(data_get($item, 'highlights', []))
                    ->map(fn ($highlight) => trim((string) $highlight))
                    ->filter()
                    ->values()
                    ->all(),
                'vendor_registration_url' => $this->clean(data_get($item, 'vendor_registration_url')),
                'participant_registration_url' => $this->clean(data_get($item, 'participant_registration_url')),
                'sponsor_registration_url' => $this->clean(data_get($item, 'sponsor_registration_url')),
                'floor_plan_url' => $this->clean(data_get($item, 'floor_plan_url')),
                'brochure_url' => $this->clean(data_get($item, 'brochure_url')),
                'is_current' => (bool) data_get($item, 'is_current', false),
            ])
            ->filter(fn (array $item) => $item['year'] !== null || $item['theme'] !== '' || $item['overview'] !== '')
            ->values();

        if ($prepared->isNotEmpty() && $prepared->every(fn (array $item) => $item['is_current'] === false)) {
            $prepared = $prepared->map(fn (array $item, int $index) => [
                ...$item,
                'is_current' => $index === 0,
            ]);
        }

        $currentMarked = false;

        return $prepared
            ->map(function (array $item) use (&$currentMarked): array {
                if ($item['is_current'] && ! $currentMarked) {
                    $currentMarked = true;

                    return $item;
                }

                return [
                    ...$item,
                    'is_current' => false,
                ];
            })
            ->sortByDesc(fn (array $item) => $item['year'] ?? 0)
            ->values()
            ->all();
    }

    private function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'program';
        $slug = $base;
        $suffix = 2;

        while (
            Program::query()
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    private function clean(mixed $value): ?string
    {
        $cleaned = trim((string) $value);

        return $cleaned === '' ? null : $cleaned;
    }
}
