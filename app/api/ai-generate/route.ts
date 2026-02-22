import { NextRequest, NextResponse } from 'next/server';

// CORS headers for cross-origin requests from admin UI
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// OpenRouter API for cheap AI generation
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct'; // Very cheap

interface ScrapedData {
  name: string;
  rating: number;
  reviewCount: number;
  category: string;
  address: string;
  phone: string;
  website: string | null;
  coordinates?: { lat: number; lng: number };
}

// Map category to vertical
function getVertical(category: string): string {
  const map: Record<string, string> = {
    'plumber': 'plumbing',
    'plumbing': 'plumbing',
    'hvac contractor': 'hvac',
    'air conditioning contractor': 'hvac',
    'heating contractor': 'hvac',
    'electrician': 'electrical',
    'electrical contractor': 'electrical',
    'roofer': 'roofing',
    'roofing contractor': 'roofing',
    'landscaper': 'landscaping',
  };
  return map[category.toLowerCase()] || 'hvac';
}

// Parse address
function parseAddress(fullAddress: string) {
  const parts = fullAddress.split(',').map(p => p.trim());
  const street = parts[0] || '';
  const city = parts[1] || '';
  const stateZipMatch = (parts[2] || '').match(/([A-Z]{2})\s*(\d{5})?/);
  const state = stateZipMatch ? stateZipMatch[1] : '';
  const zip = stateZipMatch ? stateZipMatch[2] || '00000' : '00000';
  return { street, city, state, zip };
}

// Generate full site config using AI
async function generateWithAI(scraped: ScrapedData): Promise<Record<string, unknown>> {
  const addr = parseAddress(scraped.address);
  const vertical = getVertical(scraped.category);
  const slug = scraped.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const prompt = `Generate a complete website data configuration for a ${vertical} business.

BUSINESS INFO:
- Name: ${scraped.name}
- Phone: ${scraped.phone}
- Address: ${scraped.address}
- City: ${addr.city}, ${addr.state}
- Rating: ${scraped.rating} stars (${scraped.reviewCount} reviews)
- Website: ${scraped.website || 'none'}
- Industry: ${vertical}

Generate a JSON object with these exact keys. Be creative but realistic. Use the business name and location throughout.

{
  "business": {
    "name": "${scraped.name}",
    "legalName": "${scraped.name} LLC",
    "phone": "${scraped.phone}",
    "email": "info@${slug.replace(/-/g, '')}.com",
    "website": "${scraped.website || `https://${slug}.com`}",
    "vertical": "${vertical}",
    "address": {
      "street": "${addr.street}",
      "city": "${addr.city}",
      "state": "${addr.state}",
      "zip": "${addr.zip}"
    },
    "rating": ${scraped.rating},
    "reviewCount": ${scraped.reviewCount},
    "established": ${new Date().getFullYear() - Math.floor(Math.random() * 15) - 5},
    "tagline": "[Generate a catchy tagline for this ${vertical} business]",
    "description": "[Generate a 2-sentence description]"
  },
  "services": [
    // Generate 6-8 services appropriate for ${vertical} business
    // Each service needs: slug, name, shortDescription, description, price (string like "Starting at $X"), features (array of 4-5 strings)
  ],
  "testimonials": [
    // Generate 5 realistic testimonials
    // Each needs: name, location (city nearby), rating (4 or 5), text (2-3 sentences), service (one of the services above)
  ],
  "faqs": [
    // Generate 8 FAQs about ${vertical} services
    // Each needs: question, answer (2-3 sentences)
  ],
  "areas": [
    // Generate 5 service areas near ${addr.city}, ${addr.state}
    // Each needs: slug, name, description (mention the area name and services)
  ],
  "posts": [
    // Generate 3 blog post stubs
    // Each needs: slug, title, excerpt (1 sentence), category (tips/news/guides)
  ]
}

