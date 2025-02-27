'use server'

import { sql } from '@/app/lib/db'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import type { Booking } from '@/app/lib/definitions'

interface BookingData {
  eventId: string
  date: Date
  name: string
  email: string
  phone: string
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export async function createBooking(data: BookingData) {
  console.log('Creating booking with data:', data)
  try {
    const bookingId = `book_${Date.now()}`
    
    // Get userId if user is authenticated, but don't require it
    const { userId } = await auth() || { userId: null }

    // Validate required fields
    if (!data.eventId || !data.date || !data.name || !data.email || !data.phone) {
      console.error('Missing required fields:', { 
        eventId: !!data.eventId,
        date: !!data.date,
        name: !!data.name,
        email: !!data.email,
        phone: !!data.phone
      })
      return { success: false, error: 'Missing required fields' }
    }

    // Verify event exists
    const event = await sql`
      SELECT id, name, price FROM products 
      WHERE id = ${data.eventId} AND category = 'events'
    `
    if (!event.length) {
      console.error('Event not found:', data.eventId)
      return { success: false, error: 'Invalid event selected' }
    }

    // If user is authenticated, ensure they exist in our users table
    if (userId) {
      const existingUser = await sql`
        SELECT id FROM users WHERE clerk_id = ${userId}
      `
      
      if (!existingUser.length) {
        // Split the name into first and last name
        const nameParts = data.name.split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ')

        // Create user if they don't exist
        await sql`
          INSERT INTO users (id, clerk_id, email, first_name, last_name, role)
          VALUES (${userId}, ${userId}, ${data.email}, ${firstName}, ${lastName}, 'user')
        `
      }
    }

    // All public bookings start as pending
    const status = 'pending'

    console.log('Creating booking record...')
    const result = await sql`
      INSERT INTO bookings (
        id,
        event_id,
        date,
        customer_name,
        customer_email,
        customer_phone,
        user_id,
        status
      ) VALUES (
        ${bookingId},
        ${data.eventId},
        ${data.date.toISOString()},
        ${data.name},
        ${data.email},
        ${data.phone},
        ${userId},
        ${status}
      )
    `

    console.log('Booking created successfully:', bookingId)
    
    // Only revalidate dashboard if user is authenticated
    if (userId) {
      revalidatePath('/dashboard')
    }

    return { 
      success: true, 
      bookingId,
      // Return whether user was authenticated to handle post-booking flow
      isAuthenticated: !!userId 
    }
  } catch (error) {
    console.error('Failed to create booking:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create booking'
    }
  }
}
