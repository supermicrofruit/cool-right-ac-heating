# Input Format Specification

This document defines the input format for the Foundlio site generator.

## Required Fields

These fields MUST be provided:

```json
{
  "name": "Business Name",
  "phone": "(555) 555-5555",
  "email": "info@business.com",
  "city": "Phoenix",
  "state": "AZ",
  "vertical": "hvac"
}
```

### Field Definitions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | string | Business display name | "Desert Aire Comfort" |
| `phone` | string | Formatted phone number | "(602) 555-2665" |
| `email` | string | Primary contact email | "info@desertairecomfort.com" |
| `city` | string | Primary city served | "Phoenix" |
| `state` | string | State abbreviation | "AZ" |
| `vertical` | enum | Business type | "hvac" |

### Vertical Options

- `hvac` - Heating, ventilation, air conditioning
- `plumbing` - Plumbing services
- `electrical` - Electrical services
- `roofing` - Roofing services
- `landscaping` - Landscaping services

## Optional Fields

These fields can be provided to override AI generation:

```json
{
  "name": "Desert Aire Comfort",
  "phone": "(602) 555-2665",
  "email": "info@desertairecomfort.com",
  "city": "Phoenix",
  "state": "AZ",
  "vertical": "hvac",

  // Optional overrides
  "established": 2010,
  "address": "4821 N 24th Street",
  "zip": "85016",
  "tagline": "Your Comfort, Our Priority",
  "style": "bold",
  "accentColor": "#ea580c",
  "licenses": ["ROC #298847", "EPA 608 Certified"],
  "certifications": ["Carrier Factory Authorized Dealer"],
  "rating": 4.9,
  "reviewCount": 847
}
```

### Optional Field Definitions

| Field | Type | Description | Default Behavior |
|-------|------|-------------|------------------|
| `established` | number | Year founded | AI generates (5-25 years ago) |
| `address` | string | Street address | AI generates realistic address |
| `zip` | string | ZIP code | AI generates for city |
| `tagline` | string | Business slogan | AI generates based on vertical |
| `style` | enum | Design preference | "bold" for emergency services, "classic" for others |
| `accentColor` | string | Brand color (hex) | From style/vertical defaults |
| `licenses` | string[] | Professional licenses | AI generates state-appropriate |
| `certifications` | string[] | Industry certs | AI generates vertical-appropriate |
| `rating` | number | Google rating (0-5) | Random 4.7-4.9 |
| `reviewCount` | number | Total reviews | Random 200-1000 |

### Style Options

| Style | Description | Best For |
|-------|-------------|----------|
| `minimal` | Clean, lots of white space | Premium services |
| `bold` | Strong colors, high contrast | Emergency services, HVAC |
| `classic` | Traditional, trustworthy | Established businesses |
| `modern` | Contemporary, gradients | Tech-forward services |

## Input Examples

### Minimal Input (AI fills everything)

```json
{
  "name": "Cool Breeze HVAC",
  "phone": "(602) 555-1234",
  "email": "service@coolbreezehvac.com",
  "city": "Phoenix",
  "state": "AZ",
  "vertical": "hvac"
}
```

### Partial Override

```json
{
  "name": "Valley Plumbing Pros",
  "phone": "(480) 555-7890",
  "email": "service@valleyplumbingpros.com",
  "city": "Mesa",
  "state": "AZ",
  "vertical": "plumbing",
  "established": 2015,
  "tagline": "Your Local Plumbing Experts",
  "style": "classic"
}
```

### Full Override

```json
{
  "name": "Spark Electric Co",
  "phone": "(480) 555-9999",
  "email": "info@sparkelectric.com",
  "city": "Scottsdale",
  "state": "AZ",
  "vertical": "electrical",
  "established": 2008,
  "address": "7890 E Shea Blvd",
  "zip": "85260",
  "tagline": "Powering Scottsdale Homes Since 2008",
  "style": "modern",
  "accentColor": "#7c3aed",
  "licenses": ["ROC #312456"],
  "certifications": ["Tesla Certified Installer", "Generac Authorized Dealer"],
  "rating": 4.8,
  "reviewCount": 423
}
```

## Validation Rules

### Phone Number
- Must be formatted: (XXX) XXX-XXXX
- Area code should match region when possible

### Email
- Must be valid email format
- Should match business domain if website provided

### City/State
- City must be a real city
- State must be valid 2-letter abbreviation
- City must be in the specified state

### Established Year
- Cannot be in the future
- Should be reasonable (not 1800)
- Typically 5-50 years ago

### Rating
- Must be 0-5
- Typically 4.5-5.0 for displayed reviews

### Accent Color
- Must be valid hex color
- Should have sufficient contrast with white

## Usage with Claude Code

```bash
# Using minimal input
claude "Generate a website for this business:" --input '{
  "name": "Cool Breeze HVAC",
  "phone": "(602) 555-1234",
  "email": "service@coolbreezehvac.com",
  "city": "Phoenix",
  "state": "AZ",
  "vertical": "hvac"
}'

# Or reference a file
claude "Generate website files using foundlio-generator for the business described in input.json"
```

## Usage with OpenRouter API

```javascript
const input = {
  name: "Valley Plumbing Pros",
  phone: "(480) 555-7890",
  email: "service@valleyplumbingpros.com",
  city: "Mesa",
  state: "AZ",
  vertical: "plumbing"
};

// Pass to generator script
await generate(input);
```
