'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import { SignInButton, SignUpButton } from '@clerk/nextjs'

interface BookingSuccessProps {
  bookingId: string
  isAuthenticated: boolean
  onClose: () => void
}

export function BookingSuccess({ bookingId, isAuthenticated, onClose }: BookingSuccessProps) {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-semibold">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your booking has been confirmed. Your booking ID is:
        </p>
        <p className="font-mono text-lg bg-gray-100 p-2 rounded">{bookingId}</p>
        <p className="text-gray-600 mt-4">
          We will send you a confirmation email with all the details.
        </p>
        
        {!isAuthenticated && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2">Create an Account</h3>
            <p className="text-gray-600 mb-4">
              Sign up to manage your bookings, receive updates, and get exclusive offers!
            </p>
            <SignUpButton mode="modal">
              <Button className="bg-[#235082] hover:bg-[#235082]/90">
                Create Account
              </Button>
            </SignUpButton>
          </div>
        )}

        <Button 
          onClick={onClose} 
          variant="outline"
          className="mt-6"
        >
          Book Another Event
        </Button>
      </div>
    </Card>
  )
}
