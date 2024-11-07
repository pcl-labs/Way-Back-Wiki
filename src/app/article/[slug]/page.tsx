"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { RevisionList } from '@/components/RevisionList';
import { SnapshotLink } from '@/components/SnapshotLink';
import { useRevisions } from '@/hooks/useWikipediaData';
import { Revision } from '@/types/revisions';

const ArticlePage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const title = decodeURIComponent(slug.replace(/_/g, ' '));
  const { revisions, isLoading } = useRevisions(title);

  const handleRevisionSelect = (revision: Revision) => {
    console.log('Selected revision:', revision);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article Revisions: {title}</h1>
        {revisions.length > 0 && (
          <SnapshotLink 
            articleId={revisions[0].id.toString()} 
            title={title}
          />
        )}
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