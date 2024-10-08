import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&pageids=${articleId}&rvprop=timestamp|user|comment&rvlimit=500&format=json&origin=*`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch revisions');
    }

    const data = await response.json();
    const page = Object.values(data.query.pages)[0] as any;
    const revisions = page.revisions || [];

    return NextResponse.json(revisions);
  } catch (error) {
    console.error('Error fetching revisions:', error);
    return NextResponse.json({ error: 'Failed to fetch revisions' }, { status: 500 });
  }
}