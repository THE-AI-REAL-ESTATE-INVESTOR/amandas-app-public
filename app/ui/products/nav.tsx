'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface ProductsNavProps {
  categories: string[];
}

export function ProductsNav({ categories }: ProductsNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4 py-4">
      <Link
        href="/dashboard/products"
        className={clsx(
          'rounded-lg px-3 py-2 text-sm font-medium',
          {
            'bg-blue-100 text-blue-600': pathname === '/dashboard/products',
            'hover:bg-gray-100': pathname !== '/dashboard/products',
          }
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/dashboard/products?category=${category}`}
          className={clsx(
            'rounded-lg px-3 py-2 text-sm font-medium',
            {
              'bg-blue-100 text-blue-600': pathname.includes(category),
              'hover:bg-gray-100': !pathname.includes(category),
            }
          )}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
      ))}
    </nav>
  );
}
