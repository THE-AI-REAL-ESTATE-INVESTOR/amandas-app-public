'use server'

import { sql } from '@/app/lib/db'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

interface RentalData {
  productId: string
  startDate: Date
  endDate: Date
  name: string
  email: string
  phone: string
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export async function createRental(data: RentalData) {
  console.log('Creating rental with data:', data)
  try {
    const rentalId = `rent_${Date.now()}`
    
    // Get userId if user is authenticated, but don't require it
    const { userId } = await auth() || { userId: null }

    // Validate required fields
    if (!data.productId || !data.startDate || !data.endDate || !data.name || !data.email || !data.phone) {
      console.error('Missing required fields:', { 
        productId: !!data.productId,
        startDate: !!data.startDate,
        endDate: !!data.endDate,
        name: !!data.name,
        email: !!data.email,
        phone: !!data.phone
      })
      return { success: false, error: 'Missing required fields' }
    }

    // Verify product exists and is available for rent
    const product = await sql`
      SELECT id, name, price FROM products 
      WHERE id = ${data.productId} AND category = 'rentals'
    `
    if (!product.length) {
      console.error('Rental product not found:', data.productId)
      return { success: false, error: 'Invalid rental product selected' }
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

    // All public rentals start as pending
    const status = 'pending'

    console.log('Creating rental record...')
    const result = await sql`
      INSERT INTO rentals (
        id,
        product_id,
        start_date,
        end_date,
        customer_name,
        customer_email,
        customer_phone,
        user_id,
        status
      ) VALUES (
        ${rentalId},
        ${data.productId},
        ${data.startDate.toISOString()},
        ${data.endDate.toISOString()},
        ${data.name},
        ${data.email},
        ${data.phone},
        ${userId},
        ${status}
      )
    `

    console.log('Rental created successfully:', rentalId)
    
    // Only revalidate dashboard if user is authenticated
    if (userId) {
      revalidatePath('/dashboard')
    }

    return { 
      success: true, 
      rentalId,
      // Return whether user was authenticated to handle post-rental flow
      isAuthenticated: !!userId 
    }
  } catch (error) {
    console.error('Failed to create rental:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create rental'
    }
  }
} 