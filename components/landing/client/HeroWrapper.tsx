'use client'

import { HeroSection } from '../HeroSection'

export function HeroWrapper({ brandName, brandSlogan, colors }: {
  brandName: string;
  brandSlogan: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    muted: string;
  };
}) {
  return (
    <HeroSection 
      brandName={brandName}
      brandSlogan={brandSlogan}
      colors={colors}
    />
  )
}
