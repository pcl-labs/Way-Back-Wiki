'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function FooterLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex flex-col items-center group ${isActive ? 'text-blue-400' : 'text-white'}`}>
      <div className="relative">
        {icon}
        <span className="bubble absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-active:animate-bubble-pop"></span>
      </div>
      <span className="text-xs mt-1 group-hover:text-blue-400 group-active:scale-110 transition-all duration-200">{label}</span>
    </Link>
  );
}

export function MobileFooter() {
  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-3 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center">
          <FooterLink 
            href="/" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-colors duration-200 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            } 
            label="Home"
          />
          <FooterLink 
            href="/search" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-colors duration-200 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            } 
            label="Search"
          />
          <FooterLink 
            href="https://github.com/pcl-labs/Way-Back-Wiki" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-colors duration-200 group-hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            } 
            label="GitHub"
          />
        </div>
      </div>
    </footer>
  );
}