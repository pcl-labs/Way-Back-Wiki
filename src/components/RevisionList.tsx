'use client';

import React from 'react';
import { format } from 'date-fns';
import { ArticleRevision } from '@/types/articleRevisions';
import { createPatch } from 'diff';

interface RevisionListProps {
  revisions: ArticleRevision[];
  onRevisionSelect?: (revision: ArticleRevision) => void;
}

const RevisionList: React.FC<RevisionListProps> = ({ revisions, onRevisionSelect }) => {
  const seenIds = new Map<string, number>();

  const formatDiff = (sizediff?: number) => {
    if (typeof sizediff !== 'number') return '';
    
    const absDiff = Math.abs(sizediff);
    const sign = sizediff >= 0 ? '+' : '-';
    const color = sizediff >= 0 ? 'text-green-600' : 'text-red-600';
    
    return (
      <span className={color}>
        {sign}{absDiff.toLocaleString()} bytes
      </span>
    );
  };

  const renderDiff = (currentRevision: ArticleRevision, previousRevision?: ArticleRevision) => {
    if (!currentRevision.content || !previousRevision?.content) return null;

    const patch = createPatch(
      currentRevision.title,
      previousRevision.content,
      currentRevision.content,
      format(new Date(previousRevision.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      format(new Date(currentRevision.timestamp), 'yyyy-MM-dd HH:mm:ss')
    );

    return (
      <pre className="mt-4 p-4 bg-gray-50 rounded-md overflow-x-auto text-sm">
        {patch.split('\n').map((line, i) => {
          let className = 'block';
          if (line.startsWith('+')) className += ' text-green-600 bg-green-50';
          if (line.startsWith('-')) className += ' text-red-600 bg-red-50';
          if (line.startsWith('@')) className += ' text-blue-600 bg-blue-50';
          
          return (
            <span key={i} className={className}>
              {line}
            </span>
          );
        })}
      </pre>
    );
  };

  return (
    <div className="space-y-8">
      {revisions.map((revision, index) => {
        let uniqueKey = revision.id.toString();
        const count = seenIds.get(uniqueKey) || 0;
        seenIds.set(uniqueKey, count + 1);
        if (count > 0) {
          uniqueKey = `${uniqueKey}-${count}`;
        }

        const previousRevision = index < revisions.length - 1 ? revisions[index + 1] : undefined;

        return (
          <div 
            key={uniqueKey}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <div 
              className="cursor-pointer"
              onClick={() => onRevisionSelect?.(revision)}
            >
              <div className="text-sm text-gray-500">
                {format(new Date(revision.timestamp), 'MM/dd/yyyy, h:mm:ss a')}
              </div>
              <div className="mt-2">
                <span className="font-medium">User: </span>
                {revision.user}
              </div>
              <div className="mt-2">
                <span className="font-medium">Comment: </span>
                {revision.comment || 'No comment'}
              </div>
              <div className="mt-2">
                <span className="font-medium">Changes: </span>
                {formatDiff(revision.sizediff)}
                {revision.size && (
                  <span className="text-gray-500 text-sm ml-2">
                    ({revision.size.toLocaleString()} bytes total)
                  </span>
                )}
              </div>
            </div>
            {renderDiff(revision, previousRevision)}
          </div>
        );
      })}
    </div>
  );
};

export default RevisionList;
