'use client'

import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Card } from '@/components/ui/card'

interface Rental {
  id: string
  start_date: string
  end_date: string
  status: string
  product_name: string
  price: number
}

export default function RentalsPage() {
  const { userId } = useAuth()
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}/bookings`)
        .then(res => res.json())
        .then(data => {
          setRentals(data.rentals || [])
          setLoading(false)
        })
        .catch(error => {
          console.error('Failed to fetch rentals:', error)
          setLoading(false)
        })
    }
  }, [userId])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Rentals</h1>
      
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : rentals.length > 0 ? (
          rentals.map((rental) => (
            <Card key={rental.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{rental.product_name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  rental.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  rental.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {rental.status}
                </span>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-600">No rentals found</p>
          </Card>
        )}
      </div>
    </div>
  )
} 