'use client';

import { BrandColors } from '@/app/lib/actions/brand';
import { getColorUsageExplanation } from '@/app/lib/utils/colorExplanations';

interface ColorUsageGuideProps {
  colorName: keyof BrandColors;
  color: string;
  onColorChange: (color: string) => void;
}

export function ColorUsageGuide({ colorName, color, onColorChange }: ColorUsageGuideProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="h-8 w-8 rounded cursor-pointer"
        />
        <div>
          <span className="font-medium capitalize">{colorName}</span>
          <span className="ml-2 text-sm text-gray-500">{color}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {getColorUsageExplanation(colorName)}
      </p>
      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
        <strong className="text-gray-700">Preview:</strong>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <div 
            className="h-8 rounded" 
            style={{ backgroundColor: color }}
          >
            <span className="sr-only">Full opacity</span>
          </div>
          <div 
            className="h-8 rounded" 
            style={{ backgroundColor: color, opacity: 0.1 }}
          >
            <span className="sr-only">10% opacity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
