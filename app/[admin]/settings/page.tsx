'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrandConfig } from '@/app/lib/brand/config';
import { updateBrandColors, type BrandColors } from '@/app/lib/brand/service';
import { ColorUsageGuide } from '@/components/settings/ColorUsageGuide';
import { toast } from '@/components/ui/use-toast';

export default function AdminSettings() {
  const router = useRouter();
  const config = getBrandConfig();
  const [colors, setColors] = useState<BrandColors>(config.colors);
  const [isSaving, setIsSaving] = useState(false);

  const handleColorChange = (name: keyof BrandColors, value: string) => {
    setColors(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateBrandColors(colors);
      if (result.success) {
        toast({
          title: "Settings saved",
          description: "Your brand colors have been updated.",
        });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Business Settings</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Brand Information */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Brand Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                value={config.brand.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Slogan</label>
              <input
                type="text"
                value={config.brand.slogan}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={config.brand.phone.primary}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                readOnly
              />
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Brand Colors</h2>
            <button
              onClick={() => setColors(config.colors)}
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Reset to Defaults
            </button>
          </div>
          
          <div className="space-y-6">
            {Object.entries(colors).map(([name, color]) => (
              <ColorUsageGuide
                key={name}
                colorName={name as keyof BrandColors}
                color={color as string}
                onColorChange={(newColor) => handleColorChange(name as keyof BrandColors, newColor)}
              />
            ))}
          </div>
        </section>

        <div className="text-sm text-gray-500">
          <p>Note: Brand information can only be edited by system administrators. Contact support for changes to business details.</p>
        </div>
      </div>
    </div>
  );
}
