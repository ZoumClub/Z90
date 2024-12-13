import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { CarList } from '@/components/admin/CarList';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function CarsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/admin/login');
    }
  };

  return (
    <Layout>
      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
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
    </Layout>
  );
}