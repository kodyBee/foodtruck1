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
      method: 'HEAD',
      redirect: 'follow',
    });

    // Get the final URL after redirects
    const resolvedUrl = response.url;

    return NextResponse.json({ resolvedUrl });
  } catch (error) {
    console.error('Error resolving URL:', error);
    return NextResponse.json(
      { error: 'Failed to resolve URL', resolvedUrl: url },
      { status: 500 }
    );
  }
}
