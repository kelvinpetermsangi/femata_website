import { useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

export function useSitePreferences() {
  const { locale, setLocale, toggleLocale } = useLanguage();
  const { theme, setTheme } = useTheme();

  const preferences = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      theme,
      setTheme,
      isDarkMode: theme === 'dark',
      isLightMode: theme === 'light',
      isGrayMode: theme === 'gray',
      isSwahili: locale === 'sw',
      isEnglish: locale === 'en',
      localeLabel: locale === 'sw' ? 'Swahili' : 'English',
      themeLabel:
        theme === 'dark' ? 'Dark' : theme === 'gray' ? 'Gray' : 'Light',
    }),
    [locale, setLocale, toggleLocale, theme, setTheme],
  );

  return preferences;
}