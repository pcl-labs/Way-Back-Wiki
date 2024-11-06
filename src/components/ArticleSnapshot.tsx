'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import '@/styles/wikipedia-styles.css';

interface ArticleSnapshotProps {
  html: string;
  className?: string;
}

export function ArticleSnapshot({ html, className = '' }: ArticleSnapshotProps) {
  const [sanitizedHTML, setSanitizedHTML] = useState('');

  useEffect(() => {
    if (!html) return;
    
    const clean = DOMPurify.sanitize(html, {
      ADD_TAGS: ['math', 'mrow', 'mi', 'mn', 'mo', 'msup', 'mfrac'],
      ADD_ATTR: ['xmlns', 'display', 'alttext'],
    });
    setSanitizedHTML(clean);
  }, [html]);

  if (!html) return null;

  return (
    <div className={`mw-parser-output ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
    </div>
  );
}