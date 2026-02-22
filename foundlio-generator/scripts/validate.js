#!/usr/bin/env node

/**
 * Foundlio Configuration Validator
 *
 * Validates generated JSON files against expected schemas.
 *
 * Usage:
 *   node validate.js ./output
 *   node validate.js ../data
 */

const fs = require("fs");
const path = require("path");

// Expected files and their required fields
const EXPECTED_FILES = {
  "business.json": {
    required: [
      "name",
      "phone",
      "email",
      "vertical",
      "address",
      "hours",
      "established",
      "rating",
      "reviewCount",
    ],
    nested: {
      address: ["street", "city", "state", "zip"],
      hours: ["weekdays", "saturday", "sunday"],
      theme: ["preset", "logo"],
      features: ["showBlog", "emergencyBadge"],
      seo: ["titleTemplate", "defaultDescription"],
    },
  },
  "services.json": {
    required: ["services", "categories"],
    arrayField: "services",
    arrayItemRequired: [
      "slug",
      "name",
      "shortDescription",
      "longDescription",
      "features",
      "benefits",
      "icon",
      "category",
    ],
    minArrayLength: 5,
    maxArrayLength: 10,
  },
  "areas.json": {
    required: ["areas", "serviceRadius", "primaryServiceArea"],
    arrayField: "areas",
    arrayItemRequired: [
      "slug",
      "name",
      "state",
      "description",
      "neighborhoods",
      "coordinates",
    ],
    minArrayLength: 3,
    maxArrayLength: 15,
  },
  "testimonials.json": {
    required: ["testimonials", "summary"],
    arrayField: "testimonials",
    arrayItemRequired: ["id", "name", "location", "rating", "text", "service", "date"],
    minArrayLength: 5,
    maxArrayLength: 10,
    nested: {
      summary: ["averageRating", "totalReviews", "platforms"],
    },
  },
  "faqs.json": {
    required: ["categories"],
    arrayField: "categories",
    arrayItemRequired: ["name", "slug", "faqs"],
    minArrayLength: 3,
    maxArrayLength: 8,
  },
  "posts.json": {
    required: ["posts", "categories"],
    arrayField: "posts",
    arrayItemRequired: [
      "slug",
      "title",
      "excerpt",
      "content",
      "date",
      "category",
      "metaTitle",
      "metaDescription",
    ],
    minArrayLength: 3,
    maxArrayLength: 10,
  },
};

// Validation results
class ValidationResult {
  constructor(filename) {
    this.filename = filename;
    this.errors = [];
    this.warnings = [];
    this.passed = true;
  }

  addError(message) {
    this.errors.push(message);
    this.passed = false;
  }

  addWarning(message) {
    this.warnings.push(message);
  }
}

// Check if field exists and is not empty
function checkField(obj, field, result, prefix = "") {
  const fullPath = prefix ? `${prefix}.${field}` : field;

  if (!(field in obj)) {
    result.addError(`Missing required field: ${fullPath}`);
    return false;
  }

  const value = obj[field];

  if (value === null || value === undefined) {
    result.addError(`Field is null/undefined: ${fullPath}`);
    return false;
  }

  if (typeof value === "string" && value.trim() === "") {
    result.addError(`Field is empty string: ${fullPath}`);
    return false;
  }

  return true;
}

