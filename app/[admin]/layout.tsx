'use client'

import { useAuth, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SideNav from '@/components/dashboard/sidenav'
import { checkIsAdmin } from '@/app/lib/actions'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, userId } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // If not authenticated, redirect to home
    if (isLoaded && !userId) {
      router.push('/')
      return
    }

    // Check admin role using database
    const checkAdminRole = async () => {
      try {
        if (!user?.id) return
        const isAdmin = await checkIsAdmin(user.id)
        setIsAdmin(isAdmin)
        
        if (!isAdmin) {
          console.log('Not an admin, redirecting to dashboard')
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Failed to check admin role:', error)
        router.push('/dashboard')
      } finally {
        setIsChecking(false)
      }
    }

    if (userId && user) {
      checkAdminRole()
    }
  }, [isLoaded, userId, user, router])

  if (!isLoaded || isChecking) {
    return <div>Loading...</div>
  }

  if (!isAdmin) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  )
}
