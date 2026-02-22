#!/usr/bin/env node

/**
 * Foundlio Site Generator
 *
 * Generates complete website JSON configurations using OpenRouter API.
 * Accepts flexible input formats - natural language, JSON, or file.
 *
 * Usage:
 *   node generate.js "Create a plumbing site for Valley Plumbing in Mesa AZ, phone 480-555-7890"
 *   node generate.js --input input.json --output ./output
 *   node generate.js --input '{"name":"Test","phone":"555-1234",...}'
 *
 * Environment:
 *   OPENROUTER_API_KEY - Your OpenRouter API key (required)
 *   OPENROUTER_MODEL - Model to use (optional)
 */

const fs = require("fs");
const path = require("path");

// Load .env file if exists
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

// Configuration
const CONFIG = {
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",
  defaultModel: "deepseek/deepseek-v3.2", // Best quality-to-cost ratio (Feb 2026)
  maxTokens: 16000,
  // Alternative models (sorted by cost):
  // - openai/gpt-oss-20b      $0.0008/site - Ultra budget
  // - openai/gpt-oss-120b     $0.0016/site - Cheap + good
  // - openai/gpt-5-nano       $0.0033/site - OpenAI fallback
  // - deepseek/deepseek-v3.2  $0.0037/site - Best value (default)
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    input: null,
    output: "./output",
    model: process.env.OPENROUTER_MODEL || CONFIG.defaultModel,
    verbose: false,
    raw: false, // If true, treat input as raw prompt
  };

  // Check if first arg is a plain string (not a flag)
  if (args.length > 0 && !args[0].startsWith("-")) {
    // Could be JSON or natural language
    result.input = args[0];
    // Check remaining args for flags
    for (let i = 1; i < args.length; i++) {
      switch (args[i]) {
        case "--output":
        case "-o":
          result.output = args[++i];
          break;
        case "--model":
        case "-m":
          result.model = args[++i];
          break;
        case "--verbose":
        case "-v":
          result.verbose = true;
          break;
      }
    }
    return result;
  }

  // Parse flags
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--input":
      case "-i":
        result.input = args[++i];
        break;
      case "--output":
      case "-o":
        result.output = args[++i];
        break;
      case "--model":
      case "-m":
        result.model = args[++i];
        break;
      case "--verbose":
      case "-v":
        result.verbose = true;
        break;
      case "--raw":
      case "-r":
        result.raw = true;
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
    }
  }

  return result;
}

function printHelp() {
  console.log(`
Foundlio Site Generator

Usage:
  node generate.js "<natural language description>"
  node generate.js --input <file.json> --output <dir>
  node generate.js --input '<json string>'

Input Formats (all work):
  Natural language:
    node generate.js "Plumbing company called Valley Plumbing in Mesa AZ, phone 480-555-7890"

  JSON string:
    node generate.js -i '{"name":"Valley Plumbing","phone":"(480) 555-7890","city":"Mesa","state":"AZ","vertical":"plumbing"}'

  JSON file:
    node generate.js -i business-input.json

Options:
  -i, --input    Input (natural language, JSON string, or file path)
  -o, --output   Output directory (default: ./output)
  -m, --model    OpenRouter model (default: anthropic/claude-sonnet-4)
  -v, --verbose  Show detailed output
  -r, --raw      Treat input as raw prompt (advanced)
  -h, --help     Show this help

Environment Variables:
  OPENROUTER_API_KEY  Your OpenRouter API key (required)
  OPENROUTER_MODEL    Default model to use

Examples:
  # Natural language (easiest)
  node generate.js "HVAC company Desert Aire in Phoenix AZ, (602) 555-2665, bold orange theme"

  # JSON input
  node generate.js -i '{"name":"Test Co","vertical":"hvac","city":"Phoenix","state":"AZ","phone":"555-1234","email":"test@test.com"}'

  # From file
  node generate.js -i input.json -o ../data
`);
}

// Detect input type and normalize
function normalizeInput(input) {
  if (!input) {
    throw new Error("No input provided. Use --help for usage examples.");
  }

  // Try parsing as JSON first
  if (input.trim().startsWith("{")) {
    try {
      return { type: "json", data: JSON.parse(input) };
    } catch (e) {
      // Not valid JSON, treat as natural language
    }
  }

  // Check if it's a file path
  if (
    !input.includes(" ") ||
    input.endsWith(".json") ||
    input.endsWith(".txt")
  ) {
    const filePath = path.resolve(input);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      // Check if file contains JSON
      if (content.trim().startsWith("{")) {
        try {
          return { type: "json", data: JSON.parse(content) };
        } catch (e) {
          // File exists but isn't JSON, treat as text
          return { type: "text", data: content };
        }
      }
      return { type: "text", data: content };
    }
  }

  // Natural language input
  return { type: "text", data: input };
}

