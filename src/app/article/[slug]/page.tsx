"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import dynamic from 'next/dynamic';
import { ArticleRevision } from '@/types/articleRevisions';
import { Skeleton } from '@/components/ui/skeleton';

const RevisionList = dynamic(() => import('@/components/RevisionList'), {
  loading: () => <Skeleton className="h-64 w-full" />,
});

const CustomHeatmap = dynamic(() => import('@/components/CustomHeatmap'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
});

const ArticlePage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const title = decodeURIComponent(slug.replace(/_/g, ' '));

  const [revisions, setRevisions] = useState<ArticleRevision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchRevisions = async () => {
      try {
        const response = await fetch(`/api/articles/${encodeURIComponent(title)}/revisions?fullHistory=true`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch revisions');
        }
        const data = await response.json();
        setRevisions(data.revisions);
      } catch (error) {
        console.error('Error fetching revisions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevisions();
  }, [title]);

  const filteredRevisions = useMemo(() => {
    return revisions.filter(revision => {
      const revisionYear = new Date(revision.timestamp).getFullYear();
      return revisionYear === selectedYear;
    });
  }, [revisions, selectedYear]);

  const heatmapData = useMemo(() => {
    const countMap: { 
      [key: string]: { 
        count: number; 
        revisions: Array<{ timestamp: string }>;
      } 
    } = {};
    
    filteredRevisions.forEach(revision => {
      const date = new Date(revision.timestamp).toISOString().split('T')[0];
      if (!countMap[date]) {
        countMap[date] = { count: 0, revisions: [] };
      }
      countMap[date].count += 1;
      countMap[date].revisions.push({ timestamp: revision.timestamp });
    });

    return Object.entries(countMap).map(([date, data]) => ({
      date,
      count: data.count,
      revisions: data.revisions,
    }));
  }, [filteredRevisions]);

  const maxCount = useMemo(() => {
    return Math.max(...heatmapData.map(d => d.count), 1);
  }, [heatmapData]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Article Revisions: {title}</h1>
        <div className="mb-4">
          <label htmlFor="year-select" className="mr-2">Filter by Year:</label>
          <select id="year-select" value={selectedYear} onChange={handleYearChange} className="border rounded p-2">
            {[...new Set(revisions.map(rev => new Date(rev.timestamp).getFullYear()))].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="mb-8">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <CustomHeatmap 
              data={heatmapData}
              maxCount={maxCount}
              onDayClick={(day) => {
                console.log('Day clicked:', day);
              }}
            />
          )}
        </div>
        <div className="mt-8">
          <RevisionList 
            revisions={filteredRevisions} 
            onRevisionSelect={(revision) => {
              console.log('Revision selected:', revision);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ArticlePage;