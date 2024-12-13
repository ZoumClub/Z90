import Link from 'next/link';
import { useRouter } from 'next/router';
import { Car, Plus, ClipboardList, ShoppingBag, Wrench, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function AdminNav() {
  const router = useRouter();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    return router.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>
      </div>

      <nav className="mt-4">
        <Link
          href="/admin/dashboard/cars"
          className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
            isActive('/admin/dashboard/cars') ? 'bg-gray-100' : ''
          }`}
        >
          <Car className="h-5 w-5 mr-2" />
          Car Listings
        </Link>

        <Link
          href="/admin/dashboard/cars/new"
          className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
            isActive('/admin/dashboard/cars/new') ? 'bg-gray-100' : ''
          }`}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Car
        </Link>

        <Link
          href="/admin/dashboard/accessories"
          className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
            isActive('/admin/dashboard/accessories') ? 'bg-gray-100' : ''
          }`}
        >
          <ShoppingBag className="h-5 w-5 mr-2" />
          Accessories
        </Link>

        <Link
          href="/admin/dashboard/services"
          className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
            isActive('/admin/dashboard/services') ? 'bg-gray-100' : ''
          }`}
        >
          <Wrench className="h-5 w-5 mr-2" />
          Services
        </Link>

        <Link
          href="/admin/dashboard/private-listings"
          className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
            isActive('/admin/dashboard/private-listings') ? 'bg-gray-100' : ''
          }`}
        >
          <ClipboardList className="h-5 w-5 mr-2" />
          Private Listings
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full mt-4"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </nav>
    </div>
  );
}