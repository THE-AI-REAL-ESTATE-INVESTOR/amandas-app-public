'use server';

import { brandConfig, type BrandConfig } from './config';

export type BrandColors = BrandConfig['colors'];

export async function updateBrandColors(colors: BrandColors): Promise<{ success: boolean; error?: string }> {
  try {
    brandConfig.colors = colors;
    return { success: true };
  } catch (error) {
    console.error('Failed to update brand colors:', error);
    return { success: false, error: 'Failed to update colors' };
  }
}
