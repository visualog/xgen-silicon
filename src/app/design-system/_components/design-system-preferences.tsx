"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type DesignSystemLocale = "ko" | "en";
export type DesignSystemTheme = "light" | "dark";

export type LocalizedText = {
  ko: string;
  en: string;
};

type PreferencesContextValue = {
  locale: DesignSystemLocale;
  setLocale: (locale: DesignSystemLocale) => void;
  theme: DesignSystemTheme;
  setTheme: (theme: DesignSystemTheme) => void;
  showGrid: boolean;
  setShowGrid: (showGrid: boolean) => void;
  text: (copy: LocalizedText) => string;
};

const STORAGE_KEY = "xgen.design-system.preferences";

const DesignSystemPreferencesContext = createContext<PreferencesContextValue | null>(null);

function readStoredPreferences(): Partial<Pick<PreferencesContextValue, "locale" | "theme" | "showGrid">> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { locale?: string; theme?: string; showGrid?: unknown };

    return {
      locale: parsed.locale === "en" || parsed.locale === "ko" ? parsed.locale : undefined,
      theme: parsed.theme === "dark" || parsed.theme === "light" ? parsed.theme : undefined,
      showGrid: typeof parsed.showGrid === "boolean" ? parsed.showGrid : undefined,
    };
  } catch {
    return {};
  }
}

function applyTheme(theme: DesignSystemTheme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function DesignSystemPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<DesignSystemLocale>("ko");
  const [theme, setThemeState] = useState<DesignSystemTheme>("light");
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const stored = readStoredPreferences();
    queueMicrotask(() => {
      if (stored.locale) setLocaleState(stored.locale);
      if (typeof stored.showGrid === "boolean") setShowGrid(stored.showGrid);
      if (stored.theme) setThemeState(stored.theme);
      applyTheme(stored.theme ?? "light");
    });
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ locale, theme, showGrid }));
    } catch {
      // Preference persistence is best effort; the visible toggles still work for the session.
    }
  }, [locale, theme, showGrid]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      theme,
      setTheme: (nextTheme) => {
        setThemeState(nextTheme);
        applyTheme(nextTheme);
      },
      showGrid,
      setShowGrid,
      text: (copy) => copy[locale],
    }),
    [locale, theme, showGrid],
  );

  return (
    <DesignSystemPreferencesContext.Provider value={value}>
      {children}
    </DesignSystemPreferencesContext.Provider>
  );
}

export function useDesignSystemPreferences() {
  const context = useContext(DesignSystemPreferencesContext);
  if (!context) {
    throw new Error("useDesignSystemPreferences must be used within DesignSystemPreferencesProvider");
  }

  return context;
}
