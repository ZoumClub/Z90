import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Store } from 'lucide-react';

export default function DealerLogin() {
  const router = useRouter();
  const [idNumber, setIdNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First check if dealer exists
      const { data: dealer, error } = await supabase
        .from('dealers')
        .select('id, name')
        .eq('id_number', idNumber.trim())
        .single();

      if (error || !dealer) {
        throw new Error('Invalid dealer ID');
      }

      // Store dealer info in localStorage
      localStorage.setItem('dealer_id', dealer.id);
      localStorage.setItem('dealer_name', dealer.name);

      toast.success('Login successful!');
      router.push('/dealer/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid dealer ID');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Dealer Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your dealer ID number to access your dashboard
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="id_number" className="sr-only">
                Dealer ID Number
              </label>
              <input
                id="id_number"
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your dealer ID number"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !idNumber.trim()}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}