import { SparklesIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { getBrandConfig } from '@/app/lib/brand/config';

export default async function AmandaLogo() {
  const config = await getBrandConfig();
  
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <SparklesIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">{config.brand.name}</p>
    </div>
  );
}
