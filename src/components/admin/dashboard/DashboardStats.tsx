import { Car, ShoppingBag, Wrench, ClipboardList } from 'lucide-react';

interface DashboardStatsProps {
  totalCars: number;
  totalAccessories: number;
  totalServices: number;
  pendingListings: number;
}

export function DashboardStats({
  totalCars,
  totalAccessories,
  totalServices,
  pendingListings
}: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Cars',
      value: totalCars,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Accessories',
      value: totalAccessories,
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Services',
      value: totalServices,
      icon: Wrench,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Pending Listings',
      value: pendingListings,
      icon: ClipboardList,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(({ label, value, icon: Icon, color, bgColor }) => (
        <div key={label} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${bgColor}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}