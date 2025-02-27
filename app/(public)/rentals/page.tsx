'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import RentalForm from '@/components/rental/RentalForm'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Organize products by category
const CATEGORIES = {
  'Trailers': [
    {
      id: 'rent_trailer_small',
      name: 'Small Trailer',
      description: 'Perfect for small moves and deliveries',
      price: 50,
      image_url: '/images/product-imgs/trailers/small-trailer.png',
      category: 'Trailers'
    },
    {
      id: 'rent_trailer_large',
      name: '16ft Tandem Axle',
      description: '16ft car hauler with ramps',
      price: 75,
      image_url: '/images/product-imgs/trailers/16ft-tandem-axel.png',
      category: 'Trailers'
    }
  ],
  'Tables': [
    {
      id: 'rent_table',
      name: '6ft Table',
      description: 'Sturdy table perfect for any event',
      price: 10,
      image_url: '/images/product-imgs/table.jpg',
      category: 'Tables'
    },
    {
      id: 'rent_round_table',
      name: 'Round Table',
      description: '60" round table, seats 8',
      price: 15,
      image_url: '/images/product-imgs/table.jpg',
      category: 'Tables'
    }
  ],
  'Chairs': [
    {
      id: 'rent_chair',
      name: 'Folding Chair',
      description: 'Comfortable seating for your guests',
      price: 5,
      image_url: '/images/product-imgs/chair.jpg',
      category: 'Chairs'
    },
    {
      id: 'rent_chiavari_chair',
      name: 'Chiavari Chair',
      description: 'Gold chiavari chair with cushion',
      price: 8,
      image_url: '/images/product-imgs/chair.jpg',
      category: 'Chairs'
    }
  ],
  'Party Supplies': [
    {
      id: 'rent_party_supplies',
      name: 'Party Supply Package',
      description: 'Everything you need for a great party',
      price: 75,
      image_url: '/images/product-imgs/ballons.jpg',
      category: 'Party Supplies'
    },
    {
      id: 'rent_balloon_arch',
      name: 'Balloon Arch Kit',
      description: '100pc balloon arch with stand',
      price: 75,
      image_url: '/images/product-imgs/ballons.jpg',
      category: 'Party Supplies'
    }
  ]
}

export default function RentalsPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter products based on search query and category
  const filteredCategories = Object.entries(CATEGORIES)
    .map(([category, items]) => ({
      category,
      items: items.filter(item =>
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedCategory === 'all' || category === selectedCategory)
      )
    }))
    .filter(category => category.items.length > 0)

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#2C363F] mb-4">Available Rentals</h1>
        <p className="text-lg text-[#2C363F]/60">
          Browse our selection of quality rental items for your next event
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search rentals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.keys(CATEGORIES).map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories and Items */}
      <div className="space-y-12">
        {filteredCategories.map(({ category, items }) => (
          <section key={category}>
            <h2 className="text-2xl font-semibold mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => (
                <Card key={product.id} className="p-4">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">${product.price}/day</p>
                    <Button 
                      className="bg-[#235082] hover:bg-[#235082]/90"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Book Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Dialog 
        open={!!selectedProduct} 
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      >
        <DialogContent className="max-w-lg p-0 bg-white border-none mx-auto">
          <div className="bg-[#235082]/5 min-h-fit flex justify-center items-center">
            {selectedProduct && (
              <RentalForm 
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 