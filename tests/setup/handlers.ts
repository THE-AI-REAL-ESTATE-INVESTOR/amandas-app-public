import { http, HttpResponse } from 'msw'
import type { Event } from '@/app/lib/definitions'

// Type definitions for request payloads
interface BookingRequest {
  eventId: string;
  date: string;  // ISO string format for dates
  name: string;
  email: string;
  phone: string;
}

interface StatusUpdateRequest {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface ProductResponse {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface BookingResponse {
  success: boolean;
  bookingId?: string;
  error?: string;
  data?: BookingRequest;
}

interface StatusUpdateResponse {
  success: boolean;
  eventId: string;
  status: StatusUpdateRequest['status'];
  error?: string;
}

// Define your mock request handlers with proper typing
export const handlers = [
  // Mock GET /api/events
  http.get('/api/events', () => {
    const events: Event[] = [
      {
        id: 'evt_123',
        name: 'Kids Party',
        price: 15000,
        description: 'Fun party for kids',
        category: 'events',
        date: new Date('2025-02-25T17:04:09.136Z'),
        status: 'pending'
      }
    ]
    
    return HttpResponse.json({ events })
  }),

  // Mock POST /api/bookings
  http.post('/api/bookings', async ({ request }) => {
    try {
      const data = await request.json() as BookingRequest
      
      // Validate required fields
      if (!data.eventId || !data.date || !data.name || !data.email || !data.phone) {
        return HttpResponse.json<BookingResponse>(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        )
      }
      
      const bookingId = `book_${Date.now()}`
      return HttpResponse.json<BookingResponse>(
        { success: true, bookingId, data },
        { status: 201 }
      )
    } catch (error) {
      return HttpResponse.json<BookingResponse>(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),

  // Mock GET /api/products/:id
  http.get('/api/products/:id', ({ params }) => {
    const id = params.id as string
    
    const product: ProductResponse = {
      id,
      name: 'Test Event',
      price: 15000,
      category: 'events',
      available: true
    }
    
    return HttpResponse.json([product])
  }),

  // Mock PATCH /api/events/:id/status
  http.patch('/api/events/:id/status', async ({ params, request }) => {
    try {
      const id = params.id as string
      const data = await request.json() as StatusUpdateRequest
      
      if (!data.status) {
        return HttpResponse.json<StatusUpdateResponse>(
          { success: false, eventId: id, status: 'pending', error: 'Invalid status' },
          { status: 400 }
        )
      }
      
      return HttpResponse.json<StatusUpdateResponse>({
        success: true,
        eventId: id,
        status: data.status
      })
    } catch (error) {
      return HttpResponse.json<StatusUpdateResponse>(
        { success: false, eventId: params.id as string, status: 'pending', error: 'Invalid request data' },
        { status: 400 }
      )
    }
  })
] 