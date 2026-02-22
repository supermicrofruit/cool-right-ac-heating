# AI Guide: Working with Foundlio Site Configs

> **For:** AI assistants (Claude, GPT, etc.) working on Foundlio websites
> **Version:** 2.0
> **Last Updated:** January 2026

---

## Quick Start

Foundlio websites are **100% JSON-driven**. One config file = one complete website.

**Main file:** `data/site.config.json`

**To customize a website:**
1. Read the current config
2. Modify the relevant section
3. Save - website automatically reflects changes

---

## Config Structure at a Glance

```
site.config.json
├── business     → WHO (company info)
├── theme        → HOW IT LOOKS (colors, fonts, style)
├── pages        → WHAT PAGES EXIST (and their sections)
├── content      → WHAT IT SAYS (services, testimonials, FAQs)
├── copy         → UI TEXT (buttons, labels, messages)
└── settings     → BEHAVIOR (lead capture, SEO, analytics)
```

---

## Common Tasks

### Task: Change Business Info

**Section:** `business`

```json
{
  "business": {
    "name": "New Company Name",
    "phone": "(555) 123-4567",
    "phoneRaw": "+15551234567",
    "email": "info@newcompany.com",
    "vertical": "plumbing",
    "address": {
      "street": "123 Main St",
      "city": "Austin",
      "state": "TX",
      "zip": "78701"
    },
    "established": 2015,
    "rating": 4.8,
    "reviewCount": 523
  }
}
```

**Important fields:**
- `phoneRaw` must be E.164 format (+1XXXXXXXXXX)
- `vertical` must be: `hvac`, `plumbing`, `electrical`, `roofing`, or `landscaping`
- `rating` should be 4.5-5.0 (realistic)
- `reviewCount` should match what's on Google

---

### Task: Change Theme/Colors

**Section:** `theme`

```json
{
  "theme": {
    "colors": {
      "primary": "#2563eb",
      "secondary": "#10b981",
      "background": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "style": "minimal",
    "borderRadius": "lg"
  }
}
```

**Or use a preset:** (see `data/themes/` folder)
```json
{
  "theme": {
    "$preset": "professional-blue"
  }
}
```

**Style options:** `minimal`, `bold`, `classic`, `modern`
**Border radius:** `none`, `sm`, `md`, `lg`, `full`

---

### Task: Add/Remove Page Sections

**Section:** `pages.{pageName}.sections`

Each page has a `sections` array. Order matters - sections render top to bottom.

**To hide a section:**
```json
{ "type": "testimonials-slider", "enabled": false }
```

**To add a section:**
```json
{
  "type": "cta-banner",
  "enabled": true,
  "props": {
    "variant": "emergency",
    "headline": "Need Help Now?",
    "primaryCta": { "text": "Call Now", "link": "tel:+15551234567" }
  }
}
```

**Common section types:**
| Type | Use For |
|------|---------|
| `hero` | Page header with headline |
| `services-grid` | Service cards |
| `testimonials-slider` | Customer reviews carousel |
| `faq-accordion` | Collapsible FAQs |
| `cta-banner` | Call-to-action strip |
| `trust-signals` | Badges, stats, certifications |
| `process-steps` | "How it works" steps |
| `contact-form` | Lead capture form |

---

### Task: Add/Edit Services

**Section:** `content.services`

```json
{
  "slug": "drain-cleaning",
  "name": "Drain Cleaning",
  "shortDescription": "Professional drain cleaning for clogs and slow drains.",
  "longDescription": "Full description here...",
  "icon": "Droplets",
  "category": "drains",
  "featured": true,
  "emergency": true,
  "order": 1,
  "features": [
    "Same-day service",
    "Video inspection included",
    "All drain types"
  ],
  "pricing": {
    "type": "starting",
    "amount": 99,
    "note": "Most drains cleared same day"
  },
  "meta": {
    "title": "Drain Cleaning Austin | Same-Day Service",
    "description": "Professional drain cleaning in Austin, TX..."
  }
}
```

**Key flags:**
- `featured: true` → Shows in homepage grid
- `emergency: true` → Gets "24/7" badge
- `order: 1` → Sort position (lower = first)

**Pricing types:**
- `fixed` → Exact price ($99)
- `starting` → "Starting at $99"
- `range` → "$99 - $299"
- `quote` → "Call for quote"

---

### Task: Add/Edit Testimonials

**Section:** `content.testimonials`

```json
{
  "id": "t1",
  "name": "Sarah M.",
  "location": "Austin, TX",
  "rating": 5,
  "text": "Full testimonial text here...",
  "shortText": "Short version for cards.",
  "service": "Drain Cleaning",
  "featured": true,
  "verified": true
}
```

**Tips:**
- Use first name + last initial format
- Include city for local SEO
- `shortText` is used in grid views
- `featured: true` shows on homepage

---

### Task: Add Service Areas

**Section:** `content.areas`

```json
{
  "slug": "austin-tx",
  "name": "Austin",
  "state": "TX",
  "description": "Serving Austin and surrounding areas...",
  "neighborhoods": ["Downtown", "South Austin", "East Austin", "North Loop"],
  "localChallenges": "Austin's limestone soil causes unique plumbing challenges...",
  "featured": true,
  "meta": {
    "title": "Plumber Austin TX | 24/7 Service",
    "description": "Professional plumbing services in Austin, TX..."
  }
}
```

---

### Task: Change UI Text/Copy

**Section:** `copy`

All interface text lives here. Organized by location:

