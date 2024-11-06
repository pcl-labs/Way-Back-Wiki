import { NextRequest, NextResponse } from 'next/server';

const REVISIONS_PER_PAGE = 50;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const title = searchParams.get('title');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const rvcontinue = searchParams.get('rvcontinue') || '';

  if (!id && !title) {
    return NextResponse.json({ error: 'Either id or title parameter is required' }, { status: 400 });
  }

  try {
    const apiUrl = new URL('https://en.wikipedia.org/w/api.php');
    apiUrl.searchParams.append('action', 'query');
    apiUrl.searchParams.append('prop', 'revisions');
    apiUrl.searchParams.append('rvprop', 'ids|timestamp|user|comment|content');
    apiUrl.searchParams.append('rvlimit', REVISIONS_PER_PAGE.toString());
    apiUrl.searchParams.append('format', 'json');
    apiUrl.searchParams.append('origin', '*');

    if (id) {
      apiUrl.searchParams.append('pageids', id);
    } else if (title) {
      apiUrl.searchParams.append('titles', decodeURIComponent(title));
    }

    if (rvcontinue) {
      apiUrl.searchParams.append('rvcontinue', rvcontinue);
    }

    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Wikipedia API responded with status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.error) {
      console.error('Wikipedia API error:', data.error);
      return NextResponse.json({ error: data.error.info }, { status: 500 });
    }

    // Check if pages exist in the response
    if (!data.query?.pages) {
      console.error('No pages found in Wikipedia API response');
      return NextResponse.json({ error: 'No page found' }, { status: 404 });
    }

    const pageId = Object.keys(data.query.pages)[0];
    const pageData = data.query.pages[pageId];

    // Check if the page exists
    if (pageId === '-1' || !pageData) {
      console.error('Page not found');
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const revisions = pageData.revisions || [];
    const pageTitle = pageData.title;
    const titleSlug = pageTitle.replace(/ /g, '_');

    interface Revision {
      revid: number;
      parentid: number;
      user: string;
      timestamp: string;
      comment: string;
      '*': string;
    }

    const processedRevisions = revisions.map((rev: Revision, index: number) => ({
      id: rev.revid,
      title: pageTitle,
      titleSlug: titleSlug,
      parentId: rev.parentid,
      user: rev.user,
      timestamp: rev.timestamp,
      comment: rev.comment,
      content: rev['*'],
      diff: index < revisions.length - 1 ? {
        from: revisions[index + 1]['*'],
        to: rev['*']
      } : null
    }));

    const nextRvContinue = data.continue?.rvcontinue || null;

    return NextResponse.json({
      revisions: processedRevisions,
      nextPage: nextRvContinue ? page + 1 : null,
      nextRvContinue,
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
