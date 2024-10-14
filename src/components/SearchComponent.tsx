'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Command, CommandItem} from 'cmdk';
import { useDebounce } from '@/lib/hooks';
import {
  CommandInput,
  CommandList,
} from "@/components/ui/command"


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
    <Command className="rounded-lg border shadow-md w-full">
    <div className="flex items-center border=b px-3 w-full">
      <CommandInput
        placeholder="Search Wikipedia..."
        value={query}
        onValueChange={(value: string) => {
          setQuery(value)
          router.push(`/search?q=${encodeURIComponent(value)}`, { scroll: false })
        }}
        className="flex-1 outline-none border-none focus:ring-0 focus:outline-none"
      />
      </div> 
      <CommandList className="max-h-[300px] overflow-y-auto">
          {results.map((result) => (
            <CommandItem
              key={result.pageid}
              onSelect={() => router.push(`/article/${result.pageid}`)}
            className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              {result.title}
            </CommandItem>
          ))}
      </CommandList>
    </Command>
  )
}
