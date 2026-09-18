import { useEffect, useState } from 'react';
import { Theme } from '../types';

const THEME_STORAGE_KEY = 'taskflow_theme';
const THEME_CHANGE_EVENT = 'taskflow-theme-change';

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
  return document.documentElement.classList.contains('dark') ? 'dark' : getSystemTheme();
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  document.documentElement.dataset.theme = theme;
}

/** Управляет темой приложения и синхронизирует её с корневым HTML-элементом. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // В sandbox-просмотре тема может приходить от внешнего контейнера через
  // событие из index.html. В обычном браузере этот обработчик не используется.
  useEffect(() => {
    const handleExternalThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<Theme>).detail;
      if (nextTheme === 'light' || nextTheme === 'dark') setTheme(nextTheme);
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleExternalThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleExternalThemeChange);
  }, []);

  return { theme, setTheme };
}
