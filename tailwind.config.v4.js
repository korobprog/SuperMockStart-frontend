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
  plugins: [require('tailwindcss-animate')],
};
