import { useState, useEffect } from 'react';
import { Revision } from '@/types/revisions';

export function useRevisions(id: string) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRevisions() {
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&pageids=${id}&rvprop=timestamp|user|comment|content&rvlimit=500&format=json&origin=*`);
        const data = await res.json();
        const pageRevisions = data.query.pages[id].revisions;
        setRevisions(pageRevisions);
      } catch (error) {
        console.error('Error fetching revisions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRevisions();
  }, [id]);

  return { revisions, isLoading };
}

export function useArticleContent(id: string) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&pageid=${id}&format=json&origin=*`);
        const data = await res.json();
        setContent(data.parse.text['*']);
      } catch (error) {
        console.error('Error fetching article content:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, [id]);

  return { content, isLoading };
}