import { useState } from 'react';
import { ImageUpload } from '@/components/common/ImageUpload';
import { toast } from 'react-hot-toast';
import type { Accessory } from '@/lib/types/accessory';

interface AccessoryFormProps {
  initialData?: Accessory;
  onSubmit: (data: Omit<Accessory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isSubmitting: boolean;
}

const CATEGORIES = [
  'Interior',
  'Exterior', 
  'Electronics',
  'Performance',
  'Safety',
  'Comfort',
  'Maintenance',
  'Other'
] as const;

export function AccessoryForm({ initialData, onSubmit, isSubmitting }: AccessoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    image: initialData?.image || '',
    category: initialData?.category || 'Interior',
    in_stock: initialData?.in_stock ?? true
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
      console.error('Error submitting accessory:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save accessory');
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
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Accessory['category'] }))}
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
          Image
        </label>
        <ImageUpload
          onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
          existingImage={formData.image}
          onImageRemoved={() => setFormData(prev => ({ ...prev, image: '' }))}
          bucket="accessories"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="in_stock"
          checked={formData.in_stock}
          onChange={(e) => setFormData(prev => ({ ...prev, in_stock: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="in_stock" className="ml-2 block text-sm text-gray-900">
          In Stock
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Accessory' : 'Add Accessory'}
        </button>
      </div>
    </form>
  );
}