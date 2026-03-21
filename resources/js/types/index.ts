export type Locale = 'en' | 'sw';
export type ThemeMode = 'light' | 'dark' | 'gray';

export interface ContentStatus {
  id: number;
  name: string;
  slug: string;
  is_public?: boolean;
}

export interface AdminSection {
  id: number;
  name: string;
  slug: string;
}

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
  content?: string;
  cover_image?: string | null;
  featured_image?: string | null;
  published_at?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
  status?: string | null;
  status_id?: number | null;
  category?: string | null;
  category_id?: number | null;
  tag_ids?: number[];
}

export interface VideoPost {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  youtube_url: string;
  youtube_video_id: string;
  thumbnail?: string | null;
  duration?: string | null;
  category?: string | null;
  category_id?: number | null;
  status?: string | null;
  status_id?: number | null;
  published_at?: string | null;
  is_featured?: boolean;
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

export interface DocumentItem {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  file_path: string;
  file_type?: string | null;
  category?: string | null;
  is_public: boolean;
  is_featured?: boolean;
  published_at?: string | null;
  download_url?: string | null;
  status?: string | null;
  status_id?: number | null;
  category_id?: number | null;
  tag_ids?: number[];
}

export type DocumentFile = DocumentItem;

export interface Leader {
  id: number;
  name: string;
  title: string;
  designation?: string;
  administration_level?: string | null;
  department?: string | null;
  photo_path?: string | null;
  contact_qr_path?: string | null;
  image_path?: string | null;
  bio?: string | null;
  sort_order?: number;
  rank_order?: number;
  email?: string | null;
  phone?: string | null;
  is_active: boolean;
}

export interface PageRecord {
  id: number;
  title: string;
  slug: string;
  content: string;
  featured_image?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  status_id?: number;
  status?: string | null;
  published_at?: string | null;
}

export interface PressBriefing {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  featured_image?: string | null;
  briefing_date?: string | null;
  location?: string | null;
  status_id?: number;
  status?: string | null;
  published_at?: string | null;
}

export interface Association {
  id: number;
  name: string;
  slug: string;
  region?: string | null;
  district?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  logo_path?: string | null;
  description?: string | null;
  chairperson_name?: string | null;
  secretary_name?: string | null;
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
  featured_image?: string | null;
  gallery?: string[];
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
  appVersion?: string;
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
      is_admin: boolean;
      roles?: string[];
      admin_sections?: string[];
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
  documents: DocumentItem[];
  leaders: Leader[];
  homeContent: HomeContent;
}
