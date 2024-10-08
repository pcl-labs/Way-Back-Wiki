import { NextRequest, NextResponse } from 'next/server';

const REVISIONS_PER_PAGE = 50;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id') || '25955086';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const rvcontinue = searchParams.get('rvcontinue') || '';

  try {
    const apiUrl = new URL('https://en.wikipedia.org/w/api.php');
    apiUrl.searchParams.append('action', 'query');
    apiUrl.searchParams.append('prop', 'revisions');
    apiUrl.searchParams.append('pageids', id);
    apiUrl.searchParams.append('rvprop', 'ids|timestamp|user|comment|content');
    apiUrl.searchParams.append('rvlimit', REVISIONS_PER_PAGE.toString());
    apiUrl.searchParams.append('format', 'json');
    apiUrl.searchParams.append('origin', '*');

    if (rvcontinue) {
      apiUrl.searchParams.append('rvcontinue', rvcontinue);
    }

    const response = await fetch(apiUrl.toString());
    const data = await response.json();

    const pageId = Object.keys(data.query.pages)[0];
    const revisions = data.query.pages[pageId].revisions || [];

    const processedRevisions = revisions.map((rev: any, index: number) => ({
      id: rev.revid,
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
    return NextResponse.json({ error: 'Failed to fetch revisions' }, { status: 500 });
  }
}