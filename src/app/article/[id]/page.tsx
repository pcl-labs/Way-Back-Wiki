import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { ArticleContent } from '@/components/ArticleContent';
import { Heatmap } from '@/components/Heatmap';
import { RevisionList } from '@/components/RevisionList';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

interface Revision {
  revid: number;
  timestamp: string;
  user: string;
  comment: string;
}

interface RevisionData {
  revisions: Revision[];
  counts: { date: string; count: number }[];
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = params;
  const articleData = await fetchArticleData(id);
  const revisionData = await fetchRevisionData(id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{articleData.title}</h1>
        <div className="space-y-8">
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Revision History</h2>
            <Suspense fallback={<div>Loading revision data...</div>}>
              <Heatmap revisionData={revisionData.counts} />
            </Suspense>
          </section>

          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Article Content</h2>
            <Suspense fallback={<div>Loading article content...</div>}>
              <ArticleContent html={articleData.html} />
            </Suspense>
          </section>

          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Recent Edits</h2>
            <Suspense fallback={<div>Loading revisions...</div>}>
              <RevisionList revisions={revisionData.revisions} articleId={id} />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}

async function fetchArticleData(id: string) {
  const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&pageid=${id}&format=json&origin=*`, { next: { revalidate: 3600 } });
  const data = await res.json();
  return {
    title: data.parse.title,
    html: data.parse.text['*'],
  };
}

async function fetchRevisionData(id: string): Promise<RevisionData> {
  const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&pageids=${id}&rvprop=timestamp|user|comment&rvlimit=500&format=json&origin=*`, { next: { revalidate: 3600 } });
  const data = await res.json();
  const revisions = data.query.pages[id].revisions;
  return {
    revisions,
    counts: processRevisionsForHeatmap(revisions),
  };
}

function processRevisionsForHeatmap(revisions: Revision[]): { date: string; count: number }[] {
  const counts = new Map<string, number>();
  revisions.forEach((rev) => {
    const date = rev.timestamp.split('T')[0];
    counts.set(date, (counts.get(date) || 0) + 1);
  });
  return Array.from(counts, ([date, count]) => ({ date, count }));
}

export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour