# Foundlio - Full Website Template System

**For:** Claude Code instances
**Last Updated:** January 30, 2026
**Project:** hvac-01 (base template for local service business websites)

---

## 🎯 What This Project Is

**Purpose:** A production-ready Next.js website template for local service businesses that can be cloned and customized via AI for different clients.

**Business Model (Foundlio):**
- $200-300 setup + $50/month per client
- Target: Plumbers, HVAC, roofers, electricians, landscapers
- Two build types:
  1. **Promo Build** (15-30 min) - Quick demo to show potential client
  2. **Full Build** (2-4 hrs) - After purchase, add SEO content, blog, local pages

**This Project vs react-templates:**
| | react-templates | hvac-01 (this) |
|---|---|---|
| Purpose | Block library for landing pages | Full multi-page website |
| Output | Single-page landing pages | Complete website with routing |
| Use Case | Quick sales demo | Production client site |

---

## 📁 Project Structure

```
hvac-01/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── services/
│   │   ├── page.tsx              # Services index
│   │   └── [slug]/page.tsx       # Dynamic service pages
│   ├── areas/
│   │   ├── page.tsx              # Service areas index
│   │   └── [slug]/page.tsx       # Dynamic area pages
│   ├── blog/
│   │   ├── page.tsx              # Blog index
│   │   └── [slug]/page.tsx       # Blog post pages
│   ├── works/                    # Portfolio/gallery
│   └── showcase/                 # Lead capture component gallery
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Site header with nav
│   │   └── Footer.tsx            # Site footer
│   ├── sections/                 # Page sections
│   │   ├── HeroSection.tsx       # Homepage hero
│   │   ├── ServiceGrid.tsx       # Services display
│   │   ├── TestimonialsSlider.tsx
│   │   ├── CTABanner.tsx
│   │   ├── FAQAccordion.tsx
│   │   ├── TrustSignals.tsx
│   │   └── ...
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Container.tsx
│   │   └── ...
│   └── lead-capture/             # A/B testable lead capture components
│       ├── forms/
│       │   ├── SimpleForm.tsx
│       │   ├── MultiStepForm.tsx
│       │   └── PhotoUploadForm.tsx
│       ├── widgets/
│       │   ├── CallbackWidget.tsx
│       │   └── StickyCallButton.tsx
│       ├── trust/
│       │   ├── AvailabilityBadge.tsx
│       │   ├── UrgencyIndicator.tsx
│       │   └── ReviewsNearForm.tsx
│       └── index.ts
│
├── content/                      # Copy/content system
│   ├── copy/
│   │   └── base.json             # Universal copy (CTAs, forms, trust)
│   └── verticals/                # Industry-specific content
│       ├── hvac/
│       │   ├── headlines.json    # 6 hero variations
│       │   ├── services.json     # 8 services with full copy
│       │   └── faqs.json         # FAQs by category
│       ├── plumbing/
│       │   ├── headlines.json
│       │   ├── services.json
│       │   └── faqs.json
│       └── electrical/
│           ├── headlines.json
│           ├── services.json
│           └── faqs.json
│
├── data/                         # Business data (client-editable)
│   ├── business.json             # Core business info
│   ├── services.json             # Service definitions
│   ├── areas.json                # Service areas
│   ├── testimonials.json         # Reviews
│   ├── faqs.json                 # FAQ content
│   └── posts.json                # Blog posts
│
├── lib/                          # Utilities
│   ├── copyEngine.ts             # Variable replacement engine
│   ├── contentLoader.ts          # Load content by vertical
│   ├── schema.ts                 # JSON-LD schema generators
│   └── utils.ts                  # General utilities
│
├── public/
│   └── images/                   # Static images
│       ├── logo.png
│       └── hero-technician.png
│
├── ai-manifest.json              # Instructions for AI builds
├── tailwind.config.ts            # Tailwind configuration
└── package.json
```

