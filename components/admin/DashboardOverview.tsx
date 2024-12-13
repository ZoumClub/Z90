import { useRouter } from 'next/router';
import { Car, Plus, ClipboardList } from 'lucide-react';
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
      
      {/* Car Listings Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Car Listings</h2>
          <button
            onClick={() => router.push('/admin/dashboard/cars/new')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Car
          </button>
        </div>
        <CarList
          cars={cars}
          onDelete={onDeleteCar}
          onEdit={onEditCar}
          onToggleSold={onToggleSoldStatus}
        />
      </div>

      {/* Private Listings Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Private Listings</h2>
        <PrivateListingsTable
          listings={privateListings}
          onStatusUpdate={onUpdateListingStatus}
          isUpdating={false}
        />
      </div>
    </div>
  );
}