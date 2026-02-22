# Client Portal Integration Context

> **For:** Claude instances working on the client-portal project
> **From:** hvac-01 (Next.js website template)
> **Purpose:** Enable smooth integration between website templates and the portal backend

---

## 1. What is hvac-01?

**hvac-01** is a production-ready Next.js website template for local service businesses (HVAC, plumbing, electrical, etc.). It's part of **Foundlio** - a business that creates AI-powered websites for contractors.

### Key Characteristics
- **Next.js 14** with App Router
- **JSON-driven** - entire site renders from configuration
- **Multi-vertical** - supports HVAC, plumbing, electrical (more coming)
- **No database** - currently uses JSON files
- **Ready for API integration** - designed to connect to client-portal

---

## 2. The JSON-Driven Architecture

### The Big Idea

One JSON config file = One complete website.

```
┌─────────────────────────────────────────────────────────────────┐
│                       CURRENT FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐ │
│  │  Minimal     │     │  AI (Claude) │     │ site.config.json │ │
│  │  Input       │────▶│  Generates   │────▶│ (file on disk)   │ │
│  └──────────────┘     └──────────────┘     └────────┬─────────┘ │
│                                                     │           │
│                                                     ▼           │
│                                            ┌──────────────────┐ │
│                                            │  Next.js reads   │ │
│                                            │  JSON → renders  │ │
│                                            └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Site Config Schema

The complete TypeScript schema is at: `lib/siteConfig.schema.ts`

**Top-level structure:**
```typescript
interface SiteConfig {
  version: string;
  business: BusinessConfig;      // Name, phone, address, hours, licenses
  theme: ThemeConfig;            // Colors, style, fonts
  pages: PagesConfig;            // Which pages exist, their sections
  content: ContentConfig;        // Services, testimonials, areas, FAQs, posts
  settings: SettingsConfig;      // Lead capture, SEO, analytics
  generated?: {                  // Metadata about generation
    timestamp: string;
    aiModel?: string;
    sourcePrompt?: string;
  };
}
```

### Minimal Input (What AI Receives)

```typescript
interface MinimalBusinessInput {
  name: string;           // "Valley Plumbing Pros"
  phone: string;          // "(480) 555-7890"
  email: string;          // "service@valleyplumbingpros.com"
  city: string;           // "Mesa"
  state: string;          // "AZ"
  vertical: 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'landscaping';

