/**
 * Content JSON Schema
 * Controls all page copy and section text across the website
 */

export interface HeroContent {
  headline: string;           // Main headline (e.g., "Reliable Plumbing.")
  headlineAccent: string;     // Accent text after headline (e.g., "Mesa Strong.")
  description: string;        // Hero description paragraph
  imageAlt: string;           // Alt text for hero image
}

export interface TrustSectionContent {
  title: string;              // e.g., "Why Choose Valley Plumbing Pros?"
  subtitle: string;           // e.g., "Trusted by thousands of Mesa homeowners..."
  factoryAuthorized: string;  // e.g., "All Major Brands"
  factoryDescription: string; // e.g., "Kohler, Moen, Delta"
}

export interface MediaBarContent {
  tagline: string;            // e.g., "Trusted By Mesa Homeowners"
}

export interface ServicesSectionContent {
  title: string;              // e.g., "Our Plumbing Services"
  subtitle: string;           // e.g., "Comprehensive plumbing solutions for every need"
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ProcessSectionContent {
  title: string;              // e.g., "How We Work"
  subtitle: string;           // e.g., "Simple, transparent process from start to finish"
  steps: ProcessStep[];       // Array of 4 steps
}

export interface WorksSectionContent {
  badgeText: string;          // e.g., "Our Work"
  title: string;              // e.g., "Recent Projects"
  subtitle: string;           // e.g., "See the quality craftsmanship we deliver..."
}

export interface TestimonialsSectionContent {
  title: string;              // e.g., "What Our Customers Say"
  subtitle: string;           // e.g., "Trusted by thousands of Mesa homeowners"
}

export interface CtaBannerContent {
  title: string;              // e.g., "Need Plumbing Service?"
  description: string;        // e.g., "Contact us today for fast, reliable service..."
}

export interface PageContent {
  heroTitle?: string;
  heroSubtitle?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  [key: string]: string | string[] | undefined;
}

export interface ServicesPageContent extends PageContent {
  heroTitle: string;          // "Our Plumbing Services"
  heroSubtitle: string;
  ctaTitle: string;
  ctaDescription: string;
}

export interface AboutPageContent extends PageContent {
  heroTitle: string;          // "Your Trusted Plumbing Partner Since 2015"
  heroSubtitle: string;
  storyTitle: string;         // "Our Story"
  storyParagraphs: string[];  // 3 paragraphs about the company
}

export interface ContactPageContent extends PageContent {
  heroTitle: string;          // "Get in Touch"
  heroSubtitle: string;
  formTitle: string;
  formSubtitle: string;
  emergencyTitle: string;
  emergencyText: string;
}

export interface AreasPageContent extends PageContent {
  heroTitle: string;          // "Serving the Mesa Area"
  heroSubtitle: string;
  serviceRadiusText: string;
  ctaTitle: string;
  ctaDescription: string;
}

export interface BlogPageContent extends PageContent {
  heroTitle: string;          // "Plumbing Tips & Insights"
  heroSubtitle: string;
  ctaTitle: string;
  ctaDescription: string;
}

export interface WorksPageContent extends PageContent {
  heroTitle: string;          // "Our Work Speaks for Itself"
  heroSubtitle: string;
  ctaTitle: string;
  ctaDescription: string;
}

export interface FinancingPageContent extends PageContent {
  heroTitle: string;          // "Affordable Plumbing Financing"
  heroSubtitle: string;
  whyFinanceTitle: string;
  ctaTitle: string;
  ctaDescription: string;
}

export interface EmergencyTipsPageContent extends PageContent {
  heroTitle: string;          // "Plumbing Emergency? Here's What to Do"
  heroSubtitle: string;
  commonTitle: string;
  preventionTitle: string;
  preventionSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;
}

export interface PagesContent {
  services: ServicesPageContent;
  about: AboutPageContent;
  contact: ContactPageContent;
  areas: AreasPageContent;
  blog: BlogPageContent;
  works: WorksPageContent;
  financing: FinancingPageContent;
  emergencyTips: EmergencyTipsPageContent;
}

export interface ContentConfig {
  hero: HeroContent;
  trustSection: TrustSectionContent;
  mediaBar: MediaBarContent;
  servicesSection: ServicesSectionContent;
  processSection: ProcessSectionContent;
  worksSection: WorksSectionContent;
  testimonialsSection: TestimonialsSectionContent;
  ctaBanner: CtaBannerContent;
  pages: PagesContent;
}

/**
 * Example content.json:
 *
 * {
 *   "hero": {
 *     "headline": "Reliable Plumbing.",
 *     "headlineAccent": "Mesa Strong.",
 *     "description": "From leaky faucets to full installations...",
 *     "imageAlt": "Professional plumber servicing home plumbing"
 *   },
 *   "trustSection": {
 *     "title": "Why Choose Valley Plumbing Pros?",
 *     "subtitle": "Trusted by thousands of Mesa homeowners for reliable plumbing service",
 *     "factoryAuthorized": "All Major Brands",
 *     "factoryDescription": "Kohler, Moen, Delta"
 *   },
 *   ...
 * }
 */