```json
{
  "copy": {
    "navigation": {
      "home": "Home",
      "services": "Services",
      "callNow": "Call Now"
    },
    "buttons": {
      "getFreeEstimate": "Get Free Estimate",
      "submitForm": "Send Request"
    },
    "forms": {
      "namePlaceholder": "Your name",
      "messagePlaceholder": "Describe your plumbing issue...",
      "successMessage": "Thanks! We'll call you within 30 minutes."
    },
    "sections": {
      "servicesTitle": "Our Plumbing Services",
      "testimonialsTitle": "What Austin Says About Us"
    }
  }
}
```

**Variables available in copy:**
```
{{businessName}}  {{phone}}  {{city}}  {{state}}
{{rating}}  {{reviewCount}}  {{yearsInBusiness}}
{{responseTime}}  {{warrantyYears}}  {{year}}
```

---

### Task: Configure Lead Capture

**Section:** `settings.leadCapture`

```json
{
  "leadCapture": {
    "form": "multi-step",
    "callbackWidget": {
      "enabled": true,
      "position": "bottom-right",
      "delay": 30,
      "callbackTime": 15
    },
    "stickyCallButton": {
      "enabled": true,
      "mobileOnly": true
    },
    "urgencyIndicator": {
      "enabled": true,
      "variant": "seasonal"
    },
    "requiredFields": ["name", "phone", "service"]
  }
}
```

**Form types:** `simple`, `multi-step`, `with-photo`
**Urgency variants:** `countdown`, `demand`, `seasonal`, `limited`

---

## Display Modes for Content

When configuring sections, use `display` to control what shows:

| Mode | Description | Example |
|------|-------------|---------|
| `all` | Show everything | All services |
| `featured` | Only `featured: true` items | Homepage highlights |
| `category` | Filter by category | Only "cooling" services |
| `manual` | Specific IDs | Exact items you choose |
| `recent` | Newest first (for posts) | Latest 3 blog posts |
| `random` | Random selection | Rotating testimonials |

**Example:**
```json
{
  "type": "services-grid",
  "props": {
    "display": "featured",
    "limit": 6,
    "columns": 3
  }
}
```

---

## Section Props Quick Reference

### Hero
```json
{
  "variant": "standard",
  "headline": "...",
  "subheadline": "...",
  "primaryCta": { "text": "...", "link": "..." },
  "secondaryCta": { "text": "...", "link": "...", "style": "outline" },
  "showTrustBar": true,
  "showRatingBadge": true,
  "contentAlign": "left",
  "minHeight": "lg"
}
```

### Services Grid
```json
{
  "variant": "cards",
  "display": "featured",
  "limit": 6,
  "columns": 3,
  "showTitle": true,
  "showDescription": true,
  "showIcon": true,
  "showEmergencyBadge": true,
  "showLearnMore": true,
  "showViewAll": true
}
```

### Testimonials
```json
{
  "variant": "cards",
  "display": "featured",
  "limit": 5,
  "showRating": true,
  "showService": true,
  "showLocation": true,
  "showVerifiedBadge": true,
  "autoplay": true
}
```

### FAQ Accordion
```json
{
  "display": "featured",
  "limit": 5,
  "allowMultipleOpen": false,
  "defaultOpenFirst": true,
  "addSchemaMarkup": true
}
```

### CTA Banner
```json
{
  "variant": "standard",
  "headline": "...",
  "subheadline": "...",
  "primaryCta": { "text": "...", "link": "..." },
  "showPhone": true
}
```

---

## Validation Checklist

Before saving config changes, verify:

- [ ] `phoneRaw` is valid E.164 format
- [ ] `vertical` is a valid option
- [ ] All `slug` values are URL-safe (lowercase, hyphens, no spaces)
- [ ] `meta.description` is under 160 characters
- [ ] `featured` flags are set appropriately
- [ ] `order` values don't have duplicates
- [ ] All required fields have values

---

## File Locations

| File | Purpose |
|------|---------|
| `data/site.config.json` | Main config (edit this) |
| `data/themes/*.json` | Theme presets |
| `lib/siteConfig.schema.ts` | TypeScript types |
| `lib/siteConfig.ts` | Config loader |
| `lib/sectionRenderer.ts` | Section helpers |

---

## Generating New Configs

To generate a complete config for a new business:

**Input needed:**
```json
{
  "name": "Business Name",
  "phone": "(555) 123-4567",
  "email": "info@business.com",
  "city": "Austin",
  "state": "TX",
  "vertical": "plumbing"
}
```

**Use the prompt at:** `prompts/generate-site-config.md`

This will generate a complete 800+ line config with:
- Full business profile
- Theme settings
- 6-8 services with copy
- 5+ testimonials
- 3-5 service areas
- 8-10 FAQs
- All UI copy
- SEO settings

---

## Common Patterns

### Hide section on mobile
```json
{
  "type": "stats",
  "enabled": true,
  "showOn": { "mobile": false, "desktop": true }
}
```

### Show only emergency services
```json
{
  "display": "category",
  "categories": ["emergency"]
}
```

### Custom section styling
```json
{
  "type": "cta-banner",
  "style": {
    "backgroundColor": "#1e3a5f",
    "padding": "xl"
  }
}
```

### Link FAQ to service page
```json
{
  "question": "How long does drain cleaning take?",
  "answer": "...",
  "relatedService": "drain-cleaning"
}
```

---

## Troubleshooting

**Section not showing?**
- Check `enabled: true`
- Check `display` mode has matching content
- Check `limit` isn't 0

**Content not appearing?**
- Check `featured: true` if using featured display
- Check category matches if filtering
- Check item exists in content array

**Styling wrong?**
- Check theme colors are valid hex
- Check variant is valid option
- Check style preset exists

---

*This guide is for AI assistants. For human developers, see CLAUDE.md*
