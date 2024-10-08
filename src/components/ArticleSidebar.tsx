"use client";

import { FC } from 'react';
import { Heatmap } from '@/components/Heatmap';
import { RevisionList } from '@/components/RevisionList';
import { useRevisions } from '@/hooks/useRevisions';

interface ArticleSidebarProps {
  articleId: string;
  onRevisionSelect: (revision: string) => void;
}

const ArticleSidebar: FC<ArticleSidebarProps> = ({ articleId, onRevisionSelect }) => {
  const { revisions, isLoading } = useRevisions(articleId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hidden md:block">
      <Heatmap revisions={revisions} onDayClick={(day) => {/* Handle day click */}} />
      <RevisionList 
        revisions={revisions} 
        onRevisionSelect={onRevisionSelect} 
      />
    </div>
  );
};

export default ArticleSidebar;