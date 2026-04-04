import type {
  AboutContent,
  ContactInfo,
  HomeContent,
  SiteBranding,
  SiteFooter,
} from '@/types';

export const defaultSiteBranding: SiteBranding = {
  site_name: 'FEMATA',
  organization_name: "Federation of Miners' Associations of Tanzania",
  top_bar_primary: "Official platform of Tanzania's national federation for miners' associations",
  top_bar_secondary: 'National voice for artisanal and small-scale mining associations',
  logo_path: '/brand/femata-logo.png',
  logo_alt: 'FEMATA official logo',
  settings_label: 'Settings',
  navigation_cta_label: 'Contact FEMATA Secretariat',
  navigation_cta_href: '/contact',
};

export const defaultHomeContent: HomeContent = {
  hero_image:
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80',
  hero_panel_label: 'National sector snapshot',
  why_eyebrow: 'Why FEMATA',
  why_title:
    "Organizing Tanzania's mining associations into a stronger national voice.",
  why_text:
    "FEMATA helps connect Tanzania's artisanal and small-scale mining communities to stronger representation, formalization, productivity, visibility, and long-term sector growth.",
  mandate_label: 'Institutional mandate',
  mandate_title: 'Built for coordination, productivity, and public trust.',
  mandate_text:
    "FEMATA links local miner groups, member associations, regional structures, and national coordination so the sector can grow with better organization, stronger productivity, and wider opportunity.",
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
    "From gold belts and gemstone corridors to graphite and strategic-mineral regions, FEMATA connects mining communities across Tanzania through structured association networks.",
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
    "Follow official notices, policy engagement, field activity, partnership updates, and public statements from FEMATA and its member network.",
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
  documents_title: 'Guides, circulars, briefs, and public resources for the mining community.',
  documents_text:
    'Browse official reports, governance tools, member forms, public statements, and reference materials published by FEMATA.',
  partnerships_eyebrow: 'Institutional partnerships',
  partnerships_title:
    'FEMATA works through coordination, public engagement, and national stakeholder relationships.',
  partnerships_text:
    "FEMATA works with regulators, financiers, service providers, researchers, and development partners to strengthen organized growth across Tanzania's mining ecosystem.",
  partners: [
    'Ministry of Minerals',
    'Mining Commission',
    'Regional Mining Associations',
    'Public and private sector partners',
  ],
  secondary_cta_label: 'Learn more',
};

export const defaultAboutContent: AboutContent = {
  title: "Federation of Miners' Associations of Tanzania (FEMATA)",
  body: "FEMATA is the national federation for Tanzania's artisanal and small-scale mining community, linking local groups, member associations, regional structures, and national coordination into one practical platform for representation and sector development.",
  mission: 'To unite, represent, and strengthen mining associations across Tanzania.',
  vision:
    'A respected, coordinated, and sustainable mining sector that benefits communities and the nation.',
  values: 'Integrity, representation, professionalism, and partnership.',
};

export const defaultContactInfo: ContactInfo = {
  phone: '+255 754 110 205',
  email: 'secretariat@femata.or.tz',
  address: 'Undal Street, Upanga, Dar es Salaam, Tanzania',
  postal_address: 'P.O. Box 4958, Dar es Salaam',
  description:
    'For partnerships, media engagement, membership matters, or institutional collaboration, contact the FEMATA secretariat.',
  booking_email: 'meetings@femata.or.tz',
  booking_sender_name: 'FEMATA Secretariat',
  map_embed_url:
    'https://www.google.com/maps?q=Upanga%20Dar%20es%20Salaam&output=embed',
  google_map_url:
    'https://maps.google.com/?q=Upanga%20Dar%20es%20Salaam',
  apple_map_url:
    'http://maps.apple.com/?q=Upanga%20Dar%20es%20Salaam',
};

export const defaultSiteFooter: SiteFooter = {
  strapline: "Organizing Tanzania's miners' associations for stronger visibility and growth",
  description:
    "FEMATA is the national federation connecting miners' associations, regional structures, and sector stakeholders through one public platform for representation, coordination, and responsible growth.",
  chips: [
    'Mineral development',
    'Stakeholder representation',
    'Responsible mining',
    'Policy engagement',
  ],
  prompt_text:
    'Use the FEMATA website to follow official notices, explore association profiles, access public resources, and connect with the secretariat.',
  credit_name: 'FEMATA Secretariat',
  credit_url: null,
};
