import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  className?: string;
}

export function ImageUpload({ onImageUploaded, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      files.forEach(validateFile);

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('car_images')
          .upload(filePath, file, {
            onUploadProgress: (progress) => {
              const percent = (progress.loaded / progress.total) * 100;
              setUploadProgress(Math.round(percent));
            },
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('car_images')
          .getPublicUrl(filePath);

        setPreviewImages(prev => [...prev, publicUrl]);
        onImageUploaded(publicUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const removeImage = (urlToRemove: string) => {
    setPreviewImages(prev => prev.filter(url => url !== urlToRemove));
    
    const filePath = urlToRemove.split('/').pop();
    if (filePath) {
      supabase.storage
        .from('car_images')
        .remove([filePath])
        .then(() => {
          onImageUploaded('');
        })
        .catch(console.error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block">
        <div className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-lg
          ${previewImages.length ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-white'}
          hover:border-blue-400 hover:bg-blue-50
          transition-all duration-200
        `}>
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          <div className="p-8 text-center">
            <div className="mb-4">
              <ImageIcon className={`
                mx-auto h-12 w-12
                ${previewImages.length ? 'text-blue-500' : 'text-gray-400'}
                group-hover:text-blue-500
                transition-colors duration-200
              `} />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {previewImages.length ? 'Add more images' : 'Upload images'}
              </p>
              <p className="text-xs text-gray-500">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF up to 5MB each
              </p>
            </div>
          </div>
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

      {previewImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewImages.map((url, index) => (
            <div key={url} className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => removeImage(url)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                title="Remove image"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}