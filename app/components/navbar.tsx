//app/components/navbar.tsx

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent:'center', alignContent:'center', gap: '1rem', padding: '1rem', backgroundColor: '#f0f0f0' }}>

      <Link href="/" passHref>
        <button>Home</button>
      </Link>

      <Link href="/about" passHref>
        <button>About</button>
      </Link>

      <Link href="/chatbot" passHref>
        <button>ChatBot</button>
      </Link>

    </nav>
  );
}
