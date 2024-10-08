'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface SnapshotLinkProps {
  articleId: string;
}

export function SnapshotLink({ articleId }: SnapshotLinkProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/snapshot/${articleId}`);
  };

  return (
    <button 
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      View Article Snapshot
    </button>
  );
}