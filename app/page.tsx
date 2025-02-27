import { getBrandConfig } from '@/app/lib/brand/config'
import { HeroWrapper } from '@/components/landing/client/HeroWrapper'
import { PromoSection } from '@/components/landing/PromoSection'
import { CategoriesSection } from '@/components/landing/CategoriesSection'
import { ContactWrapper } from '@/components/landing/client/ContactWrapper'

export default function Page() {
  const config = getBrandConfig()

  return (
    <main className="flex min-h-screen flex-col">
      <HeroWrapper 
        brandName={config.brand.name}
        brandSlogan={config.brand.slogan}
        colors={config.colors}
      />
      <PromoSection />
      <CategoriesSection />
      <ContactWrapper phoneNumber={config.brand.phone.primary} />
    </main>
  )
}
