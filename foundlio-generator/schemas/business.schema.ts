/**
 * Business Schema
 * Defines the structure of business.json
 *
 * This is the core configuration file containing all business information.
 */

export interface Address {
  /** Street address (e.g., "4821 N 24th Street") */
  street: string;
  /** City name */
  city: string;
  /** State abbreviation (e.g., "AZ") */
  state: string;
  /** ZIP code */
  zip: string;
  /** Full formatted address */
  full: string;
}

export interface Coordinates {
  /** Latitude */
  lat: number;
  /** Longitude */
  lng: number;
}

export interface HoursStructured {
  /** Days (e.g., "Monday - Friday") */
  days: string;
  /** Hours (e.g., "7:00 AM - 8:00 PM") */
  hours: string;
}

export interface Hours {
  /** Weekday hours display string */
  weekdays: string;
  /** Saturday hours */
  saturday: string;
  /** Sunday hours */
  sunday: string;
  /** Structured hours for schema.org */
  structured: HoursStructured[];
}

export interface SocialMedia {
  /** Facebook page URL */
  facebook?: string;
  /** Instagram profile URL */
  instagram?: string;
  /** Google Business Profile URL */
  google?: string;
  /** Twitter/X profile URL */
  twitter?: string;
  /** LinkedIn page URL */
  linkedin?: string;
  /** YouTube channel URL */
  youtube?: string;
}

export interface Theme {
  /** Theme preset ID (e.g., "bold-orange", "professional-blue") */
  preset: string;
  /** Path to logo image */
  logo: string;
  /** Path to favicon */
  favicon: string;
  /** Optional custom accent color override (hex) */
  accentColor?: string;
}

export interface Features {
  /** Show team section on about page */
  showTeam: boolean;
  /** Show blog section */
  showBlog: boolean;
  /** Show portfolio/works section */
  showWorks: boolean;
  /** Show financing information */
  showFinancing: boolean;
  /** Show emergency service badge */
  emergencyBadge: boolean;
  /** Show callback widget popup */
  callbackWidget: boolean;
  /** Show sticky phone button on mobile */
  stickyPhone: boolean;
}

export interface SEO {
  /** Title template (use %s for page title) */
  titleTemplate: string;
  /** Default meta description */
  defaultDescription: string;
}

export interface Forms {
  /** Email address for lead notifications */
  notifyEmail: string;
  /** Webhook URL for form submissions */
  webhookUrl: string;
  /** Success message after form submission */
  successMessage: string;
  /** Error message on form failure */
  errorMessage: string;
}

export interface Business {
  /** Business name (e.g., "Desert Aire Comfort") */
  name: string;

  /** Legal business name (e.g., "Desert Aire Comfort LLC") */
  legalName: string;

  /** Formatted phone number (e.g., "(602) 555-2665") */
  phone: string;

  /** Raw phone number for tel: links (e.g., "+16025552665") */
  phoneRaw: string;

  /** Primary email address */
  email: string;

  /** Website URL */
  website: string;

  /**
   * Business vertical/industry
   * Determines content templates and copy
   */
  vertical: "hvac" | "plumbing" | "electrical" | "roofing" | "landscaping";

  /** Region name (e.g., "Arizona", "South Florida") */
  region: string;

  /** Business address */
  address: Address;

  /** GPS coordinates for maps and local SEO */
  coordinates: Coordinates;

  /** Business hours */
  hours: Hours;

  /**
   * Professional licenses
   * Include state license numbers, certifications
   */
  licenses: string[];

  /**
   * Industry certifications
   * Include manufacturer authorizations, ratings
   */
  certifications: string[];

  /** Year business was established */
  established: number;

  /** Google rating (0-5, typically 4.5-5.0) */
  rating: number;

  /** Total review count across platforms */
  reviewCount: number;

  /** Brief business description (2-3 sentences) */
  description: string;

  /** Business tagline/slogan */
  tagline: string;

  /** Offers 24/7 emergency service */
  emergencyService: boolean;

  /** Offers financing options */
  financing: boolean;

  /** Offers free estimates */
  freeEstimates: boolean;

  /** Typical response time (e.g., "2 hours", "Same day") */
  responseTime: string;

  /** Warranty years on work */
  warrantyYears: number;

  /** Number of points in maintenance checklist */
  maintenancePointCount: number;

  /** Social media profiles */
  socialMedia: SocialMedia;

  /** Theme configuration */
  theme: Theme;

  /** Feature toggles */
  features: Features;

  /** SEO settings */
  seo: SEO;

  /** Form configuration */
  forms: Forms;
}

/**
 * Example business.json:
 *
 * {
 *   "name": "Desert Aire Comfort",
 *   "legalName": "Desert Aire Comfort LLC",
 *   "phone": "(602) 555-2665",
 *   "phoneRaw": "+16025552665",
 *   "email": "info@desertairecomfort.com",
 *   "website": "https://desertairecomfort.com",
 *   "vertical": "hvac",
 *   "region": "Arizona",
 *   "address": {
 *     "street": "4821 N 24th Street",
 *     "city": "Phoenix",
 *     "state": "AZ",
 *     "zip": "85016",
 *     "full": "4821 N 24th Street, Phoenix, AZ 85016"
 *   },
 *   "coordinates": { "lat": 33.4942, "lng": -112.0301 },
 *   "hours": {
 *     "weekdays": "7:00 AM - 8:00 PM",
 *     "saturday": "7:00 AM - 8:00 PM",
 *     "sunday": "Emergency Only",
 *     "structured": [
 *       { "days": "Monday - Friday", "hours": "7:00 AM - 8:00 PM" },
 *       { "days": "Saturday", "hours": "7:00 AM - 8:00 PM" },
 *       { "days": "Sunday", "hours": "Emergency Only" }
 *     ]
 *   },
 *   "licenses": ["ROC #298847", "EPA 608 Certified"],
 *   "certifications": ["Carrier Factory Authorized Dealer", "BBB A+ Rating"],
 *   "established": 2010,
 *   "rating": 4.9,
 *   "reviewCount": 847,
 *   "description": "Desert Aire Comfort has been providing reliable HVAC services...",
 *   "tagline": "Your Comfort, Our Priority",
 *   "emergencyService": true,
 *   "financing": true,
 *   "freeEstimates": true,
 *   "responseTime": "2 hours",
 *   "warrantyYears": 2,
 *   "maintenancePointCount": 21,
 *   "socialMedia": { ... },
 *   "theme": { "preset": "bold-orange", "logo": "/images/logo.png", "favicon": "/favicon.ico" },
 *   "features": { ... },
 *   "seo": { ... },
 *   "forms": { ... }
 * }
 */
