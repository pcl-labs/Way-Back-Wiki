"use client";

import React from 'react';
import DOMPurify from 'dompurify';

interface ClientSideArticleProps {
  content: string;
  selectedRevision: string | null;
}

const ClientSideArticle: React.FC<ClientSideArticleProps> = ({ content, selectedRevision }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className="prose max-w-none">
      {selectedRevision && <p>Selected revision: {selectedRevision}</p>}
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
};

export default ClientSideArticle;