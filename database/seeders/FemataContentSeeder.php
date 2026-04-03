<?php

namespace Database\Seeders;

use App\Models\AdminSection;
use App\Models\Announcement;
use App\Models\Advert;
use App\Models\Association;
use App\Models\AssociationType;
use App\Models\ContentStatus;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\GalleryItem;
use App\Models\Leader;
use App\Models\MediaLibrary;
use App\Models\NewsCategory;
use App\Models\NewsPost;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\User;
use App\Models\VideoCategory;
use App\Models\VideoPost;
use App\Support\SiteSettings;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FemataContentSeeder extends Seeder
{
    public function run(): void
    {
        $publishedStatusId = ContentStatus::query()->where('slug', ContentStatus::PUBLISHED)->value('id');

        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@femata.or.tz'],
            [
                'name' => 'FEMATA Admin',
                'password' => 'password',
                'is_admin' => true,
            ],
        );

        $admin->assignRole('super-admin');
        $admin->adminSections()->sync(AdminSection::query()->pluck('id')->all());

        $announcements = [
            [
                'title' => 'FEMATA Annual Stakeholder Meeting scheduled',
                'body' => 'An invitation to senior members for the annual convening, plus agenda highlights.',
                'priority_level' => 9,
                'starts_at' => Carbon::now()->subDay(),
                'expires_at' => Carbon::now()->addMonth(),
            ],
            [
                'title' => 'Regional safety briefing issued for member associations',
                'body' => 'Associations are encouraged to circulate the updated safety briefing and review site-level risk controls before the next regional coordination meetings.',
                'priority_level' => 8,
                'starts_at' => Carbon::now()->subDays(2),
                'expires_at' => Carbon::now()->addWeeks(5),
            ],
            [
                'title' => 'Membership data verification window now open',
                'body' => 'Regional secretariats have been asked to confirm active member lists, leadership contacts, and official communication channels for the national registry refresh.',
                'priority_level' => 7,
                'starts_at' => Carbon::now()->subDays(3),
                'expires_at' => Carbon::now()->addWeeks(3),
            ],
            [
                'title' => 'Call for submissions to the mining innovation showcase',
                'body' => 'FEMATA is inviting member associations to submit practical innovations in safety, processing, documentation, and cooperative organization for the upcoming showcase.',
                'priority_level' => 6,
                'starts_at' => Carbon::now()->subDays(4),
                'expires_at' => Carbon::now()->addWeeks(4),
            ],
            [
                'title' => 'Public notice on licensing support desk schedules',
                'body' => 'The federation support desk will host weekly clinic sessions to guide miners and associations through documentation, licensing follow-up, and formalization questions.',
                'priority_level' => 5,
                'starts_at' => Carbon::now()->subDays(5),
                'expires_at' => Carbon::now()->addWeeks(6),
            ],
            [
                'title' => 'Regional mineral market prices bulletin published',
                'body' => 'Member associations are encouraged to use the latest bulletin for local awareness sessions, buyer negotiations, and market-readiness discussions with miners and cooperatives.',
                'priority_level' => 4,
                'starts_at' => Carbon::now()->subDays(6),
                'expires_at' => Carbon::now()->addWeeks(4),
            ],
            [
                'title' => 'Environmental compliance clinic planned for association officers',
                'body' => 'FEMATA will host a short compliance clinic on environmental responsibilities, reporting requirements, and practical site-level record keeping for association administrators.',
                'priority_level' => 4,
                'starts_at' => Carbon::now()->subDays(7),
                'expires_at' => Carbon::now()->addWeeks(5),
            ],
            [
                'title' => 'Public invitation for women and youth mining enterprise nominations',
                'body' => 'Regional associations have been invited to nominate women-led and youth-led mining enterprises for a national visibility campaign focused on innovation, organization, and productive growth.',
                'priority_level' => 3,
                'starts_at' => Carbon::now()->subDays(9),
                'expires_at' => Carbon::now()->addWeeks(6),
            ],
        ];

        foreach ($announcements as $announcement) {
            Announcement::query()->updateOrCreate(
                ['title' => $announcement['title']],
                [
                    'body' => $announcement['body'],
                    'priority_level' => $announcement['priority_level'],
                    'starts_at' => $announcement['starts_at'],
                    'expires_at' => $announcement['expires_at'],
                    'is_active' => true,
                    'created_by' => $admin->id,
                    'updated_by' => $admin->id,
                ],
            );
        }

        $newsCategoryIds = NewsCategory::query()->pluck('id', 'slug');

        $newsArticles = [
            [
                'slug' => 'responsible-mining-framework',
                'title' => 'FEMATA champions new responsible mining framework',
                'excerpt' => 'Framework that binds FEMATA members to ESG commitments was endorsed by Council.',
                'content' => implode("\n\n", [
                    'FEMATA leadership introduced the Responsible Mining Framework to strengthen governance, accountability, and public trust across the mining ecosystem. The framework sets clearer expectations for member associations on safety, environmental stewardship, and institutional reporting.',
                    '"This framework is about credibility as much as compliance," one of the Council leaders noted during the launch briefing, framing the initiative as a practical step toward stronger industry coordination.',
                    'The federation says the next phase will focus on member onboarding, regional orientation sessions, and a shared monitoring dashboard for implementation milestones.',
                ]),
                'featured_image' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
                'category_slug' => 'official-statements',
                'is_featured' => true,
                'published_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDay(),
            ],
            [
                'slug' => 'mineral-traceability-guidelines',
                'title' => 'New mineral traceability guidelines shared with regional associations',
                'excerpt' => 'FEMATA circulated a practical briefing to help associations align documentation, sourcing records, and chain-of-custody checks.',
                'content' => implode("\n\n", [
                    'A new traceability briefing has been distributed to regional associations as part of FEMATA\'s effort to improve documentation standards and reduce friction during inspections, licensing reviews, and stakeholder reporting.',
                    'The guidance outlines minimum record-keeping expectations, preferred file structures, and recommended verification steps for transport, processing, and export preparation.',
                    'Regional leadership teams have been encouraged to review the guidance with their committees and identify any operational gaps that may require federation support.',
                ]),
                'featured_image' => 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=900&q=80',
                'category_slug' => 'policy-updates',
                'is_featured' => true,
                'published_at' => Carbon::now()->subDays(4),
                'updated_at' => Carbon::now()->subDays(4),
            ],
            [
                'slug' => 'regional-associations-data-drive',
                'title' => 'Regional associations begin coordinated data update drive',
                'excerpt' => 'The federation is consolidating membership, contact, and activity data to improve public visibility and internal coordination.',
                'content' => implode("\n\n", [
                    'FEMATA has started a coordinated data refresh across member associations to improve the accuracy of leadership profiles, contact details, and regional activity records published through its communication channels.',
                    'The exercise is expected to improve how quickly the federation can respond to stakeholder inquiries and make the public website a more reliable reference point.',
                    'Association secretariats were asked to prioritise verified contact information, current office bearers, and the most recent strategic priorities from each region.',
                ]),
                'featured_image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
                'category_slug' => 'member-news',
                'is_featured' => true,
                'published_at' => Carbon::now()->subDays(6),
                'updated_at' => Carbon::now()->subDays(6),
            ],
            [
                'slug' => 'community-processing-centres-brief',
                'title' => 'Sector brief highlights the value of community processing centres',
                'excerpt' => 'A new FEMATA analysis links processing-centre access with better safety outcomes, stronger pricing discipline, and more transparent trade.',
                'content' => implode("\n\n", [
                    'A sector analysis released by FEMATA says community-linked processing centres can improve operational consistency while reducing losses associated with fragmented and informal handling practices.',
                    'The brief draws attention to the relationship between reliable processing access, stronger safety controls, and more transparent trade documentation.',
                    'It also recommends closer collaboration between associations, local authorities, and service providers to ensure shared facilities remain commercially practical and professionally managed.',
                ]),
                'featured_image' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
                'category_slug' => 'sector-analysis',
                'is_featured' => false,
                'published_at' => Carbon::now()->subDays(8),
                'updated_at' => Carbon::now()->subDays(8),
            ],
            [
                'slug' => 'women-miners-finance-roundtable',
                'title' => 'Women miners finance roundtable calls for more practical lending pathways',
                'excerpt' => 'Participants urged lenders and support institutions to simplify requirements for productive, small-scale mining enterprises.',
                'content' => implode("\n\n", [
                    'A finance roundtable convened with women miners, local lenders, and sector partners focused on the credit barriers facing productive small-scale operations and the need for more workable lending pathways.',
                    'Participants emphasised that better equipment finance, predictable documentation standards, and technical follow-up support can materially improve repayment confidence.',
                    'FEMATA says the discussion will feed into future advocacy on inclusive access to capital and practical enterprise support tools for member associations.',
                ]),
                'featured_image' => 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
                'category_slug' => 'official-statements',
                'is_featured' => false,
                'published_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(9),
            ],
            [
                'slug' => 'safety-observatory-pilot-launch',
                'title' => 'Pilot safety observatory launched to surface recurring field risks earlier',
                'excerpt' => 'The observatory will compile recurring site-level safety concerns and channel them into targeted guidance for associations.',
                'content' => implode("\n\n", [
                    'FEMATA has begun piloting a simple safety observatory model to capture recurring operational risks from the field and feed them into more targeted member guidance.',
                    'The initiative is designed to surface patterns earlier, especially around PPE use, unstable site conditions, and inconsistent reporting practices.',
                    'Federation coordinators say the pilot will help regional leaders move from reactive incident responses toward a more disciplined prevention culture.',
                ]),
                'featured_image' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
                'category_slug' => 'policy-updates',
                'is_featured' => false,
                'published_at' => Carbon::now()->subDays(12),
                'updated_at' => Carbon::now()->subDays(12),
            ],
            [
                'slug' => 'lake-zone-cooperative-showcase',
                'title' => 'Lake Zone cooperative showcase draws attention to local innovation',
                'excerpt' => 'Regional operators presented practical examples of safer production methods, equipment sharing, and cooperative organization.',
                'content' => implode("\n\n", [
                    'A showcase hosted in the Lake Zone brought together association leaders, cooperative representatives, and local operators to share practical examples of equipment sharing, safer production routines, and member-led coordination.',
                    'Several presenters highlighted how modest operational improvements can significantly improve output quality and documentation discipline when adopted consistently.',
                    'FEMATA says the event offered a useful template for peer learning that can be replicated across other regions during the year.',
                ]),
                'featured_image' => 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
                'category_slug' => 'member-news',
                'is_featured' => false,
                'published_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],
            [
                'slug' => 'export-readiness-briefing',
                'title' => 'Export readiness briefing urges earlier compliance preparation',
                'excerpt' => 'FEMATA says many avoidable delays happen because compliance preparation starts too late in the trade cycle.',
                'content' => implode("\n\n", [
                    'An export-readiness briefing circulated by FEMATA warns that many avoidable delays arise because documentation, quality checks, and transport coordination are addressed too late in the trade cycle.',
                    'The federation recommends earlier preparation windows, cleaner document handover practices, and stronger communication between associations and service partners.',
                    'The briefing also notes that predictable compliance routines can improve buyer confidence while reducing stress and uncertainty for member businesses.',
                ]),
                'featured_image' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
                'category_slug' => 'sector-analysis',
                'is_featured' => false,
                'published_at' => Carbon::now()->subDays(18),
                'updated_at' => Carbon::now()->subDays(18),
            ],
        ];

        foreach ($newsArticles as $article) {
            $publishedAt = $article['published_at'];
            $updatedAt = $article['updated_at'];
            $createdAt = (clone $publishedAt)->subHours(6);

            $newsPost = NewsPost::query()->updateOrCreate(
                ['slug' => $article['slug']],
                [
                    'title' => $article['title'],
                    'excerpt' => $article['excerpt'],
                    'content' => $article['content'],
                    'featured_image' => $article['featured_image'],
                    'category_id' => $newsCategoryIds[$article['category_slug']] ?? null,
                    'status_id' => $publishedStatusId,
                    'is_featured' => $article['is_featured'],
                    'created_by' => $admin->id,
                    'updated_by' => $admin->id,
                    'published_by' => $admin->id,
                    'published_at' => $publishedAt,
                ],
            );

            DB::table('news_posts')
                ->where('id', $newsPost->id)
                ->update([
                    'created_at' => $createdAt,
                    'updated_at' => $updatedAt,
                ]);
        }

        $documentCategoryIds = DocumentCategory::query()->pluck('id', 'slug');

        $documents = [
            [
                'slug' => 'strategic-outlook-2026',
                'public_id' => '01J0FEMATASTRATEGIC2026AB',
                'title' => 'FEMATA Strategic Outlook 2026',
                'description' => 'Strategic directions, institutional priorities, and key delivery themes for the 2026 operating cycle.',
                'file_path' => '/documents/strategic-outlook-2026.pdf',
                'file_extension' => 'pdf',
                'document_type' => 'strategy',
                'category_slug' => 'strategic-plan',
                'year' => 2026,
                'published_at' => Carbon::now()->subMonth(),
            ],
            [
                'slug' => 'member-services-guide',
                'public_id' => '01J0FEMATAMEMBERSVCGUIDE26',
                'title' => 'Member Services Guide',
                'description' => 'A practical guide to federation support services, coordination channels, and member engagement pathways.',
                'file_path' => '/documents/member-services-guide.pdf',
                'file_extension' => 'pdf',
                'document_type' => 'guide',
                'category_slug' => 'forms-and-downloads',
                'year' => 2026,
                'published_at' => Carbon::now()->subWeeks(3),
            ],
            [
                'slug' => 'responsible-mining-checklist',
                'public_id' => '01J0FEMATARESPMINECHECK26',
                'title' => 'Responsible Mining Checklist',
                'description' => 'A short operational checklist covering safety, documentation, and responsible practice priorities.',
                'file_path' => '/documents/responsible-mining-checklist.pdf',
                'file_extension' => 'pdf',
                'document_type' => 'checklist',
                'category_slug' => 'policies',
                'year' => 2026,
                'published_at' => Carbon::now()->subWeeks(2),
            ],
            [
                'slug' => 'investment-readiness-brief',
                'public_id' => '01J0FEMATAINVESTREADYBRF26',
                'title' => 'Investment Readiness Brief',
                'description' => 'A concise briefing on documentation, visibility, and organizational readiness for partnerships and financing conversations.',
                'file_path' => '/documents/investment-readiness-brief.jpg',
                'file_extension' => 'jpg',
                'document_type' => 'brief',
                'category_slug' => 'analytical-reports',
                'year' => 2026,
                'published_at' => Carbon::now()->subWeeks(4),
            ],
            [
                'slug' => 'association-governance-template',
                'public_id' => '01J0FEMATAGOVERNANCETMP26',
                'title' => 'Association Governance Template',
                'description' => 'A practical reference for committee structure, reporting lines, and recurring governance routines within member associations.',
                'file_path' => '/documents/association-governance-template.pdf',
                'file_extension' => 'pdf',
                'document_type' => 'template',
                'category_slug' => 'forms-and-downloads',
                'year' => 2026,
                'published_at' => Carbon::now()->subWeeks(5),
            ],
            [
                'slug' => 'safety-briefing-pack',
                'public_id' => '01J0FEMATASAFETYBRIEFPA26',
                'title' => 'Safety Briefing Pack',
                'description' => 'Safety briefing slides and field checklist materials for use during member meetings and site visits.',
                'file_path' => '/documents/safety-briefing-pack.pdf',
                'file_extension' => 'pdf',
                'document_type' => 'briefing-pack',
                'category_slug' => 'policies',
                'year' => 2026,
                'published_at' => Carbon::now()->subWeeks(6),
            ],
            [
                'slug' => 'membership-registry-update-form',
                'public_id' => '01J0FEMATAMEMBERREGFORM26',
                'title' => 'Membership Registry Update Form',
                'description' => 'Submission form for refreshing association membership records, leadership contacts, and office details.',
                'file_path' => '/documents/membership-registry-update-form.pdf',
                'file_extension' => 'pdf',
                'document_type' => 'form',
                'category_slug' => 'forms-and-downloads',
                'year' => 2026,
                'published_at' => Carbon::now()->subWeeks(7),
            ],
        ];

        foreach ($documents as $document) {
            Document::query()->updateOrCreate(
                ['slug' => $document['slug']],
                [
                    'public_id' => $document['public_id'],
                    'title' => $document['title'],
                    'description' => $document['description'],
                    'file_path' => $document['file_path'],
                    'file_extension' => $document['file_extension'],
                    'document_type' => $document['document_type'],
                    'category_id' => $documentCategoryIds[$document['category_slug']] ?? null,
                    'year' => $document['year'],
                    'is_public' => true,
                    'status_id' => $publishedStatusId,
                    'created_by' => $admin->id,
                    'updated_by' => $admin->id,
                    'published_by' => $admin->id,
                    'published_at' => $document['published_at'],
                ],
            );
        }

        $documentIds = Document::query()->pluck('id', 'slug');

        $leaders = [
            [
                'name' => 'Dr. Amina M. Kileo',
                'designation' => 'Chairperson',
                'administration_level' => 'Management Team',
                'department' => 'Council Leadership',
                'bio' => 'Provides strategic oversight for federation governance, institutional partnerships, and national advocacy on behalf of member associations.',
                'image_path' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
                'contact_qr_path' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Dr%20Amina%20M.%20Kileo%20-%20Chairperson%20-%20FEMATA',
                'email' => 'chairperson@femata.or.tz',
                'phone' => '+255 754 110 201',
                'rank_order' => 0,
            ],
            [
                'name' => 'Hon. Joseph S. Mwinyimvua',
                'designation' => 'Vice Chairperson',
                'administration_level' => 'Management Team',
                'department' => 'Council Leadership',
                'bio' => 'Supports strategic representation, inter-association alignment, and follow-up on regional engagement priorities across the federation.',
                'image_path' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
                'contact_qr_path' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Joseph%20S.%20Mwinyimvua%20-%20Vice%20Chairperson%20-%20FEMATA',
                'email' => 'vicechair@femata.or.tz',
                'phone' => '+255 754 110 202',
                'rank_order' => 1,
            ],
            [
                'name' => 'Eng. Rehema T. Mhando',
                'designation' => 'Executive Director',
                'administration_level' => 'Management Team',
                'department' => 'Executive Office',
                'bio' => 'Leads federation execution, institutional planning, and coordination between the national secretariat and regional associations.',
                'image_path' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
                'contact_qr_path' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Rehema%20T.%20Mhando%20-%20Executive%20Director%20-%20FEMATA',
                'email' => 'executive.director@femata.or.tz',
                'phone' => '+255 754 110 203',
                'rank_order' => 2,
            ],
            [
                'name' => 'Samwel P. Magesa',
                'designation' => 'Director of Strategy and Partnerships',
                'administration_level' => 'Management Team',
                'department' => 'Strategy and Partnerships',
                'bio' => 'Coordinates strategic programs, partnership engagement, and national initiatives that improve sector visibility and institutional credibility.',
                'image_path' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
                'contact_qr_path' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Samwel%20P.%20Magesa%20-%20Director%20of%20Strategy%20and%20Partnerships%20-%20FEMATA',
                'email' => 'strategy@femata.or.tz',
                'phone' => '+255 754 110 204',
                'rank_order' => 3,
            ],
            [
                'name' => 'Rosemary N. Kibwana',
                'designation' => 'Head of Secretariat',
                'administration_level' => 'Secretariat',
                'department' => 'Secretariat Coordination',
                'bio' => 'Oversees administrative continuity, office delivery systems, and internal coordination for federation operations and public communication.',
                'image_path' => 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=600&q=80',
                'contact_qr_path' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Rosemary%20N.%20Kibwana%20-%20Head%20of%20Secretariat%20-%20FEMATA',
                'email' => 'secretariat@femata.or.tz',
                'phone' => '+255 754 110 205',
                'rank_order' => 10,
            ],
            [
                'name' => 'Martha J. Lusingu',
                'designation' => 'Finance and Administration Manager',
                'administration_level' => 'Secretariat',
                'department' => 'Finance and Administration',
                'bio' => 'Supports financial management, procurement coordination, and administration systems that keep federation services consistent and accountable.',
                'image_path' => 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80',
                'contact_qr_path' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Martha%20J.%20Lusingu%20-%20Finance%20and%20Administration%20Manager%20-%20FEMATA',
                'email' => 'finance@femata.or.tz',
                'phone' => '+255 754 110 206',
                'rank_order' => 11,
            ],
            [
                'name' => 'Abdallah K. Mshana',
                'designation' => 'Communications and Membership Officer',
                'administration_level' => 'Secretariat',
                'department' => 'Communications and Membership',
                'bio' => 'Manages public information flow, member communications, and ongoing updates to federation-facing records and digital channels.',
                'image_path' => 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=600&q=80',
                'contact_qr_path' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Abdallah%20K.%20Mshana%20-%20Communications%20and%20Membership%20Officer%20-%20FEMATA',
                'email' => 'communications@femata.or.tz',
                'phone' => '+255 754 110 207',
                'rank_order' => 12,
            ],
            [
                'name' => 'Neema C. Mdoe',
                'designation' => 'Programs and Field Coordination Officer',
                'administration_level' => 'Secretariat',
                'department' => 'Programs and Field Coordination',
                'bio' => 'Links field activities with federation programs, supports regional follow-up, and helps turn member priorities into visible coordination work.',
                'image_path' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
                'contact_qr_path' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Neema%20C.%20Mdoe%20-%20Programs%20and%20Field%20Coordination%20Officer%20-%20FEMATA',
                'email' => 'programs@femata.or.tz',
                'phone' => '+255 754 110 208',
                'rank_order' => 13,
            ],
        ];

        foreach ($leaders as $leader) {
            Leader::query()->updateOrCreate(
                ['name' => $leader['name']],
                [
                    ...$leader,
                    'is_active' => true,
                ],
            );
        }

        $galleryAssets = [
            [
                'file_path' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
                'file_name' => 'femata-leadership-forum.jpg',
                'title' => 'FEMATA leadership forum',
                'caption' => 'Recording the institution\'s leadership forum in Dar es Salaam.',
                'display_order' => 1,
                'is_featured' => true,
            ],
            [
                'file_path' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
                'file_name' => 'stakeholder-roundtable.jpg',
                'title' => 'Stakeholder roundtable session',
                'caption' => 'Regional leaders, association representatives, and partners during a policy dialogue session.',
                'display_order' => 2,
                'is_featured' => true,
            ],
            [
                'file_path' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
                'file_name' => 'field-visit-briefing.jpg',
                'title' => 'Field visit and site briefing',
                'caption' => 'A field coordination visit focused on safety practice, documentation, and production visibility.',
                'display_order' => 3,
                'is_featured' => true,
            ],
            [
                'file_path' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
                'file_name' => 'office-coordination-desk.jpg',
                'title' => 'National coordination desk',
                'caption' => 'Institutional communications and public information preparation at the federation secretariat.',
                'display_order' => 4,
                'is_featured' => false,
            ],
            [
                'file_path' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
                'file_name' => 'safety-training-session.jpg',
                'title' => 'Safety training session',
                'caption' => 'Association officers and miners during a practical session on safer routines and reporting discipline.',
                'display_order' => 5,
                'is_featured' => false,
            ],
            [
                'file_path' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
                'file_name' => 'strategy-review-session.jpg',
                'title' => 'Strategy review session',
                'caption' => 'National leadership and secretariat teams reviewing priorities, partnerships, and delivery milestones.',
                'display_order' => 6,
                'is_featured' => false,
            ],
            [
                'file_path' => 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
                'file_name' => 'women-miners-roundtable.jpg',
                'title' => 'Women miners roundtable',
                'caption' => 'A networking and enterprise support session connecting women miners with institutional partners.',
                'display_order' => 7,
                'is_featured' => true,
            ],
            [
                'file_path' => 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
                'file_name' => 'community-engagement-forum.jpg',
                'title' => 'Community engagement forum',
                'caption' => 'Public-facing session on local visibility, responsible mining, and federation outreach priorities.',
                'display_order' => 8,
                'is_featured' => false,
            ],
        ];

        foreach ($galleryAssets as $asset) {
            $media = MediaLibrary::query()->updateOrCreate(
                ['file_path' => $asset['file_path']],
                [
                    'title' => $asset['title'],
                    'file_name' => $asset['file_name'],
                    'file_type' => 'image',
                    'caption' => $asset['caption'],
                    'uploaded_by' => $admin->id,
                ],
            );

            GalleryItem::query()->updateOrCreate(
                ['media_id' => $media->id],
                [
                    'title' => $asset['title'],
                    'caption' => $asset['caption'],
                    'display_order' => $asset['display_order'],
                    'is_featured' => $asset['is_featured'],
                    'created_by' => $admin->id,
                ],
            );
        }

        $videoCategoryIds = VideoCategory::query()->pluck('id', 'slug');

        $videos = [
            [
                'slug' => 'youtube-mining-governance',
                'title' => 'YouTube address on mining governance',
                'summary' => 'Message from FEMATA\'s Chairperson on ethical partnerships and stronger institutional coordination.',
                'youtube_url' => 'https://www.youtube.com/watch?v=2g811Eo7K8U',
                'youtube_video_id' => '2g811Eo7K8U',
                'thumbnail' => 'https://img.youtube.com/vi/2g811Eo7K8U/hqdefault.jpg',
                'category_slug' => 'chairperson-address',
                'published_at' => Carbon::now()->subWeeks(2),
            ],
            [
                'slug' => 'femata-press-highlights',
                'title' => 'Press highlights from the FEMATA stakeholder dialogue',
                'summary' => 'Short highlights from the federation\'s engagement with partners, members, and public-sector stakeholders.',
                'youtube_url' => 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
                'youtube_video_id' => 'ysz5S6PUM-U',
                'thumbnail' => 'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg',
                'category_slug' => 'press-highlights',
                'published_at' => Carbon::now()->subWeeks(4),
            ],
            [
                'slug' => 'sector-interview-formalization',
                'title' => 'Sector interview on formalization and member services',
                'summary' => 'Interview unpacking practical member support, documentation readiness, and current federation priorities.',
                'youtube_url' => 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
                'youtube_video_id' => 'jNQXAC9IVRw',
                'thumbnail' => 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg',
                'category_slug' => 'sector-interviews',
                'published_at' => Carbon::now()->subWeeks(6),
            ],
        ];

        foreach ($videos as $video) {
            VideoPost::query()->updateOrCreate(
                ['slug' => $video['slug']],
                [
                    'title' => $video['title'],
                    'summary' => $video['summary'],
                    'youtube_url' => $video['youtube_url'],
                    'youtube_video_id' => $video['youtube_video_id'],
                    'thumbnail' => $video['thumbnail'],
                    'category_id' => $videoCategoryIds[$video['category_slug']] ?? null,
                    'status_id' => $publishedStatusId,
                    'is_featured' => true,
                    'created_by' => $admin->id,
                    'updated_by' => $admin->id,
                    'published_by' => $admin->id,
                    'published_at' => $video['published_at'],
                ],
            );
        }

        $associationTypeIds = [];

        foreach ([
            [
                'slug' => 'regional-miners-association',
                'name' => 'Regional Miners Association',
                'description' => 'Regional member associations coordinating miners, advocacy, and local institutional engagement.',
                'sort_order' => 1,
            ],
            [
                'slug' => 'women-miners-network',
                'name' => 'Women Miners Network',
                'description' => 'Associations and networks focused on women-led mining enterprises, visibility, and support.',
                'sort_order' => 2,
            ],
            [
                'slug' => 'local-content-providers',
                'name' => 'Local Content Providers',
                'description' => 'Organizations supporting mining through supply, fabrication, logistics, technical, and local content services.',
                'sort_order' => 3,
            ],
            [
                'slug' => 'service-providers',
                'name' => 'Mining Service Providers',
                'description' => 'Sector-aligned organizations offering services, finance, training, safety, and operational support.',
                'sort_order' => 4,
            ],
        ] as $typeData) {
            $type = AssociationType::query()->updateOrCreate(
                ['slug' => $typeData['slug']],
                [
                    'name' => $typeData['name'],
                    'description' => $typeData['description'],
                    'sort_order' => $typeData['sort_order'],
                    'is_active' => true,
                ],
            );

            $associationTypeIds[$typeData['slug']] = $type->id;
        }

        $associations = [
            [
                'slug' => 'geita-miners-association',
                'name' => 'Geita Miners Association',
                'association_type_slug' => 'regional-miners-association',
                'regions' => ['Geita', 'Mwanza', 'Shinyanga'],
                'district' => 'Geita District',
                'address' => 'Kalangalala Road, Geita Municipality',
                'postal_address' => 'P.O. Box 214, Geita',
                'phone' => '+255 765 101 220',
                'email' => 'secretariat@gema.or.tz',
                'website' => 'https://www.femata.or.tz/associations/geita-miners-association',
                'rema_website_url' => 'https://www.gema.or.tz',
                'logo_path' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
                'hero_image' => 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1400&q=80',
                'description' => 'A regional association coordinating responsible small-scale mining, field advocacy, and member support across the Lake Zone.',
                'homepage_title' => 'Practical coordination for Lake Zone mining communities',
                'homepage_intro' => 'Geita Miners Association uses its public homepage to surface practical accomplishments, member coordination results, and the direction it is setting for safer, more visible mining activity across the Lake Zone.',
                'mission' => 'To organize miners, strengthen representation, and connect members to safer operations, credible advocacy, and practical institutional support.',
                'vision' => 'A visible and professionally coordinated Lake Zone mining community with stronger public trust and stronger member opportunity.',
                'gender_commitment' => 'The association promotes women’s participation in local leadership, enterprise visibility, and inclusive access to sector opportunities.',
                'esg_commitment' => 'Geita Miners Association encourages safer production, cleaner record keeping, community accountability, and responsible environmental practice across the region.',
                'about_title' => 'A Lake Zone association with practical field coordination',
                'about_body' => 'Geita Miners Association works with miners, local leaders, and service partners to strengthen safety culture, member organization, licensing follow-up, and public visibility for productive small-scale operations. The association supports FEMATA coordination in the Lake Zone by maintaining reliable contact points, highlighting local innovation, and linking members to training, guidance, and stakeholder dialogue.',
                'focus_areas' => "Licensing and compliance guidance\nSafety awareness and field briefings\nEquipment access and member coordination",
                'highlights' => [
                    ['title' => 'Regional coordination', 'text' => 'Brings together association leaders and site representatives across the Lake Zone.'],
                    ['title' => 'Safety support', 'text' => 'Circulates practical field briefings on PPE, reporting, and safer routines.'],
                    ['title' => 'Public visibility', 'text' => 'Maintains a profile that helps partners and members find verified contacts quickly.'],
                ],
                'leaders' => [
                    [
                        'name' => 'Eng. Neema Lwakatare',
                        'title' => 'Chairperson',
                        'bio' => 'Coordinates member mobilization, safety partnerships, and regional advocacy priorities.',
                        'photo_path' => 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=500&q=80',
                        'email' => 'chair@gema.or.tz',
                        'phone' => '+255 754 991 420',
                    ],
                    [
                        'name' => 'Peter M. Komba',
                        'title' => 'Secretary',
                        'bio' => 'Oversees documentation, member records, and association communications.',
                        'photo_path' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
                        'email' => 'secretary@gema.or.tz',
                        'phone' => '+255 742 180 112',
                    ],
                ],
                'gallery' => [
                    [
                        'image_path' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Field briefing with miners and local coordinators in the Lake Zone.',
                    ],
                    [
                        'image_path' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Regional planning session on coordination and safer production routines.',
                    ],
                ],
                'chairperson_name' => 'Eng. Neema Lwakatare',
                'secretary_name' => 'Peter M. Komba',
                'document_slugs' => ['member-services-guide', 'responsible-mining-checklist'],
            ],
            [
                'slug' => 'mbeya-women-miners-network',
                'name' => 'Mbeya Women Miners Network',
                'association_type_slug' => 'women-miners-network',
                'regions' => ['Mbeya', 'Songwe', 'Rukwa'],
                'district' => 'Mbeya City',
                'address' => 'Iyunga, Mbeya City',
                'postal_address' => 'P.O. Box 809, Mbeya',
                'phone' => '+255 713 550 004',
                'email' => 'info@mwmn.or.tz',
                'website' => 'https://www.femata.or.tz/associations/mbeya-women-miners-network',
                'rema_website_url' => 'https://www.mwmn.or.tz',
                'logo_path' => 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80',
                'hero_image' => 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80',
                'description' => 'A regional network strengthening women-led mining enterprises, shared learning, and access to finance in the Southern Highlands.',
                'homepage_title' => 'Visibility and practical support for women-led mining enterprise',
                'homepage_intro' => 'The homepage for Mbeya Women Miners Network highlights current enterprise support work, leadership development, and public-facing regional accomplishments that help women miners grow with confidence.',
                'mission' => 'To strengthen women-led mining enterprise through representation, practical support, and stronger access to finance, training, and networks.',
                'vision' => 'A mining sector where women-led operations are visible, competitive, and well supported across the Southern Highlands.',
                'gender_commitment' => 'Gender inclusion is at the core of the network’s mandate, from leadership mentoring to enterprise visibility and support design.',
                'esg_commitment' => 'The network champions responsible practice, safer production routines, and enterprise growth aligned with community and environmental responsibility.',
                'about_title' => 'Supporting women-led mining enterprise growth',
                'about_body' => 'Mbeya Women Miners Network builds stronger visibility and practical support for women-led mining enterprises by connecting members to financing discussions, leadership development, documentation support, and shared learning across the Southern Highlands. The network also works with FEMATA on inclusive representation and stronger public-facing regional communication.',
                'focus_areas' => "Women-led enterprise support\nAccess to finance and markets\nLeadership mentoring and member visibility",
                'highlights' => [
                    ['title' => 'Enterprise support', 'text' => 'Helps members package business information for lenders and partners.'],
                    ['title' => 'Leadership pipeline', 'text' => 'Encourages women miners to take visible organizational roles across the region.'],
                    ['title' => 'Regional network', 'text' => 'Links members in Mbeya, Songwe, and Rukwa around shared priorities.'],
                ],
                'leaders' => [
                    [
                        'name' => 'Joyce N. Mwakyusa',
                        'title' => 'Coordinator',
                        'bio' => 'Leads partnership engagement, mentoring sessions, and enterprise visibility work.',
                        'photo_path' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
                        'email' => 'joyce@mwmn.or.tz',
                        'phone' => '+255 744 300 921',
                    ],
                    [
                        'name' => 'Asha S. Mwakipesile',
                        'title' => 'Programs Secretary',
                        'bio' => 'Coordinates member training and documentation clinics across the zone.',
                        'photo_path' => 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=500&q=80',
                        'email' => 'asha@mwmn.or.tz',
                        'phone' => '+255 768 101 714',
                    ],
                ],
                'gallery' => [
                    [
                        'image_path' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Member enterprise clinic focused on records, finance readiness, and growth planning.',
                    ],
                    [
                        'image_path' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Networking session bringing together women miners, partners, and local leaders.',
                    ],
                ],
                'chairperson_name' => 'Joyce N. Mwakyusa',
                'secretary_name' => 'Asha S. Mwakipesile',
                'document_slugs' => ['investment-readiness-brief', 'member-services-guide'],
            ],
            [
                'slug' => 'dodoma-artisanal-miners-association',
                'name' => 'Dodoma Artisanal Miners Association',
                'association_type_slug' => 'regional-miners-association',
                'regions' => ['Dodoma', 'Singida', 'Tabora'],
                'district' => 'Dodoma City',
                'address' => 'Area C, Dodoma City',
                'postal_address' => 'P.O. Box 1180, Dodoma',
                'phone' => '+255 754 818 225',
                'email' => 'admin@dama.or.tz',
                'website' => 'https://www.femata.or.tz/associations/dodoma-artisanal-miners-association',
                'rema_website_url' => 'https://www.dama.or.tz',
                'logo_path' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80',
                'hero_image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
                'description' => 'A central-zone association focused on formalization, licensing support, and stronger institutional coordination for artisanal miners.',
                'homepage_title' => 'Formalization support and stronger member coordination in the Central Zone',
                'homepage_intro' => 'Dodoma Artisanal Miners Association uses its homepage to show coordination wins, policy support work, and the institutional direction guiding member services in the Central Zone.',
                'mission' => 'To support artisanal miners with cleaner organization, better documentation, and stronger public-facing institutional coordination.',
                'vision' => 'A more organized and better represented artisanal mining community across the Central Zone.',
                'gender_commitment' => 'The association is expanding inclusive participation in member meetings, local leadership, and service delivery pathways.',
                'esg_commitment' => 'The association encourages better compliance habits, cleaner governance, and more responsible operational practices across its member base.',
                'about_title' => 'A practical association for formalization and member coordination',
                'about_body' => 'Dodoma Artisanal Miners Association supports miners with documentation follow-up, leadership coordination, and practical information-sharing across the Central Zone. It acts as a visible coordination point between members, service providers, and FEMATA national structures.',
                'focus_areas' => "Formalization support\nMember records and governance\nStakeholder communication",
                'highlights' => [
                    ['title' => 'Compliance guidance', 'text' => 'Supports cleaner member records and licensing follow-up.'],
                    ['title' => 'Sector dialogue', 'text' => 'Creates a clearer contact point for local authorities and partners.'],
                    ['title' => 'Member services', 'text' => 'Helps connect miners to guidance, forms, and public resources.'],
                ],
                'leaders' => [
                    [
                        'name' => 'Thomas M. Mrema',
                        'title' => 'Chairperson',
                        'bio' => 'Provides strategic direction on governance, compliance, and stakeholder relations.',
                        'photo_path' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
                        'email' => 'thomas@dama.or.tz',
                        'phone' => '+255 784 200 881',
                    ],
                ],
                'gallery' => [
                    [
                        'image_path' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Administrative coordination meeting on records, visibility, and compliance support.',
                    ],
                ],
                'chairperson_name' => 'Thomas M. Mrema',
                'secretary_name' => 'Rose M. Mjema',
                'document_slugs' => ['strategic-outlook-2026', 'responsible-mining-checklist'],
            ],
            [
                'slug' => 'mwanza-local-content-providers-forum',
                'name' => 'Mwanza Local Content Providers Forum',
                'association_type_slug' => 'local-content-providers',
                'regions' => ['Mwanza', 'Geita', 'Simiyu'],
                'district' => 'Mwanza City',
                'address' => 'Bwiru, Mwanza City',
                'postal_address' => 'P.O. Box 1440, Mwanza',
                'phone' => '+255 754 902 118',
                'email' => 'info@mlcpf.or.tz',
                'website' => 'https://www.femata.or.tz/associations/mwanza-local-content-providers-forum',
                'rema_website_url' => 'https://www.mlcpf.or.tz',
                'logo_path' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
                'hero_image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
                'description' => 'A regional forum linking mining-facing local content providers, fabricators, logistics teams, and technical partners around visibility and opportunity.',
                'homepage_title' => 'Local content capacity for a stronger mining ecosystem',
                'homepage_intro' => 'The forum homepage focuses on supplier readiness, collaboration wins, and how local content providers are positioning themselves to serve mining operations more effectively.',
                'mission' => 'To increase the visibility, readiness, and coordination of local content businesses serving mining regions in the Lake Zone.',
                'vision' => 'A mining ecosystem where capable local providers are visible, competitive, and connected to credible market opportunities.',
                'gender_commitment' => 'The forum encourages inclusive supplier participation and supports women-led enterprises within the regional local content ecosystem.',
                'esg_commitment' => 'The forum promotes responsible sourcing, accountable delivery, and partnership models that strengthen community and environmental outcomes.',
                'about_title' => 'A local content platform built around readiness and collaboration',
                'about_body' => 'Mwanza Local Content Providers Forum brings together service businesses, fabricators, logistics providers, and technical support firms that contribute to mining operations. Through FEMATA, the forum gains a stronger public-facing directory presence while supporting local enterprise visibility and business-to-business coordination.',
                'focus_areas' => "Supplier readiness and visibility\nBusiness-to-business coordination\nRegional local content advocacy",
                'highlights' => [
                    ['title' => 'Supplier visibility', 'text' => 'Profiles regional providers for better discovery by mines, associations, and partners.'],
                    ['title' => 'Business readiness', 'text' => 'Supports local providers in presenting their capabilities more clearly to the market.'],
                    ['title' => 'Regional collaboration', 'text' => 'Connects local content businesses across Mwanza, Geita, and Simiyu.'],
                ],
                'leaders' => [
                    [
                        'name' => 'Mary P. Kabulo',
                        'title' => 'Forum Chair',
                        'bio' => 'Leads regional supplier visibility efforts and business coordination initiatives.',
                        'photo_path' => 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=500&q=80',
                        'email' => 'mary@mlcpf.or.tz',
                        'phone' => '+255 758 221 440',
                    ],
                ],
                'gallery' => [
                    [
                        'image_path' => 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Regional supplier forum session focused on business readiness and local delivery opportunities.',
                    ],
                ],
                'chairperson_name' => 'Mary P. Kabulo',
                'secretary_name' => 'John T. Mhando',
                'document_slugs' => ['investment-readiness-brief', 'member-services-guide'],
            ],
        ];

        $associationIds = [];

        foreach ($associations as $associationData) {
            $documentSlugs = $associationData['document_slugs'];
            $associationTypeSlug = $associationData['association_type_slug'] ?? null;
            unset($associationData['document_slugs']);
            unset($associationData['association_type_slug']);

            $association = Association::query()->updateOrCreate(
                ['slug' => $associationData['slug']],
                [
                    ...$associationData,
                    'association_type_id' => $associationTypeSlug ? ($associationTypeIds[$associationTypeSlug] ?? null) : null,
                    'region' => $associationData['regions'][0] ?? null,
                    'is_active' => true,
                ],
            );

            $associationIds[$association->slug] = $association->id;

            $association->documents()->sync(
                collect($documentSlugs)
                    ->map(fn (string $slug) => $documentIds[$slug] ?? null)
                    ->filter()
                    ->values()
                    ->all(),
            );
        }

        $advertCampaigns = [
            [
                'slug' => 'home-mining-equipment-spotlight',
                'title' => 'Mining Equipment Spotlight',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Reliable field equipment for productive mining operations',
                'body' => 'A rotating homepage placement showing how partner campaigns can appear inside FEMATA with strong visual hierarchy and a clear action.',
                'cta_label' => 'Request supplier details',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_HOME,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'home-finance-video-campaign',
                'title' => 'Finance Access Campaign',
                'media_type' => 'video',
                'asset_url' => 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                'poster_url' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Finance products that fit productive mining growth',
                'body' => 'Video adverts can rotate in the same slot and hold for a longer timing window before the next campaign appears.',
                'cta_label' => 'Discuss finance options',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_HOME,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 2,
                'duration_seconds' => 10,
            ],
            [
                'slug' => 'home-safety-ppe-campaign',
                'title' => 'Safety and PPE Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Safety supplies for field-ready mining teams',
                'body' => 'Trusted suppliers of PPE, rescue gear, field safety systems, and compliance services can reach associations looking to strengthen worker protection.',
                'cta_label' => 'View safety support',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_HOME,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 3,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'home-logistics-services-campaign',
                'title' => 'Regional Logistics Services',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Move materials with better reliability and planning',
                'body' => 'Transport, warehousing, and mineral-movement partners can use this slot to reach operators moving ore, equipment, and supplies across regions.',
                'cta_label' => 'Contact logistics partner',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_HOME,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 4,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'home-training-services-campaign',
                'title' => 'Training Services Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Practical training for safer, more productive mining operations',
                'body' => 'Training institutions can use this slot to promote geology, processing, safety, leadership, and governance support for miners and member associations.',
                'cta_label' => 'Explore training support',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_HOME,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 5,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'home-technology-services-campaign',
                'title' => 'Mining Technology Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Digital tools, mapping, and operational visibility solutions',
                'body' => 'Digital mapping, production tracking, assaying, and mine-planning solutions can be promoted here for miners and associations ready to modernize.',
                'cta_label' => 'See technology services',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_HOME,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 6,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'home-association-network-campaign',
                'title' => 'National Sector Visibility Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'National partners can reach miners, associations, and stakeholders',
                'body' => 'This larger homepage placement suits banks, equipment providers, laboratories, insurers, and development partners serving Tanzania\'s mining economy.',
                'cta_label' => 'Book this placement',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_HOME,
                'slot_number' => 2,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'directory-discovery-campaign',
                'title' => 'Directory Discovery Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Reach visitors before they open a specific association profile',
                'body' => 'Association directory adverts can help partners reach visitors exploring the full network by region and type.',
                'cta_label' => 'Advertise in the directory',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_ASSOCIATIONS,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'directory-local-content-video',
                'title' => 'Local Content Providers Campaign',
                'media_type' => 'video',
                'asset_url' => 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                'poster_url' => 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Video campaigns can also be targeted by association type',
                'body' => 'This campaign highlights suppliers, fabricators, and service firms that support local content delivery to mining operations.',
                'cta_label' => 'Meet local providers',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_ASSOCIATIONS,
                'slot_number' => 2,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 10,
            ],
            [
                'slug' => 'news-partner-campaign',
                'title' => 'Newsroom Partner Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Partner campaigns can sit naturally inside the FEMATA newsroom',
                'body' => 'Media, research, and event partners can align their message with FEMATA\'s public update stream and stakeholder readership.',
                'cta_label' => 'Open media kit',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_NEWS,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'documents-resource-campaign',
                'title' => 'Document Hub Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Service providers can appear near official resources and downloads',
                'body' => 'Consultants, labs, insurers, and training providers can appear beside high-intent visitors searching for official resources and downloads.',
                'cta_label' => 'View sponsorship options',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_DOCUMENTS,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'gallery-visual-campaign',
                'title' => 'Gallery Visual Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Strong visual campaigns can live inside the media gallery too',
                'body' => 'Visual campaigns from exhibitions, equipment showcases, and partner activations can rotate inside FEMATA\'s media storytelling spaces.',
                'cta_label' => 'Plan a visual campaign',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_GALLERY,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'contact-partnership-campaign',
                'title' => 'Partnership Contact Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'This contact page slot can carry partnership and media enquiries',
                'body' => 'Banks, insurers, equipment suppliers, and development partners can meet visitors at the point where they are ready to inquire.',
                'cta_label' => 'Talk to FEMATA',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_CONTACT,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'association-home-national-campaign',
                'title' => 'Association Home National Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Every association homepage can carry a live partner campaign',
                'body' => 'This national association-home placement ensures the advert system is visible across all published association profiles.',
                'cta_label' => 'Book association homepage placement',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_ASSOCIATION_HOME,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 0,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'association-home-lake-zone-campaign',
                'title' => 'Lake Zone Services Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Region-targeted campaigns can follow association coverage',
                'body' => 'This advert uses the region scope so it appears for associations serving Geita and surrounding Lake Zone regions.',
                'cta_label' => 'Reach this region',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_ASSOCIATION_HOME,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_REGION,
                'region' => 'Geita',
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'association-home-women-miners-campaign',
                'title' => 'Women Miners Enterprise Campaign',
                'media_type' => 'video',
                'asset_url' => 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                'poster_url' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Association-type targeting can follow women miners networks',
                'body' => 'This video advert appears for associations created under the women miners network type.',
                'cta_label' => 'Support women-led mining',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_ASSOCIATION_HOME,
                'slot_number' => 2,
                'placement_scope' => Advert::SCOPE_ASSOCIATION_TYPE,
                'association_type_id' => $associationTypeIds['women-miners-network'] ?? null,
                'display_order' => 1,
                'duration_seconds' => 10,
            ],
            [
                'slug' => 'association-about-campaign',
                'title' => 'Association About Page Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Association about pages can host their own partner visibility',
                'body' => 'Partners in training, equipment, inclusion, or enterprise support can align with the association\'s public story, mission, and regional focus.',
                'cta_label' => 'Request about-page placement',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_ASSOCIATION_ABOUT,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'association-leadership-campaign',
                'title' => 'Leadership Page Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Leadership pages can showcase trusted sponsor visibility too',
                'body' => 'Governance, leadership development, insurance, and executive-support brands can appear beside verified association leaders.',
                'cta_label' => 'Book leadership placement',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_ASSOCIATION_LEADERSHIP,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'association-documents-campaign',
                'title' => 'Association Documents Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Documents pages can carry aligned resource or service campaigns',
                'body' => 'Service providers in compliance, assaying, equipment, and training can reach members looking for practical downloads and templates.',
                'cta_label' => 'Advertise on documents pages',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_ASSOCIATION_DOCUMENTS,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'association-gallery-campaign',
                'title' => 'Association Gallery Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Association galleries can host brand storytelling placements',
                'body' => 'Visual campaigns can appear beside field images, events, and association milestones to reinforce local brand recognition.',
                'cta_label' => 'Plan a gallery campaign',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_ASSOCIATION_GALLERY,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
            [
                'slug' => 'association-contact-campaign',
                'title' => 'Association Contact Campaign',
                'media_type' => 'image',
                'asset_url' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
                'headline' => 'Contact pages can rotate partner campaigns without leaving the platform',
                'body' => 'Regional sponsors and service partners can engage visitors when they are ready to contact the association directly.',
                'cta_label' => 'Inquire about regional placements',
                'cta_url' => 'https://www.femata.or.tz/contact',
                'page_key' => Advert::PAGE_ASSOCIATION_CONTACT,
                'slot_number' => 1,
                'placement_scope' => Advert::SCOPE_NATIONAL,
                'display_order' => 1,
                'duration_seconds' => 6,
            ],
        ];

        foreach ($advertCampaigns as $advertData) {
            Advert::query()->updateOrCreate(
                ['slug' => $advertData['slug']],
                [
                    'title' => $advertData['title'],
                    'media_type' => $advertData['media_type'],
                    'asset_url' => $advertData['asset_url'],
                    'poster_url' => $advertData['poster_url'] ?? null,
                    'headline' => $advertData['headline'] ?? null,
                    'body' => $advertData['body'] ?? null,
                    'cta_label' => $advertData['cta_label'] ?? null,
                    'cta_url' => $advertData['cta_url'] ?? null,
                    'page_key' => $advertData['page_key'],
                    'slot_number' => $advertData['slot_number'] ?? 1,
                    'placement_scope' => $advertData['placement_scope'] ?? Advert::SCOPE_NATIONAL,
                    'association_id' => isset($advertData['association_slug'])
                        ? ($associationIds[$advertData['association_slug']] ?? null)
                        : ($advertData['association_id'] ?? null),
                    'association_type_id' => $advertData['association_type_id'] ?? null,
                    'region' => $advertData['region'] ?? null,
                    'display_order' => $advertData['display_order'] ?? 0,
                    'duration_seconds' => $advertData['duration_seconds'] ?? ($advertData['media_type'] === 'video' ? 10 : 6),
                    'is_active' => true,
                ],
            );
        }

        Page::query()->updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => 'About FEMATA',
                'content' => SiteSettings::about()['body'],
                'status_id' => $publishedStatusId,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
                'published_by' => $admin->id,
                'published_at' => Carbon::now()->subWeek(),
            ],
        );

        $homeSettings = [
            'hero_image' => 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80',
            'hero_panel_label' => 'National sector snapshot',
            'why_eyebrow' => 'Why FEMATA',
            'why_title' => 'Organizing Tanzania\'s mining associations into a stronger national voice.',
            'why_text' => 'FEMATA helps connect Tanzania\'s artisanal and small-scale mining communities to stronger representation, formalization, productivity, visibility, and long-term sector growth.',
            'mandate_label' => 'Institutional mandate',
            'mandate_title' => 'Built for coordination, productivity, and public trust.',
            'mandate_text' => 'FEMATA links local miner groups, member associations, regional structures, and national coordination so the sector can grow with better organization, stronger productivity, and wider opportunity.',
            'highlights' => [
                [
                    'label' => 'National coordination',
                    'text' => 'A structured federation platform connecting associations, member interests, and strategic engagement across the sector.',
                ],
                [
                    'label' => 'Institutional communication',
                    'text' => 'Timely notices, formal announcements, and practical guidance presented in a cleaner national format.',
                ],
                [
                    'label' => 'Mining information',
                    'text' => 'A clearer path to documents, resources, sector updates, and knowledge relevant to formalization and growth.',
                ],
                [
                    'label' => 'Partnership access',
                    'text' => 'A more credible route for institutions, researchers, financiers, and development partners to engage the ecosystem.',
                ],
            ],
            'pillars' => [
                [
                    'title' => 'Representation',
                    'text' => 'Strengthening organized voice, coordination, and national visibility for miners and member associations.',
                ],
                [
                    'title' => 'Formalization',
                    'text' => 'Supporting compliance, structure, and practical pathways into more organized participation in the mining economy.',
                ],
                [
                    'title' => 'Access',
                    'text' => 'Expanding connections to information, markets, skills, technology, finance, and partnerships.',
                ],
            ],
            'footprint_eyebrow' => 'National footprint',
            'footprint_title' => 'Regional presence across Tanzania\'s mining landscapes.',
            'footprint_text' => 'From gold belts and gemstone corridors to graphite and strategic-mineral regions, FEMATA connects mining communities across Tanzania through structured association networks.',
            'zones' => [
                [
                    'name' => 'Lake Zone',
                    'focus' => 'Association coordination, field engagement, and sector visibility in key production areas.',
                    'base' => 'Regional coordination point',
                ],
                [
                    'name' => 'Central Zone',
                    'focus' => 'Institutional communication, formalization support, and stakeholder engagement.',
                    'base' => 'Operational coordination point',
                ],
                [
                    'name' => 'Southern Zone',
                    'focus' => 'Network expansion, member support, and stronger pathways into federation services.',
                    'base' => 'Regional support point',
                ],
            ],
            'news_eyebrow' => 'Official updates',
            'news_title' => 'News, notices, and sector communication presented with clarity.',
            'news_text' => 'Follow official notices, policy engagement, field activity, partnership updates, and public statements from FEMATA and its member network.',
            'leadership_eyebrow' => 'Leadership',
            'leadership_title' => 'Leadership presented as credible, accessible, and institutionally grounded.',
            'leadership_text' => 'The leadership section should foreground people, responsibility, and professional credibility with a more editorial presentation.',
            'media_eyebrow' => 'Field moments',
            'media_title' => 'Media that reflects actual work on the ground.',
            'media_text' => 'Strong imagery helps the website feel like an active sector institution, not a static noticeboard.',
            'documents_eyebrow' => 'Public resources',
            'documents_title' => 'Guides, circulars, briefs, and public resources for the mining community.',
            'documents_text' => 'Browse official reports, governance tools, member forms, public statements, and reference materials published by FEMATA.',
            'partnerships_eyebrow' => 'Institutional partnerships',
            'partnerships_title' => 'FEMATA works through coordination, public engagement, and national stakeholder relationships.',
            'partnerships_text' => 'FEMATA works with regulators, financiers, service providers, researchers, and development partners to strengthen organized growth across Tanzania\'s mining ecosystem.',
            'partners' => [
                'Regional associations',
                'Government agencies',
                'Finance providers',
                'Development partners',
                'Research institutions',
            ],
            'secondary_cta_label' => 'Learn more',
        ];

        $brandingSettings = [
            'site_name' => 'FEMATA',
            'organization_name' => 'Federation of Miners\' Associations of Tanzania',
            'top_bar_primary' => 'Official platform of Tanzania\'s national federation for miners\' associations',
            'top_bar_secondary' => 'National voice for artisanal and small-scale mining associations',
            'logo_path' => '/brand/femata-logo.png',
            'logo_alt' => 'FEMATA official logo',
            'settings_label' => 'Settings',
            'navigation_cta_label' => 'Contact FEMATA Secretariat',
            'navigation_cta_href' => '/contact',
        ];

        $footerSettings = [
            'strapline' => 'Organizing Tanzania\'s miners\' associations for stronger visibility and growth',
            'description' => 'FEMATA is the national federation connecting miners\' associations, regional structures, and sector stakeholders through one public platform for representation, coordination, and responsible growth.',
            'chips' => [
                'Mineral development',
                'Stakeholder representation',
                'Responsible mining',
                'Policy engagement',
            ],
            'prompt_text' => 'Use the FEMATA website to follow official notices, explore association profiles, access public resources, and connect with the secretariat.',
            'credit_name' => 'FEMATA Secretariat',
            'credit_url' => null,
        ];

        foreach ([
            'branding' => $brandingSettings,
            'home' => $homeSettings,
            'about' => SiteSettings::about(),
            'contact' => SiteSettings::contact(),
            'footer' => $footerSettings,
        ] as $key => $value) {
            SiteSetting::query()->updateOrCreate(
                ['setting_key' => $key],
                [
                    'setting_value' => json_encode($value, JSON_THROW_ON_ERROR),
                    'group_name' => 'site',
                    'updated_by' => $admin->id,
                ],
            );
        }
    }
}
