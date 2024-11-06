import { useState, useEffect } from 'react';
import { Revision } from '@/types/revisions';
import { useArticleContent } from './useArticleContent';

function useRevisions(idOrTitle: string) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRevisions() {
      if (!idOrTitle) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const queryParam = /^\d+$/.test(idOrTitle) 
          ? `id=${idOrTitle}`
          : `title=${encodeURIComponent(idOrTitle)}`;
        
        const res = await fetch(`/api/revisions?${queryParam}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch revisions');
        }
        
        if (data.revisions) {
          setRevisions(data.revisions);
        } else {
          setError('No revisions found');
        }
      } catch (error) {
        console.error('Error fetching revisions:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch revisions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRevisions();
  }, [idOrTitle]);

  return { revisions, isLoading, error };
}

// Export useRevisions and re-export useArticleContent
export { useRevisions, useArticleContent };