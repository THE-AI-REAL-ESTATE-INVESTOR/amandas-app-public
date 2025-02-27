'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getBrandConfig } from './service';


type BrandContextType = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    muted: string;
  };
};

const BrandContext = createContext<BrandContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [brandConfig, setBrandConfig] = useState<BrandContextType | null>(null);

  useEffect(() => {
    async function loadAndApplyBrandConfig() {
      const config = await getBrandConfig();
      setBrandConfig({
        colors: config.colors,
      });
      
      // Apply brand CSS variables
      document.documentElement.style.setProperty('--brand-primary', config.colors.primary);
      document.documentElement.style.setProperty('--brand-secondary', config.colors.secondary);
      document.documentElement.style.setProperty('--brand-accent', config.colors.accent);
      document.documentElement.style.setProperty('--brand-text', config.colors.text);
      document.documentElement.style.setProperty('--brand-background', config.colors.background);
      document.documentElement.style.setProperty('--brand-muted', config.colors.muted);
    }

    loadAndApplyBrandConfig();
  }, []);

  if (!brandConfig) {
    return <>{children}</>;
  }

  return (
    <BrandContext.Provider value={brandConfig}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a ThemeProvider');
  }
  return context;
}
