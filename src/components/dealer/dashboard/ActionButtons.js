import { useRouter } from 'next/router';
import { CarFront, Gavel } from 'lucide-react';

export function ActionButtons() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <button
        onClick={() => router.push('/dealer/sell-car')}
        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-white group"
      >
        <CarFront className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform stroke-[1.5]" />
        <span className="text-sm font-medium">List Car</span>
      </button>

      <button
        onClick={() => router.push('/dealer/bids')}
        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-white group"
      >
        <Gavel className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform stroke-[1.5]" />
        <span className="text-sm font-medium">Bid on Cars</span>
      </button>
    </div>
  );
}