'use client';

import React from 'react';
import { format } from 'date-fns';

interface HeatmapProps {
  data: Array<{ date: string; count: number; revisions: Array<{ timestamp: string }> }>;
  maxCount: number;
  onDayClick?: (day: Date) => void;
}

const CustomHeatmap: React.FC<HeatmapProps> = ({ data, maxCount, onDayClick }) => {
  const getColor = (count: number): string => {
    if (!count) return '#E5E7EB'; // Gray for empty cells (equivalent to gray-200)
    const intensity = Math.min(Math.ceil((count / maxCount) * 7), 7); // Adjust intensity to max 7
    switch (intensity) {
      case 1:
        return '#A7F3D0'; // Green-200
      case 2:
        return '#6EE7B7'; // Green-300
      case 3:
        return '#34D399'; // Green-400
      case 4:
        return '#10B981'; // Green-500
      case 5:
        return '#059669'; // Green-600
      case 6:
        return '#047857'; // Green-700
      case 7:
        return '#065F46'; // Green-800
      default:
        return '#E5E7EB';
    }
  };

  const daysInYear = Array.from({ length: 365 }, (_, i) => {
    const date = new Date(new Date().getFullYear(), 0, i + 1);
    const dateString = date.toISOString().split('T')[0];
    const dayData = data.find(d => d.date === dateString);
    return { date, count: dayData ? dayData.count : 0, revisions: dayData ? dayData.revisions : [] };
  });

  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekLabels = ['Mon', 'Wed', 'Fri'];

  const isMobileOrTablet = window.innerWidth < 768;

  return (
    <div className="overflow-x-auto w-full p-4">
      {!isMobileOrTablet && (
        <div className="flex flex-row w-full mb-2">
          <div className="w-12" /> {/* Spacer for week labels */}
          {monthLabels.map((month, index) => (
            <div
              key={month}
              style={{ width: 'calc(100% / 12)', textAlign: 'center', position: 'relative' }}
              className="text-xs font-medium text-gray-600"
            >
              {month}
            </div>
          ))}
        </div>
      )}
      <div className="flex w-full">
        <div className="flex flex-col mr-2">
          {weekLabels.map((day, index) => (
            <div key={index} className="h-8 flex items-center text-xs font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className={`grid grid-flow-col grid-rows-7 gap-1 ${isMobileOrTablet ? 'grid-cols-52' : 'grid-cols-53'}`}>
          {daysInYear.map((value, index) => (
            <div
              key={value.date.toISOString()}
              className="w-8 h-8 cursor-pointer flex items-center justify-center"
              style={{ backgroundColor: getColor(value.count) }}
              onClick={() => onDayClick && onDayClick(value.date)}
              title={`${format(value.date, 'MMM d, yyyy')}: ${value.count} revision${value.count !== 1 ? 's' : ''}`}
            >
              {value.revisions.length > 0 && (
                <div className="sr-only">
                  <ul>
                    {value.revisions.map((rev, idx) => (
                      <li key={idx}>{format(new Date(rev.timestamp), 'h:mm a')}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomHeatmap;
