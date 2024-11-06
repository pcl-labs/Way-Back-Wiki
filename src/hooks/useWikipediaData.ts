import { useState, useEffect, useCallback } from 'react';
import { Revision } from '@/types/revisions';
import { useArticleContent } from './useArticleContent';

function useRevisions(title: string) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [continueToken, setContinueToken] = useState<string | null>(null);

  const fetchRevisions = useCallback(async (continueFrom?: string) => {
    if (!title) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ title: encodeURIComponent(title) });
      if (continueFrom) {
        params.append('rvcontinue', continueFrom);
      }

      const response = await fetch(`/api/revisions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch revisions');
      }
      const data = await response.json();
      
      // Append new revisions, ensuring no duplicates
      setRevisions(prev => {
        const existingIds = new Set(prev.map(r => r.id));
        const newRevisions = data.revisions.filter(r => !existingIds.has(r.id));
        return [...prev, ...newRevisions];
      });
      
      // Update continue token and hasMore status
      setContinueToken(data.continue);
      setHasMore(!!data.continue);
    } catch (error) {
      console.error('Error fetching revisions:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch revisions');
    } finally {
      setIsLoading(false);
    }
  }, [title]);

  // Initial load
  useEffect(() => {
    setRevisions([]); // Reset revisions when title changes
    setContinueToken(null);
    setHasMore(true);
    fetchRevisions();
  }, [title, fetchRevisions]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && continueToken) {
      fetchRevisions(continueToken);
    }
  }, [isLoading, hasMore, continueToken, fetchRevisions]);

  return { revisions, isLoading, error, hasMore, loadMore };
}

export { useRevisions, useArticleContent };