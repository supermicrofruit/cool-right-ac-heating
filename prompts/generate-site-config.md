# AI Site Config Generation Prompt

> This prompt is used to generate complete website configurations from minimal business input.

## Input Format

```json
{
  "name": "Business Name",
  "phone": "(555) 555-5555",
  "email": "info@business.com",
  "city": "Phoenix",
  "state": "AZ",
  "vertical": "hvac",
  "established": 2010,
  "address": "123 Main St",
  "licenses": ["ROC #12345"],
  "style": "minimal",
  "accentColor": "#00509d"
}
```

## Generation Prompt

---

You are a website content generator for local service businesses. Generate a complete `site.config.json` that will power a professional website.

### Input Business Info:
```
{{BUSINESS_INPUT}}
```

### Instructions:

1. **Business Section**: Expand the input into a complete business profile:
   - Generate a realistic address in the given city/state
   - Create appropriate coordinates (use city center if not given)
   - Set appropriate hours for the vertical (HVAC companies are often open late in summer)
   - Generate 2-3 relevant licenses based on vertical and state
   - Add 3-4 industry certifications
   - Set rating between 4.7-4.9, reviewCount between 200-1000

2. **Theme Section**: Based on style preference:
   - `minimal`: Clean, lots of white space, subtle colors
   - `bold`: Strong colors, high contrast
   - `classic`: Traditional, trustworthy blues/greens
   - `modern`: Contemporary, gradient-friendly

3. **Headlines**: Generate 3 headline variations:
   - One emphasizing trust/experience
   - One emphasizing speed/emergency response
   - One with local flavor (reference city/region)

4. **Services**: Generate 6-8 services appropriate for the vertical:
   - Include emergency services if applicable
   - Write unique descriptions, not generic
   - Reference local conditions (e.g., "Phoenix heat" for AZ HVAC)
   - Include realistic features and benefits
   - Write SEO-optimized meta titles and descriptions

5. **Testimonials**: Generate 5 realistic testimonials:
   - Vary the services mentioned
   - Use first name + last initial format
   - Include nearby cities in the metro area
   - Reference specific situations (not generic praise)

6. **Service Areas**: Generate 3-5 areas in the metro:
   - Main city first
   - Include real neighborhoods
   - Reference local landmarks
   - Mention local-specific challenges

7. **FAQs**: Generate 8-10 FAQs:
   - Include pricing questions
   - Include emergency/timing questions
   - Include service-specific questions
   - Answers should be helpful and specific

8. **Blog Posts**: Generate 3 post stubs:
   - Seasonally relevant topics
   - How-to and educational content
   - Local angle when possible

9. **UI Copy**: Generate ALL interface text (CRITICAL!):
   - Navigation labels
   - Button text (CTAs, form buttons)
   - Form labels and placeholders (localized to vertical)
   - Section titles and subtitles
   - Widget text (callback, urgency, availability)
   - Error and success messages
   - Use {{variables}} for dynamic values:
     - {{businessName}}, {{phone}}, {{city}}, {{state}}
     - {{rating}}, {{reviewCount}}, {{yearsInBusiness}}
     - {{responseTime}}, {{warrantyYears}}, {{callbackTime}}
     - {{year}}, {{vertical}}

   **Important copy rules:**
   - Tailor form placeholders to vertical (e.g., "Tell us about your plumbing issue...")
   - Make CTA text action-oriented and vertical-specific
   - Section titles should reference the vertical naturally
   - Widget text should create appropriate urgency for the business type

### Output Format:

Return a valid JSON object matching the SiteConfig schema. Ensure:
- All strings are properly escaped
- No trailing commas
- Coordinates are realistic for the city
- Phone numbers match (602) XXX-XXXX format for Phoenix area
- All meta descriptions are under 160 characters

---

## Vertical-Specific Guidelines

### HVAC
- Emphasize emergency AC repair (critical in hot climates)
- Mention NATE certification, EPA 608
- Services: AC repair, AC installation, heating, maintenance, duct cleaning, indoor air quality
- Seasonal content: summer prep, winter heating
- Local challenges: extreme heat, dust, monsoon humidity
- **Copy tone:** Comfort-focused, relief from heat, "cool" language
- **Form placeholder:** "Tell us about your HVAC issue..."
- **CTA examples:** "Stay Cool", "Beat the Heat", "Restore Comfort"

