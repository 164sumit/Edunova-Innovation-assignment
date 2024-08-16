"use client"
// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WindowIcon } from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard' },
    { name: 'People Directory', href: '/people' },
  ];

  return (
    <div className=" text-black bg-gray-50 font-bold w-64  sticky left-0 top-0 bottom-0 p-4">
      <nav className="">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors ${
                  pathname === item.href ? ' text-purple-500' : ''
                }`}
              >
                <WindowIcon className="h-6 w-6 mr-3" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;