/**
 * Services Schema
 * Defines the structure of services.json
 *
 * Services are displayed on the services index page and individual service pages.
 */

export interface Service {
  /**
   * URL-friendly slug (e.g., "ac-repair")
   * Used for routing: /services/[slug]
   */
  slug: string;

  /** Display name (e.g., "AC Repair") */
  name: string;

  /**
   * Short description for cards/previews
   * 1-2 sentences, ~100-150 characters
   */
  shortDescription: string;

  /**
   * Long description for service page
   * 2-4 paragraphs with full details
   */
  longDescription: string;

  /**
   * Key features/inclusions
   * 4-8 bullet points
   */
  features: string[];

  /**
   * Customer benefits
   * 3-5 benefit statements
   */
  benefits: string[];

  /**
   * Lucide icon name
   * Options: Wrench, AirVent, Flame, Wind, Settings, Home, AlertCircle, Snowflake, Sparkles, Zap, Droplet, Shield, etc.
   */
  icon: string;

  /**
   * Service category slug
   * Must match a category in categories array
   */
  category: string;

  /** Is this an emergency service (available 24/7)? */
  emergency: boolean;

  /**
   * SEO meta title
   * Format: "{Service} {City} | {Action/Benefit}"
   * Max 60 characters
   */
  metaTitle: string;

  /**
   * SEO meta description
   * Max 160 characters
   */
  metaDescription: string;
}

export interface ServiceCategory {
  /** URL-friendly slug */
  slug: string;

  /** Display name */
  name: string;

  /** Lucide icon name */
  icon: string;
}

export interface ServicesFile {
  /** Array of services */
  services: Service[];

  /** Service categories for filtering/grouping */
  categories: ServiceCategory[];
}

/**
 * Example services.json:
 *
 * {
 *   "services": [
 *     {
 *       "slug": "ac-repair",
 *       "name": "AC Repair",
 *       "shortDescription": "Fast, reliable air conditioning repair services to restore your comfort quickly.",
 *       "longDescription": "When your AC breaks down in the Phoenix heat, every minute counts...",
 *       "features": [
 *         "Same-day service available",
 *         "All major brands serviced",
 *         "Upfront, transparent pricing",
 *         "90-day repair warranty"
 *       ],
 *       "benefits": [
 *         "Restore comfort quickly",
 *         "Prevent costly breakdowns",
 *         "Extend system lifespan"
 *       ],
 *       "icon": "Wrench",
 *       "category": "cooling",
 *       "emergency": true,
 *       "metaTitle": "AC Repair Phoenix | Same-Day Air Conditioning Repair",
 *       "metaDescription": "Fast, reliable AC repair in Phoenix. Same-day service, all brands, upfront pricing."
 *     }
 *   ],
 *   "categories": [
 *     { "slug": "cooling", "name": "Cooling Services", "icon": "Snowflake" },
 *     { "slug": "heating", "name": "Heating Services", "icon": "Flame" }
 *   ]
 * }
 */

/**
 * Services by Vertical - Generation Guidelines:
 *
 * HVAC (6-8 services):
 * - AC Repair (emergency)
 * - AC Installation
 * - AC Maintenance
 * - Heating Repair (emergency)
 * - Heating Installation
 * - Duct Cleaning
 * - Indoor Air Quality
 * - Emergency HVAC (emergency)
 *
 * Plumbing (6-8 services):
 * - Drain Cleaning (emergency)
 * - Water Heater Repair (emergency)
 * - Water Heater Installation
 * - Leak Detection & Repair (emergency)
 * - Sewer Line Service
 * - Repiping
 * - Fixture Installation
 * - Emergency Plumbing (emergency)
 *
 * Electrical (6-8 services):
 * - Panel Upgrades
 * - Whole Home Rewiring
 * - Outlet & Switch Installation
 * - Lighting Installation
 * - Generator Installation
 * - EV Charger Installation
 * - Electrical Troubleshooting (emergency)
 * - Electrical Safety Inspection
 */
