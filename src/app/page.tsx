import Link from 'next/link';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Way Back Wiki</h1>
          <p className="text-xl mb-8">Explore Wikipedia article revisions and history</p>
          <Link 
            href="/search" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Start Searching
          </Link>
        </div>
      </main>
    </div>
  );
}
