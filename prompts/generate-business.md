# AI Business.json Generation Prompt

> This prompt is used to generate a complete `business.json` configuration from minimal business input. This is simpler than `site.config.json` and focuses purely on core business information.

## Input Format (Minimal)

The AI receives minimal information and expands it into a complete business profile:

```
Name: Bob's Plumbing
Phone: (555) 123-4567
City: Austin
State: TX
Trade: plumbing
```

Or as JSON:
```json
{
  "name": "Bob's Plumbing",
  "phone": "(555) 123-4567",
  "city": "Austin",
  "state": "TX",
  "vertical": "plumbing"
}
```

---

## Generation Prompt

---

You are a business profile generator for local service businesses. Generate a complete `business.json` file that will power a professional website template.

### Input Business Info:
```
{{BUSINESS_INPUT}}
```

### Output Schema

Generate a JSON object with the following structure:

```json
{
  "name": "string - Business display name",
  "legalName": "string - Legal entity name (usually name + LLC)",
  "phone": "string - Formatted phone: (XXX) XXX-XXXX",
  "phoneRaw": "string - E.164 format: +1XXXXXXXXXX",
  "email": "string - Professional email: info@domain.com",
  "website": "string - Full URL: https://businessname.com",
  "vertical": "string - Trade type: hvac|plumbing|electrical|roofing|landscaping",
  "region": "string - State or region name",

  "address": {
    "street": "string - Realistic street address in the city",
    "city": "string - City name",
    "state": "string - Two-letter state code",
    "zip": "string - Valid ZIP code for the city",
    "full": "string - Complete formatted address"
  },

  "coordinates": {
    "lat": "number - Latitude (use city center or realistic location)",
    "lng": "number - Longitude"
  },

  "hours": {
    "weekdays": "string - e.g., '7:00 AM - 8:00 PM'",
    "saturday": "string - Saturday hours",
    "sunday": "string - Sunday hours (often 'Emergency Only')",
    "structured": [
      { "days": "string", "hours": "string" }
    ]
  },

  "licenses": ["array - 2-3 relevant licenses for state/trade"],
  "certifications": ["array - 3-4 industry certifications"],

  "established": "number - Year established (realistic, 5-25 years ago)",
  "rating": "number - Google rating: 4.7-4.9",
  "reviewCount": "number - Review count: 200-1000",

  "description": "string - 2-3 sentence company description",
  "tagline": "string - Short memorable tagline",

  "emergencyService": "boolean - 24/7 emergency availability",
  "financing": "boolean - Financing options available",
  "freeEstimates": "boolean - Free estimates offered",
  "responseTime": "string - e.g., '2 hours', 'Same Day'",
  "warrantyYears": "number - Warranty length: 1-5 years",
  "maintenancePointCount": "number - Maintenance checklist items (for HVAC)",

  "socialMedia": {
    "facebook": "string - Facebook URL",
    "instagram": "string - Instagram URL",
    "google": "string - Google Business Profile URL"
  },

  "theme": {
    "preset": "string - Theme preset name",
    "logo": "string - Path: /images/logo.png",
    "favicon": "string - Path: /favicon.ico"
  },

  "features": {
    "showTeam": "boolean",
    "showBlog": "boolean",
    "showWorks": "boolean",
    "showFinancing": "boolean",
    "emergencyBadge": "boolean",
    "callbackWidget": "boolean",
    "stickyPhone": "boolean"
  },

  "seo": {
    "titleTemplate": "string - e.g., '%s | Business Name'",
    "defaultDescription": "string - Site-wide meta description (under 160 chars)"
  },

  "forms": {
    "notifyEmail": "string - Lead notification email",
    "successMessage": "string - Form success message",
    "errorMessage": "string - Form error message"
  }
}
```

### Generation Rules

#### 1. Business Identity
- **legalName**: Append "LLC" to the business name
- **email**: Generate professional email: `info@{businessname-slug}.com`
- **website**: Generate URL: `https://{businessname-slug}.com`
- **region**: Full state name (e.g., "Texas" not "TX")

#### 2. Address Generation
- Create a realistic street address with a commercial street name
- Use real ZIP codes for the specified city
- Coordinates should be realistic for the city (use city center)
- Common street patterns: numbered streets, Main St, Commerce Dr, Industrial Blvd

#### 3. Business Hours by Vertical
| Vertical | Weekdays | Saturday | Sunday |
|----------|----------|----------|--------|
| HVAC | 7:00 AM - 8:00 PM | 7:00 AM - 8:00 PM | Emergency Only |
| Plumbing | 7:00 AM - 7:00 PM | 8:00 AM - 5:00 PM | Emergency Only |
| Electrical | 7:00 AM - 6:00 PM | 8:00 AM - 4:00 PM | Closed |
| Roofing | 7:00 AM - 5:00 PM | 8:00 AM - 2:00 PM | Closed |
| Landscaping | 7:00 AM - 6:00 PM | 8:00 AM - 4:00 PM | Closed |

