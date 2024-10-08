"use client";

import { useState, useEffect } from 'react';
import { Revision } from '@/types/revisions';

export const useRevisions = (articleId: string) => {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRevisions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/revisions?articleId=${articleId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch revisions');
        }
        const data = await response.json();
        setRevisions(data);
      } catch (error) {
        console.error('Error fetching revisions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevisions();
  }, [articleId]);

  return { revisions, isLoading };
};