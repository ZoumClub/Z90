import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { User } from 'lucide-react';

export default function SellerLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    lastFourDigits: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Find private listings matching the partial name and last 4 digits
      const { data: listings, error } = await supabase
        .from('private_listings')
        .select('id, client_name, client_phone')
        .ilike('client_name', `%${formData.name.trim()}%`) // Case-insensitive partial match
        .filter('client_phone', 'ilike', `%${formData.lastFourDigits}`) // Match last 4 digits
        .limit(1);

      if (error) throw error;

      if (!listings?.length) {
        throw new Error('No listings found with these credentials');
      }

      // Store seller info in localStorage
      localStorage.setItem('seller_name', listings[0].client_name);
      localStorage.setItem('seller_phone', listings[0].client_phone);

      toast.success('Login successful!');
      router.push('/seller/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid credentials');
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
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Seller Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your name and the last 4 digits of your phone number
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your first or last name"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastFourDigits" className="sr-only">
                  Last 4 digits of phone number
                </label>
                <input
                  id="lastFourDigits"
                  type="text"
                  value={formData.lastFourDigits}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setFormData(prev => ({ ...prev, lastFourDigits: value }));
                  }}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Last 4 digits of your phone number"
                  pattern="\d{4}"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim() || formData.lastFourDigits.length !== 4}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/sell-your-car"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Don't have a listing yet? Sell your car
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}