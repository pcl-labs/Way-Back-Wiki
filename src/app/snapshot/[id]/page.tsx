'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Heatmap } from '@/components/Heatmap';
import { ClientSideArticle } from '@/components/ClientSideArticle';
import { useRevisions, useArticleContent } from '@/hooks/useWikipediaData';

interface SnapshotPageProps {
  params: { id: string };
}

const SnapshotPage: React.FC<SnapshotPageProps> = ({ params }) => {
  const { id } = params;
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
          <ClientSideArticle content={content} />
        </div>
      </div>
    </>
  );
};

export default SnapshotPage;