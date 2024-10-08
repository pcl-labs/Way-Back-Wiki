'use client';

import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface HeatmapProps {
  revisionData: {
    date: string;
    count: number;
  }[];
}

export function Heatmap({ revisionData }: HeatmapProps) {
  const endDate = new Date();
  const startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());

  return (
    <div className="w-full">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={revisionData}
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          return `color-scale-${Math.min(4, value.count)}`;
        }}
      />
    </div>
  );
}