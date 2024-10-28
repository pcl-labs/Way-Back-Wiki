"use client";

import { useState, useEffect } from 'react';

export const useArticleContent = (articleId: string) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/article-content?articleId=${articleId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article content');
        }
        const data = await response.json();
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching article content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [articleId]);

  return { content, isLoading };
};