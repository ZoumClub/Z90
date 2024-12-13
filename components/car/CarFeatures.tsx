import { 
  Check,
  Gauge,
  Wifi,
  Camera,
  Navigation,
  ParkingCircle,
  Power,
  Shield,
  Disc,
  Laptop,
  CircleDot,
  Zap,
  Radio,
  Bluetooth
} from 'lucide-react';
import type { CarFeature } from '@/lib/supabase';

interface CarFeaturesProps {
  features?: CarFeature[];
}

const featureIcons: Record<string, React.ReactNode> = {
  'Speed Regulator': <Gauge className="w-5 h-5" strokeWidth={1.5} />,
  'Air Condition': <Wifi className="w-5 h-5" strokeWidth={1.5} />,
  'Reversing Camera': <Camera className="w-5 h-5" strokeWidth={1.5} />,
  'Reversing Radar': <Radio className="w-5 h-5" strokeWidth={1.5} />,
  'GPS Navigation': <Navigation className="w-5 h-5" strokeWidth={1.5} />,
  'Park Assist': <ParkingCircle className="w-5 h-5" strokeWidth={1.5} />,
  'Start and Stop': <Power className="w-5 h-5" strokeWidth={1.5} />,
  'Airbag': <Shield className="w-5 h-5" strokeWidth={1.5} />,
  'ABS': <Disc className="w-5 h-5" strokeWidth={1.5} />,
  'Computer': <Laptop className="w-5 h-5" strokeWidth={1.5} />,
  'Rims': <CircleDot className="w-5 h-5" strokeWidth={1.5} />,
  'Electric mirrors': <Zap className="w-5 h-5" strokeWidth={1.5} />,
  'Electric windows': <Zap className="w-5 h-5" strokeWidth={1.5} />,
  'Bluetooth': <Bluetooth className="w-5 h-5" strokeWidth={1.5} />
};

export function CarFeatures({ features = [] }: CarFeaturesProps) {
  return (
    <div className="w-full mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-blue-600 inline-block">
        Features & Equipment
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {features.map((feature) => (
          <div 
            key={feature.id} 
            className={`flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group ${
              feature.available 
                ? 'border-l-4 border-green-500' 
                : 'border-l-4 border-gray-300 opacity-50'
            }`}
          >
            <div className="flex-shrink-0">
              {feature.available ? (
                <div className="text-green-500 transform group-hover:scale-110 transition-transform duration-200">
                  {featureIcons[feature.name] || <Check className="w-5 h-5" strokeWidth={1.5} />}
                </div>
              ) : (
                <div className="text-gray-400">
                  {featureIcons[feature.name] || <Check className="w-5 h-5" strokeWidth={1.5} />}
                </div>
              )}
            </div>
            <span className={`text-sm font-medium ${feature.available ? 'text-gray-900' : 'text-gray-500'}`}>
              {feature.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}