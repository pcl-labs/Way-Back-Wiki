'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import '@/styles/wikipedia-styles.css';

interface ArticleContentProps {
  html: string;
}

export function ArticleContent({ html }: ArticleContentProps) {
  const [sanitizedHTML, setSanitizedHTML] = useState('');

  useEffect(() => {
    const clean = DOMPurify.sanitize(html, {
      ADD_TAGS: ['math', 'mrow', 'mi', 'mn', 'mo', 'msup', 'mfrac'],
      ADD_ATTR: ['xmlns', 'display', 'alttext'],
    });
    setSanitizedHTML(clean);
  }, [html]);

  return (
    <div className="mw-parser-output">
      <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
    </div>
  );
}