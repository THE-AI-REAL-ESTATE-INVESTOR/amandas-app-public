import Image from 'next/image';
import { UpdateProduct, DeleteProduct } from '@/app/ui/products/create-btn-product';
import { formatCurrency } from '@/app/lib/utils';
import { Product, CustomerField } from '@/app/lib/definitions';
import ProductStatus from '@/app/ui/products/product-status';

// Map of verified trailer images from Unsplash
const trailerImages = {
  utility: '/images/trailers/small-trailer.png',
  enclosed: '/images/trailers/enclosed-16-ft.png',
  car: '/images/trailers/16ft-tandem-axel.png',
  default: '/images/trailers/small-trailer.png'
};

interface ProductsTableProps {
  products: Product[];
  customers: CustomerField[];
}

export default async function ProductsTable({
  products,
  customers
}: ProductsTableProps) {
  const getTrailerImage = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('utility')) return trailerImages.utility;
    if (nameLower.includes('enclosed')) return trailerImages.enclosed;
    if (nameLower.includes('car')) return trailerImages.car;
    return trailerImages.default;
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Product
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Category
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Price
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Inventory
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 relative">
                        <Image
                          src={getTrailerImage(product.name)}
                          className="rounded-full object-cover"
                          fill
                          sizes="40px"
                          alt={`${product.name}`}
                          priority={true}
                        />
                      </div>
                      <p>{product.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.category}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.inventory}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateProduct id={product.id} />
                      <DeleteProduct id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
