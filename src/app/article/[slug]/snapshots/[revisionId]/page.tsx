'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Heatmap } from '@/components/Heatmap';
import { ArticleContent } from '@/components/ArticleContent';
import { useRevisions, useArticleContent } from '@/hooks/useWikipediaData';

const SnapshotPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const revisionId = params?.revisionId as string;
  const title = decodeURIComponent(slug.replace(/_/g, ' '));
  
  const { revisions, isLoading: isRevisionsLoading } = useRevisions(title);
  const { content, isLoading: isContentLoading } = useArticleContent(revisionId, title);

  if (isRevisionsLoading || isContentLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article Snapshot: {title}</h1>
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
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <ArticleContent html={content} className="prose max-w-none" />
        </div>
      </div>
    </>
  );
};

export default SnapshotPage; 