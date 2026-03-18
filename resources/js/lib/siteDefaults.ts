import type {
  AboutContent,
  ContactInfo,
  HomeContent,
  SiteBranding,
  SiteFooter,
} from '@/types';

export const defaultSiteBranding: SiteBranding = {
  site_name: 'FEMATA',
  organization_name: 'Federation of Mining Associations of Tanzania',
  top_bar_primary: 'Official Website of FEMATA',
  top_bar_secondary: 'Federation of Mining Associations of Tanzania',
  logo_path: null,
  logo_alt: 'FEMATA logo',
  settings_label: 'Settings',
  navigation_cta_label: 'Contact FEMATA',
  navigation_cta_href: '/contact',
};

export const defaultHomeContent: HomeContent = {
  hero_image:
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80',
  hero_panel_label: 'Institutional profile',
  why_eyebrow: 'Why FEMATA',
  why_title:
    'A national platform for representation, visibility, and sector coordination.',
  why_text:
    'FEMATA positions itself as a public-facing institution with a clear mandate, visible activities, and accessible information for members, partners, regulators, and communities.',
  mandate_label: 'Institutional mandate',
  mandate_title: 'Built for representation, productive growth, and public trust.',
  mandate_text:
    'The FEMATA website should do more than publish notices. It should explain who FEMATA is, what it stands for, where it works, and how it advances the interests of mining associations across Tanzania.',
  highlights: [
    {
      label: 'Visibility',
      text: 'A clearer public identity for the federation and its national mandate.',
    },
    {
      label: 'Authority',
      text: 'A stronger institutional presentation of leadership, zones, and official updates.',
    },
    {
      label: 'Access',
      text: 'Simple access to resources, announcements, and public information.',
    },
  ],
  pillars: [
    {
      title: 'Representation and advocacy',
      text: 'Championing mining associations in national dialogue and institutional decision-making.',
    },
    {
      title: 'Formalization and productivity',
      text: 'Supporting a more organized, safer, and commercially stronger mining ecosystem.',
    },
    {
      title: 'Partnership and market access',
      text: 'Creating stronger links between mining associations, regulators, investors, and service providers.',
    },
  ],
  footprint_eyebrow: 'National footprint',
  footprint_title: "Regional presence across Tanzania's mining landscapes.",
  footprint_text:
    'A stronger FEMATA website should communicate national reach and operational presence, not just office information.',
  zones: [
    {
      name: 'Lake Zone',
      focus: 'Gold production, formalization support, and association strengthening.',
      base: 'Geita, Mwanza, Shinyanga',
    },
    {
      name: 'Central Zone',
      focus: 'Institutional coordination, field outreach, and sector compliance.',
      base: 'Dodoma, Singida, Tabora',
    },
    {
      name: 'Northern Zone',
      focus: 'Member mobilization, equipment access, and stakeholder engagement.',
      base: 'Arusha, Kilimanjaro, Manyara',
    },
    {
      name: 'Southern Highlands',
      focus: 'Strategic minerals, productivity, and responsible growth.',
      base: 'Mbeya, Songwe, Rukwa',
    },
    {
      name: 'Coastal and Eastern Belt',
      focus: 'Public affairs, logistics, and national coordination.',
      base: 'Dar es Salaam, Coast, Morogoro',
    },
  ],
  news_eyebrow: 'Official updates',
  news_title: 'News, notices, and sector communication presented with clarity.',
  news_text:
    'The public newsroom should feel authoritative and current, balancing formal notices with broader institutional communication.',
  leadership_eyebrow: 'Leadership',
  leadership_title:
    'Leadership presented as credible, accessible, and institutionally grounded.',
  leadership_text:
    'The leadership section should foreground people, responsibility, and professional credibility with a more editorial presentation.',
  media_eyebrow: 'Field moments',
  media_title: 'Media that reflects actual work on the ground.',
  media_text:
    'Strong imagery helps the website feel like an active sector institution, not a static noticeboard.',
  documents_eyebrow: 'Public resources',
  documents_title: 'Documents arranged like a proper institutional resource centre.',
  documents_text:
    'Resources should feel easy to scan, easy to trust, and clearly separated by category and purpose.',
  partnerships_eyebrow: 'Institutional partnerships',
  partnerships_title:
    'FEMATA works through coordination, public engagement, and national stakeholder relationships.',
  partnerships_text:
    'The website should communicate a federation that collaborates with public institutions, sector bodies, and regional associations while remaining accessible to the wider public.',
  partners: [
    'Ministry of Minerals',
    'Mining Commission',
    'Regional Mining Associations',
    'Public and private sector partners',
  ],
  secondary_cta_label: 'Learn more',
};

export const defaultAboutContent: AboutContent = {
  title: 'Federation of Mining Associations of Tanzania (FEMATA)',
  body: 'FEMATA is the national umbrella body that brings together mining associations across Tanzania to strengthen representation, coordination, responsible practice, policy dialogue, institutional visibility, and sector development.',
  mission: 'To unite, represent, and strengthen mining associations across Tanzania.',
  vision:
    'A respected, coordinated, and sustainable mining sector that benefits communities and the nation.',
  values: 'Integrity, representation, professionalism, and partnership.',
};

export const defaultContactInfo: ContactInfo = {
  phone: '+255 22 222 3344',
  email: 'info@femata.or.tz',
  address: 'Undal Street, Upanga, Dar es Salaam, Tanzania',
  postal_address: 'P.O. Box 4958, Dar es Salaam',
  description:
    'For partnerships, media engagement, membership matters, or institutional collaboration, contact the FEMATA secretariat.',
};

export const defaultSiteFooter: SiteFooter = {
  strapline: "A united voice for Tanzania's mining associations",
  description:
    "FEMATA strengthens coordination, visibility, advocacy, and responsible growth across Tanzania's mining ecosystem by bringing regional and sector mining associations under one national platform.",
  chips: [
    'Mineral development',
    'Stakeholder representation',
    'Responsible mining',
    'Policy engagement',
  ],
  prompt_text:
    "Use the website to publish updates, highlight leadership, share resources, and strengthen FEMATA's institutional visibility.",
  credit_name: 'FEMATA Secretariat',
  credit_url: null,
};
