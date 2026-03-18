import {
  defaultAboutContent,
  defaultContactInfo,
  defaultHomeContent,
  defaultSiteBranding,
  defaultSiteFooter,
} from '@/lib/siteDefaults';
import type {
  Announcement,
  DocumentFile,
  GalleryItem,
  Leader,
  NewsPost,
} from '@/types';

const announcements: Announcement[] = [
  {
    id: 1,
    title: 'FEMATA National Mining Stakeholders Forum 2026 registration now open',
    slug: 'femata-national-mining-stakeholders-forum-2026',
    body: 'Regional associations, service providers, regulators, and sector partners are invited to register for the upcoming national forum focused on responsible mining and institutional coordination.',
    is_active: true,
    priority: 10,
    starts_at: '2026-03-15',
    ends_at: '2026-05-15',
  },
  {
    id: 2,
    title: 'Regional associations directory launched on the official FEMATA website',
    slug: 'regional-associations-directory-launched',
    body: 'The updated website improves visibility for mining associations across Tanzania and creates one trusted public reference point for official information.',
    is_active: true,
    priority: 8,
    starts_at: '2026-03-10',
    ends_at: '2026-06-01',
  },
  {
    id: 3,
    title: 'Call for updated member association profiles and website links',
    slug: 'call-for-member-profile-updates',
    body: 'Member associations are encouraged to submit updated organizational profiles, contact details, and website links for publication on the FEMATA platform.',
    is_active: true,
    priority: 7,
    starts_at: '2026-03-12',
    ends_at: '2026-04-25',
  },
];

const news: NewsPost[] = [
  {
    id: 1,
    title: 'FEMATA advances national dialogue on responsible and inclusive mining growth',
    slug: 'responsible-inclusive-mining-growth',
    excerpt: 'The federation continues strengthening coordination, visibility, and sector advocacy through national stakeholder engagement.',
    body: 'FEMATA has reaffirmed its commitment to strengthening representation for mining associations across Tanzania through coordinated dialogue on responsible mining practices, stakeholder collaboration, institutional visibility, and sector development.',
    cover_image:
      'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1400&q=80',
    published_at: '2026-03-16',
    is_published: true,
  },
  {
    id: 2,
    title: 'New digital platform improves access to FEMATA notices, resources, and sector updates',
    slug: 'new-digital-platform-for-sector-access',
    excerpt: 'The updated official website brings together public documents, media, announcements, leadership information, and institutional updates in one place.',
    body: 'The FEMATA digital platform is designed to improve trust, accessibility, and communication by providing one central online destination for official notices, public resources, media highlights, and institutional engagement.',
    cover_image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
    published_at: '2026-03-12',
    is_published: true,
  },
  {
    id: 3,
    title: 'Leadership engagement highlights policy coordination and investment readiness',
    slug: 'leadership-engagement-policy-coordination',
    excerpt: 'Recent leadership discussions focused on governance, investment climate, institutional trust, and stronger regional coordination.',
    body: 'During a recent strategic engagement session, FEMATA leadership emphasized the importance of policy dialogue, organized representation, institutional communication, and a more coordinated voice for mining associations at national level.',
    cover_image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80',
    published_at: '2026-03-06',
    is_published: true,
  },
  {
    id: 4,
    title: 'Regional associations encouraged to strengthen documentation and public visibility',
    slug: 'regional-associations-public-visibility',
    excerpt: 'FEMATA is supporting stronger institutional presentation and public access for member associations across the country.',
    body: 'As part of its national coordination mandate, FEMATA is encouraging regional associations to improve public-facing documentation, communication channels, and profile visibility to better support partnerships and stakeholder engagement.',
    cover_image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80',
    published_at: '2026-02-28',
    is_published: true,
  },
];

