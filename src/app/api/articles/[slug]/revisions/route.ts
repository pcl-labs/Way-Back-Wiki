import { NextRequest, NextResponse } from 'next/server';

async function fetchAllRevisions(title: string, fullHistory: boolean) {
  let allRevisions = [];
  let continueToken = null;

  do {
    const apiUrl = new URL('https://en.wikipedia.org/w/api.php');
    apiUrl.searchParams.append('action', 'query');
    apiUrl.searchParams.append('prop', 'revisions');
    apiUrl.searchParams.append('titles', decodeURIComponent(title));
    apiUrl.searchParams.append('rvprop', 'ids|timestamp|user|comment');
    apiUrl.searchParams.append('format', 'json');
    apiUrl.searchParams.append('origin', '*');
    apiUrl.searchParams.append('rvdir', 'older');
    apiUrl.searchParams.append('rvstart', 'now');
    apiUrl.searchParams.append('rvend', '2000-01-01T00:00:00Z');
    apiUrl.searchParams.append('rvlimit', '5000');

    if (continueToken) {
      apiUrl.searchParams.append('rvcontinue', continueToken);
    }

    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      throw new Error(`Wikipedia API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const pageId = Object.keys(data.query.pages)[0];
    const pageData = data.query.pages[pageId];

    if (pageId !== '-1' && pageData) {
      allRevisions = allRevisions.concat(pageData.revisions || []);
    }

    continueToken = data.continue?.rvcontinue || null;
  } while (continueToken);

  return allRevisions;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const slug = url.pathname.split('/')[3]; // Extract the slug from the URL path
  const fullHistory = url.searchParams.get('fullHistory') === 'true';

  if (!slug) {
    return NextResponse.json({ error: 'Title parameter is required' }, { status: 400 });
  }

  try {
    const title = decodeURIComponent(slug);
    const revisions = await fetchAllRevisions(title, fullHistory);
    return NextResponse.json({ revisions }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching revisions:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch revisions' 
    }, { status: 500 });
  }
}
