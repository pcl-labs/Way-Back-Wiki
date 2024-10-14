'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Command, CommandItem} from 'cmdk';
import { useDebounce } from '@/lib/hooks';
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import { Search, Book, AlertCircle, Loader2 } from 'lucide-react';

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
    <Command className="rounded-lg border shadow-md">
    <div className="flex items-center border=b px-3">
      <CommandInput
        placeholder="Search Wikipedia..."
        value={query}
        onValueChange={(value: string) => {
          setQuery(value)
          router.push(`/search?q=${encodeURIComponent(value)}`, { scroll: false })
        }}
      />
      </div> 
      <CommandList>
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
