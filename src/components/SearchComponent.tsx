'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/lib/hooks';
import { Command } from 'cmdk';

interface SearchResult {
  pageid: number;
  title: string;
  snippet: string;
}

export function SearchComponent() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [input, setInput] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setInput(query);
      debouncedSearch(query);
    }
  }, [searchParams]);

  const debouncedSearch = useDebounce(async (value: string) => {
    if (value) {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.query.search);
      startTransition(() => {
        updateURL(value);
      });
    } else {
      setResults([]);
      startTransition(() => {
        updateURL('');
      });
    }
  }, 300);

  const handleInputChange = (value: string) => {
    setInput(value);
    debouncedSearch(value);
  };

  const updateURL = (query: string) => {
    const newURL = query
      ? `/search?q=${encodeURIComponent(query)}`
      : '/search';
    router.push(newURL, { scroll: false });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Command 
        className="rounded-lg border border-gray-200 shadow-md overflow-hidden bg-white"
        label="Search Wikipedia"
      >
        <Command.Input 
          value={input}
          onValueChange={handleInputChange}
          placeholder="Search Wikipedia..."
          className="w-full px-4 py-3 text-lg focus:outline-none border-b border-gray-200"
        />
        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-gray-500">
            No results found.
          </Command.Empty>
          {results.map((result) => (
            <Command.Item 
              key={result.pageid} 
              value={result.title}
              onSelect={() => router.push(`/article/${result.pageid}`)}
              className="px-4 py-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{result.title}</span>
                <span 
                  className="text-sm text-gray-500 mt-1"
                  dangerouslySetInnerHTML={{ __html: result.snippet }}
                />
              </div>
            </Command.Item>
          ))}
        </Command.List>
      </Command>
      {isPending && <div className="mt-2 text-center text-gray-500">Updating...</div>}
    </div>
  );
}