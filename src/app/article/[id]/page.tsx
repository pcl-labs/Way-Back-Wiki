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
  const { revisions, isLoading } = useRevisions(id);

  const handleRevisionSelect = (revision: Revision) => {
    console.log('Selected revision:', revision);
    // Implement any additional logic for revision selection if needed
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article Revisions: {id}</h1>
        <SnapshotLink articleId={id} />
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