import { NextRequest, NextResponse } from 'next/server';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Extract place info from Google Maps URL
function parseGoogleMapsUrl(url: string) {
  // Extract place name from URL
  // Format: /maps/place/Place+Name/@lat,lng
  const placeMatch = url.match(/\/place\/([^/@]+)/);
  const placeName = placeMatch
    ? decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
    : null;

  // Extract coordinates
  const coordMatch = url.match(/@(-?[\d.]+),(-?[\d.]+)/);
  const coordinates = coordMatch
    ? { lat: parseFloat(coordMatch[1]), lng: parseFloat(coordMatch[2]) }
    : null;

  return { placeName, coordinates };
}

// Use Google Places API (if available) or fallback to URL parsing
async function scrapeGoogleMaps(url: string) {
  const { placeName, coordinates } = parseGoogleMapsUrl(url);

  if (!placeName) {
    throw new Error('Could not extract place name from URL');
  }

  // For now, return parsed data from URL
  // The AI will generate reasonable defaults
  return {
    name: placeName,
    rating: 0, // Will need to be filled manually or by AI
    reviewCount: 0,
    category: 'Business', // Default, AI will improve
    address: '', // Will need to be filled
    phone: '',
    website: null,
    coordinates: coordinates || { lat: 0, lng: 0 },
    sourceUrl: url,
    needsEnrichment: true, // Flag that this needs more data
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Missing URL' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!url.includes('google.com/maps')) {
      return NextResponse.json(
        { error: 'Invalid Google Maps URL' },
        { status: 400, headers: corsHeaders }
      );
    }

    const scrapedData = await scrapeGoogleMaps(url);

    return NextResponse.json({
      success: true,
      data: scrapedData,
      message: scrapedData.needsEnrichment
        ? 'Basic data extracted from URL. Rating, reviews, phone, and address need to be added manually or use your desktop scraper for full data.'
        : 'Full data extracted',
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scraping failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
