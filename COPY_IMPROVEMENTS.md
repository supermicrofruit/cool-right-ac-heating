# Copy & Content Improvement Recommendations

**Date:** February 7, 2026
**Scope:** Template fixes to improve AI-generated website quality
**Status:** Analysis complete, fixes pending

---

## Executive Summary

After auditing Boris Mechanical, Windy City Plumbing, and Ace Cooling generated sites plus the template source code, I identified **4 critical**, **5 high**, and **8 medium** priority issues that cause AI-generated sites to show generic, incorrect, or broken content.

The template is ~60% data-driven but ~40% relies on hardcoded text, hardcoded images, and component-level logic that doesn't adapt to different verticals. The biggest wins come from fixing the **critical SEO schema bug** and making the **hero form + trust signals data-driven**.

---

## CRITICAL Priority (Must Fix Before Production)

### 1. Hardcoded Domain in Breadcrumb Schema

**Files:** `app/services/[slug]/page.tsx:185`, `app/areas/[slug]/page.tsx:62`

```typescript
// CURRENT (broken for every generated site):
generateBreadcrumbSchema(breadcrumbItems, 'https://desertairecomfort.com')

// FIX:
generateBreadcrumbSchema(breadcrumbItems, businessData.website || `https://${businessData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.vercel.app`)
```

**Impact:** Every generated site's structured data points to `desertairecomfort.com`. Google Search Console would flag this as conflicting schema data. Breaks SEO for all service and area pages.

### 2. Hero Form Service Dropdown is Generic

**File:** `components/sections/HeroSection.tsx:271-277`

```typescript
// CURRENT (same 5 options for every business):
<option value="repair">Repair / Fix Issue</option>
<option value="maintenance">Maintenance</option>
<option value="installation">New Installation</option>
<option value="emergency">Emergency Service</option>
<option value="estimate">Free Estimate</option>

