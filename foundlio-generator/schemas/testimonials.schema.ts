/**
 * Testimonials Schema
 * Defines the structure of testimonials.json
 *
 * Testimonials are displayed on homepage, service pages, and testimonials section.
 */

export interface Testimonial {
  /** Unique identifier */
  id: number;

  /**
   * Customer name
   * Format: "First L." (e.g., "Sarah M.", "Michael R.")
   */
  name: string;

  /**
   * Location
   * Format: "City, ST" (e.g., "Phoenix, AZ")
   */
  location: string;

  /**
   * Star rating (1-5)
   * Typically 5 for displayed testimonials
   */
  rating: number;

  /**
   * Review text
   * 2-4 sentences, specific to their experience
   * Should mention the service received
   */
  text: string;

  /**
   * Service received
   * Should match a service name from services.json
   */
  service: string;

  /**
   * Review date
   * Format: "YYYY-MM-DD"
   */
  date: string;

  /** Is this a verified review? */
  verified: boolean;
}

export interface ReviewPlatform {
  /** Platform name (Google, Yelp, BBB, etc.) */
  name: string;

  /** Rating on this platform */
  rating: number;

  /** Number of reviews on this platform */
  reviews: number;
}

export interface ReviewSummary {
  /** Average rating across all platforms */
  averageRating: number;

  /** Total review count */
  totalReviews: number;

  /** Percentage of 5-star reviews */
  fiveStarPercentage: number;

  /** Breakdown by platform */
  platforms: ReviewPlatform[];
}

export interface TestimonialsFile {
  /** Array of testimonials */
  testimonials: Testimonial[];

  /** Review summary statistics */
  summary: ReviewSummary;
}

/**
 * Example testimonials.json:
 *
 * {
 *   "testimonials": [
 *     {
 *       "id": 1,
 *       "name": "Sarah M.",
 *       "location": "Phoenix, AZ",
 *       "rating": 5,
 *       "text": "Our AC went out on a Friday evening during a 110-degree weekend. Desert Aire had a technician at our house within two hours and fixed it the same night. Incredible service!",
 *       "service": "AC Repair",
 *       "date": "2024-06-15",
 *       "verified": true
 *     }
 *   ],
 *   "summary": {
 *     "averageRating": 4.9,
 *     "totalReviews": 847,
 *     "fiveStarPercentage": 94,
 *     "platforms": [
 *       { "name": "Google", "rating": 4.9, "reviews": 523 },
 *       { "name": "Yelp", "rating": 4.8, "reviews": 187 }
 *     ]
 *   }
 * }
 */

/**
 * Testimonial Generation Guidelines:
 *
 * 1. Generate 5-8 testimonials
 * 2. Vary the services mentioned across testimonials
 * 3. Include different cities from the service area
 * 4. Make each review specific:
 *    - Mention the problem they had
 *    - Mention the solution/outcome
 *    - Include emotional response (relief, gratitude)
 * 5. Vary review length (some short, some detailed)
 * 6. Spread dates across recent months
 *
 * Review Archetypes:
 *
 * - Emergency rescue: "AC died at worst time, they saved us"
 * - Installation satisfaction: "New system is amazing"
 * - Maintenance appreciation: "Been using them for years"
 * - Price transparency: "Fair pricing, no surprises"
 * - Professionalism: "Clean, courteous, explained everything"
 * - Problem solving: "Found issue others missed"
 * - Speed: "Same-day service, quick repair"
 *
 * Name Generation:
 * Use common first names with last initial:
 * - Sarah M., Michael R., Jennifer L., David K.
 * - Patricia H., Robert T., Maria G., James W.
 * - Lisa C., John P., Amanda S., Chris B.
 */
