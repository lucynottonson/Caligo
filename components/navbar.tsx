'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const getLinkClasses = (href: string) => {
    return pathname === href 
      ? 'text-blue-600 font-bold' 
      : 'text-gray-600';
  };

  return (
    <nav className="flex gap-6 p-4 bg-blue-50">
      <Link href="/" className={getLinkClasses('/')}>
        Home
      </Link>
      <Link href="/profile" className={getLinkClasses('/profile')}>
        Profile
      </Link>
      <Link href="/users" className={getLinkClasses('/users')}>
        Friends
      </Link>
    </nav>
  );
}
