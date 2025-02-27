import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  Product,
  Trailer,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

// Fetch all products
export async function fetchProducts(query = '', category = '', page = 1) {
  const ITEMS_PER_PAGE = 6;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  try {
    const products = await sql<Product[]>`
      SELECT *
      FROM products
      WHERE 
        (name ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`})
        ${category ? sql`AND category = ${category}` : sql``}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

// Fetch filtered products with pagination
export async function fetchFilteredProducts(
  query: string,
  currentPage: number,
  itemsPerPage: number = 10
) {
  const offset = (currentPage - 1) * itemsPerPage;

  try {
    const products = await sql<Product[]>`
      SELECT *
      FROM products
      WHERE
        name ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`} OR
        category ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${itemsPerPage} OFFSET ${offset}
    `;
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered products.');
  }
}

// Fetch all trailers
export async function fetchTrailers() {
  try {
    const data = await sql<Trailer[]>`
      SELECT 
        p.*,
        t.size,
        t.capacity,
        t.daily_rate
      FROM products p
      JOIN trailers t ON p.id = t.product_id
      WHERE p.category = 'trailer'
      ORDER BY p.name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch trailers.');
  }
}

// Fetch filtered trailers
export async function fetchFilteredTrailers(
  query: string,
  currentPage: number,
  itemsPerPage: number = 10
) {
  const offset = (currentPage - 1) * itemsPerPage;

  try {
    const trailers = await sql<Trailer[]>`
      SELECT 
        p.*,
        t.size,
        t.capacity,
        t.daily_rate
      FROM products p
      JOIN trailers t ON p.id = t.product_id
      WHERE 
        p.category = 'trailer' AND
        (
          p.name ILIKE ${`%${query}%`} OR
          p.description ILIKE ${`%${query}%`} OR
          t.size ILIKE ${`%${query}%`} OR
          t.capacity ILIKE ${`%${query}%`}
        )
      ORDER BY p.name ASC
      LIMIT ${itemsPerPage} OFFSET ${offset}
    `;
    return trailers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered trailers.');
  }
}

// Fetch a single trailer by ID
export async function fetchTrailerById(id: string) {
  try {
    const data = await sql<Trailer[]>`
      SELECT 
        p.*,
        t.size,
        t.capacity,
        t.daily_rate
      FROM products p
      JOIN trailers t ON p.id = t.product_id
      WHERE p.id = ${id} AND p.category = 'trailer'
    `;
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch trailer.');
  }
}

export async function fetchProductById(id: string) {
  try {
    const product = await sql<Product[]>`
      SELECT *
      FROM products
      WHERE id = ${id}
    `;
    return product[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

export async function fetchCategories() {
  try {
    const categories = await sql`
      SELECT DISTINCT category 
      FROM products 
      ORDER BY category
    `;
    return categories.map((row: { category: string }) => row.category);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}
