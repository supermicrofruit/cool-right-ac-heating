/**
 * Site Generation Script
 *
 * Takes scraped Google Maps data and generates a complete business.json
 * Then deploys to Vercel as a new project.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Types
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

interface BusinessJson {
  name: string;
  legalName: string;
  phone: string;
  phoneRaw: string;
  email: string;
  website: string;
  vertical: string;
  region: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    full: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    structured: Array<{ days: string; hours: string }>;
  };
  licenses: string[];
  certifications: string[];
  established: number;
  rating: number;
  reviewCount: number;
  description: string;
  tagline: string;
  emergencyService: boolean;
  financing: boolean;
  freeEstimates: boolean;
  responseTime: string;
  warrantyYears: number;
  maintenancePointCount: number;
  socialMedia: {
    facebook: string;
    instagram: string;
    google: string;
  };
  theme: {
    preset: string;
    logo: string;
    favicon: string;
  };
  features: {
    showTeam: boolean;
    showBlog: boolean;
    showWorks: boolean;
    showFinancing: boolean;
    emergencyBadge: boolean;
    callbackWidget: boolean;
    stickyPhone: boolean;
  };
  seo: {
    titleTemplate: string;
    defaultDescription: string;
  };
  forms: {
    notifyEmail: string;
    webhookUrl: string;
    successMessage: string;
    errorMessage: string;
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
  'roofer': 'roofing',
  'roofing contractor': 'roofing',
  'landscaper': 'landscaping',
  'landscaping': 'landscaping',
  'lawn care': 'landscaping',
};

// Parse address string into components
function parseAddress(fullAddress: string): {
  street: string;
  city: string;
  state: string;
  zip: string;
} {
  // Format: "11062 N 24th Ave, Phoenix, AZ 85029, United States"
  const parts = fullAddress.split(',').map(p => p.trim());

  const street = parts[0] || '';
  const city = parts[1] || '';

  // Parse "AZ 85029" or similar
  const stateZipMatch = (parts[2] || '').match(/([A-Z]{2})\s*(\d{5})/);
  const state = stateZipMatch ? stateZipMatch[1] : '';
  const zip = stateZipMatch ? stateZipMatch[2] : '';

  return { street, city, state, zip };
}

// Generate a slug from business name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

// Format phone number
function formatPhone(rawPhone: string): { display: string; raw: string } {
  const digits = rawPhone.replace(/\D/g, '');
  const raw = digits.startsWith('1') ? `+${digits}` : `+1${digits}`;

  // Format as (XXX) XXX-XXXX
  const areaCode = digits.slice(-10, -7);
  const prefix = digits.slice(-7, -4);
  const line = digits.slice(-4);
  const display = `(${areaCode}) ${prefix}-${line}`;

  return { display, raw };
}

// Generate email from business name
function generateEmail(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20);
  return `info@${slug}.com`;
}

// Get state full name
const STATE_NAMES: Record<string, string> = {
  'AZ': 'Arizona',
  'CA': 'California',
  'TX': 'Texas',
  'FL': 'Florida',
  'NY': 'New York',
  'IL': 'Illinois',
  'PA': 'Pennsylvania',
  'OH': 'Ohio',
  'GA': 'Georgia',
  'NC': 'North Carolina',
  'MI': 'Michigan',
  'NJ': 'New Jersey',
  'VA': 'Virginia',
  'WA': 'Washington',
  'MA': 'Massachusetts',
  'CO': 'Colorado',
  'NV': 'Nevada',
  // Add more as needed
};

// Transform scraped data to business.json
export function transformToBusinessJson(scraped: ScrapedData): BusinessJson {
  const addressParts = parseAddress(scraped.address);
  const phone = formatPhone(scraped.phone);
  const vertical = CATEGORY_TO_VERTICAL[scraped.category.toLowerCase()] || 'hvac';
  const region = STATE_NAMES[addressParts.state] || addressParts.state;
  const slug = generateSlug(scraped.name);

  // Generate reasonable established year (random within last 15 years)
  const currentYear = new Date().getFullYear();
  const established = currentYear - Math.floor(Math.random() * 15) - 5;

  // Generate vertical-specific content
  const verticalContent = getVerticalContent(vertical, scraped.name, addressParts.city);

  return {
    name: scraped.name,
    legalName: `${scraped.name} LLC`,
    phone: phone.display,
    phoneRaw: phone.raw,
    email: generateEmail(scraped.name),
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
    licenses: verticalContent.licenses,
    certifications: verticalContent.certifications,
    established,
    rating: scraped.rating,
    reviewCount: scraped.reviewCount,
    description: verticalContent.description,
    tagline: verticalContent.tagline,
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
      preset: getThemeForVertical(vertical),
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
      defaultDescription: `Professional ${vertical} services in ${addressParts.city}, ${addressParts.state}. ${scraped.rating} stars from ${scraped.reviewCount}+ reviews. Call ${phone.display}.`,
    },
    forms: {
      notifyEmail: generateEmail(scraped.name),
      webhookUrl: '',
      successMessage: 'Thanks! We\'ll contact you within 2 hours.',
      errorMessage: 'Something went wrong. Please call us directly.',
    },
  };
}

// Get vertical-specific content
function getVerticalContent(vertical: string, businessName: string, city: string) {
  const content: Record<string, {
    licenses: string[];
    certifications: string[];
    description: string;
    tagline: string;
  }> = {
    plumbing: {
      licenses: ['State Plumbing License', 'Backflow Certified', 'EPA Certified'],
      certifications: ['BBB A+ Rating', 'Master Plumber Certified', 'Lead-Safe Certified'],
      description: `${businessName} provides professional plumbing services to ${city} and surrounding areas. Our licensed plumbers deliver expert solutions for repairs, installations, and emergencies.`,
      tagline: 'Your Trusted Local Plumbers',
    },
    hvac: {
      licenses: ['HVAC Contractor License', 'EPA 608 Certified', 'NATE Certified'],
      certifications: ['Carrier Factory Authorized', 'BBB A+ Rating', 'Energy Star Partner'],
      description: `${businessName} has been providing reliable HVAC services to ${city}. Our certified technicians deliver expert heating and cooling solutions.`,
      tagline: 'Your Comfort, Our Priority',
    },
    electrical: {
      licenses: ['Master Electrician License', 'Bonded & Insured', 'NEC Compliant'],
      certifications: ['BBB A+ Rating', 'OSHA Certified', 'Licensed & Bonded'],
      description: `${businessName} offers professional electrical services in ${city}. Our licensed electricians provide safe, reliable solutions for all your electrical needs.`,
      tagline: 'Powering Your Home Safely',
    },
  };

  return content[vertical] || content.hvac;
}

// Get theme preset for vertical
function getThemeForVertical(vertical: string): string {
  const themes: Record<string, string> = {
    plumbing: 'bold-blue',
    hvac: 'bold-orange',
    electrical: 'bold-yellow',
    roofing: 'bold-red',
    landscaping: 'bold-green',
  };
  return themes[vertical] || 'bold-blue';
}

// Deploy to Vercel
export async function deployToVercel(
  businessJson: BusinessJson,
  vercelToken: string,
  teamSlug: string
): Promise<{ url: string; projectId: string }> {
  const projectName = generateSlug(businessJson.name);
  const templateDir = process.cwd();

  // Create a temporary directory for the new project
  const tempDir = `/tmp/foundlio-${projectName}-${Date.now()}`;

  console.log(`Creating project directory: ${tempDir}`);

  // Copy template to temp dir
  execSync(`cp -r "${templateDir}" "${tempDir}"`);

  // Remove git history and node_modules
  execSync(`rm -rf "${tempDir}/.git" "${tempDir}/node_modules"`);

  // Write the new business.json
  fs.writeFileSync(
    path.join(tempDir, 'data', 'business.json'),
    JSON.stringify(businessJson, null, 2)
  );

  console.log('Updated business.json');

  // Deploy using Vercel CLI
  const deployCmd = `cd "${tempDir}" && npx vercel deploy --prod --yes --token=${vercelToken} --scope=${teamSlug} --name=${projectName}`;

  console.log('Deploying to Vercel...');

  try {
    const output = execSync(deployCmd, { encoding: 'utf8' });
    const urlMatch = output.match(/https:\/\/[^\s]+\.vercel\.app/);
    const url = urlMatch ? urlMatch[0] : '';

    console.log(`Deployed: ${url}`);

    // Cleanup temp dir
    execSync(`rm -rf "${tempDir}"`);

    return { url, projectId: projectName };
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}

// Main function for CLI usage
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: npx ts-node scripts/generate-site.ts <scraped-data.json>');
    process.exit(1);
  }

  const inputFile = args[0];
  const scraped: ScrapedData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

  console.log('Input data:', scraped);

  const businessJson = transformToBusinessJson(scraped);

  console.log('Generated business.json:', JSON.stringify(businessJson, null, 2));

  // Check for Vercel deployment
  const vercelToken = process.env.VERCEL_TOKEN;
  const teamSlug = process.env.VERCEL_TEAM_SLUG;

  if (vercelToken && teamSlug) {
    const result = await deployToVercel(businessJson, vercelToken, teamSlug);
    console.log('Deployment result:', result);
  } else {
    console.log('No Vercel credentials found. Skipping deployment.');
    // Just output the business.json
    fs.writeFileSync('output-business.json', JSON.stringify(businessJson, null, 2));
    console.log('Wrote output-business.json');
  }
}

// Export for use as module
export type { ScrapedData };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
