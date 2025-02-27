// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  clerk_id: string;
  role: 'admin' | 'user';
  first_name?: string;
  last_name?: string;
  email: string;
};

export type AdminCheckResponse = {
  isAdmin: boolean;
  error?: string;
};

// Base Product type
export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  inventory: number;
  image_url: string;
};

// Trailer extends Product with additional properties
export type Trailer = Product & {
  size: string;
  capacity: string;
  daily_rate: number;  // in cents
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type Booking = {
  id: string;
  event_id: string;
  date: Date;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

export type BookingForm = {
  eventId: string;
  date: Date;
  name: string;
  email: string;
  phone: string;
};

export type Event = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  date?: Date;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  createdAt?: Date;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  userId?: string;
};

export type EventResponse = {
  events: Event[];
  error: string | null;
};

export type ProductForm = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url?: string;
};

export type TrailerField = {
  id: string;
  name: string;
};

export type CustomerField = {
  id: string;
  name: string;
};
