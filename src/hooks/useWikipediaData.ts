import { useState, useEffect } from 'react';
import { Revision } from '@/types/revisions';

export function useRevisions(id: string) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRevisions() {
      if (!id) return;
      
      try {
        const res = await fetch(`/api/revisions?id=${id}`);
        const data = await res.json();
        
        if (data.error) {
          console.error('API Error:', data.error);
          return;
        }
        
        if (data.revisions) {
          setRevisions(data.revisions);
        }
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