---

## 🏗️ Architecture

### Content-Driven Design

**Single source of truth:** `data/business.json`
```json
{
  "name": "Desert Aire Comfort",
  "vertical": "hvac",
  "phone": "(602) 555-2665",
  "city": "Phoenix",
  "rating": 4.9,
  "reviewCount": 847,
  "established": 2010,
  "responseTime": "2 hours",
  "warrantyYears": 2
}
```

### Copy System with Variables

**Template content** in `/content/verticals/{vertical}/`:
```json
{
  "headline": "Fast AC Repair in {{city}}",
  "description": "{{businessName}} responds fast with {{warrantyYears}}-year warranty."
}
```

**Variable replacement** via `lib/copyEngine.ts`:
```typescript
import { getCopy, processContent } from '@/lib/copyEngine'

// Single string
getCopy("Call {{businessName}} at {{phone}}")
// → "Call Desert Aire Comfort at (602) 555-2665"

// Entire object (deep replacement)
processContent(serviceData)
// → All {{variables}} replaced throughout
```

### Available Variables
```
{{businessName}}     - Company name
{{phone}}            - Formatted phone
{{city}}             - City name
{{state}}            - State abbreviation
{{rating}}           - Google rating
{{reviewCount}}      - Number of reviews
{{yearsInBusiness}}  - Calculated years
{{establishedYear}}  - Year established
{{responseTime}}     - Response time
{{warrantyYears}}    - Warranty years
{{licenseNumber}}    - Primary license
{{year}}             - Current year
```

### Content Loader

```typescript
import { loadHeadlines, loadServices, loadFAQs } from '@/lib/contentLoader'

// Loads from correct vertical, replaces all variables
const headlines = await loadHeadlines('hvac')
const services = await loadServices('plumbing')
```

---

## 🎨 Lead Capture Components

