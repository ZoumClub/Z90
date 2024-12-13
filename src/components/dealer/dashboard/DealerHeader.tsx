import { LogOut } from 'lucide-react';

interface DealerHeaderProps {
  dealerName: string;
  onLogout: () => void;
}

export function DealerHeader({ dealerName, onLogout }: DealerHeaderProps) {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900">Welcome</h1>
            <p className="text-gray-600">{dealerName}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}