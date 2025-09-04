'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, User, Calendar, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { Button, Modal } from './ui';
import { Album, Image } from '../types';
import { API_CONFIG, authenticatedApiCall } from '@/config/api';
import { useNotification } from '../hooks/useNotification';

interface AdminAlbumDetailProps {
  albumId: string;
  adminToken: string;
  onBack: () => void;
}

interface ImageWithMetadata {
  _id: string;
  albumName: string;
  albumId: string;
  pictureURL: string;
  uploadedBy?: string;
  referenceNumber?: string;
  departmentId: string;
  workspace: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const AdminAlbumDetail: React.FC<AdminAlbumDetailProps> = ({ albumId, adminToken, onBack }) => {
  const { showNotification } = useNotification();
  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<ImageWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageWithMetadata | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (albumId && adminToken) {
      fetchAlbumData();
    }
  }, [albumId, adminToken]);

  const fetchAlbumData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch album details
      const albumResponse = await authenticatedApiCall(
        `${API_CONFIG.ENDPOINTS.GET_ALBUM_BY_ID}/${albumId}`,
        adminToken,
        { method: 'GET' }
      );

      if (!albumResponse.ok) {
        throw new Error('Failed to fetch album details');
      }

      const albumResult = await albumResponse.json();
      if (albumResult.success && albumResult.data) {
        setAlbum(albumResult.data);
        
        // Fetch images for this album
        await fetchImages(albumResult.data._id);
      } else {
        throw new Error('Album not found');
      }
    } catch (err) {
      console.error('Error fetching album data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch album data');
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (albumId: string) => {
    try {
      console.log('🔍 AdminAlbumDetail - Fetching images for album ID:', albumId);
      console.log('🔍 AdminAlbumDetail - Using endpoint:', `${API_CONFIG.ENDPOINTS.GET_IMAGES}/${albumId}`);
      
      const imagesResponse = await authenticatedApiCall(
        `${API_CONFIG.ENDPOINTS.GET_IMAGES}/${albumId}`,
        adminToken,
        { method: 'GET' }
      );

      console.log('🔍 AdminAlbumDetail - Images response status:', imagesResponse.status);
      console.log('🔍 AdminAlbumDetail - Images response ok:', imagesResponse.ok);

      if (imagesResponse.ok) {
        const imagesResult = await imagesResponse.json();
        console.log('🔍 AdminAlbumDetail - Images result:', imagesResult);
        
        if (imagesResult.success && imagesResult.data) {
          console.log('🔍 AdminAlbumDetail - Setting images:', imagesResult.data);
          setImages(imagesResult.data);
        } else {
          console.log('🔍 AdminAlbumDetail - No images found or invalid response');
          setImages([]);
        }
      } else {
        const errorText = await imagesResponse.text();
        console.error('🔍 AdminAlbumDetail - Error response:', errorText);
        setImages([]);
      }
    } catch (err) {
      console.error('🔍 AdminAlbumDetail - Error fetching images:', err);
      setImages([]);
    }
  };

  const handleDeleteImage = (image: ImageWithMetadata) => {
    setImageToDelete(image);
    setDeleteModalOpen(true);
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete || !adminToken) return;

    try {
      setDeleting(true);
      
      const response = await authenticatedApiCall(
        `${API_CONFIG.ENDPOINTS.DELETE_IMAGE}/${imageToDelete._id}`,
        adminToken,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      const result = await response.json();
      if (result.success) {
        showNotification('Image deleted successfully!', 'success');
        
        // Remove image from local state
        setImages(prev => prev.filter(img => img._id !== imageToDelete._id));
        
        // Close modal
        setDeleteModalOpen(false);
        setImageToDelete(null);
      } else {
        throw new Error(result.msg || 'Failed to delete image');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image';
      showNotification(errorMessage, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatRelativeTime = (date: Date | string) => {
    try {
      const now = new Date();
      const uploadDate = new Date(date);
      const diffInHours = Math.floor((now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return formatDate(date);
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading album details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Album</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={onBack} variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to Albums
          </Button>
          <Button onClick={fetchAlbumData}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Album Not Found</h3>
        <p className="text-gray-600 mb-6">The album you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={onBack} variant="secondary">
          <ArrowLeft className="h-4 w-4" />
          Back to Albums
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{album.albumName}</h1>
            <p className="text-gray-600">Album Details & Image Management</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Created</p>
          <p className="font-medium text-black">{formatDate(album.createdAt)}</p>
        </div>
      </div>

      {/* Album Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Images</p>
              <p className="text-2xl font-bold text-gray-900">{images.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ImageIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Uploaders</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(images.map(img => img.referenceNumber)).size}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <User className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Latest Upload</p>
              <p className="text-sm font-bold text-gray-900">
                {images.length > 0 ? formatRelativeTime(images[0].createdAt || '') : 'None'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No images yet</h3>
          <p className="text-gray-600">This album doesn't have any images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image._id}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={image.pictureURL}
                  alt={`Image uploaded by ${image.referenceNumber}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                  }}
                />
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteImage(image)}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label={`Delete image uploaded by ${image.referenceNumber}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Image Info */}
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium">Ref: {image.referenceNumber}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatRelativeTime(image.createdAt || '')}</span>
                  </div>
                  {image.uploadedBy && (
                    <div className="text-xs text-gray-500">
                      Uploaded by: {image.uploadedBy}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setImageToDelete(null);
        }}
        title="Delete Image"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Image</h3>
            <p className="text-gray-600">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
          </div>

          {imageToDelete && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={imageToDelete.pictureURL}
                  alt="Image to delete"
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OWEzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4=';
                  }}
                />
                <div>
                  <p className="font-medium text-gray-900">Reference: {imageToDelete.referenceNumber}</p>
                  <p className="text-sm text-gray-600">
                    Uploaded: {formatDate(imageToDelete.createdAt || '')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => {
                setDeleteModalOpen(false);
                setImageToDelete(null);
              }}
              variant="secondary"
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteImage}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete Image'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAlbumDetail;
