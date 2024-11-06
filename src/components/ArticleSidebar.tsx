"use client";

import React, { useMemo } from 'react';
import { Heatmap } from '@/components/Heatmap';
import { RevisionList } from '@/components/RevisionList';
import { Revision } from '@/types/revisions';

interface ArticleSidebarProps {
  revisions: Revision[];
  handleDayClick: (day: Date) => void;
}

export function ArticleSidebar({ revisions, handleDayClick }: ArticleSidebarProps) {
  // Transform revisions into heatmap data format
  const heatmapData = useMemo(() => {
    const countMap: { [key: string]: { count: number; revisions: Array<{ timestamp: string }> } } = {};
    
    revisions.forEach(revision => {
      const date = new Date(revision.timestamp).toISOString().split('T')[0];
      if (!countMap[date]) {
        countMap[date] = { count: 0, revisions: [] };
      }
      countMap[date].count += 1;
      countMap[date].revisions.push({ timestamp: revision.timestamp });
    });

    return Object.entries(countMap).map(([date, data]) => ({
      date,
      count: data.count,
      revisions: data.revisions,
    }));
  }, [revisions]);

  // Calculate the maximum count for the heatmap
  const maxCount = useMemo(() => {
    return Math.max(...heatmapData.map(d => d.count));
  }, [heatmapData]);

  const handleRevisionSelect = (revision: Revision) => {
    console.log('Selected revision:', revision);
    // Add your revision selection logic here
  };

  return (
    <div className="hidden md:block">
      <Heatmap 
        data={heatmapData}
        maxCount={maxCount}
        onDayClick={handleDayClick} 
      />
      <RevisionList 
        revisions={revisions}
        onRevisionSelect={handleRevisionSelect}
      />
    </div>
  );
}