//app/components/navbar.tsx
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname(); // Ottieni il percorso corrente

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-blue-600">SmartLagoon</h1>
      <nav className="flex space-x-6">
        <Link
          href="/"
          className={`text-gray-700 hover:text-black ${
            pathname === '/' ? 'font-bold underline' : ''
          }`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`text-gray-700 hover:text-black ${
            pathname === '/about' ? 'font-bold underline' : ''
          }`}
        >
          About
        </Link>
      </nav>
    </header>
  );
}
