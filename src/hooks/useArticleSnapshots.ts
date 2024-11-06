"use client";

import { useState, useEffect } from 'react';

export function useArticleSnapshots(revisionId?: string, title?: string) {
  const [content, setContent] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!revisionId || !title) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/articles/${encodeURIComponent(title)}/snapshots/${revisionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch article content');
        }
        
        const data = await response.json();
        setContent(data.content);
        setPageTitle(data.title);
      } catch (error) {
        console.error('Error fetching article content:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [revisionId, title]);

  return { content, pageTitle, isLoading, error };
}