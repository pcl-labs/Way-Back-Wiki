'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useDebounce } from '@/lib/hooks';

interface SearchResult {
  pageid: number;
  title: string;
}

export default function SearchComponent() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const debouncedSearch = useDebounce(async (value: string) => {
    if (value) {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.query?.search || []);
    } else {
      setResults([]);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <Command>
      <Command.Input
        placeholder="Search Wikipedia..."
        value={query}
        onValueChange={(value: string) => {
          setQuery(value);
          router.push(`/search?q=${encodeURIComponent(value)}`, { scroll: false });
        }}
      />
      <Command.List>
        {results.map((result) => (
          <Command.Item
            key={result.pageid}
            onSelect={() => router.push(`/article/${result.pageid}`)}
          >
            {result.title}
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
}