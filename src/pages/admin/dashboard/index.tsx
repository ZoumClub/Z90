import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AdminNav } from '@/components/admin/AdminNav';
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats';
import { ActionButtons } from '@/components/admin/dashboard/ActionButtons';
import { CarList } from '@/components/admin/CarList';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCars } from '@/hooks/admin';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { cars, isLoading, deleteCar, updateCar } = useAdminCars();

  useEffect(() => {
    if (!user || profile?.role !== 'admin') {
      router.replace('/admin/login');
    }
  }, [user, profile, router]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCar(id);
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Failed to delete car');
    }
  };

  const handleToggleSold = async (car: any) => {
    try {
      await updateCar({
        id: car.id,
        data: { is_sold: !car.is_sold }
      });
    } catch (error) {
      console.error('Error updating car:', error);
      toast.error('Failed to update car status');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <AdminNav />
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
              
              <DashboardStats
                totalCars={cars.length}
                totalAccessories={0}
                totalServices={0}
                pendingListings={0}
              />

              <ActionButtons />

              <div className="mt-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Car Listings</h2>
                    <button
                      onClick={() => router.push('/admin/dashboard/cars')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View All
                    </button>
                  </div>

                  <CarList
                    cars={cars.slice(0, 5)}
                    onDelete={handleDelete}
                    onToggleSold={handleToggleSold}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}