"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Heatmap } from '@/components/Heatmap';
import { RevisionList } from '@/components/RevisionList';
import { Revision } from '@/types/revisions';
import { useRevisions, useArticleContent } from '@/hooks/useWikipediaData';

const ClientSideArticle = dynamic(() => import('@/components/ClientSideArticle'), { 
  ssr: false,
  loading: () => <p>Loading article content...</p>
});

interface ArticlePageProps {
  params: { id: string };
}

const ArticlePage: React.FC<ArticlePageProps> = ({ params }) => {
  const { id } = params;
  const [selectedRevision, setSelectedRevision] = useState<string | null>(null);
  const { revisions, isLoading: isRevisionsLoading } = useRevisions(id);
  const { content, isLoading: isContentLoading } = useArticleContent(id);

  const handleRevisionSelect = (revision: Revision) => {
    setSelectedRevision(revision.timestamp);
    // Implement logic to fetch and display the selected revision
  };

  if (isRevisionsLoading || isContentLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article: {id}</h1>
        <div className="mb-8">
          <Heatmap 
            revisions={revisions} 
            onDayClick={(day) => {
              console.log('Day clicked:', day);
              // Add logic to handle day click, e.g., fetching revisions for that day
            }} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ClientSideArticle content={content} selectedRevision={selectedRevision} />
          </div>
          <div>
            <RevisionList 
              revisions={revisions} 
              onRevisionSelect={handleRevisionSelect}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;