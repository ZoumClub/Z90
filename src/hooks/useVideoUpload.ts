import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UseVideoUploadOptions {
  maxSize?: number; // in MB
  bucket?: string;
}

export function useVideoUpload(options: UseVideoUploadOptions = {}) {
  const {
    maxSize = 100,
    bucket = 'car_videos'
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      throw new Error('Please upload a video file');
    }

    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`Video size should be less than ${maxSize}MB`);
    }
  };

  const uploadVideo = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload video';
      setError(message);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteVideo = async (videoUrl: string): Promise<void> => {
    const fileName = videoUrl.split('/').pop();
    if (!fileName) throw new Error('Invalid video URL');

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
    uploadVideo,
    deleteVideo,
    validateFile
  };
}