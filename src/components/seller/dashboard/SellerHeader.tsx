import { LogOut } from 'lucide-react';

interface SellerHeaderProps {
  sellerName: string;
  onLogout: () => void;
}

export function SellerHeader({ sellerName, onLogout }: SellerHeaderProps) {
  return (
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
  );
}