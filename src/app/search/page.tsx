import React, { Suspense } from 'react';
import SearchComponent from '@/components/SearchComponent';

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Wikipedia</h1>
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchComponent />
      </Suspense>
    </div>
  );
}