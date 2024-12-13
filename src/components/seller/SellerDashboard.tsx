import { useState } from 'react';
import { SellerListings } from './SellerListings';
import { LogOut } from 'lucide-react';

interface SellerDashboardProps {
  sellerName: string;
  onLogout: () => void;
}

export function SellerDashboard({ sellerName, onLogout }: SellerDashboardProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {sellerName}
          </h1>
          <p className="text-gray-600 mt-1">
            Here are your car listings and their current status
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      <SellerListings />
    </div>
  );
}