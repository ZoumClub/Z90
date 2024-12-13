import { supabase } from '../config/supabase';

const IMAGE_BUCKET = 'car_images';
const VIDEO_BUCKET = 'car_videos';

export async function uploadCarImage(file: File) {
  try {
    // Create unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(IMAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function uploadCarVideo(file: File) {
  try {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      throw new Error('Please upload a video file');
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      throw new Error('Video size should be less than 100MB');
    }

    // Create unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from(VIDEO_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(VIDEO_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}

export async function uploadMultipleCarImages(files: File[]) {
  const uploadPromises = files.map(file => uploadCarImage(file));
  return Promise.all(uploadPromises);
}

export async function deleteCarImage(imageUrl: string) {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export async function deleteCarVideo(videoUrl: string) {
  try {
    // Extract file path from URL
    const urlParts = videoUrl.split('/');
    const filePath = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from(VIDEO_BUCKET)
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
}

export function getImagePublicUrl(filePath: string) {
  const { data: { publicUrl } } = supabase.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(filePath);
  
  return publicUrl;
}