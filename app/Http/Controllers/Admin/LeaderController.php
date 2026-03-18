<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Leader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderController extends Controller
{
    public function index(): Response
    {
        $leaders = Leader::query()
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Leader $leader) => [
                'id' => $leader->id,
                'name' => $leader->name,
                'title' => $leader->title,
                'photo_path' => $leader->photo_path,
                'bio' => $leader->bio,
                'sort_order' => $leader->sort_order,
                'is_active' => $leader->is_active,
            ])
            ->all();

        return Inertia::render('Admin/Leaders', [
            'leaders' => $leaders,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        Leader::query()->create($data);

        return redirect()
            ->route('admin.leaders.index')
            ->with('success', 'Leader created successfully.');
    }

    public function update(Request $request, Leader $leader): RedirectResponse
    {
        $data = $this->validatedData($request);

        $leader->update($data);

        return redirect()
            ->route('admin.leaders.index')
            ->with('success', 'Leader updated successfully.');
    }

    public function destroy(Leader $leader): RedirectResponse
    {
        $leader->delete();

        return redirect()
            ->route('admin.leaders.index')
            ->with('success', 'Leader deleted successfully.');
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'photo_path' => ['nullable', 'string', 'max:2048'],
            'bio' => ['nullable', 'string'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['required', 'boolean'],
        ]);
    }
}
