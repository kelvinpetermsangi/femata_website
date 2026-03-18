import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/types';

const LANGUAGE_STORAGE_KEY = 'femata-locale';

type LanguageContextValue = {
  locale: Locale;
  setLocale: (value: Locale) => void;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => undefined,
  toggleLocale: () => undefined,
});

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as Locale | null;
  if (saved && ['en', 'sw'].includes(saved)) {
    return saved;
  }

  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readInitialLocale);

  const toggleLocale = useCallback(() => {
    setLocale((current) => (current === 'en' ? 'sw' : 'en'));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
    }),
    [locale, toggleLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
