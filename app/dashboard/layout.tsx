'use client'

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import SideNav from '@/components/dashboard/sidenav'

// This layout wraps all dashboard pages under /dashboard/*
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/')
    }
  }, [isLoaded, userId, router])

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      {/* User Dashboard Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <SideNav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
} 