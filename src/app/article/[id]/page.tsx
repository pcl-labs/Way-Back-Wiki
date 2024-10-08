"use client";

import { FC, useState } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Heatmap } from '@/components/Heatmap';
import { RevisionList } from '@/components/RevisionList';
import { useRevisions } from '@/hooks/useRevisions';
import { useArticleContent } from '@/hooks/useArticleContent';

const ClientSideArticle = dynamic(() => import('@/components/ClientSideArticle'), { 
  ssr: false,
  loading: () => <p>Loading article content...</p>
});

interface ArticlePageProps {
  params: {
    id: string;
  };
}

const ArticlePage: FC<ArticlePageProps> = ({ params }) => {
  const { id } = params;
  const [selectedRevision, setSelectedRevision] = useState<string | null>(null);
  const { revisions, isLoading: isRevisionsLoading } = useRevisions(id);
  const { content, isLoading: isContentLoading } = useArticleContent(id);

  const handleRevisionSelect = (revision: string) => {
    setSelectedRevision(revision);
  };

  if (isRevisionsLoading || isContentLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article: {id}</h1>
        <div className="mb-8">
          <Heatmap revisions={revisions} onDayClick={(day) => {/* Handle day click */}} />
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
      </main>
    </div>
  );
};

export default ArticlePage;