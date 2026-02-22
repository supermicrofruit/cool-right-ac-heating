#!/usr/bin/env node

/**
 * create-site.js
 *
 * Creates a new website from the template-monster template.
 *
 * Usage:
 *   node scripts/create-site.js <project-name>
 *   npx create-template-monster <project-name>
 *
 * Example:
 *   node scripts/create-site.js bobs-plumbing
 *   -> Creates ../bobs-plumbing with a fresh template
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`${colors.cyan}[${step}]${colors.reset} ${message}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function logError(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

// Files and directories to exclude when copying
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  '.DS_Store',
  '.env',
  '.env.local',
  'package-lock.json',
];

// Default placeholder business data
const DEFAULT_BUSINESS_DATA = {
  name: "Your Business Name",
  legalName: "Your Business Name LLC",
  phone: "(555) 123-4567",
  phoneRaw: "+15551234567",
  email: "info@yourbusiness.com",
  website: "https://yourbusiness.com",
  vertical: "hvac",
  region: "Your Region",
  address: {
    street: "123 Main Street",
    city: "Your City",
    state: "ST",
    zip: "12345",
    full: "123 Main Street, Your City, ST 12345"
  },
  coordinates: {
    lat: 0,
    lng: 0
  },
  hours: {
    weekdays: "8:00 AM - 6:00 PM",
    saturday: "9:00 AM - 4:00 PM",
    sunday: "Closed",
    structured: [
      { days: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
      { days: "Saturday", hours: "9:00 AM - 4:00 PM" },
      { days: "Sunday", hours: "Closed" }
    ]
  },
  licenses: [
    "License #XXXXXX"
  ],
  certifications: [
    "Certified Professional"
  ],
  established: new Date().getFullYear() - 5,
  rating: 5.0,
  reviewCount: 0,
  description: "Professional services for your area. Quality workmanship and customer satisfaction guaranteed.",
  tagline: "Your Tagline Here",
  emergencyService: true,
  financing: false,
  freeEstimates: true,
  responseTime: "Same day",
  warrantyYears: 1,
  maintenancePointCount: 10,
  socialMedia: {
    facebook: "",
    instagram: "",
    google: ""
  },
  theme: {
    preset: "professional-blue",
    logo: "/images/logo.png",
    favicon: "/favicon.ico"
  },
  features: {
    showTeam: false,
    showBlog: false,
    showWorks: false,
    showFinancing: false,
    emergencyBadge: true,
    callbackWidget: true,
    stickyPhone: true
  },
  seo: {
    titleTemplate: "%s | Your Business Name",
    defaultDescription: "Professional services in Your City, ST. Call (555) 123-4567 for a free estimate."
  },
  forms: {
    notifyEmail: "leads@yourbusiness.com",
    successMessage: "Thanks! We'll contact you shortly.",
    errorMessage: "Something went wrong. Please call us directly."
  }
};

/**
 * Recursively copy directory, excluding specified patterns
 */
function copyDirSync(src, dest, excludePatterns = []) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Check if should be excluded
    if (excludePatterns.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath, excludePatterns);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Convert project name to valid package name
 */
function toPackageName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.bright}create-site${colors.reset} - Create a new website from template-monster

${colors.yellow}Usage:${colors.reset}
  node scripts/create-site.js <project-name> [options]
  npx create-template-monster <project-name> [options]

${colors.yellow}Arguments:${colors.reset}
  project-name    Name for your new project (e.g., bobs-plumbing)

${colors.yellow}Options:${colors.reset}
  --no-install    Skip npm install
  --help, -h      Show this help message

${colors.yellow}Example:${colors.reset}
  node scripts/create-site.js bobs-plumbing
  node scripts/create-site.js "Valley HVAC Pros" --no-install

${colors.yellow}What it does:${colors.reset}
  1. Copies template to ../<project-name>
  2. Updates package.json with new name
  3. Resets business.json with placeholder values
  4. Removes .git folder
  5. Runs npm install (unless --no-install)
`);
    process.exit(0);
  }

  // Get project name
  const projectName = args.find(arg => !arg.startsWith('--'));
  const skipInstall = args.includes('--no-install');

  if (!projectName) {
    logError('Please provide a project name');
    console.log(`
