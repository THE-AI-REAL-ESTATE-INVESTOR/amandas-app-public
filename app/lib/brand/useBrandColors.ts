'use client';

import { useBrand } from './ThemeProvider';

export function useBrandColors() {
  const { colors } = useBrand();
  
  return {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    text: colors.text,
    background: colors.background,
    muted: colors.muted,
  };
}
