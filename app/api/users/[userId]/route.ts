import { sql } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify the request is authenticated and matches the requested userId
    const { userId: authUserId } = await auth()
    const { userId } = await params

    if (!authUserId || authUserId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // First check if user exists in our database
    const dbUser = await sql`
      SELECT id, email, role, first_name, last_name
      FROM users
      WHERE clerk_id = ${userId}
    `

    if (dbUser.length === 0) {
      // If user doesn't exist in our db, create them as a regular user
      return NextResponse.json({
        id: userId,
        role: 'user'
      })
    }

    // Return user data
    return NextResponse.json(dbUser[0])
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
} 