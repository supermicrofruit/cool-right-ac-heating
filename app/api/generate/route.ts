import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Vercel credentials from env (NEVER hardcode tokens - use .env.local)
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || '';
const VERCEL_TEAM_SLUG = process.env.VERCEL_TEAM_SLUG || '';

interface ScrapedData {
  name: string;
  rating: number;
  reviewCount: number;
  category: string;
  address: string;
  phone: string;
  website: string | null;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Map Google Maps categories to our verticals
const CATEGORY_TO_VERTICAL: Record<string, string> = {
  'plumber': 'plumbing',
  'plumbing': 'plumbing',
  'plumbing contractor': 'plumbing',
  'hvac contractor': 'hvac',
  'air conditioning contractor': 'hvac',
  'heating contractor': 'hvac',
  'hvac': 'hvac',
  'electrician': 'electrical',
  'electrical contractor': 'electrical',
  'electrical': 'electrical',
};

const STATE_NAMES: Record<string, string> = {
  'AZ': 'Arizona', 'CA': 'California', 'TX': 'Texas', 'FL': 'Florida',
  'NY': 'New York', 'NV': 'Nevada', 'CO': 'Colorado', 'WA': 'Washington',
};

function parseAddress(fullAddress: string) {
  const parts = fullAddress.split(',').map(p => p.trim());
  const street = parts[0] || '';
  const city = parts[1] || '';
  const stateZipMatch = (parts[2] || '').match(/([A-Z]{2})\s*(\d{5})/);
  const state = stateZipMatch ? stateZipMatch[1] : '';
  const zip = stateZipMatch ? stateZipMatch[2] : '';
  return { street, city, state, zip };
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

function formatPhone(rawPhone: string) {
  const digits = rawPhone.replace(/\D/g, '');
  const raw = digits.startsWith('1') ? `+${digits}` : `+1${digits}`;
  const areaCode = digits.slice(-10, -7);
  const prefix = digits.slice(-7, -4);
  const line = digits.slice(-4);
  const display = `(${areaCode}) ${prefix}-${line}`;
  return { display, raw };
}

function transformToBusinessJson(scraped: ScrapedData) {
  const addressParts = parseAddress(scraped.address);
  const phone = formatPhone(scraped.phone);
  const vertical = CATEGORY_TO_VERTICAL[scraped.category.toLowerCase()] || 'hvac';
  const region = STATE_NAMES[addressParts.state] || addressParts.state;
  const slug = generateSlug(scraped.name);
  const currentYear = new Date().getFullYear();
  const established = currentYear - Math.floor(Math.random() * 15) - 5;

  const verticalContent: Record<string, { licenses: string[]; certifications: string[]; description: string; tagline: string }> = {
    plumbing: {
      licenses: ['State Plumbing License', 'Backflow Certified', 'EPA Certified'],
      certifications: ['BBB A+ Rating', 'Master Plumber Certified'],
      description: `${scraped.name} provides professional plumbing services to ${addressParts.city} and surrounding areas.`,
      tagline: 'Your Trusted Local Plumbers',
    },
    hvac: {
      licenses: ['HVAC Contractor License', 'EPA 608 Certified', 'NATE Certified'],
      certifications: ['Carrier Factory Authorized', 'BBB A+ Rating'],
      description: `${scraped.name} provides reliable HVAC services to ${addressParts.city}.`,
      tagline: 'Your Comfort, Our Priority',
    },
    electrical: {
      licenses: ['Master Electrician License', 'Bonded & Insured'],
      certifications: ['BBB A+ Rating', 'OSHA Certified'],
      description: `${scraped.name} offers professional electrical services in ${addressParts.city}.`,
      tagline: 'Powering Your Home Safely',
    },
  };

  const content = verticalContent[vertical] || verticalContent.hvac;
  const themes: Record<string, string> = { plumbing: 'bold-blue', hvac: 'bold-orange', electrical: 'bold-yellow' };

  return {
    name: scraped.name,
    legalName: `${scraped.name} LLC`,
    phone: phone.display,
    phoneRaw: phone.raw,
    email: `info@${slug.replace(/-/g, '')}.com`,
    website: scraped.website || `https://${slug}.com`,
    vertical,
    region,
    address: {
      street: addressParts.street,
      city: addressParts.city,
      state: addressParts.state,
      zip: addressParts.zip,
      full: scraped.address.replace(', United States', ''),
    },
    coordinates: scraped.coordinates,
    hours: {
      weekdays: '7:00 AM - 8:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: 'Emergency Only',
      structured: [
        { days: 'Monday - Friday', hours: '7:00 AM - 8:00 PM' },
        { days: 'Saturday', hours: '8:00 AM - 6:00 PM' },
        { days: 'Sunday', hours: 'Emergency Only' },
      ],
    },
    licenses: content.licenses,
    certifications: content.certifications,
    established,
    rating: scraped.rating,
    reviewCount: scraped.reviewCount,
    description: content.description,
    tagline: content.tagline,
    emergencyService: true,
    financing: true,
    freeEstimates: true,
    responseTime: '2 hours',
    warrantyYears: 2,
    maintenancePointCount: 21,
    socialMedia: {
      facebook: `https://facebook.com/${slug}`,
      instagram: `https://instagram.com/${slug}`,
      google: `https://g.page/${slug}`,
    },
    theme: {
      preset: themes[vertical] || 'bold-blue',
      logo: '/images/logo.png',
      favicon: '/favicon.ico',
    },
    features: {
      showTeam: true, showBlog: true, showWorks: true, showFinancing: true,
      emergencyBadge: true, callbackWidget: true, stickyPhone: true,
    },
    seo: {
      titleTemplate: `%s | ${scraped.name}`,
      defaultDescription: `Professional ${vertical} services in ${addressParts.city}, ${addressParts.state}. ${scraped.rating} stars. Call ${phone.display}.`,
    },
    forms: {
      notifyEmail: `info@${slug.replace(/-/g, '')}.com`,
      webhookUrl: '',
      successMessage: 'Thanks! We\'ll contact you within 2 hours.',
      errorMessage: 'Something went wrong. Please call us directly.',
    },
  };
}

async function deployToVercel(
  businessJson: ReturnType<typeof transformToBusinessJson>,
  fullConfig?: Record<string, unknown>
) {
  const projectName = generateSlug(businessJson.name);
  const templateDir = process.cwd();
  const tempDir = `/tmp/foundlio-${projectName}-${Date.now()}`;

  // Copy template
  execSync(`cp -r "${templateDir}" "${tempDir}"`);
  execSync(`rm -rf "${tempDir}/.git" "${tempDir}/node_modules" "${tempDir}/.next"`);

  const dataDir = path.join(tempDir, 'data');

  // Write business.json (use fullConfig.business if available, with normalized hours)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const businessToWrite: any = fullConfig?.business || businessJson;

  // Normalize hours structure - ensure it has 'structured' array
  if (businessToWrite.hours && !businessToWrite.hours.structured) {
    businessToWrite.hours.structured = [
      { days: 'Monday - Friday', hours: businessToWrite.hours.weekdays || businessToWrite.hours.monday || '7:00 AM - 8:00 PM' },
      { days: 'Saturday', hours: businessToWrite.hours.saturday || '8:00 AM - 6:00 PM' },
      { days: 'Sunday', hours: businessToWrite.hours.sunday || 'Emergency Only' },
    ];
    // Also ensure weekdays/saturday/sunday exist
    if (!businessToWrite.hours.weekdays) {
      businessToWrite.hours.weekdays = businessToWrite.hours.monday || '7:00 AM - 8:00 PM';
    }
    if (!businessToWrite.hours.saturday) {
      businessToWrite.hours.saturday = '8:00 AM - 6:00 PM';
    }
    if (!businessToWrite.hours.sunday) {
      businessToWrite.hours.sunday = 'Emergency Only';
    }
  }

  // Normalize address structure - ensure it has 'full' field
  if (businessToWrite.address && !businessToWrite.address.full) {
    const addr = businessToWrite.address;
    businessToWrite.address.full = `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}`.trim();
  }

  // Normalize licenses and certifications to be string arrays
  if (businessToWrite.licenses && Array.isArray(businessToWrite.licenses)) {
    businessToWrite.licenses = businessToWrite.licenses.map((l: string | { name?: string }) =>
      typeof l === 'string' ? l : (l.name || 'Licensed')
    );
  }
  if (businessToWrite.certifications && Array.isArray(businessToWrite.certifications)) {
    businessToWrite.certifications = businessToWrite.certifications.map((c: string | { name?: string }) =>
      typeof c === 'string' ? c : (c.name || 'Certified')
    );
  }

  fs.writeFileSync(
    path.join(dataDir, 'business.json'),
    JSON.stringify(businessToWrite, null, 2)
  );

  // Write all other data files from fullConfig if available
  // Note: Template expects wrapped arrays like { "services": [...] }
  if (fullConfig) {
    if (fullConfig.services && Array.isArray(fullConfig.services)) {
      // Ensure all services have required fields
      interface ServiceInput {
        slug?: string;
        name?: string;
        shortDescription?: string;
        description?: string;
        longDescription?: string;
        features?: string[];
        benefits?: string[];
        icon?: string;
        category?: string;
        emergency?: boolean;
        metaTitle?: string;
        metaDescription?: string;
        price?: string;
      }

      const completeServices = fullConfig.services.map((s: ServiceInput, index: number) => ({
        slug: s.slug || `service-${index + 1}`,
        name: s.name || `Service ${index + 1}`,
        shortDescription: s.shortDescription || s.description || 'Professional service from our expert team.',
        longDescription: s.longDescription || s.description || `${businessJson.name} provides professional ${s.name || 'service'} to ensure your complete satisfaction. Our experienced technicians deliver quality work with attention to detail.`,
        features: s.features || ['Professional service', 'Experienced technicians', 'Quality workmanship', 'Customer satisfaction guaranteed'],
        benefits: s.benefits || ['Peace of mind', 'Save time', 'Expert results', 'Reliable service'],
        icon: s.icon || 'Wrench',
        category: s.category || 'general',
        emergency: s.emergency ?? false,
        metaTitle: s.metaTitle || `${s.name || 'Service'} | ${businessJson.name}`,
        metaDescription: s.metaDescription || s.shortDescription || s.description || `Professional ${s.name || 'service'} from ${businessJson.name}. Contact us today.`,
      }));

      // Extract unique categories and create category objects
      const uniqueCategories = Array.from(new Set(completeServices.map((s: { category: string }) => s.category)));
      const categoryIcons: Record<string, string> = {
        cooling: 'Snowflake', heating: 'Flame', 'air-quality': 'Wind', emergency: 'AlertCircle',
        general: 'Wrench', plumbing: 'Droplet', electrical: 'Zap', hvac: 'Fan',
      };
      const serviceCategories = uniqueCategories.map((cat: string) => ({
        slug: cat,
        name: cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Services',
        icon: categoryIcons[cat] || 'Wrench',
      }));

      fs.writeFileSync(
        path.join(dataDir, 'services.json'),
        JSON.stringify({ services: completeServices, categories: serviceCategories }, null, 2)
      );
    }
    if (fullConfig.testimonials && Array.isArray(fullConfig.testimonials)) {
      // Ensure all testimonials have required fields
      interface TestimonialInput {
        id?: number;
        name?: string;
        location?: string;
        rating?: number;
        text?: string;
        service?: string;
        date?: string;
        verified?: boolean;
      }

      const today = new Date().toISOString().split('T')[0];
      const completeTestimonials = fullConfig.testimonials.map((t: TestimonialInput, index: number) => ({
        id: t.id ?? index + 1,
        name: t.name || `Customer ${index + 1}`,
        location: t.location || `${businessJson.address?.city || 'Local'}, ${businessJson.address?.state || 'AZ'}`,
        rating: t.rating ?? 5,
        text: t.text || 'Great service! Highly recommended.',
        service: t.service || 'General Service',
        date: t.date || today,
        verified: t.verified ?? true,
      }));

      // Calculate summary
      const totalRating = completeTestimonials.reduce((sum: number, t: { rating: number }) => sum + t.rating, 0);
      const avgRating = Math.round((totalRating / completeTestimonials.length) * 10) / 10;
      const fiveStarCount = completeTestimonials.filter((t: { rating: number }) => t.rating === 5).length;

      fs.writeFileSync(
        path.join(dataDir, 'testimonials.json'),
        JSON.stringify({
          testimonials: completeTestimonials,
          summary: {
            averageRating: avgRating || 4.9,
            totalReviews: businessJson.reviewCount || 100,
            fiveStarPercentage: Math.round((fiveStarCount / completeTestimonials.length) * 100) || 90,
            platforms: [
              { name: 'Google', rating: avgRating || 4.9, reviews: Math.round((businessJson.reviewCount || 100) * 0.6) },
              { name: 'Yelp', rating: avgRating || 4.8, reviews: Math.round((businessJson.reviewCount || 100) * 0.25) },
              { name: 'BBB', rating: 5.0, reviews: Math.round((businessJson.reviewCount || 100) * 0.15) },
            ],
          },
        }, null, 2)
      );
    }
    if (fullConfig.faqs && Array.isArray(fullConfig.faqs)) {
      // Transform flat FAQ array into categories structure
      // Group FAQs by category or create a general category
      interface FAQInput {
        question?: string;
        answer?: string;
        category?: string;
      }

      const faqsByCategory: Record<string, FAQInput[]> = {};
      fullConfig.faqs.forEach((faq: FAQInput) => {
        const cat = faq.category || 'General';
        if (!faqsByCategory[cat]) {
          faqsByCategory[cat] = [];
        }
        faqsByCategory[cat].push(faq);
      });

      const categories = Object.entries(faqsByCategory).map(([name, faqs]) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        faqs: faqs.map(f => ({
          question: f.question || 'Question',
          answer: f.answer || 'Please contact us for more information.',
        })),
      }));

      // Ensure 'general' category exists for homepage
      if (!categories.find(c => c.slug === 'general')) {
        categories.unshift({
          name: 'General',
          slug: 'general',
          faqs: fullConfig.faqs.slice(0, 4).map((f: FAQInput) => ({
            question: f.question || 'Question',
            answer: f.answer || 'Please contact us for more information.',
          })),
        });
      }

      fs.writeFileSync(
        path.join(dataDir, 'faqs.json'),
        JSON.stringify({ categories }, null, 2)
      );
    }
    if (fullConfig.areas && Array.isArray(fullConfig.areas)) {
      const city = businessJson.address?.city || 'Phoenix';
      const state = businessJson.address?.state || 'AZ';

      // Ensure all areas have required fields
      interface AreaInput {
        slug?: string;
        name?: string;
        state?: string;
        description?: string;
        neighborhoods?: string[];
        landmarks?: string[];
        localChallenges?: string;
        coordinates?: { lat: number; lng: number };
        population?: string;
        serviceHighlights?: string[];
      }

      const completeAreas = fullConfig.areas.map((a: AreaInput, index: number) => ({
        slug: a.slug || `area-${index + 1}`,
        name: a.name || city,
        state: a.state || state,
        description: a.description || `${businessJson.name} proudly serves ${a.name || city} and surrounding areas with professional ${businessJson.vertical || 'service'} solutions.`,
        neighborhoods: a.neighborhoods || ['Downtown', 'Midtown', 'North Side', 'South Side'],
        landmarks: a.landmarks || [],
        localChallenges: a.localChallenges || `Local ${businessJson.vertical || 'service'} needs require experienced professionals who understand the area.`,
        coordinates: a.coordinates || businessJson.coordinates || { lat: 33.4484, lng: -112.0740 },
        population: a.population || '50,000+',
        serviceHighlights: a.serviceHighlights || ['Fast response times', 'Local expertise', 'Reliable service'],
      }));

      fs.writeFileSync(
        path.join(dataDir, 'areas.json'),
        JSON.stringify({
          areas: completeAreas,
          serviceRadius: `50 miles from ${city}`,
          primaryServiceArea: `${city} Metro Area`
        }, null, 2)
      );
    }
    if (fullConfig.posts && Array.isArray(fullConfig.posts)) {
      // Extract unique categories from posts
      const postCategories = fullConfig.posts
        .map((p: { category?: string }) => p.category)
        .filter((c): c is string => Boolean(c));
      // Add default categories if we don't have enough
      const defaultCategories = ['Maintenance Tips', 'Repair', 'Energy Efficiency', 'Indoor Air Quality', 'Industry News'];
      const allCategories = Array.from(new Set([...postCategories, ...defaultCategories]));

      // Ensure all posts have required fields
      const authorSlugForPosts = generateSlug(businessJson.name).replace(/-/g, '') + '-team';
      const today = new Date().toISOString().split('T')[0];

      interface PostInput {
        slug?: string;
        title?: string;
        excerpt?: string;
        content?: string;
        authorId?: string;
        date?: string;
        category?: string;
        image?: string;
        readTime?: string;
        metaTitle?: string;
        metaDescription?: string;
      }

      const completePosts = fullConfig.posts.map((post: PostInput, index: number) => ({
        slug: post.slug || `post-${index + 1}`,
        title: post.title || 'Blog Post',
        excerpt: post.excerpt || 'Read more about our services.',
        content: post.content || `Welcome to our blog. Contact ${businessJson.name} for professional service.`,
        authorId: post.authorId || authorSlugForPosts,
        date: post.date || today,
        category: post.category || 'Industry News',
        image: post.image || '/images/blog/default.jpg',
        readTime: post.readTime || '3 min read',
        metaTitle: post.metaTitle || post.title || 'Blog Post',
        metaDescription: post.metaDescription || post.excerpt || 'Read our latest blog post.',
      }));

      fs.writeFileSync(
        path.join(dataDir, 'posts.json'),
        JSON.stringify({
          posts: completePosts,
          categories: allCategories
        }, null, 2)
      );
    }

    // Generate authors.json with a team author matching the authorId used in posts
    const authorSlug = generateSlug(businessJson.name).replace(/-/g, '') + '-team';
    fs.writeFileSync(
      path.join(dataDir, 'authors.json'),
      JSON.stringify({
        authors: [
          {
            id: authorSlug,
            name: `${businessJson.name} Team`,
            role: `Expert ${businessJson.vertical?.charAt(0).toUpperCase()}${businessJson.vertical?.slice(1) || ''} Technicians`,
            bio: `Our team of certified technicians brings decades of combined experience to every job. We're committed to providing reliable, honest service to the ${businessJson.address?.city || 'local'} area.`,
            image: '/images/logo.png',
            certifications: businessJson.certifications || ['Licensed', 'Insured', 'Certified'],
            social: {}
          }
        ]
      }, null, 2)
    );
  }

