import { useState, useEffect } from 'react';
import { Revision } from '@/types/revisions';

export function useRevisions(identifier: string) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRevisions() {
      try {
        // Determine if identifier is a page ID (numeric) or title
        const isPageId = /^\d+$/.test(identifier);
        const queryParam = isPageId ? `pageids=${identifier}` : `titles=${encodeURIComponent(identifier)}`;
        
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&${queryParam}&rvprop=timestamp|user|comment|content&rvlimit=500&format=json&origin=*`
        );
        const data = await res.json();
        
        // Handle both ID and title-based responses
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        const pageRevisions = pages[pageId]?.revisions || [];
        
        setRevisions(pageRevisions);
      } catch (error) {
        console.error('Error fetching revisions:', error);
        setRevisions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRevisions();
  }, [identifier]);

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
