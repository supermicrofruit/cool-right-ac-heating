import {
  Inter,
  Playfair_Display,
  Source_Sans_3,
  Oswald,
  Roboto,
  Nunito,
  Open_Sans,
  Onest,
  DM_Sans,
  Montserrat,
  Lato,
  Cormorant_Garamond,
  Libre_Franklin,
  Space_Grotesk,
  IBM_Plex_Sans,
  Merriweather,
  Outfit,
  Plus_Jakarta_Sans,
  // New Google Fonts for 18 additional pairs
  Instrument_Serif,
  Instrument_Sans,
  DM_Serif_Display,
  Fraunces,
  Epilogue,
  Bodoni_Moda,
  Marcellus,
  Figtree,
  Barlow_Condensed,
  Barlow,
  Bebas_Neue,
  Big_Shoulders_Display,
  Lexend,
  Archivo_Black,
  Archivo,
  Saira_Condensed,
  Saira,
  Anton,
  Roboto_Slab,
  Bricolage_Grotesque,
  Public_Sans,
  Syne,
  Anybody,
  Hanken_Grotesk,
} from 'next/font/google'
import localFont from 'next/font/local'

// ===========================================
// ORIGINAL FONT DEFINITIONS (10 pairs)
// ===========================================

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const onest = Onest({
  subsets: ['latin'],
  variable: '--font-onest',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
  weight: ['300', '400', '700'],
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  variable: '--font-libre-franklin',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-ibm-plex',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
  weight: ['300', '400', '700'],
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

// ===========================================
// NEW GOOGLE FONT DEFINITIONS (16 pairs)
// ===========================================

// Premium/Luxury
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
  weight: ['400'],
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
  weight: ['400'],
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const epilogue = Epilogue({
  subsets: ['latin'],
  variable: '--font-epilogue',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const marcellus = Marcellus({
  subsets: ['latin'],
  variable: '--font-marcellus',
  display: 'swap',
  weight: ['400'],
})

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

// Rugged/Industrial
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const barlow = Barlow({
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
  weight: ['400'],
})

const bigShouldersDisplay = Big_Shoulders_Display({
  subsets: ['latin'],
  variable: '--font-big-shoulders',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  variable: '--font-archivo-black',
  display: 'swap',
  weight: ['400'],
})

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const sairaCondensed = Saira_Condensed({
  subsets: ['latin'],
  variable: '--font-saira-condensed',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const saira = Saira({
  subsets: ['latin'],
  variable: '--font-saira',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const anton = Anton({
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
  weight: ['400'],
})

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto-slab',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

// Trendy/Modern
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const geist = localFont({
  src: '../public/fonts/Geist-Variable.woff2',
  variable: '--font-geist',
  display: 'swap',
})

const anybody = Anybody({
  subsets: ['latin'],
  variable: '--font-anybody',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

// ===========================================
// FONTSHARE SELF-HOSTED FONTS (2 pairs)
// ===========================================

const clashDisplay = localFont({
  src: '../public/fonts/ClashDisplay-Variable.woff2',
  variable: '--font-clash-display',
  display: 'swap',
})

const satoshi = localFont({
  src: '../public/fonts/Satoshi-Variable.woff2',
  variable: '--font-satoshi',
  display: 'swap',
})

const cabinetGrotesk = localFont({
  src: '../public/fonts/CabinetGrotesk-Variable.woff2',
  variable: '--font-cabinet-grotesk',
  display: 'swap',
})

const generalSans = localFont({
  src: '../public/fonts/GeneralSans-Variable.woff2',
  variable: '--font-general-sans',
  display: 'swap',
})

// ===========================================
// FONT PAIRS CONFIGURATION
// ===========================================

export const fontPairs = {
  // --- Original 10 ---
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and versatile, perfect for tech-savvy businesses',
    heading: 'Inter',
    body: 'Inter',
    variables: [inter],
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Elegant serif headings with clean body text',
    heading: 'Playfair Display',
    body: 'Source Sans 3',
    variables: [playfairDisplay, sourceSans3],
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    description: 'Strong, impactful look for contractors and trades',
    heading: 'Oswald',
    body: 'Roboto',
    variables: [oswald, roboto],
  },
  friendly: {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm and approachable for family businesses',
    heading: 'Nunito',
    body: 'Open Sans',
    variables: [nunito, openSans],
  },
  geometric: {
    id: 'geometric',
    name: 'Geometric',
    description: 'Modern geometric style, Google-inspired feel',
    heading: 'Onest',
    body: 'DM Sans',
    variables: [onest, dmSans],
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate and trustworthy for established companies',
    heading: 'Montserrat',
    body: 'Lato',
    variables: [montserrat, lato],
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Refined and upscale for premium services',
    heading: 'Cormorant Garamond',
    body: 'Libre Franklin',
    variables: [cormorantGaramond, libreFranklin],
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    description: 'Technical and innovative for modern services',
    heading: 'Space Grotesk',
    body: 'IBM Plex Sans',
    variables: [spaceGrotesk, ibmPlexSans],
  },
  readable: {
    id: 'readable',
    name: 'Readable',
    description: 'Maximum readability with classic serif headings',
    heading: 'Merriweather',
    body: 'Source Sans 3',
    variables: [merriweather, sourceSans3],
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and minimal for a sleek, modern look',
    heading: 'Outfit',
    body: 'Plus Jakarta Sans',
    variables: [outfit, plusJakartaSans],
  },

  // --- Premium / Luxury (5 new) ---
  editorial: {
    id: 'editorial',
    name: 'Editorial',
    description: 'Modern editorial serif. Dramatic display headlines',
    heading: 'Instrument Serif',
    body: 'Instrument Sans',
    variables: [instrumentSerif, instrumentSans],
  },
  refined: {
    id: 'refined',
    name: 'Refined',
    description: 'Matched luxury pair by Colophon Foundry',
    heading: 'DM Serif Display',
    body: 'DM Sans',
    variables: [dmSerifDisplay, dmSans],
  },
  artisan: {
    id: 'artisan',
    name: 'Artisan',
    description: 'Sophisticated with character. 4-axis variable font',
    heading: 'Fraunces',
    body: 'Epilogue',
    variables: [fraunces, epilogue],
  },
  magazine: {
    id: 'magazine',
    name: 'Magazine',
    description: 'High-fashion drama. Extreme stroke contrast',
    heading: 'Bodoni Moda',
    body: 'Outfit',
    variables: [bodoniModa, outfit],
  },
  dignified: {
    id: 'dignified',
    name: 'Dignified',
    description: 'Roman inscriptions + modern geometric',
    heading: 'Marcellus',
    body: 'Figtree',
    variables: [marcellus, figtree],
  },

  // --- Rugged / Industrial (6 new) ---
  utility: {
    id: 'utility',
    name: 'Utility',
    description: 'Municipal signage aesthetic. Workhorseworthy',
    heading: 'Barlow Condensed',
    body: 'Barlow',
    variables: [barlowCondensed, barlow],
  },
  impact: {
    id: 'impact',
    name: 'Impact',
    description: 'Bold all-caps headlines. Yard sign energy',
    heading: 'Bebas Neue',
    body: 'Open Sans',
    variables: [bebasNeue, openSans],
  },
  industrial: {
    id: 'industrial',
    name: 'Industrial',
    description: 'Chicago Gothic + high-readability body',
    heading: 'Big Shoulders Display',
    body: 'Lexend',
    variables: [bigShouldersDisplay, lexend],
  },
  heritage: {
    id: 'heritage',
    name: 'Heritage',
    description: '19th-century American industrial strength',
    heading: 'Archivo Black',
    body: 'Archivo',
    variables: [archivoBlack, archivo],
  },
  precision: {
    id: 'precision',
    name: 'Precision',
    description: 'Motorsport engineering DNA. Technical trades',
    heading: 'Saira Condensed',
    body: 'Saira',
    variables: [sairaCondensed, saira],
  },
  billboard: {
    id: 'billboard',
    name: 'Billboard',
    description: 'Maximum impact headlines + sturdy slab body',
    heading: 'Anton',
    body: 'Roboto Slab',
    variables: [anton, robotoSlab],
  },

  // --- Trendy / Modern (5 new) ---
  expressive: {
    id: 'expressive',
    name: 'Expressive',
    description: 'Quirky organic heading + government-grade clarity',
    heading: 'Bricolage Grotesque',
    body: 'Public Sans',
    variables: [bricolageGrotesque, publicSans],
  },
  'avant-garde': {
    id: 'avant-garde',
    name: 'Avant-Garde',
    description: 'Art center heading + Vercel screen-optimized body',
    heading: 'Syne',
    body: 'Geist',
    variables: [syne, geist],
  },
  dynamic: {
    id: 'dynamic',
    name: 'Dynamic',
    description: 'Shape-shifting width axis headlines',
    heading: 'Anybody',
    body: 'Figtree',
    variables: [anybody, figtree],
  },
  polished: {
    id: 'polished',
    name: 'Polished',
    description: 'Refined grotesque. Inter with more personality',
    heading: 'Hanken Grotesk',
    body: 'DM Sans',
    variables: [hankenGrotesk, dmSans],
  },

  // --- Fontshare Self-Hosted (2 new) ---
  'design-forward': {
    id: 'design-forward',
    name: 'Design Forward',
    description: 'Fontshare power duo. Premium contractors',
    heading: 'Clash Display',
    body: 'Satoshi',
    variables: [clashDisplay, satoshi],
  },
  studio: {
    id: 'studio',
    name: 'Studio',
    description: 'Design agency standard. Opinionated + rational',
    heading: 'Cabinet Grotesk',
    body: 'General Sans',
    variables: [cabinetGrotesk, generalSans],
  },
} as const

export type FontPairId = keyof typeof fontPairs

// ===========================================
// EXPORTS
// ===========================================

// Generate all font variable classes for the HTML element
export const fontClasses = [
  // Original 18 fonts
  inter.variable,
  playfairDisplay.variable,
  sourceSans3.variable,
  oswald.variable,
  roboto.variable,
  nunito.variable,
  openSans.variable,
  onest.variable,
  dmSans.variable,
  montserrat.variable,
  lato.variable,
  cormorantGaramond.variable,
  libreFranklin.variable,
  spaceGrotesk.variable,
  ibmPlexSans.variable,
  merriweather.variable,
  outfit.variable,
  plusJakartaSans.variable,
  // New Google Fonts
  instrumentSerif.variable,
  instrumentSans.variable,
  dmSerifDisplay.variable,
  fraunces.variable,
  epilogue.variable,
  bodoniModa.variable,
  marcellus.variable,
  figtree.variable,
  barlowCondensed.variable,
  barlow.variable,
  bebasNeue.variable,
  bigShouldersDisplay.variable,
  lexend.variable,
  archivoBlack.variable,
  archivo.variable,
  sairaCondensed.variable,
  saira.variable,
  anton.variable,
  robotoSlab.variable,
  bricolageGrotesque.variable,
  publicSans.variable,
  syne.variable,
  geist.variable,
  anybody.variable,
  hankenGrotesk.variable,
  // Fontshare self-hosted
  clashDisplay.variable,
  satoshi.variable,
  cabinetGrotesk.variable,
  generalSans.variable,
].join(' ')

// Get font pair by ID
export function getFontPair(id: FontPairId) {
  return fontPairs[id] || fontPairs.geometric
}

// Get all font pair options for UI
export function getFontPairOptions() {
  return Object.values(fontPairs).map(pair => ({
    id: pair.id,
    name: pair.name,
    description: pair.description,
    preview: `${pair.heading} / ${pair.body}`,
  }))
}
