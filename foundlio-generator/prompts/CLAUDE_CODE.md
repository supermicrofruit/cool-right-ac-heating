# Using Foundlio Generator with Claude Code

This document provides quick-reference instructions for using the generator with Claude Code.

## Quick Start

Tell Claude:

```
Generate website configuration files for this business using the foundlio-generator schemas and examples:

Name: [Business Name]
Phone: [Phone Number]
Email: [Email]
City: [City]
State: [State]
Vertical: [hvac/plumbing/electrical]
```

## Full Command

```
Using the foundlio-generator folder as reference:
1. Read the schemas in foundlio-generator/schemas/
2. Read the example files in foundlio-generator/examples/[vertical]/
3. Read the vertical guide in foundlio-generator/prompts/verticals/[vertical].md

Generate complete JSON files for:
- Name: Valley Plumbing Pros
- Phone: (480) 555-7890
- Email: service@valleyplumbingpros.com
- City: Mesa
- State: AZ
- Vertical: plumbing

Output all 6 JSON files:
1. business.json
2. services.json
3. areas.json
4. testimonials.json
5. faqs.json
6. posts.json

Save them to foundlio-generator/output/
```

## What Claude Should Do

1. **Read the schemas** to understand exact structure
2. **Read examples** from the matching vertical
3. **Read vertical guide** for industry-specific content
4. **Generate realistic content** specific to the city/region
5. **Save files** to specified output location

## After Generation

Validate the output:

```bash
cd foundlio-generator
node scripts/validate.js ./output
```

Copy to template:

```bash
cp ./output/*.json ../data/
```

## Example Prompts

### HVAC Site
```
Generate foundlio website files for:
- Desert Aire Comfort
- (602) 555-2665
- info@desertairecomfort.com
- Phoenix, AZ
- HVAC

Use foundlio-generator/schemas and foundlio-generator/examples/hvac as reference.
```

### Plumbing Site
```
Generate foundlio website files for:
- Valley Plumbing Pros
- (480) 555-7890
- service@valleyplumbingpros.com
- Mesa, AZ
- Plumbing

Use bold-blue theme. Business established in 2015.
```

### Electrical Site
```
Generate foundlio website files for:
- Spark Electric Co
- (480) 555-9999
- info@sparkelectric.com
- Scottsdale, AZ
- Electrical

They specialize in EV charger installation and are Tesla certified.
```

## Tips

1. **Be specific about location** - Claude will research real neighborhoods and landmarks
2. **Mention specialties** - If the business has a focus area, mention it
3. **Provide any known info** - Established year, licenses, certifications help
4. **Request specific theme** - Mention if you want a particular color scheme
5. **Ask for validation** - Request Claude run the validation script after generation

## Common Customizations

Add to your prompt:

- "Use bold-orange theme for high-energy feel"
- "Emphasize emergency services in the copy"
- "Include 10 service areas across the metro"
- "Generate 5 detailed blog posts"
- "Focus on commercial services as well as residential"
- "Business was established in 2010"
- "They are Carrier Factory Authorized"
