import type { Locale } from '@/types';

type CopyLocale = {
  nav: {
    home: string;
    about: string;
    leadership: string;
    news: string;
    gallery: string;
    documents: string;
    contact: string;
  };
  theme: string;
  language: string;
  hero: {
    eyebrow: string;
    title: string;
    text: string;
    primary: string;
    secondary: string;
  };
  sections: {
    leadership: string;
    leadershipText: string;
    news: string;
    newsText: string;
    gallery: string;
    galleryText: string;
    documents: string;
    documentsText: string;
  };
  viewAll: string;
  readMore: string;
  open: string;
  download: string;
  contactBlockTitle: string;
  contactBlockText: string;
  contactBlockButton: string;
  footerText: string;
};

export const copy: Record<Locale, CopyLocale> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About FEMATA',
      leadership: 'Leadership',
      news: 'News',
      gallery: 'Gallery',
      documents: 'Resources',
      contact: 'Contact',
    },
    theme: 'Theme',
    language: 'Language',
    hero: {
      eyebrow: 'Federation of Mining Associations of Tanzania',
      title: 'The official digital home for FEMATA and Tanzania\'s mining associations.',
      text:
        'Explore FEMATA\'s mandate, leadership, news, notices, media, and public resources through a modern institutional website built for trust and visibility.',
      primary: 'About FEMATA',
      secondary: 'Latest News',
    },
    sections: {
      leadership: 'Leadership & Management',
      leadershipText: 'Meet the board and executive team guiding FEMATA\'s national agenda.',
      news: 'Newsroom',
      newsText: 'Announcements, field updates, stakeholder engagements, and official releases.',
      gallery: 'Media & Gallery',
      galleryText: 'Highlights from meetings, outreach activities, forums, and national events.',
      documents: 'Resources & Documents',
      documentsText: 'Policies, forms, reports, and public reference materials in one place.',
    },
    viewAll: 'View all',
    readMore: 'Read more',
    open: 'View details',
    download: 'Download',
    contactBlockTitle: 'Connect with the FEMATA secretariat',
    contactBlockText:
      'For stakeholder engagement, partnerships, media inquiries, or membership coordination, reach out to the official FEMATA office.',
    contactBlockButton: 'Contact Secretariat',
    footerText:
      'FEMATA serves as a collective institutional voice for mining associations in Tanzania, advancing coordination, representation, and sector growth.',
  },
  sw: {
    nav: {
      home: 'Nyumbani',
      about: 'Kuhusu FEMATA',
      leadership: 'Uongozi',
      news: 'Habari',
      gallery: 'Matukio',
      documents: 'Rasilimali',
      contact: 'Wasiliana',
    },
    theme: 'Mandhari',
    language: 'Lugha',
    hero: {
      eyebrow: 'Shirikisho la Vyama vya Wachimbaji Tanzania',
      title: 'Tovuti rasmi ya FEMATA na vyama vya wachimbaji Tanzania.',
      text:
        'Tembelea mamlaka ya FEMATA, uongozi, habari, matangazo, matukio, na rasilimali muhimu kupitia tovuti rasmi ya taasisi.',
      primary: 'Kuhusu FEMATA',
      secondary: 'Habari Mpya',
    },
    sections: {
      leadership: 'Uongozi wa Juu',
      leadershipText: 'Fahamu bodi na viongozi wa utekelezaji wanaoongoza ajenda ya FEMATA.',
      news: 'Habari',
      newsText: 'Matangazo rasmi, taarifa za shughuli, na sasisho kwa wadau wa FEMATA.',
      gallery: 'Matukio na Media',
      galleryText: 'Picha na video kutoka mikutano, ziara, na shughuli za kitaasisi.',
      documents: 'Rasilimali na Nyaraka',
      documentsText: 'Sera, fomu, ripoti, na nyaraka za rejea kwa matumizi ya umma.',
    },
    viewAll: 'Tazama zote',
    readMore: 'Soma zaidi',
    open: 'Angalia',
    download: 'Pakua',
    contactBlockTitle: 'Wasiliana na sekretarieti ya FEMATA',
    contactBlockText:
      'Kwa ushirikiano, mawasiliano ya wadau, maswali ya wanachama, au taarifa za vyombo vya habari, wasiliana na ofisi ya FEMATA.',
    contactBlockButton: 'Wasiliana na Sekretarieti',
    footerText:
      'FEMATA ni sauti ya pamoja ya vyama vya wachimbaji Tanzania, ikikuza uratibu, uwakilishi, na maendeleo ya sekta.',
  },
};
