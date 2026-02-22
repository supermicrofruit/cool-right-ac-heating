/**
 * Posts Schema
 * Defines the structure of posts.json
 *
 * Blog posts for SEO and content marketing.
 */

export interface BlogPost {
  /**
   * URL-friendly slug
   * Used for routing: /blog/[slug]
   */
  slug: string;

  /** Post title */
  title: string;

  /**
   * Excerpt/summary
   * 1-2 sentences for previews
   */
  excerpt: string;

  /**
   * Full post content
   * Markdown supported
   * Include headers (##), lists, bold text
   * Typical length: 500-1500 words
   */
  content: string;

  /**
   * Author ID
   * Typically "{company-slug}-team" (e.g., "desert-aire-team")
   */
  authorId: string;

  /**
   * Publication date
   * Format: "YYYY-MM-DD"
   */
  date: string;

  /**
   * Category
   * Options by vertical defined below
   */
  category: string;

  /** Featured image path */
  image: string;

  /**
   * Estimated read time
   * Format: "X min read"
   */
  readTime: string;

  /**
   * SEO meta title
   * Max 60 characters
   */
  metaTitle: string;

  /**
   * SEO meta description
   * Max 160 characters
   */
  metaDescription: string;
}

export interface PostsFile {
  /** Array of blog posts */
  posts: BlogPost[];

  /** Available categories */
  categories: string[];
}

/**
 * Example posts.json:
 *
 * {
 *   "posts": [
 *     {
 *       "slug": "when-to-repair-vs-replace-ac-unit",
 *       "title": "When to Repair vs. Replace Your AC Unit",
 *       "excerpt": "Learn the key factors to consider when deciding whether to repair your aging air conditioner or invest in a new system.",
 *       "content": "Making the decision between repairing and replacing your AC unit...\n\n## The 50% Rule\n\nA good rule of thumb...",
 *       "authorId": "desert-aire-team",
 *       "date": "2024-06-15",
 *       "category": "Maintenance Tips",
 *       "image": "/images/blog/ac-repair-replace.jpg",
 *       "readTime": "5 min read",
 *       "metaTitle": "When to Repair vs. Replace Your AC Unit | Phoenix HVAC Guide",
 *       "metaDescription": "Learn when it makes sense to repair your AC versus replacing it. Expert guidance from Phoenix HVAC professionals."
 *     }
 *   ],
 *   "categories": [
 *     "Maintenance Tips",
 *     "AC Repair",
 *     "Energy Efficiency",
 *     "Indoor Air Quality"
 *   ]
 * }
 */

/**
 * Blog Categories by Vertical:
 *
 * HVAC:
 * - Maintenance Tips
 * - AC Repair
 * - Energy Efficiency
 * - Indoor Air Quality
 * - Heating
 * - Industry News
 *
 * Plumbing:
 * - Maintenance Tips
 * - Drain Care
 * - Water Heaters
 * - Water Quality
 * - Emergency Prep
 * - DIY Tips
 *
 * Electrical:
 * - Safety Tips
 * - Energy Efficiency
 * - Home Upgrades
 * - EV & Smart Home
 * - Code Compliance
 * - DIY vs Professional
 *
 * Blog Post Ideas by Vertical:
 *
 * HVAC:
 * - "When to Repair vs Replace Your AC"
 * - "5 Signs Your AC Needs Attention"
 * - "Preparing Your HVAC for Summer/Winter"
 * - "Smart Thermostat Benefits"
 * - "Indoor Air Quality Guide"
 * - "Choosing the Right AC Size"
 *
 * Plumbing:
 * - "Signs You Need Drain Cleaning"
 * - "Water Heater Maintenance Guide"
 * - "How to Prevent Frozen Pipes"
 * - "When to Call a Plumber vs DIY"
 * - "Hard Water Solutions"
 * - "Slab Leak Warning Signs"
 *
 * Electrical:
 * - "Signs You Need a Panel Upgrade"
 * - "EV Charger Installation Guide"
 * - "Electrical Safety Tips for Homeowners"
 * - "When to Hire an Electrician"
 * - "Generator Buying Guide"
 * - "Smart Home Wiring Basics"
 */
