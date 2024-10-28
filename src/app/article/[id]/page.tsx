"use client";

import React from 'react';
import { Header } from '@/components/Header';
import { RevisionList } from '@/components/RevisionList';
import { SnapshotLink } from '@/components/SnapshotLink';
import { useRevisions } from '@/hooks/useWikipediaData';
import { Revision } from '@/types/revisions';

interface ArticlePageProps {
  params: { id: string };
}

const ArticlePage: React.FC<ArticlePageProps> = ({ params }) => {
  const { id } = params;
  // Decode the URL parameter in case it's a title
  const decodedId = decodeURIComponent(id);
  const { revisions, isLoading } = useRevisions(decodedId);

  const handleRevisionSelect = (revision: Revision) => {
    console.log('Selected revision:', revision);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Article Revisions: {decodedId}
        </h1>
        <SnapshotLink articleId={decodedId} />
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