// Validate a single file
function validateFile(filePath, spec) {
  const filename = path.basename(filePath);
  const result = new ValidationResult(filename);

  // Check file exists
  if (!fs.existsSync(filePath)) {
    result.addError(`File not found: ${filePath}`);
    return result;
  }

  // Parse JSON
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    result.addError(`Invalid JSON: ${e.message}`);
    return result;
  }

  // Check required top-level fields
  for (const field of spec.required) {
    checkField(data, field, result);
  }

  // Check nested required fields
  if (spec.nested) {
    for (const [parent, fields] of Object.entries(spec.nested)) {
      if (data[parent] && typeof data[parent] === "object") {
        for (const field of fields) {
          checkField(data[parent], field, result, parent);
        }
      }
    }
  }

  // Check array fields
  if (spec.arrayField && data[spec.arrayField]) {
    const arr = data[spec.arrayField];

    if (!Array.isArray(arr)) {
      result.addError(`Field '${spec.arrayField}' should be an array`);
    } else {
      // Check array length
      if (spec.minArrayLength && arr.length < spec.minArrayLength) {
        result.addWarning(
          `Array '${spec.arrayField}' has ${arr.length} items, recommended minimum is ${spec.minArrayLength}`
        );
      }
      if (spec.maxArrayLength && arr.length > spec.maxArrayLength) {
        result.addWarning(
          `Array '${spec.arrayField}' has ${arr.length} items, recommended maximum is ${spec.maxArrayLength}`
        );
      }

      // Check array item fields
      if (spec.arrayItemRequired) {
        arr.forEach((item, index) => {
          for (const field of spec.arrayItemRequired) {
            checkField(item, field, result, `${spec.arrayField}[${index}]`);
          }
        });
      }
    }
  }

  // Content-specific validations
  if (filename === "business.json" && data) {
    // Rating should be reasonable
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      result.addError(`Rating should be between 1-5, got ${data.rating}`);
    }
    if (data.rating && data.rating < 4) {
      result.addWarning(`Rating ${data.rating} is low for display`);
    }

    // Phone format
    if (data.phone && !/^\(\d{3}\)\s?\d{3}-\d{4}$/.test(data.phone)) {
      result.addWarning(`Phone format may be incorrect: ${data.phone}`);
    }

    // Established year
    const currentYear = new Date().getFullYear();
    if (data.established) {
      if (data.established > currentYear) {
        result.addError(`Established year is in the future: ${data.established}`);
      }
      if (data.established < 1900) {
        result.addWarning(`Established year seems too old: ${data.established}`);
      }
    }
  }

  if (filename === "services.json" && data.services) {
    // Check for duplicate slugs
    const slugs = data.services.map((s) => s.slug);
    const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (duplicates.length > 0) {
      result.addError(`Duplicate service slugs: ${duplicates.join(", ")}`);
    }

    // Check for emergency services
    const hasEmergency = data.services.some((s) => s.emergency);
    if (!hasEmergency) {
      result.addWarning("No emergency services defined");
    }
  }

  if (filename === "areas.json" && data.areas) {
    // Check for duplicate slugs
    const slugs = data.areas.map((a) => a.slug);
    const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (duplicates.length > 0) {
      result.addError(`Duplicate area slugs: ${duplicates.join(", ")}`);
    }

    // Check coordinates
    data.areas.forEach((area, i) => {
      if (area.coordinates) {
        if (
          area.coordinates.lat < -90 ||
          area.coordinates.lat > 90 ||
          area.coordinates.lng < -180 ||
          area.coordinates.lng > 180
        ) {
          result.addError(`Invalid coordinates for area ${area.name}`);
        }
      }
    });
  }

  if (filename === "testimonials.json" && data.testimonials) {
    // Check ratings are valid
    data.testimonials.forEach((t, i) => {
      if (t.rating && (t.rating < 1 || t.rating > 5)) {
        result.addError(`Testimonial ${i} has invalid rating: ${t.rating}`);
      }
    });

    // Check summary matches
    if (data.summary) {
      const actualCount = data.testimonials.length;
      if (data.summary.totalReviews && data.summary.totalReviews < actualCount) {
        result.addWarning(
          `Summary totalReviews (${data.summary.totalReviews}) is less than testimonial count (${actualCount})`
        );
      }
    }
  }

  if (filename === "posts.json" && data.posts) {
    // Check for duplicate slugs
    const slugs = data.posts.map((p) => p.slug);
    const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (duplicates.length > 0) {
      result.addError(`Duplicate post slugs: ${duplicates.join(", ")}`);
    }

    // Check meta description length
    data.posts.forEach((post) => {
      if (post.metaDescription && post.metaDescription.length > 160) {
        result.addWarning(
          `Post "${post.slug}" meta description is ${post.metaDescription.length} chars (max 160)`
        );
      }
      if (post.metaTitle && post.metaTitle.length > 60) {
        result.addWarning(
          `Post "${post.slug}" meta title is ${post.metaTitle.length} chars (max 60)`
        );
      }
    });
  }

  return result;
}

// Main validation function
function validate(directory) {
  console.log("Foundlio Configuration Validator");
  console.log("=================================\n");
  console.log(`Validating: ${path.resolve(directory)}\n`);

  const results = [];
  let hasErrors = false;

  for (const [filename, spec] of Object.entries(EXPECTED_FILES)) {
    const filePath = path.join(directory, filename);
    const result = validateFile(filePath, spec);
    results.push(result);

    if (!result.passed) {
      hasErrors = true;
    }
  }

  // Print results
  for (const result of results) {
    const status = result.passed ? "✓" : "✗";
    const color = result.passed ? "\x1b[32m" : "\x1b[31m";
    console.log(`${color}${status}\x1b[0m ${result.filename}`);

    for (const error of result.errors) {
      console.log(`  \x1b[31m✗ ERROR:\x1b[0m ${error}`);
    }

    for (const warning of result.warnings) {
      console.log(`  \x1b[33m⚠ WARNING:\x1b[0m ${warning}`);
    }
  }

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  console.log("\n---------------------------------");
  console.log(`Files: ${passed}/${total} passed`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`Warnings: ${totalWarnings}`);

  if (hasErrors) {
    console.log("\n\x1b[31mValidation FAILED\x1b[0m");
    process.exit(1);
  } else {
    console.log("\n\x1b[32mValidation PASSED\x1b[0m");
    process.exit(0);
  }
}

// Parse arguments
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log(`
Foundlio Configuration Validator

Usage:
  node validate.js <directory>

Arguments:
  directory    Directory containing JSON configuration files

Examples:
  node validate.js ./output
  node validate.js ../data
`);
  process.exit(0);
}

validate(args[0]);