Return ONLY valid JSON, no markdown, no explanation.`;

  if (!OPENROUTER_API_KEY) {
    // Fallback: generate locally without AI
    return generateFallback(scraped, addr, vertical, slug);
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://foundlio.com',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('OpenRouter error:', await response.text());
      return generateFallback(scraped, addr, vertical, slug);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const aiGenerated = JSON.parse(jsonMatch[0]);
      // Always generate fallback first to ensure all required fields exist
      const fallback = generateFallback(scraped, addr, vertical, slug);

      // Merge AI-generated content with fallback (AI overrides fallback where present)
      // But fallback fills in missing required fields
      const merged: Record<string, unknown> = {
        ...fallback,
        // Use AI services, testimonials, faqs, posts if they exist
        services: aiGenerated.services || fallback.services,
        testimonials: aiGenerated.testimonials || fallback.testimonials,
        faqs: aiGenerated.faqs || fallback.faqs,
        posts: aiGenerated.posts || fallback.posts,
        // Always use fallback areas - they have required fields (state, neighborhoods, etc.)
        // AI-generated areas typically lack these required properties
        areas: fallback.areas,
        // For business, merge AI fields into fallback to preserve required fields
        business: {
          ...(fallback.business as Record<string, unknown>),
          ...(aiGenerated.business || {}),
        },
      };
      return merged;
    }

    return generateFallback(scraped, addr, vertical, slug);
  } catch (error) {
    console.error('AI generation error:', error);
    return generateFallback(scraped, addr, vertical, slug);
  }
}

// Fallback generation without AI
function generateFallback(
  scraped: ScrapedData,
  addr: ReturnType<typeof parseAddress>,
  vertical: string,
  slug: string
): Record<string, unknown> {
  const servicesByVertical: Record<string, Array<{ slug: string; name: string; short: string }>> = {
    plumbing: [
      { slug: 'drain-cleaning', name: 'Drain Cleaning', short: 'Professional drain clearing' },
      { slug: 'water-heater', name: 'Water Heater Services', short: 'Installation and repair' },
      { slug: 'leak-repair', name: 'Leak Detection & Repair', short: 'Find and fix leaks fast' },
      { slug: 'pipe-repair', name: 'Pipe Repair', short: 'All pipe repairs' },
      { slug: 'sewer-line', name: 'Sewer Line Services', short: 'Sewer inspection and repair' },
      { slug: 'emergency', name: 'Emergency Plumbing', short: '24/7 emergency service' },
    ],
    hvac: [
      { slug: 'ac-repair', name: 'AC Repair', short: 'Fast cooling restoration' },
      { slug: 'ac-installation', name: 'AC Installation', short: 'New system installation' },
      { slug: 'heating-repair', name: 'Heating Repair', short: 'Furnace and heat pump repair' },
      { slug: 'maintenance', name: 'HVAC Maintenance', short: 'Preventive tune-ups' },
      { slug: 'duct-cleaning', name: 'Duct Cleaning', short: 'Improve air quality' },
      { slug: 'emergency', name: 'Emergency HVAC', short: '24/7 emergency service' },
    ],
    electrical: [
      { slug: 'panel-upgrade', name: 'Panel Upgrades', short: 'Electrical panel services' },
      { slug: 'wiring', name: 'Electrical Wiring', short: 'New and rewiring' },
      { slug: 'lighting', name: 'Lighting Installation', short: 'Indoor and outdoor lighting' },
      { slug: 'outlet-repair', name: 'Outlet & Switch Repair', short: 'Safe electrical repairs' },
      { slug: 'ev-charger', name: 'EV Charger Installation', short: 'Home charging stations' },
      { slug: 'emergency', name: 'Emergency Electrical', short: '24/7 emergency service' },
    ],
  };

  const services = (servicesByVertical[vertical] || servicesByVertical.hvac).map(s => ({
    slug: s.slug,
    name: s.name,
    shortDescription: s.short,
    description: `Professional ${s.name.toLowerCase()} services in ${addr.city}. Our certified technicians provide reliable solutions.`,
    price: 'Call for quote',
    features: ['Licensed professionals', 'Quality workmanship', 'Satisfaction guaranteed', 'Fair pricing'],
  }));

  const names = ['John M.', 'Sarah K.', 'Mike R.', 'Jennifer L.', 'David W.'];
  const testimonials = names.map((name, i) => ({
    name,
    location: addr.city,
    rating: i < 3 ? 5 : 4,
    text: `Great service from ${scraped.name}! Professional, on time, and fair pricing. Highly recommend.`,
    service: services[i % services.length].name,
  }));

  const faqs = [
    { question: `How quickly can you respond to ${vertical} emergencies?`, answer: `We offer 24/7 emergency service in ${addr.city}. Most emergencies are addressed within 2 hours.` },
    { question: 'Do you offer free estimates?', answer: 'Yes, we provide free estimates for most services. Call us to schedule.' },
    { question: 'Are your technicians licensed?', answer: 'Yes, all our technicians are fully licensed, insured, and background-checked.' },
    { question: 'What areas do you serve?', answer: `We serve ${addr.city} and surrounding areas within 30 miles.` },
    { question: 'Do you offer financing?', answer: 'Yes, we offer flexible financing options for larger projects.' },
    { question: 'What is your warranty?', answer: 'We provide a 2-year warranty on all our work.' },
  ];

  const areas = [
    {
      slug: addr.city.toLowerCase().replace(/\s+/g, '-'),
      name: addr.city,
      state: addr.state,
      description: `Serving ${addr.city} with professional ${vertical} services. Our experienced team provides reliable solutions for homes and businesses throughout the area.`,
      coordinates: scraped.coordinates || { lat: 33.4484, lng: -112.0740 },
      neighborhoods: [`Downtown ${addr.city}`, `North ${addr.city}`, `South ${addr.city}`, `East ${addr.city}`, `West ${addr.city}`],
      landmarks: [`${addr.city} City Center`, `${addr.city} Airport`],
      localChallenges: `Local climate and conditions in ${addr.city} require specialized ${vertical} expertise.`,
      population: '100,000+',
      serviceHighlights: [`Same-day service in ${addr.city}`, 'Local expertise', 'Fast response times'],
    },
    {
      slug: 'surrounding-areas',
      name: `Greater ${addr.city} Area`,
      state: addr.state,
      description: `Extended service coverage throughout the greater ${addr.city} metropolitan area.`,
      coordinates: scraped.coordinates || { lat: 33.4484, lng: -112.0740 },
      neighborhoods: ['Neighboring Communities', 'Suburban Areas', 'Outlying Districts'],
      landmarks: [],
      localChallenges: `Serving the diverse needs of the greater ${addr.city} region.`,
      population: '50,000+',
      serviceHighlights: ['Extended service area', 'Flexible scheduling', 'Reliable coverage'],
    },
  ];

  const verticalCap = vertical.charAt(0).toUpperCase() + vertical.slice(1);
  const authorId = slug.replace(/-/g, '') + '-team';
  const today = new Date().toISOString().split('T')[0];

  const posts = [
    {
      slug: `${vertical}-tips-${addr.city.toLowerCase().replace(/\s+/g, '-')}`,
      title: `${verticalCap} Tips for ${addr.city} Homeowners`,
      excerpt: `Essential ${vertical} maintenance tips for local homeowners.`,
      content: `Maintaining your ${vertical} systems in ${addr.city} requires attention to local conditions. Here are our top tips for keeping your home comfortable year-round.\n\n## Regular Maintenance\n\nSchedule annual inspections to catch problems early. Our technicians can identify issues before they become expensive repairs.\n\n## Know When to Call\n\nDon't ignore warning signs. Strange noises, unusual smells, or reduced performance all indicate potential problems.\n\n## Trust Local Experts\n\n${scraped.name} has been serving ${addr.city} homeowners for years. We understand local conditions and provide reliable solutions.`,
      authorId,
      date: today,
      category: 'Maintenance Tips',
      image: '/images/blog/maintenance-tips.jpg',
      readTime: '3 min read',
      metaTitle: `${verticalCap} Tips for ${addr.city} | ${scraped.name}`,
      metaDescription: `Expert ${vertical} maintenance tips for ${addr.city} homeowners from ${scraped.name}.`
    },
    {
      slug: 'save-money',
      title: `How to Save Money on ${verticalCap} Services`,
      excerpt: 'Smart strategies to reduce your costs.',
      content: `Smart homeowners know that preventive maintenance saves money in the long run. Here's how to keep your ${vertical} costs under control.\n\n## Schedule Regular Maintenance\n\nAnnual tune-ups prevent expensive emergency repairs and keep your systems running efficiently.\n\n## Know the Warning Signs\n\nCatching problems early means simpler, less expensive fixes.\n\n## Choose Quality Service\n\nThe cheapest option isn't always the best value. ${scraped.name} provides quality workmanship that lasts.`,
      authorId,
      date: today,
      category: 'Guides',
      image: '/images/blog/save-money.jpg',
      readTime: '4 min read',
      metaTitle: `Save Money on ${verticalCap} Services | ${scraped.name}`,
      metaDescription: `Learn how to reduce your ${vertical} costs with tips from ${scraped.name} professionals.`
    },
    {
      slug: 'when-to-call',
      title: `Signs You Need Professional ${verticalCap} Help`,
      excerpt: 'Know when to call the experts.',
      content: `Not every ${vertical} issue requires professional help, but some definitely do. Here's how to know when to call ${scraped.name}.\n\n## Emergency Signs\n\nSome issues require immediate attention. Don't wait if you notice serious problems.\n\n## Performance Issues\n\nIf your systems aren't performing as expected, it's time for a professional inspection.\n\n## Regular Checkups\n\nEven without obvious problems, annual maintenance keeps everything running smoothly.`,
      authorId,
      date: today,
      category: 'Tips',
      image: '/images/blog/when-to-call.jpg',
      readTime: '3 min read',
      metaTitle: `When to Call a ${verticalCap} Professional | ${scraped.name}`,
      metaDescription: `Learn the warning signs that indicate you need professional ${vertical} help from ${scraped.name}.`
    },
  ];

  return {
    business: {
      name: scraped.name,
      legalName: `${scraped.name} LLC`,
      phone: scraped.phone,
      phoneRaw: '+1' + scraped.phone.replace(/\D/g, ''),
      email: `info@${slug.replace(/-/g, '')}.com`,
      website: scraped.website || `https://${slug}.com`,
      vertical,
      region: addr.state,
      address: {
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        full: scraped.address.replace(', United States', ''),
      },
      coordinates: scraped.coordinates || { lat: 0, lng: 0 },
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
      licenses: ['State Licensed', 'Bonded & Insured'],
      certifications: ['BBB A+ Rating', 'Certified Professionals'],
      established: new Date().getFullYear() - 10,
      rating: scraped.rating,
      reviewCount: scraped.reviewCount,
      description: `${scraped.name} provides professional ${vertical} services in ${addr.city}. Trusted by ${scraped.reviewCount}+ customers.`,
      tagline: `Your Trusted ${vertical.charAt(0).toUpperCase() + vertical.slice(1)} Experts`,
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
        preset: vertical === 'plumbing' ? 'bold-blue' : vertical === 'electrical' ? 'bold-yellow' : 'bold-orange',
        logo: '/images/logo.png',
        favicon: '/favicon.ico',
      },
      features: {
        showTeam: true,
        showBlog: true,
        showWorks: true,
        showFinancing: true,
        emergencyBadge: true,
        callbackWidget: true,
        stickyPhone: true,
      },
      seo: {
        titleTemplate: `%s | ${scraped.name}`,
        defaultDescription: `Professional ${vertical} services in ${addr.city}, ${addr.state}. ${scraped.rating} stars. Call ${scraped.phone}.`,
      },
      forms: {
        notifyEmail: `info@${slug.replace(/-/g, '')}.com`,
        webhookUrl: '',
        successMessage: "Thanks! We'll contact you within 2 hours.",
        errorMessage: 'Something went wrong. Please call us directly.',
      },
    },
    services,
    testimonials,
    faqs,
    areas,
    posts,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scrapedData } = body;

    if (!scrapedData) {
      return NextResponse.json({ error: 'Missing scrapedData' }, { status: 400, headers: corsHeaders });
    }

    // Generate full config using AI (or fallback)
    const fullConfig = await generateWithAI(scrapedData);

    return NextResponse.json({
      success: true,
      config: fullConfig,
      usedAI: !!OPENROUTER_API_KEY,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
