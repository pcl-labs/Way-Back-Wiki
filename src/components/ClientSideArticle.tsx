"use client";

import { FC } from 'react';
import DOMPurify from 'dompurify';

interface ClientSideArticleProps {
  content: string;
  selectedRevision: string | null;
}

const ClientSideArticle: FC<ClientSideArticleProps> = ({ content, selectedRevision }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      {selectedRevision && (
        <div className="mt-4 p-4 bg-yellow-100 rounded">
          <p>Selected revision: {selectedRevision}</p>
          {/* Implement diff view here when a revision is selected */}
        </div>
      )}
    </div>
  );
};

export default ClientSideArticle;