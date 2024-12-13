import Link from 'next/link';
import { useRouter } from 'next/router';
import { Car, Plus, ClipboardList, LogOut, Settings } from 'lucide-react';

interface AdminNavProps {
  onLogout: () => void;
}

export function AdminNav({ onLogout }: AdminNavProps) {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
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
          href="/admin/dashboard/private-listings"
          className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
            isActive('/admin/dashboard/private-listings') ? 'bg-gray-100' : ''
          }`}
        >
          <ClipboardList className="h-5 w-5 mr-2" />
          Private Listings
        </Link>
        <Link
          href="/admin/dashboard/features"
          className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
            isActive('/admin/dashboard/features') ? 'bg-gray-100' : ''
          }`}
        >
          <Settings className="h-5 w-5 mr-2" />
          Manage Features
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </nav>
    </div>
  );
}