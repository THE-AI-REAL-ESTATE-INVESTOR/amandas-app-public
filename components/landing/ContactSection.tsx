import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/components/ui/button';

interface ContactSectionProps {
  phoneNumber: string;
}

export const ContactSection = ({ phoneNumber }: ContactSectionProps) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#4ECDC4]/10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className={`${lusitana.className} text-3xl font-bold mb-6 text-[#2C363F]`}>
          Ready to Make Your Event Special?
        </h2>
        <p className="text-lg mb-8 text-[#2C363F]">
          Contact us today at {phoneNumber} or visit our showroom
        </p>
        <Button
          asChild
          className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white px-8 py-3 rounded-lg text-lg"
        >
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </div>
    </section>
  );
}; 