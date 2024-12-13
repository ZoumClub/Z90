import Link from 'next/link';

export function Hero() {
  return (
    <div className="relative">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Find your perfect car
          </h1>
          <p className="mt-6 text-xl text-gray-100">
            Compare prices from trusted dealers and get the best deal
          </p>
          
          <div className="mt-10">
            <Link
              href="/sell-your-car"
              className="inline-flex items-center px-8 py-3 text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Sell Your Car
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}