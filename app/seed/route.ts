import { sql } from '@/app/lib/db';
import { bookings, events } from '@/app/lib/placeholder-data';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Drop and recreate tables with CASCADE
    await sql`DROP TABLE IF EXISTS bookings, products, users, trailers CASCADE;`;
    
    await sql`
      CREATE TABLE products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL
      );
    `;

    await sql`
      CREATE TABLE users (
        id VARCHAR(255) PRIMARY KEY,
        clerk_id VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255)
      );
    `;

    await sql`
      CREATE TABLE bookings (
        id VARCHAR(255) PRIMARY KEY,
        event_id VARCHAR(255) NOT NULL,
        date TIMESTAMP NOT NULL,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(255),
        user_id VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(clerk_id)
      );
    `;

    // Insert seed data for users
    const { users } = await import('@/app/lib/placeholder-data');
    for (const user of users) {
      await sql`
        INSERT INTO users (
          id,
          clerk_id,
          role,
          first_name,
          last_name,
          email
        ) VALUES (
          ${user.id},
          ${user.clerk_id},
          ${user.role},
          ${user.first_name},
          ${user.last_name},
          ${user.email}
        )
        ON CONFLICT (clerk_id) DO NOTHING;
      `;
    }

    // Insert seed data for events
    for (const event of events) {
      await sql`
        INSERT INTO products (
          id,
          name,
          price,
          description,
          category
        ) VALUES (
          ${event.id},
          ${event.name},
          ${event.price},
          ${event.description},
          ${event.category}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    for (const booking of bookings) {
      await sql`
        INSERT INTO bookings (
          id,
          event_id,
          date,
          customer_name,
          customer_email,
          customer_phone,
          status,
          user_id
        ) VALUES (
          ${booking.id},
          ${booking.event_id},
          ${booking.date.toISOString()},
          ${booking.customer_name},
          ${booking.customer_email},
          ${booking.customer_phone},
          ${booking.status},
          ${booking.user_id}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to seed database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