const leaders: Leader[] = [
  {
    id: 1,
    name: 'Dr. Amina M. Kileo',
    title: 'National Chairperson',
    photo_path:
      'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=900&q=80',
    bio: 'Provides strategic oversight to FEMATA with emphasis on governance, responsible mining, and institutional coordination.',
    sort_order: 0,
    is_active: true,
  },
  {
    id: 2,
    name: 'Mr. Jacob P. Mwenda',
    title: 'Executive Director',
    photo_path:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    bio: 'Leads the federation\'s operations, stakeholder engagement, and public communication across the sector.',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 3,
    name: 'Ms. Esther S. Mhando',
    title: 'Director of Programs',
    photo_path:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    bio: 'Coordinates institutional programs, regional outreach, and strategic sector partnerships.',
    sort_order: 2,
    is_active: true,
  },
];

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'National stakeholder forum session',
    slug: 'national-stakeholder-forum-session',
    type: 'image',
    image_path:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
    description: 'Leadership, regional associations, and institutional partners during a national engagement session.',
    is_featured: true,
    published_at: '2026-03-14',
  },
  {
    id: 2,
    title: 'Field visit and association outreach',
    slug: 'field-visit-and-association-outreach',
    type: 'image',
    image_path:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    description: 'Documentation from FEMATA field visits focused on visibility, coordination, and sector dialogue.',
    is_featured: true,
    published_at: '2026-03-08',
  },
  {
    id: 3,
    title: 'Official chairperson address',
    slug: 'official-chairperson-address',
    type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=2g811Eo7K8U',
    description: 'A recorded institutional message on responsible mining and national coordination.',
    is_featured: false,
    published_at: '2026-03-01',
  },
];

const documents: DocumentFile[] = [
  {
    id: 1,
    title: 'FEMATA Strategic Outlook 2026',
    slug: 'strategic-outlook-2026',
    description: 'Strategic directions, priority actions, and institutional goals for the year ahead.',
    file_path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_type: 'application/pdf',
    category: 'Strategy',
    is_public: true,
    published_at: '2026-02-20',
  },
  {
    id: 2,
    title: 'Public stakeholder engagement brief',
    slug: 'public-stakeholder-engagement-brief',
    description: 'An overview of how FEMATA is coordinating public engagement, partnerships, and institutional visibility.',
    file_path:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    file_type: 'image/jpeg',
    category: 'Brief',
    is_public: true,
    published_at: '2026-02-12',
  },
  {
    id: 3,
    title: 'Association governance guide',
    slug: 'association-governance-guide',
    description: 'Reference guidance for governance, record-keeping, and association coordination.',
    file_path: 'https://example.com/femata-governance-guide.pdf',
    file_type: 'application/pdf',
    category: 'Guide',
    is_public: true,
    published_at: '2026-02-08',
  },
];

type PreviewPage = {
  component: string;
  props: Record<string, unknown>;
};

function implodeEntries<T extends object>(items: T[], keys: (keyof T)[]) {
  return items
    .map((item) => keys.map((key) => String(item[key] ?? '')).join(' | '))
    .join('\n');
}

