export const colorMappings: Record<string, string> = {
  'warm coral': '#FF6B6B',
  'ocean blue': '#4ECDC4',
  'sunshine yellow': '#FFE66D',
  'dark charcoal': '#2C363F',
  'white': '#FFFFFF',
  'light gray': '#F7F7F7',
  
  // Original brand colors
  'primary': '#FF6B6B',
  'secondary': '#4ECDC4',
  'accent': '#FFE66D',
  'text': '#2C363F',
  'background': '#FFFFFF',
  'muted': '#F7F7F7'
};

export function getColorValue(color: string): string {
  // If the input is already a hex color, return it directly
  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    return color;
  }
  
  // If no valid color format, return a safe default
  return color || '#000000';
}