  // Optional
  established?: number;
  address?: string;
  licenses?: string[];
  style?: 'minimal' | 'bold' | 'classic' | 'modern';
  accentColor?: string;
}
```

### Full Output (What AI Generates)

See `data/site.config.json` for a complete 400+ line example.

---

## 3. Integration Opportunities

### Option A: Portal Stores Site Config

Instead of JSON file on disk, Portal stores `site.config.json` in database.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PORTAL-INTEGRATED FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐ │
│  │  Minimal     │     │  AI (Claude) │     │  Portal Backend  │ │
│  │  Input       │────▶│  Generates   │────▶│  Stores Config   │ │
│  └──────────────┘     └──────────────┘     └────────┬─────────┘ │
│                                                     │           │
│                                  GET /api/sites/:id/config      │
│                                                     │           │
│                                                     ▼           │
│                                            ┌──────────────────┐ │
│                                            │  Next.js fetches │ │
│                                            │  config → render │ │
│                                            └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Portal Changes Needed:**
```typescript
// New Prisma model
model SiteConfig {
  id          String   @id @default(cuid())
  websiteId   String   @unique
  website     Website  @relation(fields: [websiteId], references: [id])
  config      Json     // The entire site.config.json
  version     String   // Schema version
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// New API endpoint
// GET /api/sites/:websiteId/config
// Returns the SiteConfig.config JSON
```

**Next.js Changes:**
```typescript
// lib/siteConfig.ts - add API fetching
export async function fetchSiteConfig(websiteId: string): Promise<SiteConfig> {
  const res = await fetch(`${PORTAL_API_URL}/api/sites/${websiteId}/config`, {
    headers: { 'Authorization': `Bearer ${PORTAL_API_KEY}` },
    next: { revalidate: 60 }  // ISR
  });
  return res.json();
}
```

---

### Option B: Portal Generates Config on Demand

Portal has an endpoint that generates site config from minimal input.

```typescript
// Portal endpoint
// POST /api/sites/generate-config
// Body: MinimalBusinessInput
// Returns: SiteConfig (generated by AI)

app.post('/api/sites/generate-config', async (req, res) => {
  const input: MinimalBusinessInput = req.body;

  // Call Claude API to generate config
  const config = await generateSiteConfig(input);

  // Optionally store it
  await prisma.siteConfig.create({
    data: {
      websiteId: req.body.websiteId,
      config: config,
      version: '1.0.0'
    }
  });

  res.json(config);
});
```

---

### Option C: Sync with Existing Website Model

Map `site.config.json` sections to existing Portal/Payload structures.

**Current Portal Website Model:**
```typescript
interface Website {
  id: string;
  domain: string;
  status: 'temporary' | 'transitioning' | 'live';
  content: object;           // <-- This could BE the SiteConfig
  trade: string;
  payloadTenantId?: string;
}
```

**Mapping:**
| SiteConfig Section | Portal/Payload Location |
|--------------------|------------------------|
| `business` | Website.content.business OR Payload site-settings |
| `theme` | Website.content.theme |
| `content.services` | Payload services collection |
| `content.testimonials` | Payload testimonials collection |
| `content.areas` | Payload areas collection |
| `content.faqs` | Payload faqs collection |
| `content.posts` | Payload posts collection |
| `settings` | Website.content.settings |

---

## 4. Lead Submission Integration

hvac-01 has lead capture forms that should submit to Portal.

### Current Lead Endpoint (Portal)

```typescript
// POST /api/content/ingest
// Public endpoint, no auth required

interface LeadSubmission {
  leadId: string;
  businessInfo: {
    name: string;
    phone: string;
    address?: string;
  };
  websiteContent: {
    contact: {
      email: string;
      phone: string;
      message?: string;
    };
  };
}
```

### Next.js API Route for Lead Submission

```typescript
// app/api/submit-lead/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  const websiteId = process.env.WEBSITE_ID;  // From env or config

  // Forward to Portal
  const response = await fetch(`${process.env.PORTAL_API_URL}/api/content/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      leadId: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      websiteId,  // Link to website in Portal
      businessInfo: {
        name: data.name,
        phone: data.phone,
      },
      websiteContent: {
        contact: {
          email: data.email,
          phone: data.phone,
          message: data.message
        }
      }
    })
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

---

## 5. Proposed New Portal Endpoints

### Site Config Management

```typescript
// Store/retrieve site configs
GET    /api/sites/:websiteId/config          // Get config for website
PUT    /api/sites/:websiteId/config          // Update config
POST   /api/sites/generate-config            // AI generates new config

// Batch operations
POST   /api/sites/validate-config            // Validate config against schema
POST   /api/sites/preview                    // Generate preview URL for config
```

### Enhanced Lead Capture

```typescript
// Enhanced lead endpoint with website context
POST   /api/leads/submit
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
    photos?: string[];  // URLs if photo upload form
  };
  metadata: {
    page: string;           // Which page submitted from
    variation?: string;     // A/B test variation ID
    timestamp: string;
    userAgent?: string;
  };
}
```

---

## 6. Environment Variables

### hvac-01 Needs

```bash
# Portal Integration
PORTAL_API_URL=http://localhost:5001
PORTAL_API_KEY=optional-for-authenticated-endpoints

# Website Identity (for multi-tenant)
WEBSITE_ID=cuid-of-website-in-portal
TENANT_SLUG=desert-aire-comfort

