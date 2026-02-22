# Foundlio Quick Reference

## Two Claudes, One System

| Claude | Project | Job |
|--------|---------|-----|
| **Portal Claude** | client-portal | Manage clients, track leads, trigger builds |
| **Template Claude** | template-monster | Generate sites, deploy to Vercel |

---

## Typical Flow

```
1. Sales lead comes in
   │
   ▼
2. Portal Claude creates client in NocoDB
   │  • name, phone, city, state, vertical
   │
   ▼
3. Portal Claude asks Template Claude to build site
   │  "Create site for Mesa Plumbing Pros..."
   │  (passes business.json or key details)
   │
   ▼
4. Template Claude builds & deploys
   │  • npm run create-site mesaplumbingpros
   │  • Edit data/business.json
   │  • npm run deploy
   │  • Returns: https://mesaplumbingpros.vercel.app
   │
   ▼
5. Portal Claude updates NocoDB
   │  • Site status: live
   │  • URL saved
   │
   ▼
6. Portal Claude sends invite to client
   │
   ▼
7. Client's customers submit forms
   │  → Leads flow to NocoDB via Portal API
   │
   ▼
8. Portal Claude reports leads to client
```

---

## Key Commands

### Portal Claude

```
"Create a client for [business name] in [city, state]"
"Build a [vertical] site for [client]"
"Show leads for [client]"
"Show all active clients"
"Update [client] status to churned"
```

### Template Claude

```
npm run create-site [foldername]   # Clone template
npm run dev                        # Local preview
npm run build                      # Verify build
npm run deploy                     # Deploy to Vercel
```

---

## Portal API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET/POST | /api/portal/clients | JWT | List/create clients |
| GET/PATCH/DELETE | /api/portal/clients/:id | JWT | Single client ops |
| POST | /api/portal/clients/:id/invite | JWT | Generate invite |
| GET/POST | /api/portal/sites | JWT | List/create sites |
| GET/PATCH/DELETE | /api/portal/sites/:id | JWT | Single site ops |
| GET/DELETE | /api/portal/sites/:id/api-key | JWT | API key management |
| **POST** | **/api/portal/leads/intake** | **API Key** | **External lead submission** |
| GET/POST | /api/portal/leads | JWT | List/create leads |
| GET/PATCH/DELETE | /api/portal/leads/:id | JWT | Single lead ops |

---

## NocoDB Tables

| Table | Key Fields |
|-------|------------|
| **Clients** | name, phone, email, city, state, vertical, status |
| **Sites** | client (link), domain, status, business_json, deployed_url, api_key |
| **Leads** | site (link), name, phone, service, urgency, status |

---

## Theme Quick Picks

| Use Case | Theme |
|----------|-------|
| Professional/Corporate | `professional-blue`, `corporate-navy` |
| Bold/High-energy | `bold-orange`, `crimson-edge` |
| Natural/Eco | `forest-green`, `earth-tones` |
| Modern/Clean | `modern-teal`, `clean-slate` |
| Luxury | `royal-purple`, `ocean-depths` |

---

## Verticals

| Code | Display | Example Services |
|------|---------|------------------|
| hvac | HVAC | AC repair, heating, installation |
| plumbing | Plumbing | Drains, water heaters, pipes |
| electrical | Electrical | Panels, wiring, outlets |
| roofing | Roofing | Repairs, replacement |
| landscaping | Landscaping | Design, maintenance |

---

## Status Values

### Client Status
- `prospect` - Initial interest
- `trial` - Promo site created
- `active` - Paying customer
- `paused` - Temporarily inactive
- `churned` - Cancelled

### Site Status
- `building` - In progress
- `preview` - Demo ready
- `live` - Production
- `paused` - Disabled
- `archived` - Deleted

### Lead Status
- `new` - Just submitted
- `contacted` - Reached out
- `qualified` - Good prospect
- `converted` - Became customer
- `lost` - Didn't convert

---

## Handoff Template

When Portal Claude needs Template Claude to build:

```
Please create a website with these details:

Business: [Name]
Phone: [Phone]
Email: [Email]
City: [City]
State: [State]
Vertical: [hvac/plumbing/electrical]

Optional:
- Theme: [theme name]
- Address: [full address]
- Hours: [business hours]
- Year established: [year]
- Specific services: [list]

Subdomain: [name].foundlio.com

Please deploy and return the live URL.
```

---

## Lead Notification Template

When a lead comes in:

```
New Lead for [Client Name]

Name: [Lead name]
Phone: [Phone]
Service: [Requested service]
Urgency: [normal/urgent/emergency]
Message: [Their message]

Submitted: [timestamp]
From: [website URL]
```