#### 4. Licenses by State & Vertical

**HVAC:**
- State contractor license (format varies by state)
- EPA 608 Certified (universal)
- NATE Certified Technicians (universal)

**Plumbing:**
- State plumbing license (e.g., "TX Master Plumber #M-12345")
- Backflow certification
- State contractor registration

**Electrical:**
- State electrical license (e.g., "TX Electrical Contractor #EC-12345")
- OSHA certification
- State contractor registration

**Roofing:**
- State roofing contractor license
- General liability insurance
- Workers' compensation

**Landscaping:**
- Landscape contractor license (if required by state)
- Pesticide applicator license
- Irrigation certification

#### 5. Certifications by Vertical

**HVAC:**
- Carrier/Trane/Lennox Factory Authorized Dealer
- BBB A+ Rating
- Energy Star Partner

**Plumbing:**
- BBB A+ Rating
- Home Advisor Top Rated
- Angi Super Service Award

**Electrical:**
- BBB A+ Rating
- Licensed & Bonded
- UL Listed Installation

**Roofing:**
- GAF Master Elite Contractor
- CertainTeed SELECT ShingleMaster
- BBB A+ Rating

**Landscaping:**
- NALP Certified
- Water Smart Certified
- BBB A+ Rating

#### 6. Theme Presets by Vertical
| Vertical | Recommended Preset | Reasoning |
|----------|-------------------|-----------|
| HVAC | `bold-orange` | Energy, warmth, urgency |
| Plumbing | `trust-blue-light` | Water, trust, reliability |
| Electrical | `electric-purple` or `modern-teal` | Power, modern, tech |
| Roofing | `contractor-dark` | Solid, protective, professional |
| Landscaping | `fresh-green` | Nature, growth, outdoor |

#### 7. Feature Flags by Vertical
```
All Trades (default):
- showBlog: true
- showWorks: true (portfolio/gallery)
- callbackWidget: true
- stickyPhone: true

Emergency Services (HVAC, Plumbing, Electrical):
- emergencyBadge: true
- emergencyService: true

Financing (HVAC, Electrical, Roofing):
- showFinancing: true
- financing: true

Team Display (Landscaping, Roofing):
- showTeam: true
```

#### 8. Description & Tagline Guidelines

**Description formula:**
"{BusinessName} has been providing reliable {vertical} services to the {City} area since {established}. Our team of {certification} technicians delivers expert {service type} solutions with a commitment to quality workmanship and customer satisfaction."

**Tagline examples by vertical:**
- HVAC: "Your Comfort, Our Priority" / "Cool Comfort, Warm Service"
- Plumbing: "We Stop Leaks, Not Service" / "Flow Experts, Fast Response"
- Electrical: "Powering Your Home Safely" / "Wired for Excellence"
- Roofing: "Protection You Can Trust" / "Above and Beyond"
- Landscaping: "Transforming Outdoor Spaces" / "Your Vision, Our Craft"

#### 9. Response Time by Vertical
- HVAC: "2 hours" (emergency-focused in hot climates)
- Plumbing: "1 hour" (water damage urgency)
- Electrical: "Same Day"
- Roofing: "24 hours" (less urgent unless storm damage)
- Landscaping: "48 hours" (scheduled work)

#### 10. SEO Description Formula
"Professional {vertical} services in {City}, {State}. {Primary service}, {secondary service}, and {tertiary service}. {Emergency note if applicable}. Call {phone}."

Example:
"Professional plumbing services in Austin, TX. Drain cleaning, water heater repair, and leak detection. 24/7 emergency service. Call (555) 123-4567."

---

## Complete Example

### Input:
```
Name: Bob's Plumbing
Phone: (555) 123-4567
City: Austin
State: TX
Trade: plumbing
```

