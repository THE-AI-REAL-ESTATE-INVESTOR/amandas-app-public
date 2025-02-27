/**
 * @jest-environment node
 */
import { createBooking } from '@/app/lib/actions/bookings'
import { sql } from '@/app/lib/db'
import { revalidatePath } from 'next/cache'

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

// Mock the database
jest.mock('@/app/lib/db', () => ({
  sql: jest.fn()
}))

describe('createBooking', () => {
  // Use type assertion to silence TypeScript
  const mockSql = sql as jest.MockedFunction<typeof sql> as any
  const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>

  beforeEach(() => {
    mockSql.mockClear()
    mockRevalidatePath.mockClear()
  })

  it('creates a booking successfully', async () => {
    // Mock successful event lookup with type assertion
    mockSql.mockResolvedValueOnce({ rows: [{ id: 'evt_123', name: 'Test Event', price: 15000 }], length: 1 } as any)
    mockSql.mockResolvedValueOnce({ rows: [{ id: 'book_123', event_id: 'evt_123' }] } as any)

    const bookingData = {
      eventId: 'evt_123',
      date: new Date('2025-02-25T17:04:09.136Z'),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890'
    }

    const result = await createBooking(bookingData)

    expect(result.success).toBe(true)
    expect(result.bookingId).toMatch(/^book_\d+$/)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard/events')
  })

  it('returns error for missing required fields', async () => {
    const bookingData = {
      eventId: '',
      date: new Date(),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890'
    }

    const result = await createBooking(bookingData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Missing required fields')
    expect(mockSql).not.toHaveBeenCalled()
  })

  it('returns error for non-existent event', async () => {
    mockSql.mockResolvedValueOnce({ rows: [], length: 0 } as any)

    const bookingData = {
      eventId: 'non_existent',
      date: new Date(),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890'
    }

    const result = await createBooking(bookingData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid event selected')
  })

  it('handles database errors gracefully', async () => {
    mockSql.mockResolvedValueOnce({ rows: [{ id: 'evt_123', name: 'Test Event', price: 15000 }], length: 1 } as any)
    mockSql.mockRejectedValueOnce(new Error('Database connection failed'))

    const bookingData = {
      eventId: 'evt_123',
      date: new Date(),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890'
    }

    const result = await createBooking(bookingData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Database connection failed')
  })

  it('creates booking with correct SQL parameters', async () => {
    mockSql.mockResolvedValueOnce({ rows: [{ id: 'evt_123', name: 'Test Event', price: 15000 }], length: 1 } as any)
    mockSql.mockResolvedValueOnce({ rows: [{ id: 'book_123', event_id: 'evt_123' }] } as any)

    const bookingData = {
      eventId: 'evt_123',
      date: new Date('2025-02-25T17:04:09.136Z'),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890'
    }

    await createBooking(bookingData)

    // Verify the SQL queries were called
    expect(mockSql).toHaveBeenCalledTimes(2)
    
    // First call should be the SELECT query
    const selectQuery = mockSql.mock.calls[0][0].join('').replace(/\s+/g, ' ').trim()
    expect(selectQuery).toContain('SELECT id, name, price FROM products')
    expect(selectQuery).toContain('category = \'events\'')
    
    // Second call should be the INSERT query
    const insertQuery = mockSql.mock.calls[1][0].join('').replace(/\s+/g, ' ').trim()
    expect(insertQuery).toContain('INSERT INTO bookings')
    expect(insertQuery).toContain('customer_name')
  })
}) 