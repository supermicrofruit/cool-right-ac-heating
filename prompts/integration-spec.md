# Foundlio Integration Specification

## Overview

This document defines how Client Portal and Template Monster communicate.

---

## Option A: Manual Trigger (Current - Simplest)

Portal Claude tells you what to create, you (Template Monster Claude) execute:

```
Portal Claude → "Create site for Mesa Plumbing Pros with this JSON: {...}"
     ↓
Template Monster Claude → Clones template, deploys, returns URL
     ↓
Portal Claude → Updates NocoDB with URL
```

**Pros:** Simple, no extra infrastructure
**Cons:** Requires two Claude instances to coordinate

---

## Option B: API-Based Trigger (Future)

Template Monster exposes a build API:

### POST /api/build

**Request:**
```json
{
  "api_key": "foundlio-secret-key",
  "site_id": "site_abc123",
  "business_json": {
    "name": "Mesa Plumbing Pros",
    "phone": "(480) 555-7890",
    ...
  },
  "options": {
    "subdomain": "mesaplumbingpros",
    "theme": "professional-blue",
    "build_type": "promo"
  }
}
```

**Response:**
```json
{
  "success": true,
  "site_id": "site_abc123",
  "deployment": {
    "url": "https://mesaplumbingpros.foundlio.com",
    "vercel_deployment_id": "dpl_xxx",
    "status": "ready"
  }
}
```

**Implementation:** GitHub Action or Vercel serverless function that:
1. Clones template
2. Writes business.json
3. Deploys to Vercel
4. Returns URL

---

## Option C: GitHub-Based Trigger (Recommended for Now)

Use GitHub Actions to automate builds:

### Workflow

1. Portal stores business.json in a GitHub repo (one folder per site)
2. Commit triggers GitHub Action
3. Action deploys to Vercel
4. Webhook notifies Portal of completion

### GitHub Repo Structure
```
foundlio-sites/
├── sites/
│   ├── mesa-plumbing-pros/
│   │   └── business.json
│   ├── desert-aire-comfort/
│   │   └── business.json
│   └── valley-electric/
│       └── business.json
└── .github/
    └── workflows/
        └── deploy-site.yml
```

### GitHub Action
```yaml
name: Deploy Site

on:
  push:
    paths:
      - 'sites/*/business.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Get changed site
        id: changed
        run: |
          SITE=$(git diff --name-only HEAD~1 | grep business.json | head -1 | cut -d'/' -f2)
          echo "site=$SITE" >> $GITHUB_OUTPUT

      - name: Clone template
        run: |
          git clone https://github.com/foundlio/template-monster.git build
          cp sites/${{ steps.changed.outputs.site }}/business.json build/data/

      - name: Deploy to Vercel
        run: |
          cd build
          npm install
          npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Notify Portal
        run: |
          curl -X POST ${{ secrets.PORTAL_WEBHOOK_URL }} \
            -H "Content-Type: application/json" \
            -d '{"site": "${{ steps.changed.outputs.site }}", "status": "deployed"}'
```

---

## Lead Flow (Implemented)

Template Monster → Portal for all incoming leads:

### Website sends lead to Portal

In `app/api/leads/route.ts`, the lead is forwarded:

```typescript
// Forwards to Portal's intake endpoint
if (PORTAL_API_URL && PORTAL_API_KEY) {
  const portalPayload = {
    name: body.name,
    phone: body.phone,
    email: body.email,
    service: body.service,
    message: body.message,
    urgency: body.urgency || 'normal',
    source: body.source || 'website_form',
    metadata: {
      ip: ip,
      submittedAt: new Date().toISOString(),
      businessName: businessData.name,
      website: businessData.website,
    },
  }

  await fetch(`${PORTAL_API_URL}/api/portal/leads/intake`, {
    method: 'POST',
    headers: {
      'X-API-Key': PORTAL_API_KEY,  // Unique per site
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(portalPayload),
  })
}
```

### Portal receives via /api/portal/leads/intake

Portal's actual endpoint (from backend/src/routes/portal/leads.ts):

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/portal/leads/intake | X-API-Key | External lead submission |
| GET | /api/portal/leads | JWT | List leads |
| GET | /api/portal/leads/:id | JWT | Get single lead |
| PATCH | /api/portal/leads/:id | JWT | Update lead |
| DELETE | /api/portal/leads/:id | JWT | Delete lead |

The intake endpoint:
1. Validates API key via `apiKeyAuth` middleware
2. Finds site by API key in NocoDB
3. Inserts lead record linked to site
4. Returns success response

---

## NocoDB Integration

### From Portal Claude

```typescript
// List clients
const clients = await nocodb.listRecords('Clients', {
  where: { status: 'active' }
})

// Create client
const client = await nocodb.insertRecord('Clients', {
  name: 'Mesa Plumbing Pros',
  phone: '(480) 555-7890',
  city: 'Mesa',
  state: 'AZ',
  vertical: 'plumbing',
  status: 'trial'
})

// Create site linked to client
const site = await nocodb.insertRecord('Sites', {
  client: client.id,
  domain: 'mesaplumbingpros.com',
  subdomain: 'mesaplumbingpros',
  status: 'building',
  business_json: JSON.stringify(businessJson),
  theme_preset: 'professional-blue',
  build_type: 'promo'
})

// Update after deployment
await nocodb.updateRecord('Sites', site.id, {
  status: 'live',
  vercel_deployment_url: 'https://mesaplumbingpros.foundlio.com',
  last_deployed: new Date()
})
```

---

## Quick Start Recommendation

**Phase 1 (Now):**
- Manual coordination between Portal Claude and Template Monster Claude
- Portal Claude creates client/site records in NocoDB
- Template Monster Claude builds and deploys
- Portal Claude updates records with URLs

**Phase 2 (Soon):**
- GitHub-based trigger (Option C)
- Automated deployments on business.json commit
- Webhook notifications back to Portal

**Phase 3 (Later):**
- Full API-based trigger (Option B)
- Stripe integration for automatic provisioning
- Self-service client dashboard

---

## Environment Setup

### Template Monster (.env.local)
```bash
# Portal integration
PORTAL_API_URL=https://portal.foundlio.com
PORTAL_API_KEY=pk_xxx
PORTAL_SITE_ID=site_xxx  # Unique per deployed site

# Captcha
TURNSTILE_SECRET_KEY=xxx
NEXT_PUBLIC_TURNSTILE_SITE_KEY=xxx

# Email
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=leads@foundlio.com
```

### Client Portal
```bash
# NocoDB
NOCODB_BASE_URL=https://nocodb.foundlio.com
NOCODB_API_TOKEN=xxx

# Vercel (for deployments)
VERCEL_TOKEN=xxx
VERCEL_TEAM_ID=team_xxx

# GitHub (for Option C)
GITHUB_TOKEN=ghp_xxx
GITHUB_REPO=foundlio/sites

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
```

---

## Security Considerations

1. **API Keys:** Never commit to repo, use environment variables
2. **PORTAL_API_KEY:** Unique per Portal instance, validate on every request
3. **PORTAL_SITE_ID:** Unique per site, links leads to correct client
4. **Rate Limiting:** Already implemented in leads API (5/min per IP)
5. **Turnstile:** Prevents bot spam on forms
6. **CORS:** Restrict Portal API to known origins
