import { useState, useEffect } from 'react';

export function useArticleContentWithTitle(id: string) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        // First, fetch the article content and title.
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&pageids=${id}&format=json&origin=*`);
        const data = await res.json();
        const pageData = data.query.pages[id];

        // Get the title of the article.
        setTitle(pageData.title);

        // If you need content, you can use another fetch here or you can extract it from revisions or other sources as needed.
        const contentRes = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&pageid=${id}&format=json&origin=*`);
        const contentData = await contentRes.json();
        setContent(contentData.parse.text['*']);
        
      } catch (error) {
        console.error('Error fetching article content or title:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, [id]);

  return { title, content, isLoading };
}