### Plumbing
- Emphasize 24/7 availability for emergencies
- Mention state plumbing license
- Services: drain cleaning, water heaters, leak repair, sewer, repiping, fixtures
- Seasonal content: winter pipe protection, water heater maintenance
- Local challenges: hard water, older pipes, slab leaks
- **Copy tone:** Urgent, protective, prevent damage
- **Form placeholder:** "Describe your plumbing problem..."
- **CTA examples:** "Stop the Leak", "Fix It Fast", "Protect Your Home"

### Electrical
- Emphasize safety and code compliance
- Mention electrical contractor license
- Services: panel upgrades, rewiring, outlets, lighting, generators, EV chargers
- Seasonal content: storm prep, holiday lighting safety
- Local challenges: older homes, increased power demands, EV adoption
- **Copy tone:** Safety-first, professional, modern
- **Form placeholder:** "Describe your electrical issue..."
- **CTA examples:** "Power Up Safely", "Upgrade Today", "Stay Connected"

### Roofing
- Emphasize storm damage response
- Mention contractor license, insurance
- Services: repair, replacement, inspection, gutters, skylights
- Seasonal content: storm prep, post-storm inspection
- Local challenges: sun damage, monsoons, hail
- **Copy tone:** Protective, durable, peace of mind
- **Form placeholder:** "Tell us about your roofing needs..."
- **CTA examples:** "Protect Your Home", "Get Covered", "Roof Inspection"

### Landscaping
- Emphasize curb appeal and outdoor living
- Mention contractor license if required
- Services: design, installation, maintenance, irrigation, hardscaping, lighting
- Seasonal content: spring planting, winter prep, drought-resistant options
- Local challenges: water restrictions, heat-tolerant plants, soil conditions
- **Copy tone:** Beautiful, transformative, outdoor lifestyle
- **Form placeholder:** "Describe your landscaping vision..."
- **CTA examples:** "Transform Your Yard", "Get a Free Design", "Love Your Outdoors"

---

## Example Minimal Input → Full Output

**Input:**
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

**AI generates:** Complete 400+ line site.config.json with:
- Full business profile with Mesa address
- Plumbing-specific services (6-8)
- East Valley area pages (Mesa, Gilbert, Chandler, Tempe)
- Plumbing FAQs
- Testimonials mentioning specific plumbing issues
- Blog posts about water heaters, drain maintenance, etc.

---

## Review-Based Content Enrichment (NEW - Feb 2026)

When real Google reviews are available (scraped from Google Maps), the AI prompt receives additional context:

### Review Context Data
```json
{
  "topReviews": [
    { "name": "John S.", "rating": 5, "text": "They fixed our AC in under 2 hours..." }
  ],
  "topKeywords": ["reliable", "professional", "fast", "honest"],
  "scrapedHours": { "Monday": "7:00 AM - 9:00 PM", ... },
  "totalReviews": 45,
  "photoUrls": ["https://..."]
}
```

### How Reviews Improve Copy
- **Testimonials** are based on real review language (adapted names, kept specific details)
- **Keywords** from reviews are woven into headlines and service descriptions
- **Business hours** from Google Maps are used instead of invented hours
- **Service emphasis** matches what customers actually mention in reviews

### Fallback
If no reviews are available (new business, no Google Maps URL), the AI falls back to standard generation with invented content.

### Pipeline Integration
The n8n pipeline automatically:
1. Checks if NocoDB `Reviews` field has data
2. If empty and Google Maps URL exists → scrapes reviews via Google Maps scraper
3. Caches scraped reviews back to NocoDB (no re-scraping on retries)
4. Passes review context to the AI prompt

---

## Integration with Foundlio

This prompt is called when:
1. **New lead captured** → Generate preview site
2. **Client onboarding** → Generate production config
3. **Template cloning** → Customize existing config

The generated JSON is then:
1. Validated against schema
2. Stored in client-portal database
3. Deployed to website template via API or file write