### Generated Output:
```json
{
  "name": "Bob's Plumbing",
  "legalName": "Bob's Plumbing LLC",
  "phone": "(555) 123-4567",
  "phoneRaw": "+15551234567",
  "email": "info@bobsplumbing.com",
  "website": "https://bobsplumbing.com",
  "vertical": "plumbing",
  "region": "Texas",
  "address": {
    "street": "2847 Commerce Drive",
    "city": "Austin",
    "state": "TX",
    "zip": "78745",
    "full": "2847 Commerce Drive, Austin, TX 78745"
  },
  "coordinates": {
    "lat": 30.2672,
    "lng": -97.7431
  },
  "hours": {
    "weekdays": "7:00 AM - 7:00 PM",
    "saturday": "8:00 AM - 5:00 PM",
    "sunday": "Emergency Only",
    "structured": [
      { "days": "Monday - Friday", "hours": "7:00 AM - 7:00 PM" },
      { "days": "Saturday", "hours": "8:00 AM - 5:00 PM" },
      { "days": "Sunday", "hours": "Emergency Only" }
    ]
  },
  "licenses": [
    "TX Master Plumber #M-41892",
    "TX Plumbing Contractor #PC-28471",
    "Backflow Prevention Certified"
  ],
  "certifications": [
    "BBB A+ Rating",
    "Home Advisor Top Rated",
    "Angi Super Service Award 2024",
    "Austin Chamber of Commerce Member"
  ],
  "established": 2012,
  "rating": 4.8,
  "reviewCount": 523,
  "description": "Bob's Plumbing has been providing reliable plumbing services to the Austin area since 2012. Our team of licensed master plumbers delivers expert repair, installation, and maintenance solutions with a commitment to quality workmanship and customer satisfaction.",
  "tagline": "We Stop Leaks, Not Service",
  "emergencyService": true,
  "financing": false,
  "freeEstimates": true,
  "responseTime": "1 hour",
  "warrantyYears": 2,
  "maintenancePointCount": 15,
  "socialMedia": {
    "facebook": "https://facebook.com/bobsplumbingaustin",
    "instagram": "https://instagram.com/bobsplumbingaustin",
    "google": "https://g.page/bobsplumbingaustin"
  },
  "theme": {
    "preset": "trust-blue-light",
    "logo": "/images/logo.png",
    "favicon": "/favicon.ico"
  },
  "features": {
    "showTeam": false,
    "showBlog": true,
    "showWorks": true,
    "showFinancing": false,
    "emergencyBadge": true,
    "callbackWidget": true,
    "stickyPhone": true
  },
  "seo": {
    "titleTemplate": "%s | Bob's Plumbing",
    "defaultDescription": "Professional plumbing services in Austin, TX. Drain cleaning, water heater repair, and leak detection. 24/7 emergency service. Call (555) 123-4567."
  },
  "forms": {
    "notifyEmail": "leads@bobsplumbing.com",
    "successMessage": "Thanks! We'll contact you within 1 hour.",
    "errorMessage": "Something went wrong. Please call us directly."
  }
}
```

---

## Validation Checklist

Before returning the JSON, verify:

- [ ] `phone` matches format: `(XXX) XXX-XXXX`
- [ ] `phoneRaw` matches format: `+1XXXXXXXXXX`
- [ ] `vertical` is one of: `hvac`, `plumbing`, `electrical`, `roofing`, `landscaping`
- [ ] `address.zip` is valid for the city/state
- [ ] `coordinates` are realistic for the city
- [ ] `established` year is 5-25 years in the past
- [ ] `rating` is between 4.7 and 4.9
- [ ] `reviewCount` is between 200 and 1000
- [ ] `seo.defaultDescription` is under 160 characters
- [ ] All URLs use HTTPS
- [ ] JSON is valid with no trailing commas
- [ ] Licenses are formatted appropriately for the state

---

## Integration

This prompt is used for:
1. **Promo Build** - Quick 15-30 min demo site setup
2. **New Client Onboarding** - Generate initial business profile
3. **Template Cloning** - Starting point when duplicating template

The generated `business.json` works with the template's copy engine which replaces `{{variables}}` throughout the site:
- `{{businessName}}` - Company name
- `{{phone}}` - Formatted phone number
- `{{city}}`, `{{state}}` - Location
- `{{rating}}`, `{{reviewCount}}` - Social proof
- `{{yearsInBusiness}}` - Calculated from established year
- `{{responseTime}}`, `{{warrantyYears}}` - Service promises

---

## Quick Reference: State License Formats

| State | HVAC | Plumbing | Electrical |
|-------|------|----------|------------|
| TX | TACLA #12345 | M-12345 | EC-12345 |
| AZ | ROC #123456 | ROC #123456 | ROC #123456 |
| CA | CSLB #123456 | C-36 #123456 | C-10 #123456 |
| FL | CAC1234567 | CFC1234567 | EC13012345 |
| GA | CN123456 | MP123456 | EN123456 |

---

## Quick Reference: Major City Coordinates

| City | State | Lat | Lng | ZIP Pattern |
|------|-------|-----|-----|-------------|
| Phoenix | AZ | 33.4484 | -112.0740 | 850XX |
| Austin | TX | 30.2672 | -97.7431 | 787XX |
| Dallas | TX | 32.7767 | -96.7970 | 752XX |
| Houston | TX | 29.7604 | -95.3698 | 770XX |
| Los Angeles | CA | 34.0522 | -118.2437 | 900XX |
| Miami | FL | 25.7617 | -80.1918 | 331XX |
| Atlanta | GA | 33.7490 | -84.3880 | 303XX |
| Denver | CO | 39.7392 | -104.9903 | 802XX |
| Seattle | WA | 47.6062 | -122.3321 | 981XX |
| Chicago | IL | 41.8781 | -87.6298 | 606XX |
