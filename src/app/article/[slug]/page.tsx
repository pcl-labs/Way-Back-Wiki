"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { RevisionList } from '@/components/RevisionList';
import { useArticleRevisions } from '@/hooks/useArticleRevisions';
import { ArticleRevision } from '@/types/articleRevisions';
import { useRouter } from 'next/navigation';

const ArticlePage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const title = decodeURIComponent(slug.replace(/_/g, ' '));
  const { revisions, isLoading } = useArticleRevisions(title);
  const router = useRouter();

  const handleRevisionSelect = (revision: ArticleRevision) => {
    router.push(`/article/${revision.titleSlug}/snapshots/${revision.id}`);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article Revisions: {title}</h1>
        <div className="mt-8">
          {isLoading ? (
            <div>Loading revisions...</div>
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