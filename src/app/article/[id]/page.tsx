"use client";

import React from 'react';
import { Header } from '@/components/Header';
import { RevisionList } from '@/components/RevisionList';
import { SnapshotLink } from '@/components/SnapshotLink';
import { useRevisions } from '@/hooks/useWikipediaData';

interface ArticlePageProps {
  params: { id: string };
}

const ArticlePage: React.FC<ArticlePageProps> = ({ params }) => {
  const { id } = params;
  const { revisions, isLoading } = useRevisions(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article Revisions: {id}</h1>
        <SnapshotLink articleId={id} />
        <div className="mt-8">
          <RevisionList 
            revisions={revisions} 
            onRevisionSelect={(revision) => console.log('Selected revision:', revision)}
          />
        </div>
      </div>
    </>
  );
};

export default ArticlePage;