export function getPreviewPage(pathname: string): PreviewPage {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  const matchedNews = news.find((item) => normalized === `/news/${item.slug}`);
  const matchedDocument = documents.find(
    (item) => normalized === `/documents/${item.slug}`,
  );

  if (matchedNews) {
    return {
      component: 'News/Show',
      props: {
        news: matchedNews,
        announcements,
      },
    };
  }

  if (matchedDocument) {
    return {
      component: 'Documents/Show',
      props: {
        document: {
          ...matchedDocument,
          preview: matchedDocument.file_type === 'application/pdf'
            ? 'pdf'
            : matchedDocument.file_type.startsWith('image/')
              ? 'image'
              : null,
        },
        announcements,
      },
    };
  }

  switch (normalized) {
    case '/admin':
    case '/admin/dashboard':
      return {
        component: 'Admin/Dashboard',
        props: {
          stats: [
            {
              label: 'Announcements',
              value: announcements.length,
              detail: `${announcements.filter((item) => item.is_active).length} active notices`,
              href: '/admin/announcements',
            },
            {
              label: 'News posts',
              value: news.length,
              detail: `${news.filter((item) => item.is_published).length} published`,
              href: '/admin/news',
            },
            {
              label: 'Leaders',
              value: leaders.length,
              detail: `${leaders.filter((item) => item.is_active).length} active profiles`,
              href: '/admin/leaders',
            },
            {
              label: 'Gallery items',
              value: galleryItems.length,
              detail: `${galleryItems.filter((item) => item.is_featured).length} featured`,
              href: '/admin/gallery',
            },
            {
              label: 'Documents',
              value: documents.length,
              detail: `${documents.filter((item) => item.is_public).length} public resources`,
              href: '/admin/documents',
            },
          ],
          recentAnnouncements: announcements.slice(0, 5).map((item) => ({
            id: item.id,
            title: item.title,
            meta: `Priority ${item.priority}`,
            status: item.is_active ? 'Active' : 'Inactive',
          })),
          recentNews: news.slice(0, 5).map((item) => ({
            id: item.id,
            title: item.title,
            meta: item.published_at ?? 'Not scheduled',
            status: item.is_published ? 'Published' : 'Draft',
          })),
          recentDocuments: documents.slice(0, 5).map((item) => ({
            id: item.id,
            title: item.title,
            meta: item.category ?? 'Document',
            status: item.is_public ? 'Public' : 'Private',
          })),
        },
      };

    case '/admin/announcements':
      return {
        component: 'Admin/Announcements',
        props: {
          announcements: announcements.map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            body: item.body,
            is_active: item.is_active,
            starts_at: item.starts_at ? `${item.starts_at}T08:00` : null,
            ends_at: item.ends_at ? `${item.ends_at}T17:00` : null,
            priority: item.priority,
          })),
        },
      };

    case '/admin/news':
      return {
        component: 'Admin/News',
        props: {
          news: news.map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt,
            body: item.body,
            cover_image: item.cover_image,
            published_at: item.published_at ? `${item.published_at}T09:00` : null,
            is_published: item.is_published,
          })),
        },
      };

    case '/admin/leaders':
      return {
        component: 'Admin/Leaders',
        props: {
          leaders: leaders.map((item) => ({
            id: item.id,
            name: item.name,
            title: item.title,
            photo_path: item.photo_path,
            bio: item.bio,
            sort_order: item.sort_order,
            is_active: item.is_active,
          })),
        },
      };

    case '/admin/gallery':
      return {
        component: 'Admin/Gallery',
        props: {
          galleryItems: galleryItems.map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            type: item.type,
            image_path: item.image_path,
            youtube_url: item.youtube_url,
            description: item.description,
            is_featured: item.is_featured,
            published_at: item.published_at ? `${item.published_at}T10:00` : null,
          })),
        },
      };

    case '/admin/documents':
      return {
        component: 'Admin/Documents',
        props: {
          documents: documents.map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            file_path: item.file_path,
            file_type: item.file_type,
            category: item.category,
            is_public: item.is_public,
            published_at: item.published_at ? `${item.published_at}T10:00` : null,
          })),
        },
      };

    case '/admin/settings':
      return {
        component: 'Admin/Settings',
        props: {
          branding: defaultSiteBranding,
          home: {
            ...defaultHomeContent,
            highlights_text: implodeEntries(defaultHomeContent.highlights, ['label', 'text']),
            pillars_text: implodeEntries(defaultHomeContent.pillars, ['title', 'text']),
            zones_text: implodeEntries(defaultHomeContent.zones, ['name', 'focus', 'base']),
            partners_text: defaultHomeContent.partners.join('\n'),
          },
          about: defaultAboutContent,
          contact: defaultContactInfo,
          footer: {
            ...defaultSiteFooter,
            chips_text: defaultSiteFooter.chips.join('\n'),
          },
        },
      };

    case '/about':
      return {
        component: 'About',
        props: {
          about: defaultAboutContent,
          announcements,
        },
      };

    case '/leadership':
      return {
        component: 'Leadership',
        props: {
          leaders,
          announcements,
        },
      };

    case '/news':
      return {
        component: 'News/Index',
        props: {
          news,
          announcements,
        },
      };

    case '/announcements':
      return {
        component: 'Announcements',
        props: {
          announcements,
        },
      };

    case '/gallery':
      return {
        component: 'Gallery',
        props: {
          galleryItems,
          announcements,
        },
      };

    case '/documents':
      return {
        component: 'Documents/Index',
        props: {
          documents,
          announcements,
        },
      };

    case '/contact':
      return {
        component: 'Contact',
        props: {
          contact: defaultContactInfo,
          announcements,
        },
      };

    default:
      return {
        component: 'Home',
        props: {
          announcements,
          news,
          leaders,
          documents,
          galleryItems,
          homeContent: defaultHomeContent,
        },
      };
  }
}
