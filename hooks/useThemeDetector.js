import { useEffect, useState } from 'react';

export const useThemeDetector = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const darkMode = () => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('theme') === 'dark';
    }
    return false;
  };

  const isKbarDarkThemeChanged = () => {
    const html = typeof window !== 'undefined' && window.document.documentElement;
    return html ? html.classList.contains('dark') : false;
  };

  return { mounted, darkMode, isKbarDarkThemeChanged };
};