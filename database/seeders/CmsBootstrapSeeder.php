<?php

namespace Database\Seeders;

use App\Models\AdminSection;
use App\Models\ContentStatus;
use App\Models\DocumentCategory;
use App\Models\NewsCategory;
use App\Models\VideoCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CmsBootstrapSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'access admin dashboard',
            'manage news',
            'review news',
            'publish news',
            'manage videos',
            'review videos',
            'publish videos',
            'manage documents',
            'review documents',
            'publish documents',
            'manage pages',
            'publish pages',
            'manage announcements',
            'manage leaders',
            'manage media',
            'manage settings',
            'manage associations',
            'manage association types',
            'manage adverts',
            'manage programs',
            'manage press briefings',
            'publish press briefings',
            'manage meetings',
            'manage administrators',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $superAdmin = Role::findOrCreate('super-admin', 'web');
        $editor = Role::findOrCreate('editor', 'web');
        $reviewer = Role::findOrCreate('reviewer', 'web');

        $superAdmin->syncPermissions(Permission::query()->pluck('name')->all());
        $editor->syncPermissions([
            'access admin dashboard',
            'manage news',
            'manage videos',
            'manage documents',
            'manage pages',
            'manage announcements',
            'manage leaders',
            'manage media',
            'manage associations',
            'manage adverts',
            'manage programs',
            'manage press briefings',
            'manage meetings',
        ]);
        $reviewer->syncPermissions([
            'access admin dashboard',
            'review news',
            'publish news',
            'review videos',
            'publish videos',
            'review documents',
            'publish documents',
            'publish pages',
            'publish press briefings',
        ]);

        $sections = [
            [AdminSection::NEWSWIRE, 'Newswire'],
            [AdminSection::ONLINE_TV, 'Online TV'],
            [AdminSection::LIBRARY, 'Library'],
            [AdminSection::ANNOUNCEMENTS, 'Announcements'],
            [AdminSection::LEADERSHIP, 'Leadership'],
            [AdminSection::MEDIA, 'Media'],
            [AdminSection::PAGES, 'Pages'],
            [AdminSection::SETTINGS, 'Settings'],
            [AdminSection::ASSOCIATIONS, 'Associations'],
            [AdminSection::ASSOCIATION_TYPES, 'Association Types'],
            [AdminSection::ADVERTS, 'Adverts'],
            [AdminSection::PROGRAMS, 'Programs'],
            [AdminSection::PRESS_BRIEFINGS, 'Press Briefings'],
            [AdminSection::MEETINGS, 'Meetings'],
        ];

        foreach ($sections as [$slug, $name]) {
            AdminSection::query()->updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'description' => $name.' management area'],
            );
        }

        $statuses = [
            [ContentStatus::DRAFT, 'Draft', false, 10],
            [ContentStatus::PENDING_REVIEW, 'Pending Review', false, 20],
            [ContentStatus::REVIEWED, 'Reviewed', false, 30],
            [ContentStatus::APPROVED, 'Approved', false, 40],
            [ContentStatus::PUBLISHED, 'Published', true, 50],
            [ContentStatus::ARCHIVED, 'Archived', false, 60],
            [ContentStatus::REJECTED, 'Rejected', false, 70],
        ];

        foreach ($statuses as [$slug, $name, $isPublic, $sortOrder]) {
            ContentStatus::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'description' => $name.' content workflow state',
                    'is_public' => $isPublic,
                    'sort_order' => $sortOrder,
                ],
            );
        }

        foreach ([
            'Official Statements',
            'Policy Updates',
            'Member News',
            'Sector Analysis',
        ] as $name) {
            NewsCategory::query()->firstOrCreate([
                'slug' => Str::slug($name),
            ], [
                'name' => $name,
            ]);
        }

        foreach ([
            'Chairperson Address',
            'Press Highlights',
            'Sector Interviews',
        ] as $name) {
            VideoCategory::query()->firstOrCreate([
                'slug' => Str::slug($name),
            ], [
                'name' => $name,
            ]);
        }

        foreach ([
            'Federation Profile',
            'Strategic Plan',
            'Evaluation Reports',
            'Press Conference Briefings',
            'Analytical Reports',
            'Research Studies',
            'Mining Association Reports',
            'Regulations',
            'Policies',
            'Forms and Downloads',
            'Annual Reports',
            'Management Documents',
        ] as $name) {
            DocumentCategory::query()->firstOrCreate([
                'slug' => Str::slug($name),
            ], [
                'name' => $name,
            ]);
        }
    }
}
