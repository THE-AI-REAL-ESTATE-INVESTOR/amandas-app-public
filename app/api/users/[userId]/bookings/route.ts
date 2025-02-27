import { sql } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Await the params to get userId
    const { userId } = await params

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Query both bookings and rentals
    const bookings = await sql`
      SELECT 
        b.id,
        b.date,
        b.status,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        p.name as event_name,
        p.price
      FROM bookings b
      LEFT JOIN products p ON b.event_id = p.id
      WHERE b.user_id = ${userId}
      ORDER BY b.date DESC
    `

    // Also get rentals for this user
    const rentals = await sql`
      SELECT 
        r.id,
        r.start_date,
        r.end_date,
        r.status,
        r.customer_name,
        p.name as product_name,
        p.price
      FROM rentals r
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ${userId}
      ORDER BY r.start_date DESC
    `

    return NextResponse.json({ 
      bookings: bookings || [],
      rentals: rentals || []
    })
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings and rentals' },
      { status: 500 }
    )
  }
} 