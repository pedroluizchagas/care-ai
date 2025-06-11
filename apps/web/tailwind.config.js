/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'dark-surface': {
          100: '#1a1a1a',
          200: '#151515',
          300: '#0f0f0f',
          400: '#0a0a0a',
          500: '#050505',
          600: '#000000',
        },
        accent: {
          blue: '#3b82f6',
          'blue-light': '#60a5fa',
          purple: '#8b5cf6',
          'purple-light': '#a78bfa',
        },
        // Card backgrounds
        card: {
          primary: '#1a1a2e',
          secondary: '#16213e',
          accent: '#0f3460',
        },
        // Glass effect colors
        glass: {
          primary: 'rgba(30, 58, 138, 0.2)',
          secondary: 'rgba(59, 130, 246, 0.1)',
          dark: 'rgba(15, 23, 42, 0.8)',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        'gradient-dark':
          'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)',
        'gradient-card': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'gradient-accent': 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        card: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-primary': '0 0 20px rgba(30, 58, 138, 0.4)',
        'glow-blue-strong': '0 0 30px rgba(59, 130, 246, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'dark-lg': '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
        'dark-xl': '0 20px 60px 0 rgba(0, 0, 0, 0.9)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
