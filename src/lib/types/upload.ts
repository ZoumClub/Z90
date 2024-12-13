export interface UploadProgress {
  loaded: number;
  total: number;
}

export interface UploadOptions {
  onProgress?: (progress: number) => void;
  maxSize?: number;
  acceptedTypes?: string[];
}

export interface UploadResult {
  url: string;
  fileName: string;
}