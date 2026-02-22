import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Safelist dynamic theme classes that are applied via JavaScript
  // These would otherwise be purged since they're not statically referenced in components
  safelist: [
    // Color themes (original)
    'theme-fresh-teal',
    'theme-ocean-blue',
    'theme-forest-green',
    'theme-sunset-orange',
    'theme-royal-purple',
    'theme-slate-professional',
    'theme-warm-terracotta',
    'theme-midnight-navy',
    // Color themes (react-templates)
    'theme-blue-classic',
    'theme-orange-classic',
    'theme-teal-classic',
    'theme-green-classic',
    'theme-red-classic',
    'theme-yellow-classic',
    'theme-amber-minimal',
    'theme-green-fall',
    // Font styles (using 'fonts-' prefix to avoid conflict with Tailwind's font-* utilities)
    'fonts-modern',
    'fonts-classic',
    'fonts-bold',
    'fonts-friendly',
    'fonts-geometric',
    'fonts-professional',
    'fonts-elegant',
    'fonts-tech',
    'fonts-readable',
    'fonts-minimal',
    // Premium / Luxury
    'fonts-editorial',
    'fonts-refined',
    'fonts-artisan',
    'fonts-magazine',
    'fonts-dignified',
    // Rugged / Industrial
    'fonts-utility',
    'fonts-impact',
    'fonts-industrial',
    'fonts-heritage',
    'fonts-precision',
    'fonts-billboard',
    // Trendy / Modern
    'fonts-expressive',
    'fonts-avant-garde',
    'fonts-dynamic',
    'fonts-polished',
    // Fontshare Self-Hosted
    'fonts-design-forward',
    'fonts-studio',
    // Border radius styles
    'radius-sharp',
    'radius-subtle',
    'radius-rounded',
    'radius-pill',
    // Page styles
    'page-style-standard',
    'page-style-compact',
    'page-style-spacious',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Theme colors using HSL CSS variables (shadcn/ui pattern)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          light: 'hsl(var(--primary-light))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        // Gradient colors (from CSS variables)
        'gradient-from': 'hsl(var(--gradient-from))',
        'gradient-to': 'hsl(var(--gradient-to))',
        'gradient-accent': 'hsl(var(--gradient-accent))',
        // Emergency/warning colors (static)
        emergency: {
          500: '#f97316',
          600: '#ea580c',
        },
      },
      fontSize: {
        'base': ['1.125rem', { lineHeight: '1.75' }],
        'lg': ['1.25rem', { lineHeight: '1.75' }],
        'xl': ['1.375rem', { lineHeight: '1.6' }],
        '2xl': ['1.75rem', { lineHeight: '1.4' }],
        '3xl': ['2.125rem', { lineHeight: '1.3' }],
        '4xl': ['2.625rem', { lineHeight: '1.2' }],
        '5xl': ['3.5rem', { lineHeight: '1.1' }],
        '6xl': ['4.25rem', { lineHeight: '1.05' }],
        '7xl': ['5.25rem', { lineHeight: '1' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
export default config
