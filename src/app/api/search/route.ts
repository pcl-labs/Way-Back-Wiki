import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate every hour

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  try {
    const apiUrl = new URL('https://en.wikipedia.org/w/api.php');
    apiUrl.searchParams.append('action', 'query');
    apiUrl.searchParams.append('list', 'search');
    apiUrl.searchParams.append('srsearch', query);
    apiUrl.searchParams.append('format', 'json');
    apiUrl.searchParams.append('origin', '*');

    const response = await fetch(apiUrl.toString());
    const data = await response.json();

    // Process the results to include the URL-friendly title
    if (data.query?.search) {
      data.query.search = data.query.search.map((result: any) => ({
        ...result,
        titleSlug: result.title.replace(/ /g, '_')
      }));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}