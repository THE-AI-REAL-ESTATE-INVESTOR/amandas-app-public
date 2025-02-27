import { BrandColors } from '@/app/lib/actions/brand';

export const getColorUsageExplanation = (colorName: keyof BrandColors): string => {
  const explanations: Record<keyof BrandColors, string> = {
    primary: "Used for main navigation, important buttons, and key UI elements. Example: 'Browse Rentals' button and admin panel link.",
    secondary: "Used for call-to-action buttons and background accents. Example: Main page background (15% opacity) and contact section (5% opacity).",
    accent: "Used for success messages, highlights, and decorative elements. Example: System status indicators and special offers.",
    text: "Used for main content text and headings. Example: Page titles and body text.",
    background: "Used for page and card backgrounds. Example: Dashboard cards and form backgrounds.",
    muted: "Used for subtle backgrounds and disabled states. Example: Secondary buttons and inactive elements."
  };

  return explanations[colorName];
};
