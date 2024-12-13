import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  className?: string;
  existingImage?: string;
  onImageRemoved?: () => void;
  bucket?: string;
}

export function ImageUpload({ 
  onImageUploaded, 
  className = '',
  existingImage,
  onImageRemoved,
  bucket = 'car_images'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImage || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          },
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = async () => {
    if (!previewUrl) return;

    try {
      const fileName = previewUrl.split('/').pop();
      if (!fileName) throw new Error('Invalid image URL');

      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) throw error;

      setPreviewUrl(null);
      onImageRemoved?.();
      toast.success('Image removed successfully');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block">
        <div className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-lg
          ${previewUrl ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-white'}
          hover:border-blue-400 hover:bg-blue-50
          transition-all duration-200
        `}>
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          {!previewUrl && (
            <div className="p-8 text-center">
              <div className="mb-4">
                <ImageIcon className={`
                  mx-auto h-12 w-12
                  ${previewUrl ? 'text-blue-500' : 'text-gray-400'}
                  group-hover:text-blue-500
                  transition-colors duration-200
                `} />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Click to upload image
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      </label>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Uploading...</span>
            <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="mt-4">
          <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
              title="Remove image"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}