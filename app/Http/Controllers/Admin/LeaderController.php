<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreLeaderRequest;
use App\Models\Leader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class LeaderController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Leader::class);

        $leaders = Leader::query()
            ->orderBy('rank_order')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Leader $leader) => [
                'id' => $leader->id,
                'name' => $leader->name,
                'title' => $leader->designation,
                'designation' => $leader->designation,
                'administration_level' => $leader->administration_level,
                'department' => $leader->department,
                'photo_path' => $leader->image_path,
                'image_path' => $leader->image_path,
                'bio' => $leader->bio,
                'sort_order' => $leader->rank_order,
                'rank_order' => $leader->rank_order,
                'email' => $leader->email,
                'phone' => $leader->phone,
                'is_active' => $leader->is_active,
                'contact_qr_path' => $leader->contact_qr_path,
            ])
            ->all();

        return Inertia::render('Admin/Leaders', [
            'leaders' => $leaders,
        ]);
    }

    public function store(StoreLeaderRequest $request): RedirectResponse
    {
        $this->authorize('create', Leader::class);

        Leader::query()->create($this->payload($request->validated()));
        Cache::forget('public_leaders_v2');

        return redirect()
            ->route('admin.leaders.index')
            ->with('success', 'Leader created successfully.');
    }

    public function update(StoreLeaderRequest $request, Leader $leader): RedirectResponse
    {
        $this->authorize('update', $leader);

        $leader->update($this->payload($request->validated()));
        Cache::forget('public_leaders_v2');

        return redirect()
            ->route('admin.leaders.index')
            ->with('success', 'Leader updated successfully.');
    }

    public function destroy(Request $request, Leader $leader): RedirectResponse
    {
        $this->authorize('delete', $leader);

        $leader->delete();
        Cache::forget('public_leaders_v2');

        return redirect()
            ->route('admin.leaders.index')
            ->with('success', 'Leader deleted successfully.');
    }

    private function payload(array $data): array
    {
        return [
            'name' => $data['name'],
            'designation' => $data['designation'] ?? ($data['title'] ?? ''),
            'administration_level' => $data['administration_level'] ?? null,
            'department' => $data['department'] ?? null,
            'image_path' => $data['image_path'] ?? ($data['photo_path'] ?? null),
            'bio' => $data['bio'] ?? null,
            'rank_order' => $data['rank_order'] ?? ($data['sort_order'] ?? 0),
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'is_active' => $data['is_active'],
            'contact_qr_path' => $data['contact_qr_path'] ?? null,
        ];
    }
}
