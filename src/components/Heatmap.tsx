'use client';

import React, { useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Revision } from '@/types/revisions';
import * as Tooltip from '@radix-ui/react-tooltip';
import { format } from 'date-fns';

interface HeatmapProps {
  revisions: Revision[];
  onDayClick: (day: Date) => void;
}

interface HeatmapValue {
  date: string;
  count: number;
  revisions: Revision[];
}

export function Heatmap({ revisions, onDayClick }: HeatmapProps) {
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  const endDate = new Date();

  const values = useMemo(() => {
    const countMap: { [key: string]: { count: number; revisions: Revision[] } } = {};
    
    revisions.forEach(revision => {
      const date = new Date(revision.timestamp).toISOString().split('T')[0];
      if (!countMap[date]) {
        countMap[date] = { count: 0, revisions: [] };
      }
      countMap[date].count += 1;
      countMap[date].revisions.push(revision);
    });

    return Object.entries(countMap).map(([date, data]): HeatmapValue => ({
      date,
      count: data.count,
      revisions: data.revisions,
    }));
  }, [revisions]);

  const maxCount = useMemo(() => Math.max(...values.map(v => v.count)), [values]);

  const getColorClass = (count: number): string => {
    if (!count) return 'color-empty';
    const intensity = Math.ceil((count / maxCount) * 4);
    return `color-github-${intensity}`;
  };

  const renderTooltipContent = (value: HeatmapValue | null) => {
    if (!value || !value.revisions.length) return null;

    return (
      <div className="rounded-md bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
        <div className="font-semibold">
          {format(new Date(value.date), 'MMMM d, yyyy')}
        </div>
        <div className="text-sm text-muted-foreground">
          {value.count} revision{value.count !== 1 ? 's' : ''}
        </div>
        <ul className="mt-1 space-y-1">
          {value.revisions.map((revision, index) => (
            <li key={index} className="text-xs text-muted-foreground">
              {format(new Date(revision.timestamp), 'h:mm a')}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Tooltip.Provider delayDuration={0}>
      <div className="heatmap-container">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={(value) => getColorClass(value ? value.count : 0)}
          onClick={(value) => value && onDayClick(new Date(value.date))}
          titleForValue={(value) => ''} // Empty string as we're using custom tooltip
          transformDayElement={(element, value) => (
            <Tooltip.Root key={element.key}>
              <Tooltip.Trigger asChild>
                {element}
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content 
                  side="top" 
                  align="center"
                  sideOffset={5}
                  className="z-50 animate-in fade-in-0 zoom-in-95"
                >
                  {renderTooltipContent(value)}
                  <Tooltip.Arrow className="fill-popover" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          )}
        />
        <style jsx global>{`
          .react-calendar-heatmap .color-github-1 { fill: #9be9a8; }
          .react-calendar-heatmap .color-github-2 { fill: #40c463; }
          .react-calendar-heatmap .color-github-3 { fill: #30a14e; }
          .react-calendar-heatmap .color-github-4 { fill: #216e39; }
        `}</style>
      </div>
    </Tooltip.Provider>
  );
}