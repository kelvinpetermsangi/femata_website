import type { Locale } from '@/types';

type CopyLocale = {
  nav: {
    home: string;
    about: string;
    leadership: string;
    remas: string;
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
    remas: string;
    remasText: string;
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
      remas: 'REMAs',
      news: 'News & Updates',
      gallery: 'Media Gallery',
      documents: 'Documents',
      contact: 'Contact',
    },
    theme: 'Theme',
    language: 'Language',
    hero: {
      eyebrow: 'Federation of Miners’ Associations of Tanzania',
      title: 'The official digital platform for FEMATA and Tanzania’s mining associations.',
      text:
        'Discover FEMATA’s mandate, leadership, strategic initiatives, official notices, sector updates, public resources, and the REMAs directory through a modern institutional platform built for visibility, credibility, and sector coordination.',
      primary: 'About FEMATA',
      secondary: 'Explore REMAs',
    },
    sections: {
      leadership: 'Leadership & Governance',
      leadershipText:
        'Meet the leaders, board members, and executive team guiding FEMATA’s institutional direction and national mining agenda.',
      remas: 'REMAs Directory',
      remasText:
        'Access regional miners’ associations, member profiles, and links to their respective websites through a centralized national directory.',
      news: 'News & Sector Updates',
      newsText:
        'Follow official announcements, stakeholder engagements, field updates, events, and public communications from FEMATA.',
      gallery: 'Media & Institutional Gallery',
      galleryText:
        'Browse highlights from meetings, mining forums, outreach programs, exhibitions, and national sector engagements.',
      documents: 'Documents & Public Resources',
      documentsText:
        'Access reports, publications, forms, policy references, official statements, and downloadable materials in one place.',
    },
    viewAll: 'View all',
    readMore: 'Read more',
    open: 'View details',
    download: 'Download',
    contactBlockTitle: 'Connect with the FEMATA Secretariat',
    contactBlockText:
      'For partnerships, stakeholder engagement, membership coordination, sector inquiries, or official communication, contact the FEMATA secretariat.',
    contactBlockButton: 'Contact Secretariat',
    footerText:
      'FEMATA serves as the collective institutional voice for miners’ associations in Tanzania, strengthening representation, coordination, advocacy, and responsible sector development.',
  },
  sw: {
    nav: {
      home: 'Nyumbani',
      about: 'Kuhusu FEMATA',
      leadership: 'Uongozi',
      remas: 'REMAs',
      news: 'Habari na Taarifa',
      gallery: 'Matukio na Picha',
      documents: 'Nyaraka',
      contact: 'Wasiliana',
    },
    theme: 'Mandhari',
    language: 'Lugha',
    hero: {
      eyebrow: 'Shirikisho la Vyama vya Wachimbaji Tanzania',
      title: 'Jukwaa rasmi la kidijitali la FEMATA na vyama vya wachimbaji Tanzania.',
      text:
        'Tembelea mamlaka ya FEMATA, uongozi, mipango ya kimkakati, matangazo rasmi, taarifa za sekta, rasilimali za umma, na orodha ya REMAs kupitia jukwaa la kisasa la kitaasisi lililojengwa kwa uwazi, hadhi, na uratibu wa sekta.',
      primary: 'Kuhusu FEMATA',
      secondary: 'Angalia REMAs',
    },
    sections: {
      leadership: 'Uongozi na Utawala',
      leadershipText:
        'Fahamu viongozi, wajumbe wa bodi, na timu ya utendaji inayoongoza mwelekeo wa FEMATA na ajenda ya sekta ya madini kitaifa.',
      remas: 'Orodha ya REMAs',
      remasText:
        'Pata vyama vya wachimbaji vya kikanda, taarifa za wanachama, na viungo vya tovuti zao kupitia orodha ya kitaifa iliyounganishwa.',
      news: 'Habari na Taarifa za Sekta',
      newsText:
        'Fuatilia matangazo rasmi, ushirikiano wa wadau, taarifa za shughuli, matukio, na mawasiliano ya umma kutoka FEMATA.',
      gallery: 'Matukio na Galeria ya Taasisi',
      galleryText:
        'Tazama picha na kumbukumbu za mikutano, majukwaa ya madini, programu za uhamasishaji, maonesho, na shughuli za kitaifa za sekta.',
      documents: 'Nyaraka na Rasilimali za Umma',
      documentsText:
        'Pata ripoti, machapisho, fomu, marejeo ya sera, taarifa rasmi, na nyenzo za kupakua katika eneo moja.',
    },
    viewAll: 'Tazama zote',
    readMore: 'Soma zaidi',
    open: 'Angalia maelezo',
    download: 'Pakua',
    contactBlockTitle: 'Wasiliana na Sekretarieti ya FEMATA',
    contactBlockText:
      'Kwa ushirikiano, uratibu wa wanachama, mawasiliano ya wadau, maswali ya sekta, au taarifa rasmi, wasiliana na sekretarieti ya FEMATA.',
    contactBlockButton: 'Wasiliana na Sekretarieti',
    footerText:
      'FEMATA ni sauti ya pamoja ya vyama vya wachimbaji Tanzania, ikiimarisha uwakilishi, uratibu, utetezi, na maendeleo yenye uwajibikaji katika sekta ya madini.',
  },
};
