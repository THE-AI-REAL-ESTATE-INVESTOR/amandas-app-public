'use client'

import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useUser()
  const firstName = user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Admin'

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to your dashboard, {firstName}! 👋</h1>
        <p className="mt-2 text-gray-600">Here's an overview of your admin controls</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* All Users Overview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users Overview</h2>
          <div className="space-y-4">
            {/* We'll implement this with server actions later */}
            <div className="flex justify-between items-center">
              <span>Total Users</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Bookings</span>
              <span className="font-semibold">0</span>
            </div>
            <button 
              onClick={() => router.push('/admin/users')}
              className="w-full py-2 px-4 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF6B6B]/90"
            >
              Manage Users
            </button>
          </div>
        </div>

        {/* Inventory Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Items</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Items Rented</span>
              <span className="font-semibold">0</span>
            </div>
            <button 
              onClick={() => router.push('/admin/inventory')}
              className="w-full py-2 px-4 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF6B6B]/90"
            >
              Manage Inventory
            </button>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Today's Revenue</span>
              <span className="font-semibold">$0</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Monthly Revenue</span>
              <span className="font-semibold">$0</span>
            </div>
            <button 
              onClick={() => router.push('/admin/revenue')}
              className="w-full py-2 px-4 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF6B6B]/90"
            >
              View Reports
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {/* We'll implement this with server actions later */}
            <p className="text-gray-600">No recent bookings</p>
            <button 
              onClick={() => router.push('/admin/bookings')}
              className="w-full py-2 px-4 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF6B6B]/90"
            >
              View All Bookings
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>System Status</span>
              <span className="text-green-500">●</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Backup</span>
              <span className="text-gray-600">Never</span>
            </div>
            <button 
              onClick={() => router.push('/admin/settings')}
              className="w-full py-2 px-4 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF6B6B]/90"
            >
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
