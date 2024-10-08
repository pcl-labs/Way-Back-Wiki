'use client';

import React, { useState } from 'react';
import { Revision } from '@/types/revisions';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { diffLines, Change } from 'diff';

interface RevisionListProps {
  revisions: Revision[];
  onRevisionSelect: (revision: Revision) => void;
}

function DiffView({ oldContent, newContent }: { oldContent: string; newContent: string }) {
  const diff = diffLines(oldContent, newContent);

  return (
    <pre className="text-sm overflow-x-auto">
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
  );
}

export function RevisionList({ revisions, onRevisionSelect }: RevisionListProps) {
  const [expandedRevision, setExpandedRevision] = useState<string | null>(null);

  if (!revisions || revisions.length === 0) {
    return <div>No revisions available.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Revisions</h2>
      <ul className="space-y-2">
        {revisions.map((revision, index) => (
          <li key={revision.timestamp} className="border p-2 rounded hover:bg-gray-100">
            <div className="flex justify-between items-center cursor-pointer">
              <span 
                className="font-medium"
                onClick={() => onRevisionSelect(revision)}
              >
                {new Date(revision.timestamp).toLocaleString()}
              </span>
              <button 
                className="p-1 hover:bg-gray-200 rounded"
                onClick={() => setExpandedRevision(expandedRevision === revision.timestamp ? null : revision.timestamp)}
              >
                {expandedRevision === revision.timestamp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <span>User: {revision.user}</span>
              <br />
              <span>Comment: {revision.comment || 'No comment'}</span>
            </div>
            {expandedRevision === revision.timestamp && index < revisions.length - 1 && (
              <DiffView 
                oldContent={revisions[index + 1]['*'] || ''} 
                newContent={revision['*'] || ''} 
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}