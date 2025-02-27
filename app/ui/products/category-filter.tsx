'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const currentCategory = searchParams.get('category') || '';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`
            rounded-full px-4 py-2 text-sm font-medium
            ${
              currentCategory === category
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}
