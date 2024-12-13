import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { CarList } from '@/components/admin/CarList';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Car, ShoppingBag, Wrench, ClipboardList } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/admin/login');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link
              href="/admin/dashboard/cars/new"
              className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
            >
              <Car className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <span>Add New Car</span>
            </Link>

            <Link
              href="/admin/dashboard/private-listings"
              className="flex flex-col items-center justify-center p-6 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors group"
            >
              <ClipboardList className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <span>Private Listings</span>
            </Link>

            <Link
              href="/admin/dashboard/accessories"
              className="flex flex-col items-center justify-center p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors group"
            >
              <ShoppingBag className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <span>Manage Accessories</span>
            </Link>

            <Link
              href="/admin/dashboard/services"
              className="flex flex-col items-center justify-center p-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors group"
            >
              <Wrench className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <span>Manage Services</span>
            </Link>
          </div>

          {/* Recent Cars */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Car Listings</h2>
              <Link
                href="/admin/dashboard/cars"
                className="text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>
            <CarList
              onDelete={async (id) => {
                try {
                  const { error } = await supabase
                    .from('cars')
                    .delete()
                    .eq('id', id);

                  if (error) throw error;
                  toast.success('Car deleted successfully');
                  router.reload();
                } catch (error) {
                  console.error('Error deleting car:', error);
                  toast.error('Failed to delete car');
                }
              }}
              onToggleSold={async (car) => {
                try {
                  const { error } = await supabase
                    .from('cars')
                    .update({ is_sold: !car.is_sold })
                    .eq('id', car.id);

                  if (error) throw error;
                  toast.success(`Car marked as ${!car.is_sold ? 'sold' : 'available'}`);
                  router.reload();
                } catch (error) {
                  console.error('Error updating car:', error);
                  toast.error('Failed to update car status');
                }
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}