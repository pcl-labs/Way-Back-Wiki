'use client';

import React from 'react';
import { Revision } from '@/types/revisions';

interface RevisionListProps {
  revisions: Revision[];
  onRevisionSelect: (revision: Revision) => void;
}

export function RevisionList({ revisions, onRevisionSelect }: RevisionListProps) {
  if (!revisions || revisions.length === 0) {
    return <div>No revisions available.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Revisions</h2>
      <ul className="space-y-2">
        {revisions.map((revision) => (
          <li key={revision.timestamp} className="border p-2 rounded hover:bg-gray-100 cursor-pointer">
            <button onClick={() => onRevisionSelect(revision)} className="w-full text-left">
              <span className="font-medium">{new Date(revision.timestamp).toLocaleString()}</span>
              <br />
              <span className="text-sm text-gray-600">User: {revision.user}</span>
              <br />
              <span className="text-sm text-gray-600">
                Comment: {revision.comment || 'No comment'}
              </span>
              {revision['*'] && (
                <>
                  <br />
                  <span className="text-sm text-gray-600">
                    Content: {revision['*'].substring(0, 100)}...
                  </span>
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}