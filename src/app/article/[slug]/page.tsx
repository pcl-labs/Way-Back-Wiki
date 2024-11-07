"use client";

import React, { useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import dynamic from 'next/dynamic';
import { useArticleRevisions } from '@/hooks/useArticleRevisions';
import { ArticleRevision } from '@/types/articleRevisions';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const RevisionList = dynamic(() => import('@/components/RevisionList'), {
  loading: () => <Skeleton className="h-64 w-full" />,
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

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentTarget = observerTarget.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article Revisions: {title}</h1>
        <div className="mt-8">
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
        <div ref={observerTarget} className="h-10 flex items-center justify-center">
          {isLoading && <div>Loading more revisions...</div>}
        </div>
      </div>
    </>
  );
};

export default ArticlePage;