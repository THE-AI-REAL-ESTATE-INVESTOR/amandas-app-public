export const events = [
  {
    id: 'evt_balloon',
    name: 'Balloon Party',
    price: 15000,
    description: 'Setting up balloon directions',
    category: 'events'
  },
  {
    id: 'evt_tent',
    name: 'Kids Tent Party',
    price: 25000,
    description: 'Set up tents for your party',
    category: 'events'
  },
  {
    id: 'evt_bar_min',
    name: 'Adult Party - 2 Drink Minimum',
    price: 50000,
    description: 'Open bar with 2 drink minimum plus tips',
    category: 'events'
  },
  {
    id: 'evt_bar_keg',
    name: 'Adult Party - Keg Package',
    price: 125000,
    description: 'Open bar with 1 keg plus paid liquor',
    category: 'events'
  },
  {
    id: 'evt_beer_barn',
    name: 'Adult Party - Beer Barn',
    price: 25000,
    description: 'Beer barn with open liquor',
    category: 'events'
  }
]

export const bookings = [
  {
    id: 'book_1',
    event_id: 'evt_balloon',
    date: new Date('2024-03-15'),
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '555-0123',
    created_at: new Date('2024-02-24'),
    status: 'pending',
    user_id: null // Will be populated with Clerk user ID when authenticated
  }
]

export const users = [
  {
    id: 'user_1',
    clerk_id: 'clerk_user_1', // Will be populated with actual Clerk ID
    role: 'admin',
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com'
  }
]
