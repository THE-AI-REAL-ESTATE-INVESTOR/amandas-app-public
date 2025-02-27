'use client'

import * as React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PartyPopper } from 'lucide-react'

type Package = {
  id: string;
  name: string;
  description: string;
  price: number;
}

const PACKAGES: Package[] = [
  {
    id: 'balloon-party',
    name: 'Balloon Party',
    description: 'Setting up balloon directions',
    price: 150,
  },
  {
    id: 'kids-tent',
    name: 'Kids Tent Party',
    description: 'Set up tents for your slumber party / birthday party',
    price: 250,
  }
]

interface PackageSelectionProps {
  onPackageSelect: (packageId: string) => void;
}

export function PackageSelection({ onPackageSelect }: PackageSelectionProps) {
  const [selectedPackage, setSelectedPackage] = React.useState<string | null>(null)

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId)
    onPackageSelect(packageId)
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-8">Choose Your Kids Package</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PACKAGES.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`cursor-pointer transition-all ${
              selectedPackage === pkg.id 
                ? 'border-[#235082] border-2' 
                : 'hover:border-[#235082]/50'
            }`}
            onClick={() => handlePackageSelect(pkg.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <PartyPopper className="w-8 h-8 text-[#235082]" />
                <div>
                  <h3 className="text-xl font-semibold">{pkg.name}</h3>
                  <p className="text-gray-600">${pkg.price}</p>
                </div>
              </div>
              <p className="text-gray-500">{pkg.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPackage && (
        <div className="mt-8 text-center">
          <Button 
            className="bg-[#235082] hover:bg-[#235082]/90 text-white"
            onClick={() => onPackageSelect(selectedPackage)}
          >
            Continue with {PACKAGES.find(p => p.id === selectedPackage)?.name}
          </Button>
        </div>
      )}
    </div>
  )
} 