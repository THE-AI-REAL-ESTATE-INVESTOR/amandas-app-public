import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';

export const PromoSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative w-64 h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-[#FF6B6B]">
          <Image
            src="/images/marketing/amanda-promo.jpg"
            alt="Amanda's Party & Event Rentals Team"
            fill
            className="object-cover"
            priority
          />
        </div>
        <p className={`${lusitana.className} text-2xl text-[#2C363F] mb-4`}>
          Family-Owned & Operated
        </p>
        <p className="text-lg text-[#2C363F] opacity-80">
          Creating memorable events with a personal touch
        </p>
      </div>
    </section>
  );
}; 