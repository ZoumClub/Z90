import { useState } from 'react';
import { Upload, X, Video } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface VideoUploadProps {
  onVideoUploaded: (url: string) => void;
  className?: string;
  existingVideo?: string;
  onVideoRemoved?: () => void;
}

export function VideoUpload({ 
  onVideoUploaded, 
  className = '',
  existingVideo,
  onVideoRemoved
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(existingVideo || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!file.type.startsWith('video/')) {
        throw new Error('Please upload a video file');
      }

      if (file.size > 100 * 1024 * 1024) {
        throw new Error('Video size should be less than 100MB');
      }

      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('car_videos')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          },
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('car_videos')
        .getPublicUrl(filePath);

      setVideoUrl(publicUrl);
      onVideoUploaded(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video');
      console.error('Upload error:', err);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const removeVideo = () => {
    if (videoUrl) {
      const filePath = videoUrl.split('/').pop();
      if (filePath) {
        supabase.storage
          .from('car_videos')
          .remove([filePath])
          .then(() => {
            setVideoUrl(null);
            onVideoRemoved?.();
          })
          .catch(console.error);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block">
        <div className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-lg
          ${videoUrl ? 'border-purple-300 bg-purple-50' : 'border-gray-300 bg-white'}
          hover:border-purple-400 hover:bg-purple-50
          transition-all duration-200
        `}>
          <input
            type="file"
            className="sr-only"
            accept="video/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          <div className="p-8 text-center">
            <div className="mb-4">
              <Video className={`
                mx-auto h-12 w-12
                ${videoUrl ? 'text-purple-500' : 'text-gray-400'}
                group-hover:text-purple-500
                transition-colors duration-200
              `} />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {videoUrl ? 'Replace video' : 'Upload video'}
              </p>
              <p className="text-xs text-gray-500">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400">
                MP4, WebM up to 100MB
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
            <span className="text-sm font-medium text-purple-600">Uploading...</span>
            <span className="text-sm font-medium text-purple-600">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="mt-4">
          <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
            <video
              src={videoUrl}
              controls
              className="w-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
            <button
              onClick={removeVideo}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
              title="Remove video"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}