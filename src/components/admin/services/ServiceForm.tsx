import { useState } from 'react';
import { useRouter } from 'next/router';
import { ImageUpload } from '@/components/common/ImageUpload';
import { toast } from 'react-hot-toast';
import type { Service } from '@/lib/types/service';

const CATEGORIES = [
  'Maintenance',
  'Repair',
  'Inspection',
  'Customization',
  'Cleaning',
  'Insurance',
  'Warranty',
  'Other'
] as const;

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isSubmitting: boolean;
}

export function ServiceForm({ initialData, onSubmit, isSubmitting }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    image: initialData?.image || '',
    category: initialData?.category || 'Maintenance',
    duration: initialData?.duration || '',
    available: initialData?.available ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const price = parseFloat(formData.price.toString());
      if (isNaN(price) || price < 0) {
        throw new Error('Please enter a valid price');
      }

      if (!formData.image) {
        throw new Error('Please upload an image');
      }

      await onSubmit({
        ...formData,
        price
      });
    } catch (error) {
      console.error('Error submitting service:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save service');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price (£)
        </label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Service['category'] }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration
        </label>
        <input
          type="text"
          value={formData.duration}
          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
          placeholder="e.g., 2-3 hours"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image
        </label>
        <ImageUpload
          onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
          existingImage={formData.image}
          onImageRemoved={() => setFormData(prev => ({ ...prev, image: '' }))}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="available"
          checked={formData.available}
          onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
          Available
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Service' : 'Add Service'}
        </button>
      </div>
    </form>
  );
}