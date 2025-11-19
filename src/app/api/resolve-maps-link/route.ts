import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
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
    
    console.log('Resolved URL:', resolvedUrl);

    // Try to extract useful information from the URL
    let placeName = null;
    let lat = null;
    let lng = null;

    // Extract place name from path
    const placeMatch = resolvedUrl.match(/\/maps\/place\/([^\/]+)/);
    if (placeMatch) {
      placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    }

    // Extract coordinates from data parameters
    const latMatch = resolvedUrl.match(/!3d(-?\d+\.\d+)/);
    const lngMatch = resolvedUrl.match(/!4d(-?\d+\.\d+)/);
    
    if (latMatch) lat = parseFloat(latMatch[1]);
    if (lngMatch) lng = parseFloat(lngMatch[1]);

    return NextResponse.json({ 
      resolvedUrl,
      placeName,
      lat,
      lng
    });
  } catch (error) {
    console.error('Error resolving URL:', error);
    return NextResponse.json(
      { error: 'Failed to resolve URL', resolvedUrl: url },
      { status: 500 }
    );
  }
}
