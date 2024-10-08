import { SearchComponent } from '@/components/SearchComponent';
import { Header } from '@/components/Header';

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Search Wikipedia</h1>
        <SearchComponent />
      </main>
    </div>
  );
}