import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  console.log('[resolve-maps-link] Incoming URL:', url);

  if (!url) {
    console.log('[resolve-maps-link] No URL provided');
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
  }

  try {
    // Fetch the short URL to get the redirect location
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Get the final URL after redirects
    const resolvedUrl = response.url;
    console.log('[resolve-maps-link] Resolved URL:', resolvedUrl);

    // Try to extract useful information from the URL
    let placeName = null;
    let lat = null;
    let lng = null;

    // Extract place name from path
    const placeMatch = resolvedUrl.match(/\/maps\/place\/([^\/]+)/);
    if (placeMatch) {
      placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      console.log('[resolve-maps-link] Extracted placeName:', placeName);
    }


    // Extract coordinates from data parameters
    const latMatch = resolvedUrl.match(/!3d(-?\d+\.\d+)/);
    const lngMatch = resolvedUrl.match(/!4d(-?\d+\.\d+)/);
    if (latMatch) {
      lat = parseFloat(latMatch[1]);
      console.log('[resolve-maps-link] Extracted lat:', lat);
    }
    if (lngMatch) {
      lng = parseFloat(lngMatch[1]);
      console.log('[resolve-maps-link] Extracted lng:', lng);
    }

    // If coordinates are missing but placeName is available, use Google Geocoding API
    if ((!lat || !lng) && placeName) {
      try {
        const apiKey = "AIzaSyB2Le7CZu6DgENeLQczIlQr-bIedFpSZ7w";
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${apiKey}`;
        const geoRes = await fetch(geocodeUrl);
        const geoData = await geoRes.json();
        if (geoData.status === "OK" && geoData.results.length > 0) {
          lat = geoData.results[0].geometry.location.lat;
          lng = geoData.results[0].geometry.location.lng;
          console.log('[resolve-maps-link] Geocoded lat/lng:', lat, lng);
        } else {
          console.warn('[resolve-maps-link] Geocoding failed:', geoData.status, geoData.error_message);
        }
      } catch (geoError) {
        console.error('[resolve-maps-link] Geocoding error:', geoError);
      }
    }

    console.log('[resolve-maps-link] Returning:', { resolvedUrl, placeName, lat, lng });
    return NextResponse.json({ 
      resolvedUrl,
      placeName,
      lat,
      lng
    });
  } catch (error) {
    console.error('[resolve-maps-link] Error resolving URL:', error);
    return NextResponse.json(
      { error: 'Failed to resolve URL', resolvedUrl: url },
      { status: 500 }
    );
  }
}
