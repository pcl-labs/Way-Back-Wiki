"use client";

import { useState, useEffect } from 'react';

export const useArticleTitle = (articleId: string) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTitle = async () => {
      setIsLoading(true);
      try {
        // Fetch article title from Wikipedia API based on articleId (which is the page ID)
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&pageids=${articleId}&prop=info`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch article title');
        }

        const data = await response.json();
        const page = data?.query?.pages?.[articleId];

        if (page && page.title) {
          setTitle(page.title);  // Set the title
        } else {
          throw new Error('No title found for this article ID');
        }
      } catch (error) {
        console.error('Error fetching article title:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTitle();
  }, [articleId]);

  return { title, isLoading };
};
