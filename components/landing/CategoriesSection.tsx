import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categories = [
  {
    title: 'Trailers',
    description: 'Various sizes for your transportation needs',
    image: '/images/product-imgs/trailers/small-trailer.png',
  },
  {
    title: 'Tables',
    description: '6ft tables perfect for any event',
    image: '/images/product-imgs/table.jpg',
  },
  {
    title: 'Chairs',
    description: 'Comfortable seating options',
    image: '/images/product-imgs/chair.jpg',
  },
  {
    title: 'Party Supplies',
    description: 'High-quality balloons and decorations',
    image: '/images/product-imgs/ballons.jpg',
  },
];

export const CategoriesSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <h2 className={`${lusitana.className} text-3xl font-bold text-center mb-12 text-[#2C363F]`}>
        Our Rental Categories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {categories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 w-full">
                <Image
                  src={category.image}
                  alt={`Rental ${category.title.toLowerCase()}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}; 