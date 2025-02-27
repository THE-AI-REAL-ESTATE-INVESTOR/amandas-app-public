'use server'

import { sql } from '@/app/lib/db'
import { redirect } from 'next/navigation'

export async function createBooking(formData: FormData) {
  const rawFormData = {
    eventId: formData.get('eventId'),
    date: formData.get('date'),
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    userId: formData.get('userId')
  }

  try {
    const bookingId = `book_${Date.now()}`
    await sql`
      INSERT INTO bookings (
        id,
        event_id,
        date,
        customer_name,
        customer_email,
        customer_phone,
        user_id
      ) VALUES (
        ${bookingId},
        ${rawFormData.eventId},
        ${rawFormData.date},
        ${rawFormData.name},
        ${rawFormData.email},
        ${rawFormData.phone},
        ${rawFormData.userId}
      )
    `
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to create booking.')
  }

  redirect('/dashboard/events')
}
