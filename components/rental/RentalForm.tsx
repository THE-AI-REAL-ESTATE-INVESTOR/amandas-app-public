import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { createRental } from '@/app/lib/actions/rentals'
import RentalSuccess from './RentalSuccess'
import { differenceInDays } from 'date-fns'
import { Minus, Plus } from 'lucide-react'

interface RentalFormProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    image_url: string
  }
  onClose?: () => void
}

export default function RentalForm({ product, onClose }: RentalFormProps) {
  const [step, setStep] = useState(1)
  const [days, setDays] = useState(1)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [successRentalId, setSuccessRentalId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [showAgeVerification, setShowAgeVerification] = useState(false)
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [birthDateError, setBirthDateError] = useState<string | null>(null)

  // Calculate total price based on days
  const totalPrice = days * product.price

  const formAction = async (formData: FormData) => {
    if (!startDate) {
      console.error('Missing required fields')
      return
    }

    // Calculate end date based on start date and number of days
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + days - 1)

    const data = {
      productId: product.id,
      startDate,
      endDate,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    }

    const result = await createRental(data)
    if (result.success) {
      setSuccessRentalId(result.rentalId || null)
      setIsAuthenticated(result.isAuthenticated || false)
    } else {
      console.error('Failed to create rental:', result.error)
    }
  }

  const verifyAge = () => {
    if (!birthDate) {
      setBirthDateError('Please select your birth date')
      return
    }

    const age = Math.floor((new Date().getTime() - birthDate.getTime()) / 31557600000)
    if (age < 21) {
      setBirthDateError('You must be 21 or older to rent this equipment')
      return
    }

    setShowAgeVerification(false)
    setStep(2)
  }

  if (successRentalId) {
    return <RentalSuccess rentalId={successRentalId} isAuthenticated={isAuthenticated} />
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="p-4 bg-white shadow-lg">
        {/* Product Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            {onClose && (
              <Button variant="ghost" onClick={onClose} size="sm">×</Button>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          <p className="text-base font-semibold">${product.price}/day</p>
        </div>

        {step === 1 && (
          <>
            <h3 className="text-base font-semibold mb-3">Select Rental Duration</h3>
            <div className="space-y-4">
              {/* Days Picker */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDays(Math.max(1, days - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <div className="text-lg font-semibold">{days}</div>
                  <div className="text-sm text-gray-600">days</div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDays(days + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Price Summary */}
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex justify-between items-center">
                  <span>Daily Rate:</span>
                  <span>${product.price}</span>
                </div>
                <div className="flex justify-between items-center font-semibold mt-1">
                  <span>Total Price:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <Button
                className="w-full bg-[#235082] hover:bg-[#235082]/90"
                onClick={() => setStep(2)}
                size="sm"
              >
                Select Dates
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-base font-semibold mb-3">Select Start Date</h3>
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={startDate as Date}
                onSelect={(date: Date | undefined) => setStartDate(date || null)}
                disabled={(date) => date < new Date()}
                className="rounded-lg border w-full"
              />

              {/* Price Summary */}
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex justify-between items-center">
                  <span>Duration:</span>
                  <span>{days} day{days !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Daily Rate:</span>
                  <span>${product.price}</span>
                </div>
                <div className="flex justify-between items-center font-semibold mt-1">
                  <span>Total Price:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  size="sm"
                >
                  Back
                </Button>
                <Button
                  className="flex-1 bg-[#235082] hover:bg-[#235082]/90"
                  disabled={!startDate}
                  onClick={() => setStep(3)}
                  size="sm"
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="text-base font-semibold mb-3">Contact Information</h3>
            <form action={formAction} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  className="text-sm"
                />
              </div>

              {/* Rental Summary */}
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex justify-between items-center">
                  <span>Duration:</span>
                  <span>{days} day{days !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Daily Rate:</span>
                  <span>${product.price}</span>
                </div>
                <div className="flex justify-between items-center font-semibold mt-1">
                  <span>Total Price:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <div className="flex justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  size="sm"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#235082] hover:bg-[#235082]/90"
                  size="sm"
                >
                  Complete Rental
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>

      {/* Age Verification Modal */}
      {showAgeVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm w-full mx-4 bg-white shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Age Verification Required</h3>
            <p className="text-sm text-gray-600 mb-4">
              You must be 21 or older to rent this equipment.
              Please enter your birth date to continue.
            </p>
            
            <div className="space-y-4 mb-4">
              <label className="block text-sm font-medium text-gray-700">Birth Date</label>
              <Calendar
                mode="single"
                selected={birthDate as Date}
                onSelect={(date: Date | undefined) => setBirthDate(date || null)}
                disabled={(date) => date > new Date()}
                className="rounded-lg border"
              />
            </div>

            {birthDateError && (
              <p className="text-red-500 text-sm mb-4">{birthDateError}</p>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                variant="destructive"
                onClick={() => {
                  setShowAgeVerification(false)
                  setBirthDate(null)
                  setBirthDateError(null)
                }}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={verifyAge}
                size="sm"
              >
                Verify Age
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
} 