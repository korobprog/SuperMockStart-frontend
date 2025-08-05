import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark');

    // Apply the appropriate theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      console.log('Applied system theme:', systemTheme);
    } else {
      root.classList.add(theme);
      console.log('Applied theme:', theme);
    }

    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Force a repaint and update CSS custom properties
    requestAnimationFrame(() => {
      // Trigger a reflow to ensure CSS variables are updated
      root.style.display = 'none';
      root.offsetHeight; // Trigger reflow
      root.style.display = '';

      // Force update of CSS custom properties
      const computedStyle = getComputedStyle(root);
      root.style.setProperty('--force-update', Date.now().toString());
    });
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      root.classList.add(newTheme);
      console.log('System theme changed to:', newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const getCurrentTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme;
  };

  const isDark = () => {
    return getCurrentTheme() === 'dark';
  };

  const isLight = () => {
    return getCurrentTheme() === 'light';
  };

  const isSystem = () => {
    return theme === 'system';
  };

  return {
    theme,
    setTheme,
    getCurrentTheme,
    isDark,
    isLight,
    isSystem,
    mounted,
  };
}
