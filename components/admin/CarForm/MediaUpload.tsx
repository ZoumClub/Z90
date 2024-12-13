import { useState } from 'react';
import { ImageUpload } from '../ImageUpload';
import { VideoUpload } from '../VideoUpload';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface MediaUploadProps {
  formData: Partial<Car>;
  setFormData: (data: Partial<Car>) => void;
}

export function MediaUpload({ formData, setFormData }: MediaUploadProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteImage = async () => {
    if (!formData.image || isDeleting) return;

    try {
      setIsDeleting(true);

      // Extract file name from URL
      const fileName = formData.image.split('/').pop();
      if (!fileName) throw new Error('Invalid image URL');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('car_images')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Update form data
      setFormData({ ...formData, image: '' });
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Images and Video</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Image
          </label>
          {formData.image ? (
            <div className="relative">
              <img
                src={formData.image}
                alt="Car preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={isDeleting}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 transition-colors"
                title="Delete image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <ImageUpload
              onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
              className="mb-4"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video (Optional)
          </label>
          <VideoUpload
            onVideoUploaded={(url) => setFormData(prev => ({ ...prev, video_url: url }))}
            existingVideo={formData.video_url}
            onVideoRemoved={() => setFormData(prev => ({ ...prev, video_url: undefined }))}
          />
        </div>
      </div>
    </div>
  );
}