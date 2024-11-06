import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const articleId = searchParams.get('articleId');
  const title = searchParams.get('title');

  if (!articleId && !title) {
    return NextResponse.json({ error: 'Article ID or title is required' }, { status: 400 });
  }

  try {
    const apiUrl = new URL('https://en.wikipedia.org/w/api.php');
    apiUrl.searchParams.append('action', 'parse');
    apiUrl.searchParams.append('format', 'json');
    apiUrl.searchParams.append('origin', '*');
    apiUrl.searchParams.append('prop', 'text|displaytitle');

    if (articleId) {
      apiUrl.searchParams.append('oldid', articleId);
    } else if (title) {
      apiUrl.searchParams.append('page', decodeURIComponent(title));
    }

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error('Failed to fetch article content');
    }

    const data = await response.json();
    
    if (!data.parse) {
      throw new Error('Invalid response from Wikipedia API');
    }

    const content = data.parse.text['*'];
    const displayTitle = data.parse.displaytitle;

    return NextResponse.json({ content, title: displayTitle });
  } catch (error) {
    console.error('Error fetching article content:', error);
    return NextResponse.json({ error: 'Failed to fetch article content' }, { status: 500 });
  }
}