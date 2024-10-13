'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Book, ExternalLink } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export default function WikipediaSearch() {
  interface SearchResult {
    title: string;
    description: string;
    link: string;
  }

  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchWikipedia = useCallback(async (term: string) => {
    if (term.length < 3) {
      setResults([]); // Clear results if term is too short
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${term}&limit=10&namespace=0&format=json&origin=*`);
      const data = await response.json();
  
      // Check if results exist and format them
      const formattedResults = data[1]?.map((title: string, index: number) => ({
        title,
        description: data[2]?.[index] || 'No description available', // Fallbacks
        link: data[3]?.[index] || '#'
      })) || [];
  
      setResults(formattedResults);
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
      setResults([]); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Wikipedia</h1>
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Search Wikipedia..." 
          onValueChange={(value) => searchWikipedia(value)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {isLoading && <CommandItem disabled>Loading...</CommandItem>}
          <CommandGroup heading="Results">
            {results.map((result, index) => (
              <CommandItem key={index}>
                <Book className="mr-2 h-4 w-4" />
                <span>{result.title}</span>
                <a 
                  href={result.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

