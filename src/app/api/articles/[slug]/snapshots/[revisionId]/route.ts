export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const revisionId = pathname.split('/').pop();

  if (!revisionId) {
    return Response.json({ error: 'Revision ID is required' }, { status: 400 });
  }

  try {
    const apiUrl = new URL('https://en.wikipedia.org/w/api.php');
    apiUrl.searchParams.append('action', 'parse');
    apiUrl.searchParams.append('format', 'json');
    apiUrl.searchParams.append('origin', '*');
    apiUrl.searchParams.append('prop', 'text|displaytitle');
    apiUrl.searchParams.append('oldid', revisionId);

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

    return Response.json({ content, title: displayTitle });
  } catch (error) {
    console.error('Error fetching article content:', error);
    return Response.json({ error: 'Failed to fetch article content' }, { status: 500 });
  }
}