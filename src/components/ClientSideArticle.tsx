import React from 'react';
import DOMPurify from 'dompurify';

interface ClientSideArticleProps {
  content: string;
}

export const ClientSideArticle: React.FC<ClientSideArticleProps> = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
};