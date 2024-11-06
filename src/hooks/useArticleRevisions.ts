"use client";

import { useState, useEffect, useCallback } from 'react';
import { ArticleRevision } from '@/types/articleRevisions';

export function useArticleRevisions(title: string) {
  const [revisions, setRevisions] = useState<ArticleRevision[]>([]);
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

      const response = await fetch(`/api/articles/${encodeURIComponent(title)}/revisions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch revisions');
      }
      const data = await response.json();
      
      setRevisions(prev => {
        const existingIds = new Set(prev.map((r: ArticleRevision) => r.id));
        const newRevisions = data.revisions.filter((r: ArticleRevision) => !existingIds.has(r.id));
        return [...prev, ...newRevisions];
      });
      
      setContinueToken(data.continue);
      setHasMore(!!data.continue);
    } catch (error) {
      console.error('Error fetching revisions:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch revisions');
    } finally {
      setIsLoading(false);
    }
  }, [title]);

  useEffect(() => {
    setRevisions([]);
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