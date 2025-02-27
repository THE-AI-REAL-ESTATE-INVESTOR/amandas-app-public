'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Product, Trailer, User } from './definitions';

export interface DashboardBooking {
  id: string;
  date: string;
  status: string;
  event_name: string;
  price: number;
}

export interface DashboardRental {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  product_name: string;
  price: number;
}

export interface DashboardData {
  user: User | null;
  bookings: DashboardBooking[];
  rentals: DashboardRental[];
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Admin check server action
export async function checkIsAdmin(clerkId: string): Promise<boolean> {
  try {
    const result = await sql<User[]>`
      SELECT role FROM users 
      WHERE clerk_id = ${clerkId}
    `;
    console.log('Admin check for clerk_id:', clerkId, 'Result:', result);
    return result[0]?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Set user as admin
export async function setUserAsAdmin(clerkId: string, email: string) {
  try {
    // Try to update existing user first
    const updateResult = await sql`
      UPDATE users 
      SET role = 'admin'
      WHERE clerk_id = ${clerkId}
      RETURNING *
    `;
    
    if (updateResult.length === 0) {
      // If no user exists, insert new admin user
      await sql`
        INSERT INTO users (id, clerk_id, role, email)
        VALUES (${`u_${Date.now()}`}, ${clerkId}, 'admin', ${email})
      `;
    }
    
    console.log('Successfully set user as admin:', clerkId);
    return true;
  } catch (error) {
    console.error('Error setting user as admin:', error);
    return false;
  }
}

// Get user dashboard data
export async function getUserDashboardData(userId: string): Promise<DashboardData> {
  try {
    // Fetch user data and role
    const userData = await sql<User[]>`
      SELECT id, clerk_id, role, email FROM users WHERE clerk_id = ${userId}
    `;

    // Fetch bookings
    const bookingsData = await sql`
      SELECT 
        b.id,
        b.date,
        b.status,
        b.event_id,
        p.name as event_name,
        p.price
      FROM bookings b
      LEFT JOIN products p ON b.event_id = p.id
      WHERE b.user_id = ${userId}
    `;

    // Fetch rentals
    const rentalsData = await sql`
      SELECT 
        r.id,
        r.start_date,
        r.end_date,
        r.status,
        p.name as product_name,
        p.price
      FROM rentals r
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ${userId}
    `;

    return {
      user: userData[0] || null,
      bookings: bookingsData.filter(d => d.id).map(d => ({
        id: d.id,
        date: d.date,
        status: d.status,
        event_name: d.event_name || 'Unknown Event',
        price: d.price || 0
      })),
      rentals: rentalsData.map(d => ({
        id: d.id,
        start_date: d.start_date,
        end_date: d.end_date,
        status: d.status,
        product_name: d.product_name || 'Unknown Product',
        price: d.price || 0
      }))
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
}