// Load generator context (schemas, examples, prompts)
function loadContext() {
  const generatorDir = path.join(__dirname, "..");

  // Load master prompt
  let masterPrompt = "";
  const masterPath = path.join(generatorDir, "prompts", "MASTER.md");
  if (fs.existsSync(masterPath)) {
    masterPrompt = fs.readFileSync(masterPath, "utf-8");
  }

  // Load schemas (as documentation)
  const schemasDir = path.join(generatorDir, "schemas");
  let schemas = "";
  if (fs.existsSync(schemasDir)) {
    const schemaFiles = fs
      .readdirSync(schemasDir)
      .filter((f) => f.endsWith(".schema.ts"));
    schemas = schemaFiles
      .map((f) => {
        const content = fs.readFileSync(path.join(schemasDir, f), "utf-8");
        return `### ${f}\n\`\`\`typescript\n${content}\n\`\`\``;
      })
      .join("\n\n");
  }

  // Load content library (condensed)
  const contentDir = path.join(generatorDir, "content-library");
  let contentLibrary = "";
  if (fs.existsSync(contentDir)) {
    // Only load headlines and services as examples
    const keyFiles = ["headlines.json", "services.json"];
    contentLibrary = keyFiles
      .filter((f) => fs.existsSync(path.join(contentDir, f)))
      .map((f) => {
        const content = fs.readFileSync(path.join(contentDir, f), "utf-8");
        return `### ${f}\n\`\`\`json\n${content}\n\`\`\``;
      })
      .join("\n\n");
  }

  // Load example for reference (HVAC as default)
  const exampleDir = path.join(generatorDir, "examples", "hvac");
  let example = "";
  if (fs.existsSync(exampleDir)) {
    const exampleFile = path.join(exampleDir, "business.json");
    if (fs.existsSync(exampleFile)) {
      example = fs.readFileSync(exampleFile, "utf-8");
    }
  }

  return {
    masterPrompt,
    schemas,
    contentLibrary,
    example,
  };
}

// Load vertical-specific guide
function loadVerticalGuide(vertical) {
  const guidePath = path.join(
    __dirname,
    "..",
    "prompts",
    "verticals",
    `${vertical}.md`
  );

  if (fs.existsSync(guidePath)) {
    return fs.readFileSync(guidePath, "utf-8");
  }

  return "";
}

// Build prompt for JSON input
function buildPromptFromJson(input, context) {
  const vertical = input.vertical || "hvac";
  const verticalGuide = loadVerticalGuide(vertical);

  return `${context.masterPrompt}

## Schemas Reference

${context.schemas}

## Vertical-Specific Guide (${vertical})

${verticalGuide}

## Content Library Reference

${context.contentLibrary}

## Example business.json

\`\`\`json
${context.example}
\`\`\`

---

## Your Task

Generate complete website configuration files for this business:

\`\`\`json
${JSON.stringify(input, null, 2)}
\`\`\`

Output each file as a separate JSON code block with the filename in the format:

\`\`\`json filename="business.json"
{...}
\`\`\`

Generate all 6 required files:
1. business.json
2. services.json
3. areas.json
4. testimonials.json
5. faqs.json
6. posts.json

Make sure all content is realistic, specific to the city/region, and follows the schemas exactly.
`;
}

// Build prompt for natural language input
function buildPromptFromText(text, context) {
  return `${context.masterPrompt}

## Schemas Reference

${context.schemas}

## Content Library Reference

${context.contentLibrary}

## Example business.json

\`\`\`json
${context.example}
\`\`\`

---

## Your Task

A user wants to generate a website. Here's their description:

"${text}"

First, extract the business information from this description:
- Business name
- Phone number (format as (XXX) XXX-XXXX)
- Email (generate a professional one if not provided)
- City and State
- Vertical/Industry (hvac, plumbing, or electrical)
- Any other details mentioned (established year, specialties, etc.)

Then generate complete website configuration files based on this information.

Output each file as a separate JSON code block with the filename in the format:

\`\`\`json filename="business.json"
{...}
\`\`\`

Generate all 6 required files:
1. business.json
2. services.json
3. areas.json
4. testimonials.json
5. faqs.json
6. posts.json

Important:
- If the vertical isn't clear, infer it from the business name or description
- Generate realistic content specific to the city/region mentioned
- Follow the schemas exactly
- Make the content professional and specific, not generic
`;
}

// Call OpenRouter API
async function callOpenRouter(prompt, model) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY not found.\n\n" +
        "Set it in one of these ways:\n" +
        "1. Create .env file: cp .env.example .env && edit .env\n" +
        "2. Export: export OPENROUTER_API_KEY=sk-or-v1-your-key\n" +
        "3. Inline: OPENROUTER_API_KEY=sk-or-v1-your-key node generate.js ...\n\n" +
        "Get your API key at: https://openrouter.ai/keys"
    );
  }

  console.log("  Sending request to OpenRouter...");

  const response = await fetch(CONFIG.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://foundlio.com",
      "X-Title": "Foundlio Generator",
    },
    body: JSON.stringify({
      model: model,
      max_tokens: CONFIG.maxTokens,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    throw new Error("Invalid response from OpenRouter API");
  }

  return data.choices[0].message.content;
}

