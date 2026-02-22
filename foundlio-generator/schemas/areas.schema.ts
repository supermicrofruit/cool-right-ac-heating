/**
 * Areas Schema
 * Defines the structure of areas.json
 *
 * Service areas generate local landing pages for SEO and local relevance.
 */

export interface ServiceArea {
  /**
   * URL-friendly slug (e.g., "phoenix", "scottsdale")
   * Used for routing: /areas/[slug]
   */
  slug: string;

  /** City/Area name */
  name: string;

  /** State abbreviation */
  state: string;

  /**
   * Area description
   * 2-4 sentences describing the area and service relevance
   * Should mention local characteristics
   */
  description: string;

  /**
   * Neighborhoods within this area
   * 6-10 neighborhood names
   */
  neighborhoods: string[];

  /**
   * Local landmarks
   * 3-5 recognizable landmarks
   */
  landmarks: string[];

  /**
   * Local challenges specific to this area
   * 2-3 sentences about area-specific service needs
   */
  localChallenges: string;

  /** GPS coordinates for map centering */
  coordinates: {
    lat: number;
    lng: number;
  };

  /** Population (formatted string, e.g., "1.6 million") */
  population: string;

  /**
   * Service highlights for this area
   * 2-4 bullet points
   */
  serviceHighlights: string[];
}

export interface AreasFile {
  /** Array of service areas */
  areas: ServiceArea[];

  /** Service radius description */
  serviceRadius: string;

  /** Primary service area name */
  primaryServiceArea: string;
}

/**
 * Example areas.json:
 *
 * {
 *   "areas": [
 *     {
 *       "slug": "phoenix",
 *       "name": "Phoenix",
 *       "state": "AZ",
 *       "description": "As Arizona's capital and largest city, Phoenix presents unique HVAC challenges with its extreme desert heat regularly exceeding 115F in summer.",
 *       "neighborhoods": [
 *         "Downtown Phoenix",
 *         "Arcadia",
 *         "Biltmore",
 *         "Paradise Valley Village",
 *         "Ahwatukee"
 *       ],
 *       "landmarks": [
 *         "Camelback Mountain",
 *         "Phoenix Sky Harbor Airport",
 *         "Desert Botanical Garden"
 *       ],
 *       "localChallenges": "Phoenix's extreme summer temperatures put tremendous strain on AC systems. Dust storms can clog filters and outdoor units.",
 *       "coordinates": { "lat": 33.4484, "lng": -112.0740 },
 *       "population": "1.6 million",
 *       "serviceHighlights": [
 *         "Same-day emergency service throughout Phoenix",
 *         "Experience with historic homes in central Phoenix",
 *         "Dust storm damage repair specialists"
 *       ]
 *     }
 *   ],
 *   "serviceRadius": "50 miles from Phoenix",
 *   "primaryServiceArea": "Phoenix Metro Area"
 * }
 */

/**
 * Area Generation Guidelines:
 *
 * 1. Always include the main city first
 * 2. Add 3-9 surrounding cities/suburbs
 * 3. Use real neighborhood names (Google Maps verification)
 * 4. Reference actual landmarks
 * 5. Research local challenges:
 *    - Climate (heat, humidity, cold, storms)
 *    - Housing stock (age, types)
 *    - Water quality (hard water, etc.)
 *    - Growth/development patterns
 *
 * Metro Area Examples:
 *
 * Phoenix Metro: Phoenix, Scottsdale, Mesa, Tempe, Chandler, Gilbert, Glendale, Peoria, Surprise, Goodyear
 * Dallas Metro: Dallas, Fort Worth, Plano, Arlington, Irving, Frisco, McKinney, Garland
 * Atlanta Metro: Atlanta, Marietta, Alpharetta, Roswell, Sandy Springs, Decatur, Kennesaw
 * Denver Metro: Denver, Aurora, Lakewood, Arvada, Westminster, Thornton, Centennial
 * Miami Metro: Miami, Fort Lauderdale, Hollywood, Pembroke Pines, Coral Springs, Hialeah
 */
