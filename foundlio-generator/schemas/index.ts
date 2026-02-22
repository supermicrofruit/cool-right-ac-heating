/**
 * Foundlio Generator Schemas
 *
 * Complete TypeScript type definitions for all JSON configuration files.
 * These schemas define the exact structure AI must generate.
 *
 * Usage:
 * ```typescript
 * import { Business, Service, ServiceArea } from './schemas'
 * ```
 */

// Re-export all schemas
export * from "./business.schema";
export * from "./services.schema";
export * from "./areas.schema";
export * from "./testimonials.schema";
export * from "./faqs.schema";
export * from "./posts.schema";
export type { ThemeColors, ThemeFile } from "./theme.schema";

/**
 * Complete Site Configuration
 * All files that make up a generated website
 */
export interface GeneratedSite {
  /** Core business information */
  business: import("./business.schema").Business;

  /** Services offered */
  services: import("./services.schema").ServicesFile;

  /** Service areas */
  areas: import("./areas.schema").AreasFile;

  /** Customer testimonials */
  testimonials: import("./testimonials.schema").TestimonialsFile;

  /** Frequently asked questions */
  faqs: import("./faqs.schema").FAQsFile;

  /** Blog posts */
  posts: import("./posts.schema").PostsFile;

  /** Custom theme (optional) */
  theme?: import("./theme.schema").ThemeFile;
}

/**
 * Minimal Input for Generation
 * The minimum information needed to generate a site
 */
export interface MinimalInput {
  /** Business name (required) */
  name: string;

  /** Phone number (required) */
  phone: string;

  /** Email address (required) */
  email: string;

  /** City (required) */
  city: string;

  /** State abbreviation (required) */
  state: string;

  /** Business vertical (required) */
  vertical: "hvac" | "plumbing" | "electrical" | "roofing" | "landscaping";

  // Optional overrides
  established?: number;
  address?: string;
  tagline?: string;
  style?: "minimal" | "bold" | "classic" | "modern";
  accentColor?: string;
  licenses?: string[];
}

/**
 * Output File Map
 * Maps each schema to its output filename
 */
export const OUTPUT_FILES = {
  business: "business.json",
  services: "services.json",
  areas: "areas.json",
  testimonials: "testimonials.json",
  faqs: "faqs.json",
  posts: "posts.json",
  theme: "themes.json",
} as const;

/**
 * Template Variables
 * Variables available for use in content ({{variable}})
 */
export const TEMPLATE_VARIABLES = [
  "businessName",
  "phone",
  "phoneRaw",
  "email",
  "city",
  "state",
  "region",
  "address",
  "fullAddress",
  "rating",
  "reviewCount",
  "yearsInBusiness",
  "establishedYear",
  "responseTime",
  "warrantyYears",
  "licenseNumber",
  "maintenancePointCount",
  "callbackTime",
  "year",
  "vertical",
] as const;

/**
 * Supported Verticals
 */
export const VERTICALS = [
  "hvac",
  "plumbing",
  "electrical",
  "roofing",
  "landscaping",
] as const;

export type Vertical = (typeof VERTICALS)[number];

/**
 * Style Options
 */
export const STYLES = ["minimal", "bold", "classic", "modern"] as const;

export type Style = (typeof STYLES)[number];
