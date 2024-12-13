import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface UseImageUploadOptions {
  maxSize?: number; // in MB
  bucket?: string;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    maxSize = 5,
    bucket = 'car_images'
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`Image size should be less than ${maxSize}MB`);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    validateFile(file);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        onUploadProgress: (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          setUploadProgress(Math.round(percent));
        },
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const deleteImage = async (imageUrl: string): Promise<void> => {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) throw new Error('Invalid image URL');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
  };

  return {
    isUploading,
    uploadProgress,
    error,
    setError,
    uploadImage,
    deleteImage,
    validateFile
  };
}