import { useState } from 'react';
import { Video, X } from 'lucide-react';
import { useVideoUpload } from '@/hooks/useVideoUpload';

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
  const [videoUrl, setVideoUrl] = useState<string | null>(existingVideo || null);
  const {
    isUploading,
    uploadProgress,
    error,
    setError,
    uploadVideo,
    deleteVideo
  } = useVideoUpload();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadVideo(file);
      setVideoUrl(url);
      onVideoUploaded(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload video';
      setError(message);
    }
  };

  const handleRemoveVideo = async () => {
    if (!videoUrl) return;

    try {
      await deleteVideo(videoUrl);
      setVideoUrl(null);
      onVideoRemoved?.();
    } catch (error) {
      console.error('Error removing video:', error);
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
              onClick={handleRemoveVideo}
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