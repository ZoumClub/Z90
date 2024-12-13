import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Car } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  const isDealerPage = router.pathname.startsWith('/dealer');
  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminPage && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center">
                <Car className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">ZoooM</span>
              </Link>
              
              {!isDealerPage && (
                <nav className="flex items-center space-x-8">
                  <Link
                    href="/seller/login"
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                  >
                    Seller Login
                  </Link>
                  <Link
                    href="/sell-your-car"
                    className="bg-green-600 text-white px-6 py-2 text-base font-medium shadow-lg hover:bg-green-700 transition-all duration-200"
                  >
                    Sell Your Car
                  </Link>
                </nav>
              )}
            </div>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}