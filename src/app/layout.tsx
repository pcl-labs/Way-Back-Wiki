import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Way Back Wiki",
  description: "Get insights into Wikipedia's history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 dark:bg-gray-900 flex flex-col min-h-screen`}
      >
        <header className="bg-gray-900 sticky top-0 z-40 w-full border-b border-gray-700">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <nav className="flex items-center">
              <Link href="/" className="text-xl font-bold text-white hover:text-gray-400 transition-colors duration-200">
                Way Back Wiki
              </Link>
            </nav>
            <div className="flex items-center">
              <Link 
                href="/search" 
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Search
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-4 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <p>&copy; 2024 Way Back Wiki. All rights reserved.</p>
              <a 
                href="https://github.com/pcl-labs/Way-Back-Wiki" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}