'use client';

import React from 'react';
import { ArticleRevision } from '@/types/articleRevisions';

interface RevisionListProps {
  revisions: ArticleRevision[];
  onRevisionSelect?: (revision: ArticleRevision) => void;
}

const RevisionList: React.FC<RevisionListProps> = ({ revisions, onRevisionSelect }) => {
  const seenIds = new Map<string, number>();

  return (
    <div className="space-y-8">
      {revisions.map((revision, index) => {
        let uniqueKey = revision.revid.toString();
        const count = seenIds.get(uniqueKey) || 0;
        seenIds.set(uniqueKey, count + 1);
        if (count > 0) {
          uniqueKey = `${uniqueKey}-${count}`;
        }

        return (
          <div 
            key={uniqueKey}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <div 
              className="cursor-pointer"
              onClick={() => onRevisionSelect?.(revision)}
            >
              <div className="text-base text-gray-700">
                <span className="font-medium">Timestamp: </span>
                {revision.timestamp}
              </div>
              <div className="mt-2 text-base text-gray-700">
                <span className="font-medium">User: </span>
                {revision.user}
              </div>
              <div className="mt-2 text-base text-gray-700">
                <span className="font-medium">Comment: </span>
                {revision.comment || 'No comment'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RevisionList;