  // Deploy
  const deployCmd = `cd "${tempDir}" && npx vercel deploy --prod --yes --token=${VERCEL_TOKEN} --scope=${VERCEL_TEAM_SLUG} --name=${projectName}`;

  const output = execSync(deployCmd, { encoding: 'utf8', timeout: 300000 });
  const urlMatch = output.match(/https:\/\/[^\s]+\.vercel\.app/);

  // Cleanup
  execSync(`rm -rf "${tempDir}"`);

  return {
    url: urlMatch ? urlMatch[0] : null,
    projectId: projectName,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scrapedData, fullConfig, deploy = false } = body;

    if (!scrapedData) {
      return NextResponse.json({ error: 'Missing scrapedData' }, { status: 400, headers: corsHeaders });
    }

    // Use AI-generated fullConfig if provided, otherwise transform scraped data
    const businessJson = fullConfig?.business
      ? fullConfig.business
      : transformToBusinessJson(scrapedData);

    if (!deploy) {
      // Preview mode - just return the generated config
      return NextResponse.json({
        success: true,
        businessJson,
        preview: true,
      }, { headers: corsHeaders });
    }

    // Deploy to Vercel with full config
    const result = await deployToVercel(businessJson, fullConfig);

    return NextResponse.json({
      success: true,
      businessJson,
      deployment: result,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
