/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {
      colors: {
        // Navigation colors
        'nav-bg-dark': 'rgba(18, 18, 18, 0.95)',
        'nav-bg-light': 'rgba(255, 255, 255, 0.95)',
        'nav-text': 'rgba(255, 255, 255, 0.7)',
        'nav-text-hover': '#ffffff',
        'nav-dropdown-bg': 'rgba(0, 0, 0, 0.98)',
        'nav-dropdown-border': 'rgba(255, 255, 255, 0.1)',
        'nav-mobile-bg': 'rgba(0, 0, 0, 0.98)',
        
        // Solana brand colors
        'solana-purple': '#9945ff',
        'solana-green': '#19fb9b',
        'solana-yellow': '#fed612',
        'solana-orange': '#ff5722',
        'solana-pink': '#f087ff',
        
        // Component colors (from web app)
        'ch-background': 'var(--ch-16)',
        'ch-border': 'hsl(var(--fd-border))',
        'ch-selection': 'var(--ch-20)',
        'ch-tab-active-foreground': 'var(--ch-4)',
        'ch-tab-inactive-foreground': 'var(--ch-15)',
        'ch-line-number': 'var(--ch-24)',
        'ch-tabs-background': 'hsl(var(--fd-muted))',
        'ch-active-border': 'var(--ch-3)',
        'solution-bg': '#080d17',
      },
      borderRadius: {
        lg: 'var(--radius, 0.5rem)',
        md: 'calc(var(--radius, 0.5rem) - 2px)',
        sm: 'calc(var(--radius, 0.5rem) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'fade-out': 'fadeOut 0.2s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
};