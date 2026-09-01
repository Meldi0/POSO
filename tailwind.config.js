/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ocean: {
          deep: '#0D5C75',      // Sidebar, Primary Header
          darker: '#083342',    // Sidebar widget container, deep insets
          cyan: '#199FB1',      // Primary interactive, SLA badge, active tab
          cyanHover: '#148797', // Hover state for primary buttons
          ice: '#A5D1E1',       // Border highlights, secondary chips
          soft: '#EAF4F8',      // Pill badges, soft card backgrounds
          textMuted: '#6B8C99', // Subtitle & metadata text
        },
        canvas: {
          cream: '#F4F7F9',     // Main outer workspace background
          surface: '#FFFFFF',   // Pure white floating card surfaces
          subtle: '#EEF3F6',    // Input fields, table row alternating tint
        },
        coral: {
          urgent: '#F58A61',    // Floating Action Button, Urgent tags
          urgentHover: '#E77448',
          soft: '#FDEEE9',      // Urgent chip background
        },
        status: {
          open: '#3B82F6',      // Open (Blue)
          progress: '#F59E0B',  // In Progress (Amber)
          waiting: '#8B5CF6',   // Waiting (Purple)
          closed: '#10B981',    // Closed (Emerald)
        },
        // Backwards compatibility tokens
        background: {
          deep: '#07090e',
          DEFAULT: '#0b0e14',
          surface: '#11151e',
          elevated: '#171c28',
          card: 'rgba(255, 255, 255, 0.04)',
          'card-hover': 'rgba(255, 255, 255, 0.07)',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.07)',
          DEFAULT: 'rgba(255, 255, 255, 0.12)',
          glow: 'rgba(25, 159, 177, 0.3)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'app-shell': '0 25px 60px -15px rgba(13, 92, 117, 0.12), 0 0 0 1px rgba(13, 92, 117, 0.05)',
        'ticket-card': '0 4px 20px -2px rgba(13, 92, 117, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'ticket-hover': '0 12px 30px -4px rgba(13, 92, 117, 0.14), 0 4px 10px -2px rgba(25, 159, 177, 0.08)',
        'card-sage': '0 8px 24px -4px rgba(13, 92, 117, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 16px 32px -6px rgba(13, 92, 117, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'drawer-slide': '-10px 0 40px rgba(8, 51, 66, 0.18)',
        'fab-glow': '0 10px 25px -3px rgba(245, 138, 97, 0.45)',
        'coral-fab': '0 10px 25px -3px rgba(245, 138, 97, 0.45)',
        'paper-wave-1': '0 10px 30px rgba(13, 92, 117, 0.08)',
        'paper-wave-2': '0 20px 45px rgba(25, 159, 177, 0.12)',
      },
      borderRadius: {
        'app-shell': '32px',
        'card-smooth': '20px',
        'pill-chip': '9999px',
        'spatial': '18px',
        'spatial-lg': '22px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'wave-drift': 'waveDrift 14s ease-in-out infinite alternate',
        'drawer-in': 'drawerIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fab-pulse': 'fabPulse 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        waveDrift: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '100%': { transform: 'translateY(-12px) rotate(0.5deg)' },
        },
        drawerIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        fabPulse: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 10px 25px -3px rgba(245, 138, 97, 0.45)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 15px 35px -3px rgba(245, 138, 97, 0.65)' },
        }
      }
    },
  },
  plugins: [],
}
