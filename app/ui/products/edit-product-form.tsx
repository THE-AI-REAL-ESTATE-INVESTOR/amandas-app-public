'use client';

import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import Image from 'next/image';
import { updateProduct } from '@/app/lib/actions';

export default function EditProductForm({
  product,
  customers,
}: {
  product: ProductForm;
  customers: CustomerField[];
  trailers: TrailerField[];
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null);

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

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <form action={updateProductWithId} className="rounded-md bg-gray-50 p-4 md:p-6">
      {/* Current Image Preview */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Current Image
        </label>
        {imagePreview ? (
          <div className="relative h-32 w-32">
            <Image
              src={imagePreview}
              alt={product.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-500">No image available</p>
        )}
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label htmlFor="image" className="mb-2 block text-sm font-medium">
          Update Image
        </label>
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
          defaultValue={product.name}
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
          defaultValue={product.description || ''}
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
          defaultValue={product.price}
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
          defaultValue={product.category}
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
          defaultValue={product.inventory}
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          required
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Update Product</Button>
      </div>
    </form>
  );
}