# Feature Flags
USE_PORTAL_CONFIG=false     # true = fetch from Portal, false = use local JSON
USE_PORTAL_LEADS=true       # true = submit leads to Portal
```

### Portal Needs

```bash
# For AI config generation
ANTHROPIC_API_KEY=sk-ant-...

# For webhook notifications to websites
WEBHOOK_SECRET=shared-secret-for-verification
```

---

## 7. Webhook Integration (Future)

Portal notifies websites when content changes.

```typescript
// Portal sends webhook when config updated
POST https://client-website.com/api/webhooks/portal
{
  event: 'config.updated' | 'lead.created' | 'content.published';
  websiteId: string;
  timestamp: string;
  signature: string;  // HMAC signature for verification
  data: {
    // Event-specific payload
  };
}

// Next.js webhook handler
// app/api/webhooks/portal/route.ts
export async function POST(request: Request) {
  const payload = await request.json();

  // Verify signature
  const signature = request.headers.get('x-portal-signature');
  if (!verifySignature(payload, signature)) {
    return new Response('Invalid signature', { status: 401 });
  }

  switch (payload.event) {
    case 'config.updated':
      // Trigger ISR revalidation
      await revalidatePath('/');
      await revalidatePath('/services');
      break;
    case 'lead.created':
      // Maybe show notification
      break;
  }

  return new Response('OK');
}
```

---

## 8. Schema Alignment Checklist

When integrating, ensure these match between hvac-01 and Portal:

| hvac-01 Schema | Portal/Payload Equivalent |
|----------------|--------------------------|
| `SiteConfig.business` | `Website.content.business` or `site-settings` global |
| `SiteConfig.content.services[]` | `services` collection |
| `SiteConfig.content.testimonials[]` | Could add `testimonials` collection |
| `SiteConfig.content.areas[]` | Could add `service-areas` collection |
| `SiteConfig.content.faqs[]` | Could add `faqs` collection |
| `SiteConfig.content.posts[]` | `posts` collection (if exists) |
| `SiteConfig.settings.leadCapture` | Website settings or new config |
| `SiteConfig.settings.seo` | Part of `site-settings` or pages |

---

## 9. Quick Start for Portal Integration

### Phase 1: Lead Submission (Easy)
1. Add `PORTAL_API_URL` to hvac-01 environment
2. Create `/api/submit-lead` route in hvac-01
3. Connect lead capture forms to this route
4. Leads appear in Portal dashboard

### Phase 2: Config Storage (Medium)
1. Add `SiteConfig` model to Portal Prisma schema
2. Create `/api/sites/:id/config` endpoints
3. Update hvac-01 to optionally fetch from API
4. Add `USE_PORTAL_CONFIG` feature flag

### Phase 3: AI Generation (Advanced)
1. Add Anthropic SDK to Portal backend
2. Create `/api/sites/generate-config` endpoint
3. Use `prompts/generate-site-config.md` as template
4. Validate output against schema
5. Store and serve to websites

---

## 10. Files to Share

These files from hvac-01 may be useful in Portal:

| File | Purpose | Use in Portal |
|------|---------|---------------|
| `lib/siteConfig.schema.ts` | TypeScript types | Validation, storage typing |
| `prompts/generate-site-config.md` | AI prompt | Config generation endpoint |
| `data/site.config.json` | Example output | Testing, documentation |

---

## 11. Contact Points

**hvac-01 Codebase:**
- Schema: `lib/siteConfig.schema.ts`
- Loader: `lib/siteConfig.ts`
- Example: `data/site.config.json`
- Lead forms: `components/lead-capture/`
- AI manifest: `ai-manifest.json`

**Portal Codebase:**
- Routes: `backend/src/routes/`
- Content ingest: `backend/src/routes/content.ts`
- Lead management: `backend/src/routes/leads.ts`
- Prisma schema: `backend/prisma/schema.prisma`

---

*Document created for cross-project AI context sharing*
*Last updated: January 30, 2026*
