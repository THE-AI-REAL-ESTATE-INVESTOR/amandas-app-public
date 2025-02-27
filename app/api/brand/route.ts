import { sql } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const ColorSchema = z.object({
  primary: z.string().regex(/^#[0-9A-F]{6}$/i),
  secondary: z.string().regex(/^#[0-9A-F]{6}$/i),
  accent: z.string().regex(/^#[0-9A-F]{6}$/i),
  text: z.string().regex(/^#[0-9A-F]{6}$/i),
  background: z.string().regex(/^#[0-9A-F]{6}$/i),
  muted: z.string().regex(/^#[0-9A-F]{6}$/i),
});

export async function GET() {
  try {
    const result = await sql`
      SELECT value FROM brand_settings WHERE key = 'colors'
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'No brand settings found' }, { status: 404 });
    }

    return NextResponse.json(result[0].value);
  } catch (error) {
    console.error('Failed to fetch brand settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const colors = ColorSchema.parse(body);

    await sql`
      INSERT INTO brand_settings (key, value)
      VALUES ('colors', ${JSON.stringify(colors)})
      ON CONFLICT (key) DO UPDATE
      SET value = ${JSON.stringify(colors)}
    `;

    // Revalidate all pages that use brand colors
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/admin/settings');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update brand settings:', error);
    return NextResponse.json(
      { error: 'Failed to update brand settings' },
      { status: 500 }
    );
  }
}
