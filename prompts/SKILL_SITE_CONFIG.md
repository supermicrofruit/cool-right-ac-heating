# Skill: Foundlio Site Config Editor

You are editing a JSON-driven website. The entire site is controlled by `data/site.config.json`.

## Quick Reference

### Structure
```
site.config.json
├── business     → Company info (name, phone, address)
├── theme        → Colors, fonts, style (or use preset)
├── pages        → Page configs with sections[]
├── content      → Services, testimonials, areas, FAQs
├── copy         → ALL UI text (buttons, labels, messages)
└── settings     → Lead capture, SEO, analytics
```

### Change Business Info
Edit `business` object:
- `name`, `phone`, `phoneRaw` (E.164 format)
- `email`, `address`, `vertical`
- `rating`, `reviewCount`, `established`

### Change Theme
Option 1 - Use preset:
```json
"theme": { "preset": "professional-blue" }
```

Option 2 - Custom:
```json
"theme": {
  "colors": { "primary": "#0066cc", "background": "#fff", "text": "#0f172a", "muted": "#64748b" },
  "borderRadius": "lg"
}
```

Available presets: `professional-blue`, `bold-orange`, `modern-teal`, `classic-navy`, `minimal-slate`, `luxury-gold`, `desert-red`, `fresh-green`, `electric-purple`, `trust-blue-light`, `contractor-dark`, `soft-coral`

### Add/Remove Sections
In `pages.{pageName}.sections[]`:
```json
{ "type": "services-grid", "enabled": true, "props": { "display": "featured", "limit": 6 } }
```

Types: `hero`, `services-grid`, `testimonials-slider`, `faq-accordion`, `cta-banner`, `trust-signals`, `process-steps`, `contact-form`, `map`, `stats`, `gallery`, `team`

### Content Display Modes
```json
"display": "all"       // Everything
"display": "featured"  // Only featured:true items
"display": "category"  // Filter by categories[]
"display": "manual"    // Specific IDs
"display": "random"    // Random selection
```

### Add Service
In `content.services[]`:
```json
{
  "slug": "service-slug",
  "name": "Service Name",
  "shortDescription": "Brief description",
  "icon": "IconName",
  "category": "category",
  "featured": true,
  "emergency": false,
  "order": 1,
  "meta": { "title": "SEO Title", "description": "SEO desc" }
}
```

### Change UI Text
In `copy`:
- `copy.navigation` → Menu labels
- `copy.buttons` → CTA text
- `copy.forms` → Form labels, placeholders, messages
- `copy.sections` → Section titles, subtitles

Variables: `{{businessName}}`, `{{phone}}`, `{{city}}`, `{{rating}}`, `{{reviewCount}}`, `{{yearsInBusiness}}`

### Hide Section
```json
{ "type": "testimonials", "enabled": false }
```

### Hide on Mobile
```json
{ "type": "stats", "showOn": { "mobile": false } }
```

## Validation
- `phoneRaw` must be E.164: `+15551234567`
- `vertical` must be: `hvac`, `plumbing`, `electrical`, `roofing`, `landscaping`
- `slug` must be URL-safe: lowercase, hyphens, no spaces
- `meta.description` under 160 chars
