<?php

namespace App\Support;

use App\Models\ContentStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class ContentWorkflowManager
{
    /**
     * @var array<string, array<int, string>>
     */
    private const ALLOWED_TRANSITIONS = [
        ContentStatus::DRAFT => [
            ContentStatus::PENDING_REVIEW,
            ContentStatus::ARCHIVED,
        ],
        ContentStatus::PENDING_REVIEW => [
            ContentStatus::DRAFT,
            ContentStatus::REVIEWED,
            ContentStatus::REJECTED,
            ContentStatus::ARCHIVED,
        ],
        ContentStatus::REVIEWED => [
            ContentStatus::PENDING_REVIEW,
            ContentStatus::APPROVED,
            ContentStatus::REJECTED,
            ContentStatus::ARCHIVED,
        ],
        ContentStatus::APPROVED => [
            ContentStatus::REVIEWED,
            ContentStatus::PUBLISHED,
            ContentStatus::ARCHIVED,
        ],
        ContentStatus::PUBLISHED => [
            ContentStatus::ARCHIVED,
        ],
        ContentStatus::ARCHIVED => [
            ContentStatus::DRAFT,
        ],
        ContentStatus::REJECTED => [
            ContentStatus::DRAFT,
            ContentStatus::PENDING_REVIEW,
            ContentStatus::ARCHIVED,
        ],
    ];

    public function apply(User $user, Model $record, int|string|null $requestedStatus, mixed $publishedAt = null): array
    {
        $targetStatus = $this->resolveStatus($requestedStatus);
        $currentStatusSlug = $this->currentStatusSlug($record);

        $this->assertTransitionAllowed($user, $record, $currentStatusSlug, $targetStatus->slug);

        return [
            'status_id' => $targetStatus->id,
            'updated_by' => $user->id,
            ...$this->transitionMetadata($record, $user, $targetStatus->slug, $currentStatusSlug, $publishedAt),
        ];
    }

    private function resolveStatus(int|string|null $requestedStatus): ContentStatus
    {
        $status = ContentStatus::query()
            ->when(
                is_numeric($requestedStatus),
                fn ($query) => $query->whereKey((int) $requestedStatus),
                fn ($query) => $query->where('slug', $requestedStatus ?: ContentStatus::DRAFT),
            )
            ->first();

        if (! $status) {
            throw ValidationException::withMessages([
                'status_id' => 'The selected workflow status is invalid.',
            ]);
        }

        return $status;
    }

    private function currentStatusSlug(Model $record): string
    {
        if ($record->relationLoaded('status') && $record->status) {
            return (string) $record->status->slug;
        }

        if ($record->status_id) {
            return (string) ContentStatus::query()
                ->whereKey($record->status_id)
                ->value('slug');
        }

        return ContentStatus::DRAFT;
    }

    private function assertTransitionAllowed(User $user, Model $record, string $currentStatus, string $targetStatus): void
    {
        if ($currentStatus !== $targetStatus) {
            $allowedTargets = self::ALLOWED_TRANSITIONS[$currentStatus] ?? [];

            if (! in_array($targetStatus, $allowedTargets, true)) {
                throw ValidationException::withMessages([
                    'status_id' => sprintf(
                        'Workflow transition from %s to %s is not allowed.',
                        str_replace('_', ' ', $currentStatus),
                        str_replace('_', ' ', $targetStatus),
                    ),
                ]);
            }
        }

        Gate::forUser($user)->authorize('transitionToStatus', [$record, $targetStatus]);
    }

    private function transitionMetadata(
        Model $record,
        User $user,
        string $targetStatus,
        string $currentStatus,
        mixed $publishedAt,
    ): array {
        $attributes = [];

        if ($currentStatus === $targetStatus) {
            if ($targetStatus === ContentStatus::PUBLISHED) {
                if (blank($record->published_by)) {
                    $attributes['published_by'] = $user->id;
                }

                $attributes['published_at'] = $this->normalizeDateTime($publishedAt)
                    ?? $record->published_at
                    ?? now();
            }

            return $attributes;
        }

        if ($targetStatus === ContentStatus::PENDING_REVIEW && blank($record->submitted_at)) {
            $attributes['submitted_by'] = $user->id;
            $attributes['submitted_at'] = now();
        }

        if ($targetStatus === ContentStatus::REVIEWED && blank($record->reviewed_at)) {
            $attributes['reviewed_by'] = $user->id;
            $attributes['reviewed_at'] = now();
        }

        if ($targetStatus === ContentStatus::APPROVED && blank($record->approved_at)) {
            $attributes['approved_by'] = $user->id;
            $attributes['approved_at'] = now();
        }

        if ($targetStatus === ContentStatus::PUBLISHED) {
            $attributes['published_by'] = $user->id;
            $attributes['published_at'] = $this->normalizeDateTime($publishedAt) ?? $record->published_at ?? now();
        }

        return $attributes;
    }

    private function normalizeDateTime(mixed $value): ?Carbon
    {
        if (blank($value)) {
            return null;
        }

        return Carbon::parse($value);
    }
}
