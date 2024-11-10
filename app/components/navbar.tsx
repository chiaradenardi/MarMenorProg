//app/components/navbar.tsx

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='flex w-full justify-around items-center h-16 bg-gray-100'>

      <Link href="/" passHref className='flex-1 h-full flex justify-center items-center text-center py-2 hover:bg-gray-200 transition-colors cursor-pointer'>
        <div>
          Home
        </div>
      </Link>

      <Link href="/about" passHref className='flex-1 h-full flex justify-center items-center text-center py-2 hover:bg-gray-200 transition-colors cursor-pointer'>
        <div>
          About
        </div>
      </Link>

      <Link href="/chatbot" passHref className='flex-1 h-full flex justify-center items-center text-center py-2 hover:bg-gray-200 transition-colors cursor-pointer'>
        <div >
          ChatBot
        </div>
      </Link>


    </nav>
  );
}
