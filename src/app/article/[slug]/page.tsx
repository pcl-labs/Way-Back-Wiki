"use client";

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { RevisionList } from '@/components/RevisionList';
import { SnapshotLink } from '@/components/SnapshotLink';
import { useRevisions } from '@/hooks/useWikipediaData';
import { Revision } from '@/types/revisions';

const ArticlePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const slug = params?.slug as string;
  const id = searchParams.get('id') || '';
  const { revisions, isLoading } = useRevisions(id);

  // Get the title from the URL slug
  const title = decodeURIComponent(slug.replace(/_/g, ' '));

  const handleRevisionSelect = (revision: Revision) => {
    console.log('Selected revision:', revision);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article Revisions: {title}</h1>
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