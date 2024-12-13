import { Edit2, Trash2 } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  created_at: string;
}

interface FeatureListProps {
  features: Feature[];
  onEdit: (feature: Feature) => void;
  onDelete: (id: string) => void;
}

export function FeatureList({ features, onEdit, onDelete }: FeatureListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Feature Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {features.map((feature) => (
            <tr key={feature.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {feature.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(feature.created_at).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onEdit(feature)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit feature"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(feature.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete feature"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {features.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                No features found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}