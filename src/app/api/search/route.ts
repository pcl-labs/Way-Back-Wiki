import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate every hour

interface WikiSearchResult {
  pageid: number;
  title: string;
  snippet?: string;
}

interface WikiSearchResponse {
  query?: {
    search: WikiSearchResult[];
  };
  error?: {
    code: string;
    info: string;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query
      )}&format=json&origin=*`
    );

    if (!response.ok) {
      throw new Error(`Wikipedia API responded with status: ${response.status}`);
    }

    const data: WikiSearchResponse = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 500 }
    );
  }
}