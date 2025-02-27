'use client';

import Link from 'next/link';
import NavLinks from '@/components/dashboard/nav-links';
import AmandaLogo from '@/components/shared/amanda-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { getBrandConfig } from '@/app/lib/brand/config';

export default function SideNav() {
  const config = getBrandConfig();
  const { user, isLoaded } = useUser();
  
  // Debug logging for parent component
  console.log('SideNav - Debug Start ----------------');
  console.log('SideNav - User Loaded:', isLoaded);
  console.log('SideNav - User ID:', user?.id);
  console.log('SideNav - Metadata:', JSON.stringify(user?.publicMetadata, null, 2));
  console.log('SideNav - Debug End ------------------');

  return (
    <div className="flex h-full flex-col bg-gray-900">
      <Link
        className="flex h-20 shrink-0 items-center p-4 md:h-40"
        href="/"
      >
        <div className="w-full text-white">
          <div className="w-32 md:w-40">
            <AmandaLogo />
          </div>
          <h1 className="mt-2 text-sm md:text-base font-medium">
            {config.brand.name} 🎈 🍻
          </h1>
          <p className="mt-1 text-xs text-gray-300">
            {config.brand.slogan}
          </p>
        </div>
      </Link>
      <div className="flex-grow flex flex-col justify-between px-3 py-4">
        <div className="space-y-1">
          <NavLinks />
        </div>
        <SignOutButton>
          <button className="flex w-full items-center gap-2 rounded-md p-3 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
