'use client';

import React, { useState } from 'react';
import { Revision } from '@/types/revisions';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RevisionListProps {
  revisions: Revision[];
  onRevisionSelect: (revision: Revision) => void;
}

function DiffView({ diff }: { diff: string }) {
  return (
    <pre className="text-sm overflow-x-auto p-2 border rounded">
      {diff.split('\n').map((line, index) => (
        <div
          key={index}
          className={
            line.startsWith('+') ? 'bg-green-100 text-green-800 pl-2' :
            line.startsWith('-') ? 'bg-red-100 text-red-800 pl-2' :
            'pl-2'
          }
        >
          <code>{line}</code>
        </div>
      ))}
    </pre>
  );
}

export function RevisionList({ revisions, onRevisionSelect }: RevisionListProps) {
  const [expandedRevisions, setExpandedRevisions] = useState<Set<string>>(new Set());

  if (!revisions || revisions.length === 0) {
    return <div>No revisions available.</div>;
  }

  const toggleRevision = (timestamp: string) => {
    setExpandedRevisions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(timestamp)) {
        newSet.delete(timestamp);
      } else {
        newSet.add(timestamp);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Revisions</h2>
      <ul className="space-y-2">
        {revisions.map((revision) => (
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
                onClick={() => toggleRevision(revision.timestamp)}
                aria-expanded={expandedRevisions.has(revision.timestamp)}
              >
                {expandedRevisions.has(revision.timestamp) ? 
                  <ChevronUp size={16} /> : 
                  <ChevronDown size={16} />
                }
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <span>User: {revision.user}</span>
              <br />
              <span>Comment: {revision.comment || 'No comment'}</span>
            </div>
            {expandedRevisions.has(revision.timestamp) && revision.diff && (
              <div className="mt-2 border-t pt-2">
                <DiffView diff={revision.diff.diff || ''} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
