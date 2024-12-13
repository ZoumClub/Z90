import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

interface UploadOptions {
  onProgress?: (progress: number) => void;
}

export async function uploadImage(file: File, options?: UploadOptions): Promise<string> {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('car_images')
      .upload(fileName, file, {
        onUploadProgress: (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          options?.onProgress?.(Math.round(percent));
        },
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('car_images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function uploadVideo(file: File, options?: UploadOptions): Promise<string> {
  try {
    if (!file.type.startsWith('video/')) {
      throw new Error('Please upload a video file');
    }

    if (file.size > 100 * 1024 * 1024) {
      throw new Error('Video size should be less than 100MB');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('car_videos')
      .upload(fileName, file, {
        onUploadProgress: (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          options?.onProgress?.(Math.round(percent));
        },
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('car_videos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}

export async function deleteFile(url: string, type: 'image' | 'video'): Promise<void> {
  try {
    const fileName = url.split('/').pop();
    if (!fileName) throw new Error('Invalid file URL');

    const bucket = type === 'image' ? 'car_images' : 'car_videos';
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    throw error;
  }
}

export async function uploadMultipleImages(
  files: File[],
  options?: UploadOptions
): Promise<string[]> {
  const uploadPromises = files.map(file => 
    uploadImage(file, {
      onProgress: (progress) => {
        options?.onProgress?.(progress / files.length);
      }
    })
  );

  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}

export async function saveCarImages(
  carId: string,
  images: { url: string; display_order: number }[]
): Promise<void> {
  try {
    const { error } = await supabase.rpc('manage_car_images', {
      p_car_id: carId,
      p_images: images
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving car images:', error);
    toast.error('Failed to save car images');
    throw error;
  }
}