import { useState } from 'react';
import { ImageUpload } from '../ImageUpload';
import { VideoUpload } from '../VideoUpload';
import type { Car } from '@/lib/supabase';

interface MediaUploadProps {
  formData: Partial<Car>;
  setFormData: (data: Partial<Car>) => void;
}

export function MediaUpload({ formData, setFormData }: MediaUploadProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Images and Video</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Image
          </label>
          <ImageUpload
            onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
            className="mb-4"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Car preview"
              className="w-full h-48 object-cover rounded-md"
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