// Parse generated content into separate files
function parseGeneratedContent(content) {
  const files = {};

  // Match code blocks with filename
  const regex = /```json\s+filename="([^"]+)"\n([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const filename = match[1];
    const jsonContent = match[2].trim();

    try {
      files[filename] = JSON.parse(jsonContent);
      console.log(`  ✓ Parsed ${filename}`);
    } catch (e) {
      console.warn(`  ⚠ Could not parse ${filename}: ${e.message}`);
    }
  }

  // If no files found with filename format, try to find any JSON blocks
  if (Object.keys(files).length === 0) {
    console.log("  Trying alternative parsing...");
    const altRegex = /```json\n([\s\S]*?)```/g;
    let index = 0;
    const fileNames = [
      "business.json",
      "services.json",
      "areas.json",
      "testimonials.json",
      "faqs.json",
      "posts.json",
    ];

    while ((match = altRegex.exec(content)) !== null && index < fileNames.length) {
      const jsonContent = match[1].trim();
      try {
        files[fileNames[index]] = JSON.parse(jsonContent);
        console.log(`  ✓ Parsed as ${fileNames[index]}`);
        index++;
      } catch (e) {
        // Skip invalid JSON blocks
      }
    }
  }

  return files;
}

// Write output files
function writeOutputFiles(files, outputDir) {
  // Create output directory if needed
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const written = [];

  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    written.push(filePath);
  }

  return written;
}

// Main function
async function main() {
  const args = parseArgs();

  console.log("\n🏗️  Foundlio Site Generator");
  console.log("===========================\n");

  try {
    // Normalize input
    console.log("📥 Processing input...");
    const normalized = normalizeInput(args.input);
    console.log(`  Input type: ${normalized.type}`);

    // Load context
    console.log("\n📚 Loading generator context...");
    const context = loadContext();
    console.log("  ✓ Master prompt loaded");
    console.log("  ✓ Schemas loaded");
    console.log("  ✓ Content library loaded");

    // Build prompt based on input type
    let prompt;
    if (normalized.type === "json") {
      console.log(`\n📋 Business: ${normalized.data.name || "Unknown"}`);
      console.log(`  Vertical: ${normalized.data.vertical || "auto-detect"}`);
      console.log(`  Location: ${normalized.data.city || "Unknown"}, ${normalized.data.state || "Unknown"}`);
      prompt = buildPromptFromJson(normalized.data, context);
    } else {
      console.log(`\n📝 Processing natural language input...`);
      console.log(`  "${normalized.data.substring(0, 100)}${normalized.data.length > 100 ? "..." : ""}"`);
      prompt = buildPromptFromText(normalized.data, context);
    }

    if (args.verbose) {
      console.log("\n--- PROMPT ---");
      console.log(prompt.substring(0, 2000) + "...[truncated]");
      console.log("--- END PROMPT ---\n");
    }

    // Call API
    console.log(`\n🤖 Calling OpenRouter API (${args.model})...`);
    console.log("  This may take 30-60 seconds...\n");

    const response = await callOpenRouter(prompt, args.model);

    if (args.verbose) {
      console.log("\n--- RESPONSE ---");
      console.log(response.substring(0, 2000) + "...[truncated]");
      console.log("--- END RESPONSE ---\n");
    }

    // Parse response
    console.log("📄 Parsing generated content...");
    const files = parseGeneratedContent(response);
    const fileCount = Object.keys(files).length;

    if (fileCount === 0) {
      throw new Error(
        "No valid JSON files could be parsed from the response.\n" +
          "Try running with --verbose to see the raw response."
      );
    }

    console.log(`  Found ${fileCount} files\n`);

    // Write files
    const outputPath = path.resolve(args.output);
    console.log(`💾 Writing files to ${outputPath}...`);
    const written = writeOutputFiles(files, outputPath);
    written.forEach((f) => console.log(`  ✓ ${path.basename(f)}`));

    // Summary
    console.log("\n✅ Generation complete!");
    console.log(`\n📁 Output directory: ${outputPath}`);
    console.log(`📊 Files generated: ${written.length}/6`);

    if (written.length < 6) {
      console.log("\n⚠️  Some files were not generated. You may need to:");
      console.log("   - Run again with more specific input");
      console.log("   - Check the output and manually complete missing files");
    }

    console.log("\n📋 Next steps:");
    console.log(`   1. Validate: node scripts/validate.js ${args.output}`);
    console.log(`   2. Copy to template: cp ${args.output}/*.json ../data/`);
    console.log("   3. Build: cd .. && npm run build");
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    if (args.verbose && error.stack) {
      console.error("\nStack trace:", error.stack);
    }
    process.exit(1);
  }
}

// Run
main();
