'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Heatmap } from '@/components/Heatmap';
import { ClientSideArticle } from '@/components/ClientSideArticle';
import { useRevisions, useArticleContent } from '@/hooks/useWikipediaData';

const SnapshotPage = () => {
  // Use the useParams hook instead of receiving props
  const params = useParams();
  const id = params?.id as string;
  
  const { revisions, isLoading: isRevisionsLoading } = useRevisions(id);
  const { content, isLoading: isContentLoading } = useArticleContent(id);

  if (isRevisionsLoading || isContentLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article Snapshot: {id}</h1>
        <div className="mb-8">
          <Heatmap 
            revisions={revisions} 
            onDayClick={(day) => {
              console.log('Day clicked:', day);
              // Add logic to handle day click, e.g., fetching revisions for that day
            }} 
          />
        </div>
        <div className="mt-8">
          <ClientSideArticle content={content} title={id} />
        </div>
      </div>
    </>
  );
};

export default SnapshotPage;