// This file handles /dashboard
'use client'

import { useAuth, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import AmandaLogo from '@/components/shared/amanda-logo'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { getBrandConfig } from '@/app/lib/brand/config'
import { getUserDashboardData } from '@/app/lib/actions'

import { DashboardBooking, DashboardRental } from '@/app/lib/actions'

export default function DashboardPage() {
  const { userId, isLoaded } = useAuth()
  const { user } = useUser()
  const [bookings, setBookings] = useState<DashboardBooking[]>([])
  const [rentals, setRentals] = useState<DashboardRental[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const config = getBrandConfig()

  useEffect(() => {
    async function loadDashboardData() {
      if (!userId) return;
      
      try {
        const data = await getUserDashboardData(userId);
        setIsAdmin(data.user?.role === 'admin');
        setBookings(data.bookings || []);
        setRentals(data.rentals || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [userId]);

  // Calculate analytics
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const rentalsThisMonth = rentals.filter(rental => {
    const rentalDate = new Date(rental.start_date)
    return rentalDate.getMonth() === currentMonth && rentalDate.getFullYear() === currentYear
  })
  const isEligibleForDiscount = rentalsThisMonth.length >= 3
  const totalSpent = rentals.reduce((sum, rental) => sum + rental.price, 0)

  if (!isLoaded) return <div>Loading...</div>
  if (!userId) return null

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12">
              <AmandaLogo />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C363F]">
                Welcome to your dashboard, {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Guest'}! 👋
              </h1>
              <p className="text-gray-600">
                {isAdmin ? 'Administrator Access' : 'Customer Portal'}
              </p>
            </div>
          </div>
          {isAdmin && (
            <Link 
              href="/admin"
              className="bg-[#235082] text-white px-4 py-2 rounded-lg hover:bg-[#235082]/90 transition-colors"
            >
              Admin Panel
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Overview Card */}
          <Card className="p-6 bg-white shadow-sm md:col-span-3">
            <h2 className="text-xl font-semibold mb-4 text-[#2C363F]">Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-[#235082]/5 rounded-lg">
                <h3 className="text-sm font-medium text-[#235082] mb-1">Rentals This Month</h3>
                <p className="text-2xl font-bold text-[#2C363F]">{rentalsThisMonth.length}</p>
                {isEligibleForDiscount && (
                  <p className="text-sm text-green-600 mt-1">
                    🎉 10% Discount Available!
                  </p>
                )}
              </div>
              <div className="p-4 bg-[#FF6B6B]/5 rounded-lg">
                <h3 className="text-sm font-medium text-[#FF6B6B] mb-1">Total Spent</h3>
                <p className="text-2xl font-bold text-[#2C363F]">${totalSpent}</p>
              </div>
              <div className="p-4 bg-[#4ECDC4]/5 rounded-lg">
                <h3 className="text-sm font-medium text-[#4ECDC4] mb-1">Active Rentals</h3>
                <p className="text-2xl font-bold text-[#2C363F]">
                  {rentals.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </Card>

          {/* Rentals Card */}
          <Card className="p-6 bg-white shadow-sm md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-[#2C363F]">My Rentals</h2>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : rentals.length > 0 ? (
              <div className="space-y-4">
                {rentals.map((rental) => (
                  <div key={rental.id} className="p-4 bg-gray-50 rounded-lg">
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No rentals yet</p>
            )}
          </Card>

          {/* Quick Actions Card */}
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-[#2C363F]">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                href="/rentals"
                className="block w-full py-2 px-4 bg-[#235082] text-white rounded-lg hover:bg-[#235082]/90 transition-colors text-center"
              >
                Browse Rentals
              </Link>
              <Link 
                href="/book"
                className="block w-full py-2 px-4 border border-[#FF6B6B] text-[#FF6B6B] rounded-lg hover:bg-[#FF6B6B]/10 transition-colors text-center"
              >
                Book New Event
              </Link>
              {isEligibleForDiscount && (
                <div className="p-3 bg-green-50 rounded-lg mt-4">
                  <p className="text-sm text-green-700">
                    You've qualified for a 10% discount on your next rental! 🎉
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
