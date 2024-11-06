"use client";

import { useState, useEffect } from 'react';

interface ArticleContentResponse {
  content: string;
  title: string;
}

export const useArticleContent = (articleId?: string, title?: string) => {
  const [content, setContent] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const queryParam = articleId 
          ? `articleId=${articleId}`
          : `title=${encodeURIComponent(title || '')}`;
        
        const response = await fetch(`/api/article-content?${queryParam}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch article content');
        }
        
        const data: ArticleContentResponse = await response.json();
        setContent(data.content);
        setPageTitle(data.title);
      } catch (error) {
        console.error('Error fetching article content:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch content');
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId || title) {
      fetchContent();
    }
  }, [articleId, title]);

  return { content, pageTitle, isLoading, error };
};