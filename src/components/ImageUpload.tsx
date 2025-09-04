'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui';
import { uploadToCloudinary, uploadMultipleToCloudinary, validateImageFiles, CloudinaryUploadResult } from '../utils/cloudinary';

interface ImageUploadProps {
  onUpload: (results: CloudinaryUploadResult[]) => void;
  onError: (error: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  result?: CloudinaryUploadResult;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onError,
  multiple = true,
  maxFiles = 10,
  disabled = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Validate files
    const validation = validateImageFiles(fileArray);
    if (!validation.valid) {
      onError(validation.errors.join('\n'));
      return;
    }

    // Check file count
    if (fileArray.length > maxFiles) {
      onError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);
    
    // Initialize uploading files state
    const initialUploadingFiles: UploadingFile[] = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));
    setUploadingFiles(initialUploadingFiles);

    try {
      const results = await uploadMultipleToCloudinary(fileArray);
      
      // Update state with successful results
      const successFiles: UploadingFile[] = results.map((result, index) => ({
        file: fileArray[index],
        progress: 100,
        status: 'success' as const,
        result
      }));
      
      setUploadingFiles(successFiles);
      onUpload(results);
      
      // Clear uploading files after a delay
      setTimeout(() => {
        setUploadingFiles([]);
        setIsUploading(false);
      }, 2000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      // Update state with error
      const errorFiles: UploadingFile[] = fileArray.map(file => ({
        file,
        progress: 0,
        status: 'error' as const,
        error: errorMessage
      }));
      
      setUploadingFiles(errorFiles);
      onError(errorMessage);
      
      // Clear uploading files after a delay
      setTimeout(() => {
        setUploadingFiles([]);
        setIsUploading(false);
      }, 3000);
    }
  }, [maxFiles, onUpload, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const removeUploadingFile = useCallback((index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragOver ? 'Drop images here' : 'Upload Images'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {multiple 
                ? `Drag & drop images here, or click to select (max ${maxFiles})`
                : 'Drag & drop an image here, or click to select'
              }
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports JPEG, PNG, WebP, GIF (max 10MB each)
            </p>
          </div>
          
          {!disabled && (
                          <button
                type="button"
                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Images
              </button>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Uploading Images</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0">
                {uploadingFile.status === 'uploading' && (
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
                {uploadingFile.status === 'success' && (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                )}
                {uploadingFile.status === 'error' && (
                  <AlertCircle className="w-8 h-8 text-red-500" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadingFile.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                {uploadingFile.status === 'uploading' && (
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadingFile.progress}%` }}
                    />
                  </div>
                )}
                
                {uploadingFile.status === 'error' && uploadingFile.error && (
                  <p className="text-xs text-red-600 mt-1">{uploadingFile.error}</p>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeUploadingFile(index);
                }}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
