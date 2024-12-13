import { 
  Gauge, 
  Fuel, 
  Settings, 
  Navigation, 
  Users 
} from 'lucide-react';

interface CarOverviewProps {
  mileage?: string;
  fuelType: string;
  transmission: string;
  autonomy?: string;
  seats: number;
}

export function CarOverview({ 
  mileage = 'N/A', 
  fuelType, 
  transmission, 
  autonomy = 'N/A', 
  seats 
}: CarOverviewProps) {
  const items = [
    { 
      icon: <Gauge className="w-8 h-8 text-blue-600" strokeWidth={1.5} />, 
      label: 'Mileage', 
      value: mileage 
    },
    { 
      icon: <Fuel className="w-8 h-8 text-blue-600" strokeWidth={1.5} />, 
      label: 'Fuel Type', 
      value: fuelType 
    },
    { 
      icon: <Settings className="w-8 h-8 text-blue-600" strokeWidth={1.5} />, 
      label: 'Transmission', 
      value: transmission 
    },
    { 
      icon: <Navigation className="w-8 h-8 text-blue-600" strokeWidth={1.5} />, 
      label: 'Autonomy', 
      value: autonomy 
    },
    { 
      icon: <Users className="w-8 h-8 text-blue-600" strokeWidth={1.5} />, 
      label: 'Seats', 
      value: seats 
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-blue-600 inline-block">
        Car Overview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center group"
          >
            <div className="flex justify-center mb-3 transform group-hover:scale-110 transition-transform duration-200">
              {item.icon}
            </div>
            <p className="text-gray-600 text-sm mb-1">{item.label}</p>
            <p className="font-semibold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}