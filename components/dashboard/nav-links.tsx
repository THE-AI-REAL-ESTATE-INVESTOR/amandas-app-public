'use client';

import {
  HomeIcon,
  ShoppingCartIcon,
  CalendarIcon,
  UserGroupIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { checkIsAdmin } from '@/app/lib/actions';

const baseLinks = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'My Rentals', href: '/dashboard/rentals', icon: ShoppingCartIcon },
  { name: 'My Bookings', href: '/dashboard/bookings', icon: CalendarIcon },
];

const adminLinks = [
  { name: 'Admin Dashboard', href: '/admin/dashboard', icon: UserGroupIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  { name: 'Admin Check', href: '/admin/check', icon: CogIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.id) {
        const result = await checkIsAdmin(user.id);
        setIsAdmin(result);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

  // Combine links based on user role
  const links = [...baseLinks, ...(isAdmin ? adminLinks : [])];
  console.log('NavLinks - Final Links:', links.map(l => l.name));

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-[#235082] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <LinkIcon className={`h-6 w-6 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
            <span className="truncate">{link.name}</span>
            {isActive && (
              <div className="absolute left-0 h-full w-1 bg-[#235082] rounded-r" />
            )}
          </Link>
        );
      })}
    </>
  );
}
