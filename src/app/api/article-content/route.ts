import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=parse&pageid=${articleId}&format=json&origin=*`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch article content');
    }

    const data = await response.json();
    const content = data.parse.text['*'];

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching article content:', error);
    return NextResponse.json({ error: 'Failed to fetch article content' }, { status: 500 });
  }
}