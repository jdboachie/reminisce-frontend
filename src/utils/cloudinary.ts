import { CloudinaryUploadResponse } from '../types';

export class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
  }

  async uploadImage(file: File): Promise<CloudinaryUploadResponse> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  async uploadMultipleImages(files: File[]): Promise<CloudinaryUploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  getImageUrl(publicId: string, transformation?: string): string {
    if (!this.cloudName) {
      throw new Error('Cloudinary cloud name is not configured');
    }
    
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`;
    const transform = transformation ? `/${transformation}` : '';
    return `${baseUrl}${transform}/${publicId}`;
  }

  getOptimizedImageUrl(publicId: string, width: number = 800, quality: number = 80): string {
    const transformation = `w_${width},q_${quality}`;
    return this.getImageUrl(publicId, transformation);
  }

  getThumbnailUrl(publicId: string, size: number = 200): string {
    const transformation = `w_${size},h_${size},c_fill`;
    return this.getImageUrl(publicId, transformation);
  }
}

export const cloudinaryService = new CloudinaryService();
