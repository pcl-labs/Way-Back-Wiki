import Link from 'next/link';
import { Search } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Way Back Wiki
        </Link>
        <Link href="/search" className="hover:text-gray-300">
          <Search size={24} />
        </Link>
      </nav>
    </header>
  );
}