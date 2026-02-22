/**
 * FAQs Schema
 * Defines the structure of faqs.json
 *
 * FAQs are displayed on dedicated FAQ page and relevant service pages.
 */

export interface FAQ {
  /** The question */
  question: string;

  /**
   * The answer
   * Can include light formatting
   * Keep answers helpful and specific (2-4 sentences)
   */
  answer: string;
}

export interface FAQCategory {
  /** Category display name */
  name: string;

  /** URL-friendly slug */
  slug: string;

  /** FAQs in this category */
  faqs: FAQ[];
}

export interface FAQsFile {
  /** FAQ categories with their questions */
  categories: FAQCategory[];
}

/**
 * Example faqs.json:
 *
 * {
 *   "categories": [
 *     {
 *       "name": "General",
 *       "slug": "general",
 *       "faqs": [
 *         {
 *           "question": "What areas do you serve?",
 *           "answer": "We serve the entire Phoenix metro area including Phoenix, Scottsdale, Mesa, Tempe, Chandler, Gilbert, Glendale, Peoria, Surprise, and Goodyear."
 *         },
 *         {
 *           "question": "Are you licensed and insured?",
 *           "answer": "Yes, we are fully licensed (ROC #298847), bonded, and insured. All our technicians are NATE-certified."
 *         }
 *       ]
 *     },
 *     {
 *       "name": "AC Repair",
 *       "slug": "ac-repair",
 *       "faqs": [
 *         {
 *           "question": "How quickly can you come for an AC repair?",
 *           "answer": "We offer same-day service for most AC repairs. For emergencies, we typically arrive within 2-4 hours."
 *         }
 *       ]
 *     }
 *   ]
 * }
 */

/**
 * FAQ Categories by Vertical:
 *
 * HVAC:
 * - General (4-5 FAQs)
 * - AC Repair (3-4 FAQs)
 * - AC Installation (3-4 FAQs)
 * - Maintenance (3-4 FAQs)
 * - Emergency Service (2-3 FAQs)
 *
 * Plumbing:
 * - General (4-5 FAQs)
 * - Drain Cleaning (3-4 FAQs)
 * - Water Heaters (3-4 FAQs)
 * - Emergency Service (2-3 FAQs)
 * - Pricing (2-3 FAQs)
 *
 * Electrical:
 * - General (4-5 FAQs)
 * - Panel Upgrades (3-4 FAQs)
 * - Safety (3-4 FAQs)
 * - EV Chargers (2-3 FAQs)
 * - Emergency Service (2-3 FAQs)
 *
 * Common FAQ Topics (all verticals):
 *
 * General:
 * - What areas do you serve?
 * - Are you licensed and insured?
 * - Do you offer financing?
 * - Do you provide free estimates?
 * - What payment methods do you accept?
 *
 * Service-Specific:
 * - How quickly can you come?
 * - How much does [service] cost?
 * - Should I repair or replace?
 * - What brands do you work with?
 * - What warranty do you offer?
 *
 * Emergency:
 * - What qualifies as an emergency?
 * - Do you charge extra for nights/weekends?
 * - What should I do while waiting?
 */
