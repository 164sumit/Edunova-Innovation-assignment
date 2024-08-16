// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  userName: string;
}

const Navbar: React.FC<NavbarProps> = ({ userName }) => {
  return (
    <nav className="bg-gray-50 shadow-sm  border-spacing-1 ">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-purple-800">
              PEOPLE.CO
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex items-center">
              <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
              <span className="ml-2 text-sm font-medium text-gray-700">{userName}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;