'use client';

import { FC } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Revision } from '../types/revisions';

interface HeatmapProps {
  revisions: Revision[];
  onDayClick: (day: string) => void;
}

export const Heatmap: FC<HeatmapProps> = ({ revisions, onDayClick }) => {
  const values = revisions.reduce((acc, revision) => {
    const date = revision.timestamp.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const heatmapData = Object.entries(values).map(([date, count]) => ({ date, count }));

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Revision Heatmap</h2>
      <CalendarHeatmap
        startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
        endDate={new Date()}
        values={heatmapData}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          return `color-scale-${Math.min(value.count, 4)}`;
        }}
        onClick={(value) => value && value.date && onDayClick(value.date)}
      />
    </div>
  );
};