// FIX: Load from services.json
import { getAllServices } from '@/lib/services'
const services = getAllServices().slice(0, 5)
// Then render:
{services.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
<option value="other">Other / Free Estimate</option>
```

**Impact:** A cleaning company shows "Repair / Fix Issue" and "New Installation" in their hero form. Plumber shows "Maintenance" as top option instead of "Emergency Plumbing". Forms don't match the actual services offered.

### 3. Contact Page Emergency Text Hardcoded

**File:** `app/contact/page.tsx:56`

```typescript
// CURRENT (shows for ALL businesses, even those without 24/7 service):
<p className="text-sm text-slate-500 mt-1">
  Available 24/7 for emergencies
</p>

// FIX:
<p className="text-sm text-slate-500 mt-1">
  {businessData.emergencyService
    ? 'Available 24/7 for emergencies'
    : `${businessData.responseTime} response time`}
</p>
```

### 4. Contact Page Response Time Hardcoded

**File:** `app/contact/page.tsx:77`

```typescript
// CURRENT:
<p className="text-sm text-slate-500 mt-1">
  We respond within 24 hours
</p>

// FIX:
<p className="text-sm text-slate-500 mt-1">
  We respond within {businessData.responseTime || '24 hours'}
</p>
```

**Impact:** A business with "2 hour" response time still shows "24 hours" on their contact page. False info that could lose leads.

---

## HIGH Priority (Fix Before Scaling)

### 5. Hero Image Hardcoded to Single Photo

**File:** `components/sections/HeroSection.tsx` (lines 322, 365, 396, 488)

All 4 hero variants use `/images/hero-technician.png`. A cleaning company, painter, or landscaper shows a generic "technician" photo.

**Fix:** Add `heroImage` field to `data/business.json`. AI generator should output a vertical-appropriate image path. Fallback to `/images/hero-{vertical}.png`.

```typescript
// In HeroSection:
const heroImage = businessData.theme?.heroImage || `/images/hero-${businessData.vertical}.png`
```

**Requires:** Adding stock hero images per vertical to the template repo: `hero-hvac.png`, `hero-plumber.png`, `hero-electrician.png`, `hero-cleaning.png`, `hero-roofing.png`, `hero-landscaping.png`, `hero-painting.png`.

### 6. About Page Company Values Hardcoded

**File:** `app/about/page.tsx:20-41`

Every generated site has identical values: Excellence, Integrity, Customer First, Reliability. These are fine generics but don't differentiate businesses.

**Fix:** Move to `data/content.json` under `aboutSection.values`. The AI generator should produce 4 business-specific values. Keep current as fallback.

```typescript
const contentValues = getAboutSectionContent()?.values
const values = contentValues?.length ? contentValues : defaultValues
```

### 7. About Page Milestones are Formulaic

**File:** `app/about/page.tsx:43-50`

Milestones are auto-generated from `established + N` years. A company founded in 2020 shows:
- 2020: Founded
- 2022: Expanded team
- 2025: Expanded to metro area
- 2028: Launched 24/7 emergency (FUTURE DATE!)

**Fix:** Cap milestones at current year. Better: make milestones part of `data/content.json` so AI can generate realistic ones.

```typescript
const currentYear = new Date().getFullYear()
const milestones = (getAboutSectionContent()?.milestones || defaultMilestones)
  .filter(m => m.year <= currentYear)
```

### 8. Trust Signals Partially Hardcoded

**File:** `components/sections/TrustSignals.tsx:8-39`

Mixed hardcoded/data-driven signals:
- `trustContent.factoryAuthorized` / `.factoryDescription` from content.json (good)
- "Licensed & Insured" always shows (what if business is bonded but not insured differently?)
- "Satisfaction Guaranteed" + "100% workmanship guarantee" always shows
- "24/7 Emergency Service" OR response time (good conditional)

**Fix:** Make signals array data-driven from content.json. AI generates appropriate signals per business.

### 9. CTA Banner Content Not Vertical-Specific

**File:** `data/content.json` ctaSection

The CTA text may be generic (e.g., "Ready for a Spotless Home?" for cleaning vertical) but doesn't adapt when AI generates for HVAC or plumbing.

**Fix:** Ensure the AI prompt generates vertical-appropriate CTA copy. Add validation in `Parse AI Response` node to check CTA text matches vertical.

---

## MEDIUM Priority (Improve Quality)

### 10. FAQ Section Title/Subtitle Generic on Homepage

**File:** `app/page.tsx:66-67`

```typescript
// CURRENT:
title="Common Questions"
description="Find answers to frequently asked questions about our services"
```

**Fix:** Pull from content.json FAQ section or generate per vertical.

### 11. Service Icon Matching Fragile

**File:** `components/sections/ServiceGrid.tsx` iconMap

Only 12 icons available. AI-generated service names that don't match a known icon fall back to `Wrench`. Services like "Duct Cleaning", "Water Heater", "Landscape Design" all show a generic wrench.

**Fix:** Expand iconMap to 25+ icons. Add a smarter icon-matching function that checks keywords in service names.

### 12. Footer "Privacy Policy" and "Terms of Service" Links Dead

These link to `/privacy` and `/terms` which don't exist. Every generated site has dead links in the footer.

**Fix:** Either generate these pages (easy template), hide the links if pages don't exist, or link to a shared Foundlio legal page.

### 13. Social Media Links Only Facebook/Instagram

**File:** Footer.tsx

If business has Google Business Profile, Yelp, NextDoor, or TikTok, there's no way to display them.

**Fix:** Add more social icons to Footer, conditionally shown.

### 14. No Vertical-Specific Service Templates

Services data is fully AI-generated, which is good, but there's no validation that the AI generated enough services, appropriate categories, or that slugs are URL-safe.

**Fix:** Add validation in `Parse AI Response` node: minimum 6 services, valid slugs, at least 2 categories.

### 15. Content Loader Returns Empty Objects

**File:** `lib/content.ts`

Functions like `getProcessSectionContent()` return `contentData.processSection || {}`. An empty object won't break the app but renders empty sections.

**Fix:** Return meaningful defaults so pages always have content even if AI omits a section.

### 16. Rating Badge Always Shows 5 Stars

**File:** `components/sections/TestimonialsSlider.tsx`

Star display is hardcoded to always show 5 filled stars regardless of actual average rating.

**Fix:** Calculate filled/empty stars from `summary.averageRating`.

### 17. No "Near Me" Location Signals

Generated pages miss local SEO opportunities. No "serving [neighborhood]" micro-copy, no distance indicators, no "nearest to you" signals.

**Fix:** Use areas.json neighborhoods data to add location micro-copy throughout the site.

---

## AI Prompt Improvements

The n8n workflow's OpenRouter AI prompt should be updated to:

1. **Generate vertical-appropriate CTA text** - not generic "schedule service"
2. **Generate company values** - specific to the business type, not generic
3. **Generate realistic milestones** - based on established year and current year
4. **Generate hero image suggestion** - which stock photo category to use
5. **Validate service count** - minimum 6 services with proper categories
6. **Generate FAQ answers that mention the business name** - currently many answers are generic

---

## Implementation Order

1. **Fix breadcrumb schema domain** (5 min, critical SEO fix)
2. **Fix contact page emergency/response text** (5 min, false info fix)
3. **Make hero form load services from data** (15 min, UX fix)
4. **Cap about page milestones at current year** (5 min, bug fix)
5. **Add vertical-specific hero images** (30 min, visual quality)
6. **Make trust signals data-driven** (20 min, content quality)
7. **Make about values data-driven** (15 min, content quality)
8. **Add content.ts default fallbacks** (15 min, robustness)
9. **Fix dead privacy/terms links** (10 min, polish)
10. **Expand icon map** (15 min, visual quality)

**Total estimated effort:** ~2.5 hours for all fixes

---

## Template Data Fields Checklist

Fields the AI MUST generate for a complete site:

### business.json
- [x] name, legalName, phone, phoneRaw, email, website
- [x] vertical, region, address (full object), coordinates
- [x] hours (weekdays, saturday, sunday, structured[])
- [x] licenses[], certifications[]
- [x] established, rating, reviewCount
- [x] description, tagline
- [x] emergencyService, financing, freeEstimates
- [x] responseTime, warrantyYears
- [ ] **NEW: heroImage** (path to vertical-appropriate hero photo)
- [ ] **NEW: paymentMethods[]** (for trust signals)

### content.json
- [x] hero (headline, headlineAccent, description)
- [x] trustSection (factoryAuthorized, factoryDescription)
- [x] servicesSection, processSection, testimonialsSection, ctaSection
- [ ] **NEW: aboutSection.values[]** (4 company values with icon, title, desc)
- [ ] **NEW: aboutSection.milestones[]** (realistic timeline events)
- [ ] **NEW: faqSection.title, faqSection.description**

### services.json
- [x] services[] (slug, name, shortDescription, longDescription, icon, category)
- [x] categories[] (slug, name, description, icon, features[])
- [ ] **VALIDATE: min 6 services, min 2 categories, valid slugs**

### testimonials.json
- [x] testimonials[] (name, location, rating, text, service, date, verified)
- [x] summary (averageRating, totalReviews, platforms[])

### areas.json
- [x] areas[] (slug, name, state, description, neighborhoods[])
- [x] primaryServiceArea, serviceRadius

### faqs.json
- [x] categories[] with faqs[] (question, answer)
- [ ] **VALIDATE: answers mention business name at least once**
