"use client";

import { useState, useEffect, useCallback } from 'react';
import { ArticleRevision } from '@/types/articleRevisions';

interface UseArticleRevisionsOptions {
  fullHistory?: boolean;
}

export function useArticleRevisions(title: string, options: UseArticleRevisionsOptions = {}) {
  const [revisions, setRevisions] = useState<ArticleRevision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [continueToken, setContinueToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchRevisions = useCallback(async (continueFrom?: string) => {
    if (!title) return;

    setIsLoading(true);

    try {
      const params = new URLSearchParams({ 
        title: encodeURIComponent(title)
      });
      
      if (options.fullHistory) {
        params.append('fullHistory', 'true');
      } else if (continueFrom) {
        params.append('rvcontinue', continueFrom);
      }

      const response = await fetch(`/api/articles/${encodeURIComponent(title)}/revisions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch revisions');
      }
      const data = await response.json();

      if (options.fullHistory) {
        setRevisions(data.revisions);
      } else {
        setRevisions(prev => [...prev, ...data.revisions]);
      }
      
      setContinueToken(data.continue || null);
      setHasMore(!!data.continue);
    } catch (error) {
      console.error('Error fetching revisions:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch revisions');
    } finally {
      setIsLoading(false);
    }
  }, [title, options.fullHistory]);

  useEffect(() => {
    setRevisions([]);
    setContinueToken(null);
    setHasMore(true);
    fetchRevisions();
  }, [title, fetchRevisions]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && continueToken && !options.fullHistory) {
      fetchRevisions(continueToken);
    }
  }, [isLoading, hasMore, continueToken, fetchRevisions, options.fullHistory]);

  return { revisions, isLoading, error, hasMore, loadMore };
}