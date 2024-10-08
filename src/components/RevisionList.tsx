'use client';

import React from 'react';
import { Revision } from '@/types/revisions';

interface RevisionListProps {
  revisions: Revision[];
  onRevisionSelect: (revision: Revision) => void;
}

export function RevisionList({ revisions, onRevisionSelect }: RevisionListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Revisions</h2>
      <ul className="space-y-2">
        {revisions.map((revision) => (
          <li key={revision.id} className="border p-2 rounded hover:bg-gray-100 cursor-pointer">
            <button onClick={() => onRevisionSelect(revision)} className="w-full text-left">
              <span className="font-medium">{new Date(revision.timestamp).toLocaleString()}</span>
              <br />
              <span className="text-sm text-gray-600">{revision.comment}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}