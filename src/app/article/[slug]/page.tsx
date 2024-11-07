"use client";

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import dynamic from 'next/dynamic';
import { useArticleRevisions } from '@/hooks/useArticleRevisions';
import { ArticleRevision } from '@/types/articleRevisions';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const RevisionList = dynamic(() => import('@/components/RevisionList'), {
  loading: () => <Skeleton className="h-64 w-full" />,
});

const Heatmap = dynamic(() => import('@/components/Heatmap'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
});

const ArticlePage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const title = decodeURIComponent(slug.replace(/_/g, ' '));
  const { revisions, isLoading, hasMore, loadMore } = useArticleRevisions(title);
  const router = useRouter();

  const handleRevisionSelect = (revision: ArticleRevision) => {
    router.push(`/article/${revision.titleSlug}/snapshots/${revision.id}`);
  };

  const heatmapData = useMemo(() => {
    const countMap: { 
      [key: string]: { 
        count: number; 
        revisions: Array<{ 
          id: string;
          timestamp: string 
        }> 
      } 
    } = {};
    
    revisions.forEach(revision => {
      const date = new Date(revision.timestamp).toISOString().split('T')[0];
      if (!countMap[date]) {
        countMap[date] = { count: 0, revisions: [] };
      }
      countMap[date].count += 1;
      countMap[date].revisions.push({ 
        id: revision.id.toString(),
        timestamp: revision.timestamp 
      });
    });

    return Object.entries(countMap).map(([date, data]) => ({
      date,
      count: data.count,
      revisions: data.revisions,
    }));
  }, [revisions]);

  const maxCount = useMemo(() => {
    return Math.max(...heatmapData.map(d => d.count), 1);
  }, [heatmapData]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article Revisions: {title}</h1>
        <div className="mb-8">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <Heatmap 
              data={heatmapData}
              maxCount={maxCount}
              onDayClick={(day) => {
                console.log('Day clicked:', day);
              }}
            />
          )}
        </div>
        <div className="mt-8">
          <button 
            onClick={loadMore} 
            disabled={isLoading || !hasMore}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
          {isLoading && revisions.length === 0 ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <RevisionList 
              revisions={revisions} 
              onRevisionSelect={handleRevisionSelect}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ArticlePage;