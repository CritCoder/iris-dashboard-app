import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      spacing: {
        '84': '21rem', // 336px - 50% more than w-56 (224px)
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        // Base radius system - all based on --radius variable
        none: '0px',
        xs: 'calc(var(--radius) / 4)',     // 2px
        sm: 'calc(var(--radius) / 2)',     // 4px  
        DEFAULT: 'var(--radius)',          // 8px (base)
        md: 'calc(var(--radius) + 2px)',   // 10px
        lg: 'calc(var(--radius) + 4px)',   // 12px
        xl: 'calc(var(--radius) + 6px)',   // 14px
        '2xl': 'calc(var(--radius) + 8px)', // 16px
        '3xl': 'calc(var(--radius) + 12px)', // 20px
        full: '9999px',                    // Fully rounded
        
        // Legacy support (deprecated - use new system)
        'legacy-sm': 'calc(var(--radius) - 4px)',
        'legacy-md': 'calc(var(--radius) - 2px)',
        'legacy-lg': 'var(--radius)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;