'use client';

import React, { useState } from 'react';
import { DiffView } from './DiffView';

interface Revision {
  revid: number;
  timestamp: string;
  user: string;
  comment: string;
}

interface RevisionListProps {
  revisions: Revision[];
  articleId: string;
}

export function RevisionList({ revisions, articleId }: RevisionListProps) {
  const [selectedRevision, setSelectedRevision] = useState<number | null>(null);
  const [diffContent, setDiffContent] = useState<{ old: string; new: string } | null>(null);

  const handleRevisionSelect = async (revid: number) => {
    setSelectedRevision(revid);
    const oldContent = await fetchRevisionContent(articleId, revid);
    const newContent = await fetchRevisionContent(articleId, 'current');
    setDiffContent({ old: oldContent, new: newContent });
  };

  async function fetchRevisionContent(pageId: string, revId: number | 'current'): Promise<string> {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&pageid=${pageId}&oldid=${revId}&format=json&origin=*`);
    const data = await res.json();
    return data.parse.text['*'];
  }

  return (
    <div>
      <ul className="space-y-2">
        {revisions.slice(0, 10).map((revision) => (
          <li 
            key={revision.revid}
            className={`cursor-pointer p-2 rounded ${selectedRevision === revision.revid ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            onClick={() => handleRevisionSelect(revision.revid)}
          >
            <div className="font-medium">{new Date(revision.timestamp).toLocaleString()}</div>
            <div className="text-sm text-gray-600">by {revision.user}</div>
            <div className="text-sm italic">{revision.comment}</div>
          </li>
        ))}
      </ul>
      {diffContent && (
        <div className="mt-4">
          <DiffView oldContent={diffContent.old} newContent={diffContent.new} />
        </div>
      )}
    </div>
  );
}