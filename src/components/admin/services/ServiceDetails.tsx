
interface ServiceDetailsProps {
  name: string;
  description: string;
}

export function ServiceDetails({ name, description }: ServiceDetailsProps) {
  return (
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900">
        {name}
      </div>
      <div className="text-sm text-gray-500 line-clamp-1">
        {description}
      </div>
    </div>
  );
}
