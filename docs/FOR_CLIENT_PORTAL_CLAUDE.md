# Context for Client Portal Development

> **Copy this to client-portal project** as reference for Claude instances working there.

---

## hvac-01 Website Template Summary

There's a Next.js website template (`hvac-01`) that generates complete websites for local service businesses from a single JSON config file.

### The JSON-Driven Architecture

**Input** (6 fields):
```json
{
  "name": "Valley Plumbing Pros",
  "phone": "(480) 555-7890",
  "email": "service@valleyplumbingpros.com",
  "city": "Mesa",
  "state": "AZ",
  "vertical": "plumbing"
}
```

**Output** (400+ line `site.config.json`):
- Complete business profile
- Theme/colors
- 6-8 services with full copy
- 5+ testimonials
- 3-5 service areas
- 8-10 FAQs
- 3 blog posts
- SEO settings
- Lead capture config

**AI generates this JSON → Next.js renders the entire site from it.**

---

## Integration Opportunities

### 1. Store Site Configs in Portal DB

```prisma
model SiteConfig {
  id        String   @id @default(cuid())
  websiteId String   @unique
  website   Website  @relation(fields: [websiteId], references: [id])
  config    Json     // The entire site.config.json
  version   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**New endpoints:**
```
GET  /api/sites/:websiteId/config     - Fetch config
PUT  /api/sites/:websiteId/config     - Update config
POST /api/sites/generate-config       - AI generates new config
```

### 2. Enhanced Lead Capture

Website forms submit to Portal with more context:

```typescript
POST /api/leads/submit
{
  websiteId: string;
  source: 'contact-form' | 'callback-widget' | 'sticky-cta' | 'multi-step';
  formData: {
    name: string;
    phone: string;
    email?: string;
    service?: string;
    urgency?: 'routine' | 'soon' | 'emergency';
    message?: string;
  };
  metadata: {
    page: string;
    variation?: string;  // A/B test ID
    timestamp: string;
  };
}
```

### 3. AI Config Generation Endpoint

```typescript
// POST /api/sites/generate-config
import Anthropic from '@anthropic-ai/sdk';

async function generateSiteConfig(input: MinimalInput): Promise<SiteConfig> {
  const client = new Anthropic();

  const prompt = `Generate a complete site.config.json for:
    Business: ${input.name}
    Phone: ${input.phone}
    City: ${input.city}, ${input.state}
    Vertical: ${input.vertical}

    Follow the SiteConfig schema exactly...`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text);
}
```

---

## Key Files in hvac-01

| File | What It Contains |
|------|------------------|
| `lib/siteConfig.schema.ts` | Full TypeScript types for SiteConfig |
| `lib/siteConfig.ts` | Config loader with helper functions |
| `data/site.config.json` | Complete example (400+ lines) |
| `prompts/generate-site-config.md` | AI prompt template |
| `docs/CLIENT_PORTAL_INTEGRATION.md` | Full integration guide |

---

## Schema Overview

```typescript
interface SiteConfig {
  version: string;

  business: {
    name: string;
    phone: string;
    email: string;
    address: { street, city, state, zip };
    hours: { weekdays, saturday, sunday };
    established: number;
    rating: number;
    reviewCount: number;
    licenses: string[];
    certifications: string[];
    emergencyService: boolean;
    financing: boolean;
    responseTime: string;
    warrantyYears: number;
  };

  theme: {
    colors: { primary, background, text, muted };
    style: 'minimal' | 'bold' | 'classic' | 'modern';
    borderRadius: 'none' | 'sm' | 'md' | 'lg';
  };

  pages: {
    home: PageConfig;
    services: PageConfig;
    about: PageConfig;
    contact: PageConfig;
    areas?: PageConfig;
    blog?: PageConfig;
  };

  content: {
    headlines: { hero: HeroProps; variations?: HeroProps[] };
    services: ServiceConfig[];
    testimonials: TestimonialConfig[];
    areas: AreaConfig[];
    faqs: FAQConfig[];
    posts?: BlogPostConfig[];
  };

  settings: {
    leadCapture: LeadCaptureConfig;
    seo: SEOConfig;
    analytics?: AnalyticsConfig;
  };
}
```

---

## Quick Wins

1. **Today:** Add lead submission endpoint that accepts `websiteId` and `source`
2. **Soon:** Add `SiteConfig` model to store website configs
3. **Later:** Add AI generation endpoint using the schema

---

## Mapping to Existing Portal Models

| SiteConfig | Portal Equivalent |
|------------|-------------------|
| `business` | `Website.content` or Payload `site-settings` |
| `content.services` | Could sync to Payload `services` collection |
| `settings` | New field on `Website` model |

The `SiteConfig` can either:
- **Replace** the current `Website.content` JSON blob
- **Complement** it as a separate model linked to Website

---

*For full details, see: `hvac-01/docs/CLIENT_PORTAL_INTEGRATION.md`*
