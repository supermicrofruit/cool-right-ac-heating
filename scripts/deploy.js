#!/usr/bin/env node

/**
 * Vercel Deployment Script
 *
 * Wraps the Vercel CLI with helpful checks and output.
 * Usage: npm run deploy
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`${colors.cyan}[${step}]${colors.reset} ${message}`);
}

function logError(message) {
  console.error(`${colors.red}Error: ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}${colors.bold}${message}${colors.reset}`);
}

// Check if Vercel CLI is installed
function checkVercelCLI() {
  logStep('1/4', 'Checking Vercel CLI...');

  try {
    const result = spawnSync('vercel', ['--version'], {
      encoding: 'utf-8',
      shell: true
    });

    if (result.status !== 0) {
      throw new Error('Vercel CLI not found');
    }

    const version = result.stdout.trim();
    log(`  Vercel CLI version: ${version}`, colors.green);
    return true;
  } catch (error) {
    logError('Vercel CLI is not installed.');
    console.log('');
    log('To install Vercel CLI, run one of the following:', colors.yellow);
    console.log('');
    console.log('  npm install -g vercel');
    console.log('  # or');
    console.log('  pnpm add -g vercel');
    console.log('  # or');
    console.log('  yarn global add vercel');
    console.log('');
    log('After installation, run: vercel login', colors.yellow);
    console.log('');
    return false;
  }
}

// Read project name from package.json
function getProjectInfo() {
  logStep('2/4', 'Reading project info...');

  const packageJsonPath = path.join(process.cwd(), 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    logError('package.json not found in current directory');
    process.exit(1);
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const projectName = packageJson.name || 'unnamed-project';
    log(`  Project: ${projectName}`, colors.green);
    return { name: projectName, version: packageJson.version };
  } catch (error) {
    logError(`Failed to read package.json: ${error.message}`);
    process.exit(1);
  }
}

// Check if there's a vercel.json config
function checkVercelConfig() {
  const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
  if (fs.existsSync(vercelJsonPath)) {
    log('  Using vercel.json configuration', colors.green);
    return true;
  }
  log('  No vercel.json found (using defaults)', colors.yellow);
  return false;
}

// Run the deployment
function deploy() {
  logStep('3/4', 'Deploying to Vercel...');
  console.log('');

  try {
    // Run vercel --prod and capture output
    // Using inherit for stdio so user sees real-time output and can interact if needed
    const result = spawnSync('vercel', ['--prod'], {
      encoding: 'utf-8',
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });

    if (result.status !== 0) {
      throw new Error(`Deployment failed with exit code ${result.status}`);
    }

    return true;
  } catch (error) {
    logError(`Deployment failed: ${error.message}`);
    return false;
  }
}

// Get the production URL after deployment
function getProductionUrl(projectName) {
  logStep('4/4', 'Fetching deployment URL...');

  try {
    // Get the latest production deployment
    const result = spawnSync('vercel', ['ls', '--prod', '-n', '1'], {
      encoding: 'utf-8',
      shell: true,
      cwd: process.cwd()
    });

    if (result.stdout) {
      // Parse the output to find the URL
      const lines = result.stdout.split('\n').filter(line => line.trim());
      // The URL is typically in the output
      const urlMatch = result.stdout.match(/https:\/\/[^\s]+\.vercel\.app/);
      if (urlMatch) {
        return urlMatch[0];
      }
    }

    // Fallback: construct probable URL from project name
    return `https://${projectName}.vercel.app`;
  } catch (error) {
    return null;
  }
}

// Main execution
function main() {
  console.log('');
  log('='.repeat(50), colors.cyan);
  log('  Foundlio Template Deployment', colors.bold);
  log('='.repeat(50), colors.cyan);
  console.log('');

  // Step 1: Check Vercel CLI
  if (!checkVercelCLI()) {
    process.exit(1);
  }

  // Step 2: Get project info
  const projectInfo = getProjectInfo();
  checkVercelConfig();
  console.log('');

  // Step 3: Deploy
  const deploySuccess = deploy();

  if (!deploySuccess) {
    console.log('');
    logError('Deployment failed. Please check the errors above.');
    process.exit(1);
  }

  // Step 4: Get and display URL
  console.log('');
  const url = getProductionUrl(projectInfo.name);

  log('='.repeat(50), colors.green);
  logSuccess('  Deployment successful!');
  log('='.repeat(50), colors.green);
  console.log('');

  if (url) {
    log(`  Production URL: ${url}`, colors.cyan);
  }

  console.log('');
  log('  Manage deployments: https://vercel.com/dashboard', colors.reset);
  console.log('');
}

main();
