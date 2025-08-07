/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--color-border))',
        input: 'hsl(var(--color-input))',
        ring: 'hsl(var(--color-ring))',
        background: 'hsl(var(--color-background))',
        foreground: 'hsl(var(--color-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          foreground: 'hsl(var(--color-primary-foreground))',
          glow: 'hsl(var(--color-primary-glow))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary))',
          foreground: 'hsl(var(--color-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--color-destructive))',
          foreground: 'hsl(var(--color-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--color-muted))',
          foreground: 'hsl(var(--color-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--color-accent))',
          foreground: 'hsl(var(--color-accent-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--color-success))',
          foreground: 'hsl(var(--color-success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--color-warning))',
          foreground: 'hsl(var(--color-warning-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--color-popover))',
          foreground: 'hsl(var(--color-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--color-card))',
          foreground: 'hsl(var(--color-card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--color-sidebar-background))',
          foreground: 'hsl(var(--color-sidebar-foreground))',
          primary: 'hsl(var(--color-sidebar-primary))',
          'primary-foreground': 'hsl(var(--color-sidebar-primary-foreground))',
          accent: 'hsl(var(--color-sidebar-accent))',
          'accent-foreground': 'hsl(var(--color-sidebar-accent-foreground))',
          border: 'hsl(var(--color-sidebar-border))',
          ring: 'hsl(var(--color-sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-dark': 'var(--gradient-dark)',
      },
      boxShadow: {
        elegant: 'var(--shadow-elegant)',
        glow: 'var(--shadow-glow)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: 'var(--shadow-elegant)' },
          '50%': { boxShadow: 'var(--shadow-glow)' },
        },
        'theme-switch': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'theme-switch': 'theme-switch 0.6s ease-in-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Плагин для кастомных классов границ
    function ({ addUtilities }) {
      const modernBorders = {
        '.border-modern': {
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          position: 'relative',
        },
        '.border-modern::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        },
        '.border-modern-elevated': {
          border: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow:
            '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
          position: 'relative',
        },
        '.border-modern-elevated::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.02)',
        },
        '.border-modern-colored': {
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow:
            '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(59, 130, 246, 0.1)',
          position: 'relative',
        },
        '.border-modern-colored::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          border: '1px solid rgba(59, 130, 246, 0.08)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          boxShadow: '0 1px 1px rgba(59, 130, 246, 0.05)',
        },
        '.border-modern-gradient': {
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow:
            '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(147, 51, 234, 0.1)',
          position: 'relative',
        },
        '.border-modern-gradient::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          border: '1px solid rgba(147, 51, 234, 0.08)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          boxShadow: '0 1px 1px rgba(147, 51, 234, 0.05)',
        },
        // Темная тема
        '.dark .border-modern': {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        },
        '.dark .border-modern::after': {
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.dark .border-modern-elevated': {
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow:
            '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        },
        '.dark .border-modern-elevated::after': {
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.15)',
        },
        '.dark .border-modern-colored': {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow:
            '0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(59, 130, 246, 0.2)',
        },
        '.dark .border-modern-colored::after': {
          border: '1px solid rgba(59, 130, 246, 0.15)',
          boxShadow: '0 1px 1px rgba(59, 130, 246, 0.1)',
        },
        '.dark .border-modern-gradient': {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow:
            '0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(147, 51, 234, 0.2)',
        },
        '.dark .border-modern-gradient::after': {
          border: '1px solid rgba(147, 51, 234, 0.15)',
          boxShadow: '0 1px 1px rgba(147, 51, 234, 0.1)',
        },
        // Анимации при наведении
        '.border-modern:hover, .border-modern-elevated:hover, .border-modern-colored:hover, .border-modern-gradient:hover':
          {
            transform: 'translateY(-1px)',
            boxShadow:
              '0 2px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)',
          },
        '.dark .border-modern:hover, .dark .border-modern-elevated:hover, .dark .border-modern-colored:hover, .dark .border-modern-gradient:hover':
          {
            boxShadow:
              '0 2px 6px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)',
          },
        // Утилитарные классы для карточек и инпутов
        '.card-modern': {
          '@apply border-modern rounded-lg bg-background': {},
        },
        '.card-modern-elevated': {
          '@apply border-modern-elevated rounded-lg bg-background': {},
        },
        '.card-modern-colored': {
          '@apply border-modern-colored rounded-lg bg-background': {},
        },
        '.card-modern-gradient': {
          '@apply border-modern-gradient rounded-lg bg-background': {},
        },
        '.btn-modern': {
          '@apply border-modern rounded-md bg-background text-foreground': {},
        },
        '.btn-modern-elevated': {
          '@apply border-modern-elevated rounded-md bg-background text-foreground':
            {},
        },
        '.btn-modern-colored': {
          '@apply border-modern-colored rounded-md bg-background text-foreground':
            {},
        },
        '.btn-modern-gradient': {
          '@apply border-modern-gradient rounded-md bg-background text-foreground':
            {},
        },
        '.input-modern': {
          '@apply border-modern rounded-md bg-background text-foreground': {},
        },
        '.input-modern-elevated': {
          '@apply border-modern-elevated rounded-md bg-background text-foreground':
            {},
        },
        '.input-modern-colored': {
          '@apply border-modern-colored rounded-md bg-background text-foreground':
            {},
        },
        '.input-modern-gradient': {
          '@apply border-modern-gradient rounded-md bg-background text-foreground':
            {},
        },
      };
      addUtilities(modernBorders);
    },
  ],
};
