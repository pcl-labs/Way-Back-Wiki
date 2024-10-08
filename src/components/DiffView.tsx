'use client';

import React from 'react';
import { diffLines, Change } from 'diff';

interface DiffViewProps {
  oldContent: string;
  newContent: string;
}

export function DiffView({ oldContent, newContent }: DiffViewProps) {
  const diff = diffLines(oldContent, newContent);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Revision Differences</h2>
      <pre className="whitespace-pre-wrap text-sm">
        {diff.map((part: Change, index: number) => (
          <span
            key={index}
            className={
              part.added ? 'bg-green-200' :
              part.removed ? 'bg-red-200' :
              ''
            }
          >
            {part.value}
          </span>
        ))}
      </pre>
    </div>
  );
}