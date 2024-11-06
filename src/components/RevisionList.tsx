'use client';

import React from 'react';
import { format } from 'date-fns';
import { ArticleRevision } from '@/types/articleRevisions';

interface RevisionListProps {
  revisions: ArticleRevision[];
  onRevisionSelect?: (revision: ArticleRevision) => void;
}

export const RevisionList: React.FC<RevisionListProps> = ({ revisions, onRevisionSelect }) => {
  return (
    <div className="space-y-4">
      {revisions.map((revision) => (
        <div 
          key={revision.id}
          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => onRevisionSelect?.(revision)}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500">
                {format(new Date(revision.timestamp), 'MM/dd/yyyy, h:mm:ss a')}
              </div>
              <div className="mt-1">
                <span className="font-medium">User: </span>
                {revision.user}
              </div>
              <div className="mt-1">
                <span className="font-medium">Comment: </span>
                {revision.comment || 'No comment'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
