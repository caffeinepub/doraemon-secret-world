import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))'
        },
        chart: {
          1: 'oklch(var(--chart-1))',
          2: 'oklch(var(--chart-2))',
          3: 'oklch(var(--chart-3))',
          4: 'oklch(var(--chart-4))',
          5: 'oklch(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar))',
          foreground: 'oklch(var(--sidebar-foreground))',
          primary: 'oklch(var(--sidebar-primary))',
          'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
          accent: 'oklch(var(--sidebar-accent))',
          'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))'
        },
        // Doraemon palette (dora.* aliases)
        dora: {
          blue: 'oklch(0.55 0.22 240)',
          'blue-light': 'oklch(0.72 0.18 230)',
          'blue-dark': 'oklch(0.35 0.20 245)',
          red: 'oklch(0.58 0.22 25)',
          yellow: 'oklch(0.88 0.18 85)',
          white: 'oklch(0.98 0.01 240)',
          navy: 'oklch(0.18 0.12 250)',
          cyan: 'oklch(0.75 0.15 210)',
          pink: 'oklch(0.72 0.18 355)',
        },
        // Doraemon palette (doraemon-* names used throughout components)
        doraemon: {
          blue: 'oklch(0.55 0.22 240)',
          'blue-light': 'oklch(0.72 0.18 230)',
          'blue-dark': 'oklch(0.25 0.15 248)',
          red: 'oklch(0.58 0.22 25)',
          yellow: 'oklch(0.88 0.18 85)',
          white: 'oklch(0.98 0.01 240)',
          navy: 'oklch(0.10 0.10 252)',
          sky: 'oklch(0.65 0.20 215)',
          cyan: 'oklch(0.82 0.20 205)',
          pink: 'oklch(0.72 0.18 355)',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
        'glow-blue': '0 0 25px rgba(0,160,255,0.65), 0 0 60px rgba(0,130,255,0.35)',
        'glow-red': '0 0 25px oklch(0.58 0.22 25 / 0.65), 0 0 60px oklch(0.58 0.22 25 / 0.30)',
        'glow-yellow': '0 0 25px oklch(0.88 0.18 85 / 0.65), 0 0 60px oklch(0.88 0.18 85 / 0.30)',
        'glow-cyan': '0 0 25px rgba(0,220,255,0.65), 0 0 60px rgba(0,200,255,0.35)',
        'glass': '0 8px 32px rgba(0,0,0,0.50)',
        'card-hover': '0 20px 60px rgba(0,160,255,0.40)',
        'neon-card': '0 0 40px 8px rgba(0,150,255,0.35), inset 0 0 20px rgba(0,120,255,0.05)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px oklch(0.55 0.22 240 / 0.4)' },
          '50%': { boxShadow: '0 0 30px oklch(0.55 0.22 240 / 0.8)' }
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' }
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float-slow 5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      }
    }
  },
  plugins: [typography, containerQueries, animate]
};
