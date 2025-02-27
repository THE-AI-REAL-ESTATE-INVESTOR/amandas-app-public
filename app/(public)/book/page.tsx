import { BookingForm } from '@/components/booking/BookingForm'
import { getBrandConfig } from '@/app/lib/brand/config'
import { sql } from '@/app/lib/db'

export const dynamic = 'force-dynamic'

async function getEventProducts() {
  const events = await sql<Array<{
    id: string
    name: string
    price: number
    description: string
    category: string
  }>>`
    SELECT id, name, price, description, category
    FROM products
    WHERE category = 'events'
    ORDER BY name ASC
  `
  return events
}

export default async function BookPage() {
  const [brand, events] = await Promise.all([
    getBrandConfig(),
    getEventProducts()
  ])

  return (
    <div className="container mx-auto py-8 flex justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: brand.colors.primary }}>
            {brand.brand.name}
          </h1>
          <p className="mt-2 text-lg" style={{ color: brand.colors.text }}>
            {brand.brand.slogan}
          </p>
        </div>
        <BookingForm events={events} />
      </div>
    </div>
  )
}
