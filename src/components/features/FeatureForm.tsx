import { useState } from 'react';
import { Plus } from 'lucide-react';

interface FeatureFormProps {
  onSubmit: (name: string) => Promise<void>;
  isSubmitting: boolean;
  editingFeature?: { id: string; name: string } | null;
}

export function FeatureForm({ onSubmit, isSubmitting, editingFeature }: FeatureFormProps) {
  const [name, setName] = useState(editingFeature?.name || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(name);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter feature name"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting || !name.trim()}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        <Plus className="h-5 w-5" />
        {editingFeature ? 'Update Feature' : 'Add Feature'}
      </button>
    </form>
  );
}