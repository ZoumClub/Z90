import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface UploadOptions {
  onProgress?: (progress: number) => void;
  maxSize?: number;
  bucket?: string;
}

export async function uploadImage(file: File, options: UploadOptions = {}) {
  const {
    onProgress,
    maxSize = 5 * 1024 * 1024, // 5MB
    bucket = 'accessories'
  } = options;

  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    // Validate file size
    if (file.size > maxSize) {
      throw new Error(`Image size should be less than ${maxSize / (1024 * 1024)}MB`);
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
          onProgress?.(Math.round(percent));
        },
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function deleteImage(imageUrl: string, bucket = 'accessories'): Promise<void> {
  try {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) throw new Error('Invalid image URL');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}