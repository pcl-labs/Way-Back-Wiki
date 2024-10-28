"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Use useRouter from next/navigation for the new app router
import { Header } from '@/components/Header';
import { RevisionList } from '@/components/RevisionList';
import { SnapshotLink } from '@/components/SnapshotLink';
import { useRevisions } from '@/hooks/useWikipediaData';
import { useArticleTitle } from '@/hooks/useArticleContent';
import { Revision } from '@/types/revisions';

interface ArticlePageProps {
  params: { id: string };
}

const ArticlePage: React.FC<ArticlePageProps> = ({ params }) => {
  const { id } = params;
  const router = useRouter();  // Initialize the new router for navigation

  // Fetch article title and revisions
  const { revisions, isLoading: revisionsLoading } = useRevisions(id);
  const { title, isLoading: titleLoading } = useArticleTitle(id);

  // Use useEffect to change the URL when the title is fetched
  useEffect(() => {
    if (title && !titleLoading) {
      // Update the URL dynamically using the new router (without third argument)
      router.replace(`/article/${encodeURIComponent(title)}`);
    }
  }, [title, titleLoading, router]);

  const handleRevisionSelect = (revision: Revision) => {
    console.log('Selected revision:', revision);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {titleLoading ? 'Loading title...' : `Article: ${title}`}
        </h1>
        <SnapshotLink articleId={id} />
        <div className="mt-8">
          {revisionsLoading ? (
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
