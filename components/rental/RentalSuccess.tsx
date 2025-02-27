import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SignUpButton } from "@clerk/nextjs"

interface RentalSuccessProps {
  rentalId: string
  isAuthenticated: boolean
}

export default function RentalSuccess({ rentalId, isAuthenticated }: RentalSuccessProps) {
  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Rental Request Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your rental ID is: {rentalId}
        </p>

        {!isAuthenticated && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2">Create an Account</h3>
            <p className="text-gray-600 mb-4">
              Sign up to manage your rentals, receive updates, and get exclusive offers!
            </p>
            <SignUpButton mode="modal">
              <Button className="bg-[#235082] hover:bg-[#235082]/90">
                Create Account
              </Button>
            </SignUpButton>
          </div>
        )}

        <div className="space-y-4">
          {isAuthenticated ? (
            <>
              <Button 
                className="w-full bg-[#235082] hover:bg-[#235082]/90"
                onClick={() => window.location.href = '/dashboard'}
              >
                View in Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Return Home
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/'}
            >
              Return Home
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
} 