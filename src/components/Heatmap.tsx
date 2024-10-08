'use client';

import React, { useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Revision } from '@/types/revisions';

interface HeatmapProps {
  revisions: Revision[];
  onDayClick: (day: Date) => void;
}

interface HeatmapValue {
  date: string;
  count: number;
}

export function Heatmap({ revisions, onDayClick }: HeatmapProps) {
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const endDate = new Date();

  const values = useMemo(() => {
    const countMap: { [key: string]: number } = {};
    revisions.forEach(revision => {
      const date = new Date(revision.timestamp).toISOString().split('T')[0];
      countMap[date] = (countMap[date] || 0) + 1;
    });

    return Object.entries(countMap).map(([date, count]): HeatmapValue => ({ date, count }));
  }, [revisions]);

  const maxCount = useMemo(() => Math.max(...values.map(v => v.count)), [values]);

  const getColorClass = (count: number): string => {
    if (!count) return 'color-empty';
    const intensity = Math.ceil((count / maxCount) * 4);
    return `color-github-${intensity}`;
  };

  return (
    <div className="heatmap-container">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={(value) => getColorClass(value ? value.count : 0)}
        onClick={(value) => value && onDayClick(new Date(value.date))}
        titleForValue={(value) => value ? `${value.date}: ${value.count} revision${value.count !== 1 ? 's' : ''}` : 'No revisions'}
      />
      <style jsx global>{`
        .react-calendar-heatmap .color-github-1 { fill: #9be9a8; }
        .react-calendar-heatmap .color-github-2 { fill: #40c463; }
        .react-calendar-heatmap .color-github-3 { fill: #30a14e; }
        .react-calendar-heatmap .color-github-4 { fill: #216e39; }
      `}</style>
    </div>
  );
}