**Location:** `/components/lead-capture/`
**Showcase:** `/app/showcase/page.tsx` (http://localhost:3000/showcase)

### Forms
| Component | Description |
|-----------|-------------|
| `SimpleForm` | Basic name/phone/service form |
| `MultiStepForm` | 3-step wizard (service → urgency → contact) |
| `PhotoUploadForm` | Form with drag-drop photo upload |

### Widgets
| Component | Description |
|-----------|-------------|
| `CallbackWidget` | "We'll call you in X min" floating popup |
| `StickyCallButton` | Mobile-only fixed bottom CTA |

### Trust/Urgency
| Component | Description |
|-----------|-------------|
| `AvailabilityBadge` | Technician availability indicators |
| `UrgencyIndicator` | Countdown, demand, seasonal alerts |
| `ReviewsNearForm` | Review displays (4 variants) |

### Usage
```typescript
import { SimpleForm, MultiStepForm, CallbackWidget } from '@/components/lead-capture'

// All accept accentColor prop
<MultiStepForm accentColor="#00509d" />
<CallbackWidget accentColor="#059669" />
```

---

## 🔧 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **JSON data files** (no database)

---

## 🚀 Build Types

### Promo Build (15-30 min)
Quick demo for potential client:
1. Update `data/business.json` (name, phone, address)
2. Set `vertical` field (hvac/plumbing/electrical)
3. Replace logo (`public/images/logo.png`)
4. Optional: Pick headline variation
5. Deploy

### Full Build (2-4 hrs)
After client purchase:
1. All promo build steps
2. Generate blog posts (3-5 articles)
3. Create local area pages
4. Add real testimonials
5. Configure lead capture variant
6. Real photos
7. Analytics setup

---

## 🎯 AI Manifest

**File:** `ai-manifest.json`

Provides structured instructions for AI:
- What files to edit for each build type
- Field-level documentation
- Variable reference
- Component usage guide

---

## 📊 Current Verticals

| Vertical | Headlines | Services | FAQs |
|----------|-----------|----------|------|
| HVAC | 6 variations | 8 services | ✅ |
| Plumbing | 6 variations | 7 services | ✅ |
| Electrical | 6 variations | 8 services | ✅ |

**To add:** Roofing, Landscaping, Cleaning, Garage Door

---

## 🔄 Related Projects

### react-templates
Block-based landing page generator:
- 100+ blocks in registry
- Used for quick sales demos
- Single-page output

**Relationship:**
- react-templates = Lead capture/demo
- hvac-01 = Full production site

**Shared content:** The `/content/verticals/` copy system could be shared between both projects.

---

## ⚠️ Important Rules

### Always Do
1. Run `npm run build` before committing
2. Use `@/` import prefix
3. Keep business data in JSON files
4. Test at `/showcase` when adding lead capture components

### Never Do
1. Hardcode business info in components
2. Skip the copy engine for templated content
3. Add new verticals without all 3 files (headlines, services, faqs)

---

## 🛠️ Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
```

---

## 📍 Key URLs (Dev)

- Homepage: http://localhost:3000
- Showcase: http://localhost:3000/showcase
- Services: http://localhost:3000/services
- Contact: http://localhost:3000/contact

---

## 🎨 Design System

### Accent Color
Primary: `#00509d` (blue)

To change: Search and replace `#00509d` throughout components.

### Fonts
- Headings: System font stack
- Body: System font stack

### Key Classes
```css
.bg-[#00509d]        /* Primary background */
.text-[#00509d]      /* Primary text */
.hover:bg-[#003d7a]  /* Primary hover */
```

---

## 📝 Quick Start for New Build

```bash
# 1. Clone the repo
git clone <repo> client-name-website

# 2. Update business info
# Edit: data/business.json

# 3. Set vertical
# In business.json: "vertical": "plumbing"

# 4. Replace logo
# Replace: public/images/logo.png

# 5. Test locally
npm install
npm run dev

# 6. Deploy
npm run build
# Deploy to Vercel/Netlify
```

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `data/business.json` | Client business info (edit for each client) |
| `content/verticals/*/` | Industry copy templates |
| `lib/copyEngine.ts` | Variable replacement |
| `lib/contentLoader.ts` | Load content by vertical |
| `ai-manifest.json` | AI build instructions |
| `app/showcase/page.tsx` | Component gallery |

---

## ✅ Current State

- ✅ Full website template working
- ✅ 3 verticals (HVAC, Plumbing, Electrical)
- ✅ Copy system with variables
- ✅ Lead capture component library
- ✅ Showcase page for A/B testing
- ✅ AI manifest for builds
- ✅ **JSON-driven architecture** (new!)
- ⏳ More verticals needed (Roofing, etc.)
- ⏳ Form webhook/email integration

---

## 🤖 JSON-Driven Website Generation (NEW)

**The Big Idea:** One JSON file = One complete website. AI generates the JSON, template renders it.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FOUNDLIO PIPELINE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐ │
│  │  AI Input    │     │  AI Engine   │     │  site.config.json│ │
│  │  (minimal)   │────▶│  (Claude)    │────▶│  (complete)      │ │
│  │              │     │              │     │                  │ │
│  │ • Name       │     │ • Validates  │     │ • business       │ │
│  │ • Phone      │     │ • Expands    │     │ • theme          │ │
│  │ • Vertical   │     │ • Generates  │     │ • pages[]        │ │
│  │ • City       │     │   copy       │     │ • content        │ │
│  └──────────────┘     └──────────────┘     │ • settings       │ │
│                                            └────────┬─────────┘ │
│                                                     │           │
│                                                     ▼           │
│                                            ┌──────────────────┐ │
│                                            │  Next.js Render  │ │
│                                            │  Template        │ │
│                                            └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `lib/siteConfig.schema.ts` | TypeScript types for full site config |
| `lib/siteConfig.ts` | Config loader with typed helpers |
| `data/site.config.json` | Example complete config (400+ lines) |
| `prompts/generate-site-config.md` | AI prompt for generating configs |

### Minimal Input (What AI receives)

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

### Complete Output (What AI generates)

AI expands this into a complete `site.config.json` with:
- Full business profile with address, hours, licenses
- Theme colors and style preferences
- Page configurations with sections
- 6-8 services with full copy
- 5+ testimonials (realistic, specific)
- 3-5 service areas with local content
- 8-10 FAQs
- 3 blog post stubs
- SEO settings
- Lead capture configuration

### Using the Config

```typescript
import {
  getBusiness,
  getTheme,
  getServices,
  getAreas,
  getTestimonials,
  getFAQs,
  getHeroHeadlines,
} from '@/lib/siteConfig'

// Get business info
const business = getBusiness()
// → { name: "Desert Aire Comfort", phone: "(602) 555-2665", ... }

// Get services
const services = getServices()
// → [{ slug: "ac-repair", name: "AC Repair", ... }, ...]

// Get hero with A/B variations
const { main, variations } = getHeroHeadlines()
// → main headline + variations for testing

// Static params for dynamic routes
export function generateStaticParams() {
  return getAllServiceSlugs().map(slug => ({ slug }))
}
```

### Benefits

1. **Cheap production** - AI generates complete site in one call
2. **Type-safe** - Full TypeScript schema
3. **Portable** - Config can be stored in DB, sent via API
4. **Version-controlled** - Easy to track changes
5. **A/B testable** - Multiple headline variations included
6. **No Payload CMS needed** - Works standalone

### Workflow

```
1. Sales lead captured → AI generates site.config.json
2. Config stored in Portal DB or deployed as file
3. Next.js template reads config → renders site
4. Client buys → same config, add real content
5. Changes? → Update JSON, redeploy
```

---

## 🌐 Foundlio Ecosystem (Full Context)

This project is part of a larger system:

### Three Projects

| Project | Purpose | Tech |
|---------|---------|------|
| **react-templates** | Block library for landing pages | React + Vite |
| **hvac-01** (this) | Full website template | Next.js |
| **client-portal** | SaaS backend + CRM | Express + Payload CMS |

### How They Work Together

```
SALES FUNNEL:

1. LEAD CAPTURE
   react-templates → Quick landing page demo
   "Here's what your site could look like"

2. CLIENT BUYS ($200-300)
   hvac-01 → Full website deployed
   Blog, SEO, service pages, areas

3. ONGOING ($50/mo)
   client-portal → Lead management
   Client dashboard, CRM, analytics
```

### Client Portal Integration (Future)

The client-portal has:
- **Payload CMS** - Content management (multi-tenant)
- **Lead API** - `POST /api/content/ingest` for form submissions
- **User Auth** - JWT-based authentication
- **Stripe** - Subscription management

**Current approach:** JSON files (simple, works now)
**Future option:** Connect to Portal API for leads + Payload for content

### Key Schemas (from client-portal)

```typescript
// Lead submission (when connecting to Portal)
interface LeadSubmission {
  leadId: string;
  businessInfo: {
    name: string;
    phone: string;
    address: string;
  };
  websiteContent: {
    contact: {
      email: string;
      phone: string;
      message: string;
    };
  };
}

// Website record (in Portal DB)
interface Website {
  id: string;
  domain: string;
  status: 'temporary' | 'transitioning' | 'live';
  content: object;  // JSON blob
  trade: string;    // 'plumbing', 'hvac', etc.
  payloadTenantId?: string;
}
```

### Environment Variables (for Portal integration)

```bash
# When ready to connect to Portal
PORTAL_API_URL=http://localhost:5001
PAYLOAD_API_URL=http://localhost:3000
PAYLOAD_API_KEY=your-key
TENANT_ID=optional-tenant-id
```

---

*Last updated by Claude on January 30, 2026*
