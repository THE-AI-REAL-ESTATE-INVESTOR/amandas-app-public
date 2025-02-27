'use client'

import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Card } from '@/components/ui/card'

interface Booking {
  id: string
  date: string
  status: string
  event_name: string
  price: number
}

export default function BookingsPage() {
  const { userId } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}/bookings`)
        .then(res => res.json())
        .then(data => {
          setBookings(data.bookings || [])
          setLoading(false)
        })
        .catch(error => {
          console.error('Failed to fetch bookings:', error)
          setLoading(false)
        })
    }
  }, [userId])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
      
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{booking.event_name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-600">No bookings found</p>
          </Card>
        )}
      </div>
    </div>
  )
} 