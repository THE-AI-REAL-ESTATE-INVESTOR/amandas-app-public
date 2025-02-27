'use client'

import * as React from 'react'
import { useState, useTransition } from 'react'
import { createBooking } from '@/app/lib/actions/bookings'
import { BookingSuccess } from './BookingSuccess'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { PartyPopper, Beer, Clock } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAvailableTimeSlots } from '@/app/lib/utils/timeSlots'

interface Event {
  id: string
  name: string
  price: number
  description: string
  category: string
  type?: 'adult' | 'kids'
}

// Helper function to determine event type
const getEventType = (eventId: string): 'adult' | 'kids' => {
  return eventId.startsWith('evt_bar') || eventId.startsWith('evt_beer') ? 'adult' : 'kids'
}

interface BookingFormProps {
  events: Event[]
}

type PartyType = 'kids' | 'adult' | null

export function BookingForm({ events }: BookingFormProps) {
  const [partyType, setPartyType] = useState<PartyType>(null)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [birthDateError, setBirthDateError] = useState<string | null>(null)

  const formAction = async (formData: FormData) => {
    if (!selectedEvent || !date || !time) return

    setError(null)
    startTransition(async () => {
      try {
        const result = await createBooking({
          eventId: selectedEvent,
          date: date,
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string
        })

        if (result.success) {
          setSuccessBookingId(result.bookingId || null)
          setIsAuthenticated(result.isAuthenticated || false)
        } else {
          setError(result.error || 'Failed to create booking')
        }
      } catch (err) {
        setError('An unexpected error occurred')
      }
    })
  }

  const selectedEventDetails = events.find(event => event.id === selectedEvent)

  const handleSuccessClose = () => {
    setSuccessBookingId(null)
    // Reset form
    setPartyType(null)
    setSelectedEvent(null)
    setDate(new Date())
    setTime('')
  }

  const [step, setStep] = useState(1)
  const [showAgeVerification, setShowAgeVerification] = useState(false)

  const nextStep = () => {
    if (step === 1 && !partyType) return
    if (step === 2 && !selectedEvent) return
    if (step === 3 && (!date || !time)) return
    
    if (partyType === 'adult' && step === 1) {
      setShowAgeVerification(true)
      return
    }
    
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      if (step === 2) {
        setSelectedEvent(null)
      } else if (step === 3) {
        setDate(new Date())
        setTime('')
      }
    }
  }

  // Filter events based on party type
  const filteredEvents = React.useMemo(() => {
    return events.filter(event => {
      const eventType = getEventType(event.id)
      return partyType === eventType
    })
  }, [events, partyType])

  // Reset selected event when party type changes
  React.useEffect(() => {
    setSelectedEvent(null)
  }, [partyType])

  const verifyAge = () => {
    if (!birthDate) {
      setBirthDateError('Please select your birth date')
      return
    }

    const age = Math.floor((new Date().getTime() - birthDate.getTime()) / 31557600000)
    if (age < 21) {
      setBirthDateError('You must be 21 or older to book an adult party package')
      return
    }

    setShowAgeVerification(false)
    setStep(2)
  }

  return (
    <form action={formAction} className="max-w-2xl mx-auto">
      {successBookingId ? (
        <BookingSuccess 
          bookingId={successBookingId} 
          isAuthenticated={isAuthenticated}
          onClose={handleSuccessClose} 
        />
      ) : (
        <Card className="p-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((number) => (
            <div
              key={number}
              className={`flex items-center ${number < 4 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= number
                    ? 'bg-[#235082] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {number}
              </div>
              {number < 4 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step > number ? 'bg-[#235082]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Age Verification Modal */}
        {showAgeVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <Card className="p-8 max-w-md w-full mx-4 bg-white shadow-xl">
              <h3 className="text-xl font-semibold mb-6">Age Verification Required</h3>
              <p className="text-gray-600 mb-6">
                You must be 21 or older to book an adult party package.
                Please enter your birth date to continue.
              </p>
              
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                <Calendar
                  mode="single"
                  selected={birthDate as Date}
                  onSelect={(date: Date | undefined) => setBirthDate(date || null)}
                  disabled={(date) => date > new Date()}
                  className="rounded-xl border"
                />
              </div>

              {birthDateError && (
                <p className="text-red-500 text-sm mb-4">{birthDateError}</p>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowAgeVerification(false)
                    setPartyType(null)
                    setBirthDate(null)
                    setBirthDateError(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={verifyAge}
                >
                  Verify Age
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Step 1: Party Type Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-8">Choose Your Party Type</h3>
            <div className="grid grid-cols-2 gap-8">
              {/* Kids Party Card */}
              <div
                className={`p-8 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                  partyType === 'kids'
                    ? 'border-[#235082] bg-[#235082]/10'
                    : 'hover:border-[#235082]/60'
                }`}
                onClick={() => {
                  setPartyType('kids')
                  setSelectedEvent(null)
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <PartyPopper className="w-20 h-20 text-[#235082] mb-4" />
                  <h4 className="text-2xl font-semibold text-[#235082]">Kids Parties</h4>
                  <p className="text-sm text-gray-600 mt-4">
                    Perfect for birthdays, celebrations, and special occasions
                  </p>
                </div>
              </div>

              {/* Adult Party Card */}
              <div
                className={`p-8 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                  partyType === 'adult'
                    ? 'border-[#FF6B6B] bg-[#FF6B6B]/10'
                    : 'hover:border-[#FF6B6B]/60'
                }`}
                onClick={() => {
                  setPartyType('adult')
                  setSelectedEvent(null)
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <Beer className="w-20 h-20 text-[#FF6B6B] mb-4" />
                  <h4 className="text-2xl font-semibold text-[#FF6B6B]">Adult Parties</h4>
                  <p className="text-sm text-gray-600 mt-4">
                    21+ events with premium bar service
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Package Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-8">
              Choose Your {partyType === 'kids' ? "Kids" : "Adult"} Package
            </h3>
            <div className="grid grid-cols-2 gap-6 max-h-[600px] overflow-y-auto p-2">
              {filteredEvents.map(event => {
                const color = partyType === 'adult' ? '[#FF6B6B]' : '[#235082]'
                const icon = partyType === 'adult' 
                  ? <Beer className={`w-16 h-16 text-${color} mb-4`} />
                  : <PartyPopper className={`w-16 h-16 text-${color} mb-4`} />

                return (
                  <div
                    key={event.id}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                      selectedEvent === event.id
                        ? `border-${color} bg-${color}/10`
                        : `hover:border-${color}/60`
                    }`}
                    onClick={() => setSelectedEvent(event.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      {icon}
                      <h4 className={`text-xl font-semibold text-${color}`}>{event.name}</h4>
                      <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                      <p className={`text-lg font-bold text-${color} mt-4`}>
                        ${(event.price / 100).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Date & Time Selection */}
        {step === 3 && (
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">Select Date & Time</h3>
            
            {/* Date Selection */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Choose a Date</h4>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  setTime('') // Reset time when date changes
                }}
                className="rounded-xl border mx-auto [&_.rdp-day_focus]:bg-[#235082] [&_.rdp-day_selected]:bg-[#235082]"
                disabled={(date) => {
                  const day = date.getDay()
                  return date < new Date() || day === 0 // Disable Sundays
                }}
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Choose a Time
              </h4>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTimeSlots(date).map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {date?.getDay() === 6 && (
                <p className="text-sm text-gray-500">
                  Saturday hours: 10:00 AM - 4:00 PM
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Contact Information */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-8">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Summary */}
            {selectedEventDetails && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <p className="text-sm text-gray-600">
                  {selectedEventDetails.name} - ${(selectedEventDetails.price / 100).toLocaleString()}
                </p>
                {date && time && (
                  <p className="text-sm text-gray-600">
                    Date: {date.toLocaleDateString()} at {time}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="px-6"
            >
              Back
            </Button>
          )}
          
          {step < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={
                (step === 1 && !partyType) ||
                (step === 2 && !selectedEvent) ||
                (step === 3 && (!date || !time))
              }
              className="bg-[#235082] hover:bg-[#235082]/90 px-6 ml-auto"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!selectedEvent || !date || !time || isPending}
              className="bg-[#235082] hover:bg-[#235082]/90 px-6 ml-auto"
            >
              {isPending ? 'Booking...' : 'Book Now'}
            </Button>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}
        </Card>
      )}
    </form>
  )
}
