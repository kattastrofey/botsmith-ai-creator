import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // AI-inspired color palette
        ai: {
          purple: "hsl(var(--ai-purple))",
          blue: "hsl(var(--ai-blue))",
          cyan: "hsl(var(--ai-cyan))",
          pink: "hsl(var(--ai-pink))",
          green: "hsl(var(--ai-green))",
          amber: "hsl(var(--ai-amber))",
        },
        // Neon variants for highlights
        neon: {
          purple: "hsl(var(--neon-purple))",
          blue: "hsl(var(--neon-blue))",
          cyan: "hsl(var(--neon-cyan))",
          pink: "hsl(var(--neon-pink))",
        },
        // Glassmorphism colors
        glass: {
          bg: "hsla(var(--glass-bg))",
          border: "hsla(var(--glass-border))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // AI-inspired animations
        "neural-pulse": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
            opacity: "0.6",
          },
          "25%": {
            transform: "translate(-10px, -10px) scale(1.05)",
            opacity: "0.8",
          },
          "50%": {
            transform: "translate(10px, 5px) scale(0.95)",
            opacity: "0.4",
          },
          "75%": {
            transform: "translate(-5px, 10px) scale(1.02)",
            opacity: "0.7",
          },
        },
        "ai-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            boxShadow: "0 0 20px hsla(var(--primary), 0.5)",
          },
          "50%": {
            opacity: "0.7",
            transform: "scale(1.05)",
            boxShadow: "0 0 40px hsla(var(--primary), 0.8)",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsla(var(--primary), 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px hsla(var(--primary), 0.6)",
          },
        },
        "slide-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px) scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neural-pulse": "neural-pulse 20s ease-in-out infinite",
        "ai-pulse": "ai-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
        "slide-in": "slide-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "neural-pattern": 
          "radial-gradient(circle at 25% 25%, hsla(263, 85%, 70%, 0.3) 0%, transparent 2%), " +
          "radial-gradient(circle at 75% 75%, hsla(217, 91%, 60%, 0.3) 0%, transparent 2%), " +
          "radial-gradient(circle at 50% 50%, hsla(189, 94%, 62%, 0.2) 0%, transparent 1.5%)",
      },
      boxShadow: {
        "glow-sm": "0 0 10px hsla(var(--primary), 0.5)",
        "glow": "0 0 20px hsla(var(--primary), 0.5)",
        "glow-lg": "0 0 40px hsla(var(--primary), 0.5)",
        "glow-xl": "0 0 60px hsla(var(--primary), 0.5)",
        "neon-purple": "0 0 20px hsla(var(--ai-purple), 0.5), 0 0 40px hsla(var(--ai-purple), 0.3)",
        "neon-blue": "0 0 20px hsla(var(--ai-blue), 0.5), 0 0 40px hsla(var(--ai-blue), 0.3)",
        "neon-cyan": "0 0 20px hsla(var(--ai-cyan), 0.5), 0 0 40px hsla(var(--ai-cyan), 0.3)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Custom plugin for glassmorphism utilities
    function({ addUtilities }: any) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        },
        '.glass-sidebar': {
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        },
        '.neural-bg': {
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundImage: 
              'radial-gradient(circle at 25% 25%, hsla(263, 85%, 70%, 0.3) 0%, transparent 2%), ' +
              'radial-gradient(circle at 75% 75%, hsla(217, 91%, 60%, 0.3) 0%, transparent 2%), ' +
              'radial-gradient(circle at 50% 50%, hsla(189, 94%, 62%, 0.2) 0%, transparent 1.5%)',
            backgroundSize: '100px 100px, 150px 150px, 80px 80px',
            animation: 'neural-pulse 20s ease-in-out infinite',
            opacity: '0.6',
            pointerEvents: 'none',
          },
        },
        '.gradient-text-purple': {
          background: 'linear-gradient(135deg, hsl(var(--ai-purple)) 0%, hsl(var(--ai-pink)) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.gradient-text-blue': {
          background: 'linear-gradient(135deg, hsl(var(--ai-blue)) 0%, hsl(var(--ai-cyan)) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
