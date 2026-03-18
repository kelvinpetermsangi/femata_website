import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ThemeMode } from '@/types';

const THEME_STORAGE_KEY = 'femata-theme';
const SUPPORTED_THEMES: ThemeMode[] = ['light', 'dark', 'gray'];

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (value: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isValidTheme(value: unknown): value is ThemeMode {
  return typeof value === 'string' && SUPPORTED_THEMES.includes(value as ThemeMode);
}

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isValidTheme(saved)) {
      return saved;
    }
  } catch {
    return 'light';
  }

  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(readInitialTheme);

  const setTheme = useCallback((value: ThemeMode) => {
    if (isValidTheme(value)) {
      setThemeState(value);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'gray';
      return 'light';
    });
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        // Ignore storage write errors
      }
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      if (isValidTheme(event.newValue)) {
        setThemeState(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}