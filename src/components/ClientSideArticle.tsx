import React from 'react';
import DOMPurify from 'dompurify';

interface ClientSideArticleProps {
  content: string;
  title: string;
}

export const ClientSideArticle: React.FC<ClientSideArticleProps> = ({ content, title }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>
    </div>
  );
};