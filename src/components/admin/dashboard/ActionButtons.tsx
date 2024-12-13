import { useRouter } from 'next/router';
import { Car, Plus, ClipboardList, ShoppingBag, Wrench } from 'lucide-react';

export function ActionButtons() {
  const router = useRouter();

  const buttons = [
    {
      label: 'Add New Car',
      icon: Car,
      href: '/admin/dashboard/cars/new',
      bgColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: 'Private Listings',
      icon: ClipboardList,
      href: '/admin/dashboard/private-listings',
      bgColor: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      label: 'Accessories',
      icon: ShoppingBag,
      href: '/admin/dashboard/accessories',
      bgColor: 'bg-green-600 hover:bg-green-700'
    },
    {
      label: 'Services',
      icon: Wrench,
      href: '/admin/dashboard/services',
      bgColor: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {buttons.map(({ label, icon: Icon, href, bgColor }) => (
        <button
          key={label}
          onClick={() => router.push(href)}
          className={`flex flex-col items-center justify-center p-6 ${bgColor} text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group`}
        >
          <Icon className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}