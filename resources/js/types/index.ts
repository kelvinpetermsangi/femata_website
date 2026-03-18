export type Locale = 'en' | 'sw';
export type ThemeMode = 'light' | 'dark' | 'gray';

export interface Announcement {
  id: number;
  title: string;
  slug: string;
  body: string;
  is_active: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  priority: number;
}

export interface NewsPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  body: string;
  cover_image?: string | null;
  published_at?: string | null;
  is_published: boolean;
}

export interface GalleryItem {
  id: number;
  title: string;
  slug: string;
  type: 'image' | 'youtube';
  image_path?: string | null;
  youtube_url?: string | null;
  description?: string | null;
  is_featured: boolean;
  published_at?: string | null;
}

export interface DocumentFile {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  file_path: string;
  file_type: string;
  category?: string | null;
  is_public: boolean;
  published_at?: string | null;
}

export interface Leader {
  id: number;
  name: string;
  title: string;
  photo_path?: string | null;
  bio?: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface SiteBranding {
  site_name: string;
  organization_name: string;
  top_bar_primary: string;
  top_bar_secondary?: string | null;
  logo_path?: string | null;
  logo_alt?: string | null;
  settings_label: string;
  navigation_cta_label: string;
  navigation_cta_href: string;
}

export interface HomeHighlight {
  label: string;
  text: string;
}

export interface HomePillar {
  title: string;
  text: string;
}

export interface HomeZone {
  name: string;
  focus: string;
  base: string;
}

export interface HomeContent {
  hero_image?: string | null;
  hero_panel_label: string;
  why_eyebrow: string;
  why_title: string;
  why_text: string;
  mandate_label: string;
  mandate_title: string;
  mandate_text: string;
  highlights: HomeHighlight[];
  pillars: HomePillar[];
  footprint_eyebrow: string;
  footprint_title: string;
  footprint_text: string;
  zones: HomeZone[];
  news_eyebrow: string;
  news_title: string;
  news_text: string;
  leadership_eyebrow: string;
  leadership_title: string;
  leadership_text: string;
  media_eyebrow: string;
  media_title: string;
  media_text: string;
  documents_eyebrow: string;
  documents_title: string;
  documents_text: string;
  partnerships_eyebrow: string;
  partnerships_title: string;
  partnerships_text: string;
  partners: string[];
  secondary_cta_label: string;
}

export interface AboutContent {
  title: string;
  body: string;
  mission: string;
  vision: string;
  values: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  postal_address?: string | null;
  description: string;
}

export interface SiteFooter {
  strapline: string;
  description: string;
  chips: string[];
  prompt_text: string;
  credit_name?: string | null;
  credit_url?: string | null;
}

export interface SharedPageProps {
  [key: string]: unknown;
  appName?: string;
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
      is_admin: boolean;
    } | null;
  };
  flash?: {
    success?: string | null;
    error?: string | null;
  };
  siteBranding?: SiteBranding;
  siteFooter?: SiteFooter;
  siteContact?: ContactInfo;
}

export interface HomePageProps {
  announcements: Announcement[];
  news: NewsPost[];
  galleryItems: GalleryItem[];
  documents: DocumentFile[];
  leaders: Leader[];
  homeContent: HomeContent;
}
