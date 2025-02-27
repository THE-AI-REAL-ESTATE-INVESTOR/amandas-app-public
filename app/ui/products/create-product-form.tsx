'use client';

import { createProduct } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import Image from 'next/image';

export default function CreateProductForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={createProduct} className="rounded-md bg-gray-50 p-4 md:p-6">
      {/* Image Upload */}
      <div className="mb-4">
        <label htmlFor="image" className="mb-2 block text-sm font-medium">
          Product Image
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-500 file:text-white
              hover:file:bg-blue-600"
          />
          {imagePreview && (
            <div className="relative h-20 w-20">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Product Name"
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="mb-2 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Product description..."
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          rows={3}
        />
      </div>

      {/* Price */}
      <div className="mb-4">
        <label htmlFor="price" className="mb-2 block text-sm font-medium">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          placeholder="0.00"
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          step="0.01"
          required
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="mb-2 block text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          required
        >
          <option value="">Select a category</option>
          <option value="trailer">Trailer</option>
          <option value="accessories">Accessories</option>
          <option value="parts">Parts</option>
        </select>
      </div>

      {/* Inventory */}
      <div className="mb-4">
        <label htmlFor="inventory" className="mb-2 block text-sm font-medium">
          Inventory
        </label>
        <input
          type="number"
          id="inventory"
          name="inventory"
          placeholder="0"
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          required
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
} 