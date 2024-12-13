import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Store, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Car } from '@/lib/supabase';

export default function DealerInventory() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dealerId = localStorage.getItem('dealer_id');
    if (!dealerId) {
      router.replace('/dealer');
      return;
    }
    loadInventory(dealerId);
  }, [router]);

  const loadInventory = async (dealerId: string) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          brand:brands (
            id,
            name,
            logo_url
          )
        `)
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSoldStatus = async (car: Car) => {
    try {
      const { data: updatedCar, error } = await supabase
        .from('cars')
        .update({ is_sold: !car.is_sold })
        .eq('id', car.id)
        .select()
        .single();

      if (error) throw error;

      setCars(cars.map(c => c.id === car.id ? updatedCar : c));
      toast.success(`Car marked as ${updatedCar.is_sold ? 'sold' : 'available'}`);
    } catch (error) {
      console.error('Error updating car:', error);
      toast.error('Failed to update car status');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Store className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          </div>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listed Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              src={car.image}
                              alt={`${car.make} ${car.model}`}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {car.year} {car.make} {car.model}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">£{car.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          car.is_sold
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {car.is_sold ? 'Sold' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(car.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleSoldStatus(car)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                            car.is_sold
                              ? 'text-green-700 bg-green-100 hover:bg-green-200'
                              : 'text-red-700 bg-red-100 hover:bg-red-200'
                          }`}
                        >
                          <Tag className="h-4 w-4" />
                          {car.is_sold ? 'Mark Available' : 'Mark Sold'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cars.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No cars in inventory
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}