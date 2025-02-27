'use server';

import { sql } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ColorSchema = z.object({
  primary: z.string().regex(/^#[0-9A-F]{6}$/i),
  secondary: z.string().regex(/^#[0-9A-F]{6}$/i),
  accent: z.string().regex(/^#[0-9A-F]{6}$/i),
  text: z.string().regex(/^#[0-9A-F]{6}$/i),
  background: z.string().regex(/^#[0-9A-F]{6}$/i),
  muted: z.string().regex(/^#[0-9A-F]{6}$/i),
});

export type BrandColors = z.infer<typeof ColorSchema>;

export async function updateBrandColors(colors: BrandColors) {
  try {
    // Validate colors
    const validatedColors = ColorSchema.parse(colors);

    // Update colors in brand.yaml
    const fs = require('fs');
    const yaml = require('yaml');
    const path = require('path');

    const configPath = path.join(process.cwd(), 'config', 'brand.yaml');
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = yaml.parse(configFile);

    config.colors = validatedColors;

    fs.writeFileSync(configPath, yaml.stringify(config));

    // Revalidate all pages that use brand colors
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/admin/settings');

    return { success: true };
  } catch (error) {
    console.error('Failed to update brand colors:', error);
    return { success: false, error: 'Failed to update colors' };
  }
}

export async function getBrandColors() {
  try {
    const fs = require('fs');
    const yaml = require('yaml');
    const path = require('path');

    const configPath = path.join(process.cwd(), 'config', 'brand.yaml');
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = yaml.parse(configFile);

    return config.colors;
  } catch (error) {
    console.error('Failed to fetch brand colors:', error);
    return null;
  }
}
