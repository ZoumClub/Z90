```tsx
import { useRouter } from 'next/router';
import { Car, Plus, ClipboardList, ShoppingBag, Wrench } from 'lucide-react';
import { CarList } from './CarList';
import { PrivateListingsTable } from './PrivateListingsTable';
import type { Car as CarType, PrivateListing } from '@/lib/supabase';

interface DashboardOverviewProps {
  username: string;
  cars: CarType[];
  privateListings: PrivateListing[];
  onDeleteCar: (id: string) => void;
  onEditCar: (id: string) => void;
  onToggleSoldStatus: (car: CarType) => void;
  onUpdateListingStatus: (id: string, status: 'approved' | 'rejected') => void;
}

export function DashboardOverview({ 
  username,
  cars,
  privateListings,
  onDeleteCar,
  onEditCar,
  onToggleSoldStatus,
  onUpdateListingStatus
}: DashboardOverviewProps) {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Welcome, {username}</h1>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => router.push('/admin/dashboard/cars/new')}
          className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Car className="h-8 w-8 mb-2" />
          <span>Add New Car</span>
        </button>
        <button
          onClick={() => router.push('/admin/dashboard/accessories')}
          className="flex flex-col items-center justify-center p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ShoppingBag className="h-8 w-8 mb-2" />
          <span>Manage Accessories</span>
        </button>
        <button
          onClick={() => router.push('/admin/dashboard/services')}
          className="flex flex-col items-center justify-center p-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Wrench className="h-8 w-8 mb-2" />
          <span>Manage Services</span>
        </button>
        <button
          onClick={() => router.push('/admin/dashboard/private-listings')}
          className="flex flex-col items-center justify-center p-6 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <ClipboardList className="h-8 w-8 mb-2" />
          <span>Private Listings</span>
        </button>
      </div>

      {/* Car Listings Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Car Listings</h2>
          <button
            onClick={() => router.push('/admin/dashboard/cars')}
            className="text-blue-600 hover:text-blue-800"
          >
            View All
          </button>
        </div>
        <CarList
          cars={cars.slice(0, 5)}
          onDelete={onDeleteCar}
          onEdit={onEditCar}
          onToggleSold={onToggleSoldStatus}
        />
      </div>

      {/* Private Listings Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Private Listings</h2>
          <button
            onClick={() => router.push('/admin/dashboard/private-listings')}
            className="text-blue-600 hover:text-blue-800"
          >
            View All
          </button>
        </div>
        <PrivateListingsTable
          listings={privateListings.slice(0, 5)}
          onStatusUpdate={onUpdateListingStatus}
          isUpdating={false}
        />
      </div>
    </div>
  );
}
```