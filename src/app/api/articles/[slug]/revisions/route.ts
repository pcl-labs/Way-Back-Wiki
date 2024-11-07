import { NextRequest, NextResponse } from 'next/server';

interface WikiRevision {
  revid: number;
  parentid?: number;
  user: string;
  timestamp: string;
  comment: string;
  size?: number;
  sizediff?: number;
  '*'?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title');
  const rvcontinue = searchParams.get('rvcontinue');
  const fullHistory = searchParams.get('fullHistory') === 'true';

  if (!title) {
    return NextResponse.json({ error: 'Title parameter is required' }, { status: 400 });
  }

  try {
    const apiUrl = new URL('https://en.wikipedia.org/w/api.php');
    apiUrl.searchParams.append('action', 'query');
    apiUrl.searchParams.append('prop', 'revisions');
    apiUrl.searchParams.append('titles', decodeURIComponent(title));
    apiUrl.searchParams.append('rvprop', 'ids|timestamp|user|comment|size|sizediff|content');
    apiUrl.searchParams.append('format', 'json');
    apiUrl.searchParams.append('origin', '*');
    apiUrl.searchParams.append('rvdir', 'older');
    apiUrl.searchParams.append('rvstart', 'now');
    apiUrl.searchParams.append('rvend', '2000-01-01T00:00:00Z');

    // For full history, use maximum limit, otherwise use standard pagination
    apiUrl.searchParams.append('rvlimit', fullHistory ? '5000' : '50');

    if (rvcontinue && !fullHistory) {
      apiUrl.searchParams.append('rvcontinue', rvcontinue);
    }

    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Wikipedia API responded with status: ${response.status}`);
    }
    
    const data = await response.json();

    if (!data.query?.pages) {
      return NextResponse.json({ error: 'No page found' }, { status: 404 });
    }

    const pageId = Object.keys(data.query.pages)[0];
    const pageData = data.query.pages[pageId];

    if (pageId === '-1' || !pageData) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const revisions = pageData.revisions || [];
    const processedRevisions = revisions.map((rev: WikiRevision) => ({
      id: rev.revid,
      title: pageData.title,
      titleSlug: pageData.title.replace(/ /g, '_'),
      parentId: rev.parentid,
      user: rev.user,
      timestamp: rev.timestamp,
      comment: rev.comment,
      size: rev.size,
      sizediff: rev.sizediff,
      content: rev['*']
    }));

    // Only include continue token if not requesting full history
    const nextContinue = !fullHistory ? data.continue?.rvcontinue : null;

    return NextResponse.json({
      revisions: processedRevisions,
      continue: nextContinue,
      hasMore: !!nextContinue
    }, {
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
