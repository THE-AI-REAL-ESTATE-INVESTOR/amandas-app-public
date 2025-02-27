'use client'

import { getBrandConfig } from '@/app/lib/brand/config'

export default function AmandaLogo() {
  const config = getBrandConfig()

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-lg">
        A
      </div>
    </div>
  )
}
