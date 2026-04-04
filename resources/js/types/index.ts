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
  updated_at?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
  is_breaking?: boolean;
  status?: string | null;
  status_id?: number | null;
  category?: string | null;
  category_id?: number | null;
  tag_ids?: number[];
  reading_time?: number;
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
  event_name?: string | null;
  event_date?: string | null;
  published_at?: string | null;
}

export interface GalleryGroup {
  slug: string;
  title: string;
  date?: string | null;
  note?: string | null;
  item_count: number;
  cover_item?: GalleryItem | null;
  items: GalleryItem[];
  href: string;
}

export interface DocumentItem {
  id: number;
  index_number?: string | null;
  title: string;
  slug: string;
  description?: string | null;
  file_path: string;
  thumbnail_path?: string | null;
  file_type?: string | null;
  category?: string | null;
  author?: string | null;
  publisher?: string | null;
  year?: number | null;
  is_public: boolean;
  is_featured?: boolean;
  published_at?: string | null;
  download_url?: string | null;
  read_url?: string | null;
  share_url?: string | null;
  status?: string | null;
  status_id?: number | null;
  category_id?: number | null;
  tag_ids?: number[];
  preview?: 'pdf' | 'image' | null;
  comments_count?: number;
  comments?: DocumentComment[];
}

export type DocumentFile = DocumentItem;

export interface DocumentComment {
  id: number;
  name: string;
  comment: string;
  created_at?: string | null;
}

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

export interface AssociationHighlight {
  title?: string | null;
  text?: string | null;
}

export interface AssociationLeaderProfile {
  name: string;
  group?: string | null;
  title?: string | null;
  bio?: string | null;
  photo_path?: string | null;
  email?: string | null;
  phone?: string | null;
  contact_qr_path?: string | null;
}

export interface AssociationGalleryItem {
  image_path: string;
  caption?: string | null;
  event_title?: string | null;
  event_date?: string | null;
}

export interface AssociationPageConfig {
  key: string;
  label: string;
  slug: string;
  visible: boolean;
  headline: string;
  intro: string;
  href?: string;
}

export interface AssociationSocialLink {
  platform: string;
  label: string;
  url: string;
  visible: boolean;
}

export interface AssociationType {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
  association_count?: number;
}

export interface ProgramHighlight {
  title?: string | null;
  text?: string | null;
}

export interface ProgramMetric {
  label?: string | null;
  value?: string | null;
  note?: string | null;
}

export interface ProgramTeamMember {
  name: string;
  title?: string | null;
  bio?: string | null;
  photo_path?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface ProgramYear {
  year?: number | null;
  edition_label?: string | null;
  region?: string | null;
  venue?: string | null;
  date_summary?: string | null;
  theme?: string | null;
  overview?: string | null;
  highlights?: string[];
  vendor_registration_url?: string | null;
  participant_registration_url?: string | null;
  sponsor_registration_url?: string | null;
  floor_plan_url?: string | null;
  brochure_url?: string | null;
  is_current?: boolean;
}

export interface ProgramPageConfig {
  key: string;
  label: string;
  slug: string;
  href?: string;
}

export interface Program {
  id: number;
  name: string;
  slug: string;
  tagline?: string | null;
  summary?: string | null;
  hero_image?: string | null;
  pages?: ProgramPageConfig[];
  current_page?: ProgramPageConfig;
  current_year?: ProgramYear | null;
  current_year_value?: number | null;
  home_title?: string | null;
  home_intro?: string | null;
  home_body?: string | null;
  about_title?: string | null;
  about_body?: string | null;
  team_intro?: string | null;
  years_intro?: string | null;
  current_year_intro?: string | null;
  highlights?: ProgramHighlight[];
  metrics?: ProgramMetric[];
  team?: ProgramTeamMember[];
  years?: ProgramYear[];
  team_count?: number;
  year_count?: number;
  is_active?: boolean;
}

export interface AdvertItem {
  id: number;
  title: string;
  slug: string;
  media_type: 'image' | 'video';
  asset_url: string;
  poster_url?: string | null;
  headline?: string | null;
  body?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  page_key: string;
  page_label?: string;
  slot_number: number;
  placement_scope: string;
  placement_label?: string;
  association_id?: number | null;
  association_type_id?: number | null;
  association_name?: string | null;
  association_type_name?: string | null;
  region?: string | null;
  display_order?: number;
  duration_seconds: number;
  is_active: boolean;
}

export type AdvertSlots = Record<string, AdvertItem[]>;

export interface Association {
  id: number;
  name: string;
  slug: string;
  association_type_id?: number | null;
  association_type?: AssociationType | null;
  region?: string | null;
  regions?: string[];
  district?: string | null;
  address?: string | null;
  postal_address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  rema_website_url?: string | null;
  logo_path?: string | null;
  hero_image?: string | null;
  description?: string | null;
  homepage_title?: string | null;
  homepage_intro?: string | null;
  mission?: string | null;
  vision?: string | null;
  gender_commitment?: string | null;
  esg_commitment?: string | null;
  about_title?: string | null;
  about_body?: string | null;
  focus_areas?: string[] | string | null;
  highlights?: AssociationHighlight[];
  leaders?: AssociationLeaderProfile[];
  gallery?: AssociationGalleryItem[];
  documents?: DocumentItem[];
  profile_pages?: AssociationPageConfig[];
  current_page?: AssociationPageConfig;
  social_links?: AssociationSocialLink[];
  chairperson_name?: string | null;
  secretary_name?: string | null;
  contact_title?: string | null;
  contact_body?: string | null;
  map_embed_url?: string | null;
  google_map_url?: string | null;
  apple_map_url?: string | null;
  document_ids?: number[];
  document_count?: number;
  leaders_count?: number;
  gallery_count?: number;
  visible_page_count?: number;
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
  booking_email?: string | null;
  booking_sender_name?: string | null;
  map_embed_url?: string | null;
  google_map_url?: string | null;
  apple_map_url?: string | null;
}

export interface MeetingLeaderOption {
  id: string;
  name: string;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  group?: string | null;
}

export interface MeetingRequestItem {
  id: number;
  scope_type: string;
  request_type: string;
  status: string;
  status_label?: string;
  requester_name: string;
  requester_email: string;
  requester_phone?: string | null;
  organization?: string | null;
  meeting_with_name?: string | null;
  meeting_with_title?: string | null;
  meeting_with_email?: string | null;
  meeting_with_group?: string | null;
  subject?: string | null;
  meeting_mode?: string | null;
  preferred_date?: string | null;
  preferred_slot?: string | null;
  alternate_date?: string | null;
  alternate_slot?: string | null;
  duration_minutes?: number | null;
  message?: string | null;
  agenda?: string | null;
  recipient_email?: string | null;
  proposed_date?: string | null;
  proposed_slot?: string | null;
  proposed_location?: string | null;
  proposed_map_url?: string | null;
  response_message?: string | null;
  association?: Pick<Association, 'id' | 'name' | 'slug'> | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdministratorUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  role?: string | null;
  roles?: string[];
  admin_sections?: string[];
  association_ids?: number[];
  managed_associations?: Pick<Association, 'id' | 'name' | 'slug'>[];
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
  appReleaseDate?: string;
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
      is_admin: boolean;
      roles?: string[];
      admin_sections?: string[];
      managed_associations?: Pick<Association, 'id' | 'name' | 'slug'>[];
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
  associations?: Association[];
  programs?: Program[];
  adverts?: AdvertSlots;
  homeContent: HomeContent;
}
