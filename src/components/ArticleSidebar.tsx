"use client";

import React from 'react';
import { Heatmap } from '@/components/Heatmap';
import { RevisionList } from '@/components/RevisionList';
import { Revision } from '@/types/revisions';

interface ArticleSidebarProps {
  revisions: Revision[];
  onRevisionSelect: (revision: Revision) => void;
}

export function ArticleSidebar({ revisions, onRevisionSelect }: ArticleSidebarProps) {
  const handleDayClick = (day: Date) => {
    // Handle day click logic here
    console.log('Day clicked:', day);
    // You can filter revisions for the selected day and update the state if needed
  };

  return (
    <div className="hidden md:block">
      <Heatmap 
        revisions={revisions} 
        onDayClick={handleDayClick} 
      />
      <RevisionList 
        revisions={revisions} 
        onRevisionSelect={onRevisionSelect} 
      />
    </div>
  );
}