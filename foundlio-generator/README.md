# Foundlio Generator

**AI-powered website configuration generator for local service businesses.**

This toolkit enables AI (via OpenRouter or Claude Code) to generate complete JSON configurations that power customized websites from minimal business input.

## Quick Start

### Setup

```bash
cd foundlio-generator

# Copy and edit environment file
cp .env.example .env
# Edit .env and add your OpenRouter API key
```

### Using with OpenRouter API

The script accepts **any input format** - natural language, JSON, or file:

```bash
# Natural language (easiest!)
node scripts/generate.js "Plumbing company called Valley Plumbing in Mesa AZ, phone 480-555-7890"

# JSON string
node scripts/generate.js -i '{"name":"Valley Plumbing","phone":"(480) 555-7890","email":"info@vp.com","city":"Mesa","state":"AZ","vertical":"plumbing"}'

# JSON file
node scripts/generate.js -i input.json -o ./output
```

### Using with Claude Code

```bash
# Ask Claude to generate a site
claude "Generate a plumbing website for Valley Plumbing Pros in Mesa, AZ. Phone: (480) 555-7890. Use foundlio-generator schemas as reference."
```

Claude will read the schemas and examples, then generate all required JSON files.

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    GENERATION PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐ │
│  │  Minimal     │     │  AI Engine   │     │  Output Files    │ │
│  │  Input       │────▶│  + Schemas   │────▶│                  │ │
│  │              │     │  + Examples  │     │  business.json   │ │
│  │ • name       │     │  + Prompts   │     │  services.json   │ │
│  │ • phone      │     │              │     │  areas.json      │ │
│  │ • city       │     │              │     │  testimonials.json│
│  │ • vertical   │     │              │     │  faqs.json       │ │
│  └──────────────┘     └──────────────┘     │  posts.json      │ │
│                                            │  theme.json      │ │
│                                            └────────┬─────────┘ │
│                                                     │           │
│                                                     ▼           │
│                                            ┌──────────────────┐ │
│                                            │  Drop into       │ │
│                                            │  template /data  │ │
│                                            └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
foundlio-generator/
├── README.md                 # This file
├── schemas/                  # TypeScript schemas (source of truth)
│   ├── business.schema.ts    # Business info structure
│   ├── services.schema.ts    # Services structure
│   ├── areas.schema.ts       # Service areas
│   ├── testimonials.schema.ts# Reviews
│   ├── posts.schema.ts       # Blog posts
│   ├── faqs.schema.ts        # FAQs
│   ├── theme.schema.ts       # Theme configuration
│   └── index.ts              # Combined exports
│
├── examples/                 # Complete examples per vertical
│   ├── hvac/                 # All JSON files for HVAC
│   ├── plumbing/             # All JSON files for plumbing
│   └── electrical/           # All JSON files for electrical
│
├── prompts/
│   ├── MASTER.md             # Main AI generation prompt
│   ├── INPUT_FORMAT.md       # Input specification
│   └── verticals/            # Industry-specific guidance
│       ├── hvac.md
│       ├── plumbing.md
│       └── electrical.md
│
├── content-library/          # Reference material for AI
│   ├── headlines.json        # Headline patterns
│   ├── services.json         # Service templates by vertical
│   ├── faqs.json             # FAQ templates
│   └── trust-signals.json    # Trust badge copy
│
├── scripts/
│   ├── generate.js           # OpenRouter generation script
│   └── validate.js           # Validation script
│
└── output-spec.md            # What files to generate & where
```

## Input Format

Minimal input required:

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

Optional fields that override AI generation:

```json
{
  "name": "Valley Plumbing Pros",
  "phone": "(480) 555-7890",
  "email": "service@valleyplumbingpros.com",
  "city": "Mesa",
  "state": "AZ",
  "vertical": "plumbing",

  "established": 2015,
  "address": "123 Main Street",
  "tagline": "Your Local Plumbing Experts",
  "style": "bold",
  "accentColor": "#2563eb"
}
```

## Output Files

The generator produces these files for the template's `/data` folder:

| File | Description |
|------|-------------|
| `business.json` | Core business info, hours, licenses, features |
| `services.json` | 6-8 services with full copy and SEO |
| `areas.json` | 3-10 service areas with local content |
| `testimonials.json` | 5-8 realistic reviews |
| `faqs.json` | 8-15 categorized FAQs |
| `posts.json` | 3-5 blog post stubs |
| `theme.json` | Theme configuration and colors |

## Supported Verticals

| Vertical | Status | Services |
|----------|--------|----------|
| HVAC | ✅ Complete | AC repair, installation, heating, maintenance |
| Plumbing | ✅ Complete | Drain cleaning, water heaters, leak repair |
| Electrical | ✅ Complete | Panel upgrades, rewiring, EV chargers |
| Roofing | 📝 Planned | Repair, replacement, storm damage |
| Landscaping | 📝 Planned | Design, installation, maintenance |

## Usage Examples

### Generate HVAC Site (Claude Code)

```
Generate website files for:
- Name: Desert Aire Comfort
- Phone: (602) 555-2665
- City: Phoenix, AZ
- Vertical: HVAC
- Style: bold-orange

Use the schemas in foundlio-generator/schemas and examples in foundlio-generator/examples/hvac as reference.
```

### Generate Plumbing Site (OpenRouter)

```bash
node scripts/generate.js --input '{
  "name": "Valley Plumbing Pros",
  "phone": "(480) 555-7890",
  "city": "Mesa",
  "state": "AZ",
  "vertical": "plumbing"
}'
```

### Validate Generated Files

```bash
node scripts/validate.js ./output
```

## Integration with Template

After generation:

```bash
# Copy generated files to template
cp ./output/*.json ../data/

# Or specify output directly
node scripts/generate.js --input input.json --output ../data
```

The template will automatically use the new configuration.

## Contributing

To add a new vertical:

1. Create `prompts/verticals/{vertical}.md` with industry guidance
2. Add examples to `examples/{vertical}/`
3. Update `content-library/*.json` with vertical-specific content
4. Test generation with sample input

## License

MIT - Part of the Foundlio ecosystem.