${colors.yellow}Usage:${colors.reset} node scripts/create-site.js <project-name>

${colors.yellow}Example:${colors.reset}
  node scripts/create-site.js bobs-plumbing
  node scripts/create-site.js "Valley HVAC Pros"
`);
    process.exit(1);
  }

  // Determine paths
  const templateDir = path.resolve(__dirname, '..');
  const packageName = toPackageName(projectName);
  const targetDir = path.resolve(templateDir, '..', packageName);

  log(`
${colors.bright}Creating new site: ${projectName}${colors.reset}
`, colors.cyan);

  // Check if target directory already exists
  if (fs.existsSync(targetDir)) {
    logError(`Directory already exists: ${targetDir}`);
    console.log(`\nPlease choose a different name or remove the existing directory.`);
    process.exit(1);
  }

  // Step 1: Copy template
  logStep('1/5', 'Copying template files...');
  try {
    copyDirSync(templateDir, targetDir, EXCLUDE_PATTERNS);
    logSuccess(`Copied to ${targetDir}`);
  } catch (err) {
    logError(`Failed to copy template: ${err.message}`);
    process.exit(1);
  }

  // Step 2: Update package.json
  logStep('2/5', 'Updating package.json...');
  try {
    const packageJsonPath = path.join(targetDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = packageName;
    // Remove bin entry if it exists (not needed in cloned projects)
    delete packageJson.bin;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    logSuccess(`Set package name to "${packageName}"`);
  } catch (err) {
    logError(`Failed to update package.json: ${err.message}`);
    process.exit(1);
  }

  // Step 3: Reset business.json
  logStep('3/5', 'Resetting business.json with placeholders...');
  try {
    const businessJsonPath = path.join(targetDir, 'data', 'business.json');
    fs.writeFileSync(businessJsonPath, JSON.stringify(DEFAULT_BUSINESS_DATA, null, 2) + '\n');
    logSuccess('Reset business.json');
  } catch (err) {
    logError(`Failed to reset business.json: ${err.message}`);
    process.exit(1);
  }

  // Step 4: Create .env.local from .env.example if it exists
  logStep('4/5', 'Setting up environment...');
  try {
    const envExamplePath = path.join(targetDir, '.env.example');
    const envLocalPath = path.join(targetDir, '.env.local');
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envLocalPath);
      logSuccess('Created .env.local from .env.example');
    } else {
      logSuccess('No .env.example found, skipping');
    }
  } catch (err) {
    log(`Warning: Could not create .env.local: ${err.message}`, colors.yellow);
  }

  // Step 5: Run npm install
  if (!skipInstall) {
    logStep('5/5', 'Installing dependencies (this may take a minute)...');
    try {
      execSync('npm install', {
        cwd: targetDir,
        stdio: 'inherit',
      });
      logSuccess('Dependencies installed');
    } catch (err) {
      logError(`npm install failed: ${err.message}`);
      console.log(`\nYou can try running "npm install" manually in the new directory.`);
    }
  } else {
    logStep('5/5', 'Skipping npm install (--no-install flag)');
  }

  // Success message
  console.log(`
${colors.green}${colors.bright}Success!${colors.reset} Created ${colors.cyan}${projectName}${colors.reset} at:
${colors.bright}${targetDir}${colors.reset}

${colors.yellow}Next steps:${colors.reset}

  1. ${colors.bright}cd ${packageName}${colors.reset}
     Navigate to your new project

  2. ${colors.bright}Edit data/business.json${colors.reset}
     Update with your client's business information:
     - name, phone, email
     - address and city
     - vertical (hvac, plumbing, electrical)
     - licenses, certifications

  3. ${colors.bright}Replace public/images/logo.png${colors.reset}
     Add the client's logo

  4. ${colors.bright}npm run dev${colors.reset}
     Start the development server

  5. ${colors.bright}npm run build${colors.reset}
     Build for production when ready

${colors.cyan}Quick commands:${colors.reset}
  cd ${packageName} && npm run dev

${colors.cyan}Documentation:${colors.reset}
  See CLAUDE.md for full build instructions
`);
}

// Run
main();
