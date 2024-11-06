'use client';

import React, { useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import * as Tooltip from '@radix-ui/react-tooltip';
import { format } from 'date-fns';

interface HeatmapProps {
  data: HeatmapValue[];
  maxCount: number;
  onDayClick?: (day: Date) => void;
}

interface HeatmapValue {
  date: string;
  count: number;
  revisions: Array<{ timestamp: string }>;
}

export function Heatmap({ data, maxCount, onDayClick }: HeatmapProps) {
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  const endDate = new Date();

  const values = useMemo(() => data, [data]);

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
          onClick={(value) => value && onDayClick && onDayClick(new Date(value.date))}
          transformDayElement={(element, value, index) => (
            <Tooltip.Root key={index}>
              <Tooltip.Trigger asChild>
                {React.cloneElement(element as React.ReactElement)}
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content 
                  side="top" 
                  align="center"
                  sideOffset={5}
                  className="z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                >
                  {value && renderTooltipContent(value as HeatmapValue)}
                  <Tooltip.Arrow className="fill-popover" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          )}
        />
        <style jsx global>{`
          .react-calendar-heatmap {
            width: 100%;
          }
          .react-calendar-heatmap rect {
            rx: 2;
          }
          .react-calendar-heatmap .color-empty {
            fill: #ebedf0;
          }
          .react-calendar-heatmap .color-github-1 { fill: #9be9a8; }
          .react-calendar-heatmap .color-github-2 { fill: #40c463; }
          .react-calendar-heatmap .color-github-3 { fill: #30a14e; }
          .react-calendar-heatmap .color-github-4 { fill: #216e39; }
        `}</style>
      </div>
    </Tooltip.Provider>
  );
}