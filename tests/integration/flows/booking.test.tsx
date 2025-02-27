import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http } from 'msw'
import { server } from '../../setup/msw'
import { BookingForm } from '@/components/booking/BookingForm'
import type { BookingEvent } from '@/types/booking'

describe('Booking Flow Integration', () => {
  const mockEvents: BookingEvent[] = [{
    id: 'evt_123',
    name: 'Test Event',
    price: 15000,
    description: 'Test Description',
    category: 'party',
    type: 'kids' as const
  }]

  beforeEach(() => {
    // Reset handlers before each test
    server.use(
      http.post('/api/bookings', async ({ request }) => {
        const data = await request.json()
        return Response.json({ 
          success: true,
          bookingId: 'book_123',
          status: 'confirmed'
        })
      })
    )
  })

  it('should complete a booking flow successfully', async () => {
    const user = userEvent.setup()
    
    render(<BookingForm events={mockEvents} />)

    // Select party type
    await user.click(screen.getByText(/kids parties/i))
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Select package
    await user.click(screen.getByText(mockEvents[0].name))
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Select date and time
    const today = new Date()
    await user.click(screen.getByRole('button', { name: new RegExp(today.getDate().toString()) }))
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: '10:00 AM' }))
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Fill contact information
    await user.type(screen.getByRole('textbox', { name: /name/i }), 'John Doe')
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'john@example.com')
    await user.type(screen.getByRole('textbox', { name: /phone/i }), '123-456-7890')

    // Submit the form
    await user.click(screen.getByRole('button', { name: /book now/i }))

    // Verify success state
    await waitFor(() => {
      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument()
    })
  })

  it('should handle booking errors appropriately', async () => {
    // Override the booking handler to simulate an error
    server.use(
      http.post('/api/bookings', () => {
        return Response.json(
          { error: 'Booking failed' },
          { status: 400 }
        )
      })
    )

    const user = userEvent.setup()
    
    render(<BookingForm events={mockEvents} />)

    // Go through all steps
    await user.click(screen.getByText(/kids parties/i))
    await user.click(screen.getByRole('button', { name: /next/i }))
    await user.click(screen.getByText(mockEvents[0].name))
    await user.click(screen.getByRole('button', { name: /next/i }))
    
    const today = new Date()
    await user.click(screen.getByRole('button', { name: new RegExp(today.getDate().toString()) }))
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: '10:00 AM' }))
    await user.click(screen.getByRole('button', { name: /next/i }))

    await user.type(screen.getByRole('textbox', { name: /name/i }), 'John Doe')
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'john@example.com')
    await user.type(screen.getByRole('textbox', { name: /phone/i }), '123-456-7890')

    // Submit the form
    await user.click(screen.getByRole('button', { name: /book now/i }))

    // Verify error state
    await waitFor(() => {
      expect(screen.getByText(/booking failed/i)).toBeInTheDocument()
    })
  })
})
