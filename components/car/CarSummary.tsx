import { 
  Car, 
  Palette, 
  Users, 
  Key, 
  Paintbrush, 
  Shield 
} from 'lucide-react';

interface CarSummaryProps {
  bodyType: string;
  exteriorColor: string;
  numberOfOwners: number;
  numberOfKeys?: string;
  interiorColor: string;
  condition: string;
}

export function CarSummary({ 
  bodyType,
  exteriorColor,
  numberOfOwners,
  numberOfKeys = 'n/a',
  interiorColor,
  condition
}: CarSummaryProps) {
  const items = [
    { 
      icon: <Car className="w-6 h-6 text-blue-600" strokeWidth={1.5} />, 
      label: 'Body Type', 
      value: bodyType 
    },
    { 
      icon: <Palette className="w-6 h-6 text-blue-600" strokeWidth={1.5} />, 
      label: 'Exterior Color', 
      value: exteriorColor 
    },
    { 
      icon: <Users className="w-6 h-6 text-blue-600" strokeWidth={1.5} />, 
      label: 'Number Of Owners', 
      value: numberOfOwners 
    },
    { 
      icon: <Key className="w-6 h-6 text-blue-600" strokeWidth={1.5} />, 
      label: 'Number Of Keys', 
      value: numberOfKeys 
    },
    { 
      icon: <Paintbrush className="w-6 h-6 text-blue-600" strokeWidth={1.5} />, 
      label: 'Interior Color', 
      value: interiorColor 
    },
    { 
      icon: <Shield className="w-6 h-6 text-blue-600" strokeWidth={1.5} />, 
      label: 'Condition', 
      value: condition 
    },
  ];

  return (
    <div className="w-full mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-blue-600 inline-block">
        Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="transform group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <span className="text-gray-600">{item.label}</span>
            </div>
            <span className="font-bold text-gray-900 uppercase">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}