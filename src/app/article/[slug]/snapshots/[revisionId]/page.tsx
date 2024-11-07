'use client';

import React, { useMemo, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { ArticleSnapshot } from '@/components/ArticleSnapshot';
import { useArticleRevisions } from '@/hooks/useArticleRevisions';
import { useArticleSnapshots } from '@/hooks/useArticleSnapshots';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

const Heatmap = dynamic(() => import('@/components/Heatmap'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
});

const SnapshotPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const revisionId = params?.revisionId as string;
  const title = decodeURIComponent(slug.replace(/_/g, ' '));
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { revisions, isLoading: isRevisionsLoading } = useArticleRevisions(title, { fullHistory: true });
  const { content, isLoading: isContentLoading } = useArticleSnapshots(revisionId, title);

  const currentRevision = useMemo(() => 
    revisions.find(rev => rev.id.toString() === revisionId),
    [revisions, revisionId]
  );

  const parentRevision = useMemo(() => 
    revisions.find(rev => rev.id === currentRevision?.parentId),
    [revisions, currentRevision]
  );

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
        <h1 className="text-3xl font-bold mb-2">Article Snapshot: {title}</h1>
        {isRevisionsLoading ? (
          <div className="mb-6 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : currentRevision && (
          <div className="mb-6 space-y-1 text-sm text-gray-600">
            <div>
              <span className="font-medium">Revision ID: </span>
              {currentRevision.id}
            </div>
            <div>
              <span className="font-medium">Date: </span>
              {format(new Date(currentRevision.timestamp), 'MMMM d, yyyy h:mm:ss a')}
            </div>
            <div>
              <span className="font-medium">Editor: </span>
              {currentRevision.user}
            </div>
            {parentRevision && (
              <div>
                <span className="font-medium">Compared to revision: </span>
                {parentRevision.id} ({format(new Date(parentRevision.timestamp), 'MMMM d, yyyy h:mm:ss a')})
              </div>
            )}
            {currentRevision.comment && (
              <div>
                <span className="font-medium">Comment: </span>
                {currentRevision.comment}
              </div>
            )}
          </div>
        )}
        <div className="mb-8">
          {isRevisionsLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <Heatmap 
                data={heatmapData}
                maxCount={maxCount}
                onDayClick={(day) => {
                  console.log('Day clicked:', day);
                }}
              />
            </Suspense>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {isContentLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ArticleSnapshot html={content} className="prose max-w-none" />
          )}
        </div>
      </div>
    </>
  );
};

export default SnapshotPage;