'use client';

import React, { useMemo, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { ArticleSnapshot } from '@/components/ArticleSnapshot';
import { useArticleRevisions } from '@/hooks/useArticleRevisions';
import { useArticleSnapshots } from '@/hooks/useArticleSnapshots';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const SnapshotPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const revisionId = params?.revisionId as string;
  const title = decodeURIComponent(slug.replace(/_/g, ' '));
  
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