'use client';

import React, { useMemo } from 'react';
import CalendarHeatmap, { ReactCalendarHeatmapValue } from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Revision } from '@/types/revisions';
import { useState } from 'react';
import Tippy from '@tippyjs/react';

interface HeatmapProps {
  revisions: Revision[];
  onDayClick: (day: Date) => void;
}

interface HeatmapValue {
  date: string;
  count: number;
}

export function Heatmap({revisions}: HeatmapProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [currentTileString, setCurrentTileString] = useState<string>();

  const handleMouseClick = (event: React.MouseEvent) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
    setTooltipVisible(!tooltipVisible);
  };

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

  const getHeatMapValueTileData = (value: ReactCalendarHeatmapValue<string> | undefined) => 
    value ? `${value.date}: ${value.count} revision${value.count !== 1 ? 's' : ''}` : 'No revisions'

  return (
    <div onClick={handleMouseClick} className="heatmap-container">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={(value) => getColorClass(value ? value.count : 0)}
        onClick={
          (value: ReactCalendarHeatmapValue<string> | undefined) => 
            setCurrentTileString(
              getHeatMapValueTileData(value)
            )
        }
      />
      <Tippy
        content={currentTileString}
        visible={tooltipVisible}
        onClickOutside={() => setTooltipVisible(false)}
        interactive
        placement="top-start"
        className="heatmap-tooltip"
        popperOptions={{
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
              },
            },
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['top', 'bottom', 'left', 'right'],
              },
            },
          ],
        }}
        offset={[0, 10]}
      >
        <div
          style={{
            position: 'absolute',
            top: cursorPosition.y,
            left: cursorPosition.x,
            pointerEvents: 'none',
          }}
        />
      </Tippy>
      <style jsx global>{`
        .react-calendar-heatmap .color-github-1 { fill: #9be9a8; }
        .react-calendar-heatmap .color-github-2 { fill: #40c463; }
        .react-calendar-heatmap .color-github-3 { fill: #30a14e; }
        .react-calendar-heatmap .color-github-4 { fill: #216e39; }
        .heatmap-tooltip {
          background: black;
          color: white;
          border-radius: 6px;
          padding: 8px 16px;
          font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
        }
      `}</style>
    </div>
  );
}