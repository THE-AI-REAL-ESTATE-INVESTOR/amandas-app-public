/**
 * @jest-environment node
 */
import { createBooking } from '@/app/lib/actions/bookings'
import { server } from '../../../setup/msw'

describe('createBooking', () => {
  const mockBookingData = {
    eventId: 'evt_123',
    date: new Date('2025-02-25T17:04:09.136Z'),
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890'
  }

  beforeAll(() => {
    // Start MSW server
    server.listen()
  })

  afterEach(() => {
    // Reset handlers after each test
    server.resetHandlers()
  })

  afterAll(() => {
    // Clean up after all tests
    server.close()
  })

  it('creates a booking successfully', async () => {
    const result = await createBooking(mockBookingData)
    expect(result.success).toBe(true)
    expect(result.bookingId).toMatch(/^book_\d+$/)
  })

  it('returns error for missing required fields', async () => {
    const result = await createBooking({
      ...mockBookingData,
      eventId: ''
    })
    expect(result).toEqual({ 
      success: false, 
      error: 'Missing required fields' 
    })
  })

  it('returns error for non-existent event', async () => {
    const result = await createBooking({
      ...mockBookingData,
      eventId: 'non_existent'
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid event selected')
  })
}) 