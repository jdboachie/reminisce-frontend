'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { Button, Modal, FormField } from './ui';
import { Album, CreateAlbumPayload } from '../types';
import { API_CONFIG, authenticatedApiCall } from '@/config/api';
import { useNotification } from '../hooks/useNotification';

interface AlbumsManagementProps {
  adminToken?: string;
  departmentInfo?: {
    name: string;
    code: string;
    slug: string;
  };
}

const AlbumsManagement: React.FC<AlbumsManagementProps> = ({ adminToken, departmentInfo }) => {
  const { showNotification } = useNotification();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshingAfterCreation, setRefreshingAfterCreation] = useState(false);
  
  const [albumForm, setAlbumForm] = useState<CreateAlbumPayload>({
    albumName: '',
    departmentId: departmentInfo?.slug || ''
  });

  // Load albums when component mounts or department changes
  useEffect(() => {
    if (adminToken && departmentInfo?.slug) {
      loadAlbums(true);
    }
  }, [adminToken, departmentInfo?.slug]);

  // Only load albums once when component mounts or department changes
  useEffect(() => {
    if (adminToken && departmentInfo?.slug) {
      loadAlbums(true);
    }
  }, [adminToken, departmentInfo?.slug]); // Remove albums.length, loading, error from dependencies

  // Update departmentId in albumForm when departmentInfo changes
  useEffect(() => {
    if (departmentInfo?.slug) {
      setAlbumForm(prev => ({ ...prev, departmentId: departmentInfo.slug }));
    }
  }, [departmentInfo]);
  
    const loadAlbums = async (showLoading = true) => {
    try {
      if (showLoading) {
      setLoading(true);
      }
      setError(null);
      
      if (!adminToken) {
        throw new Error('Admin token not available');
      }
      
      if (departmentInfo?.slug) {
        const endpoint = `${API_CONFIG.ENDPOINTS.GET_ALBUMS}/${departmentInfo.slug}`;
        console.log('Loading albums for department:', departmentInfo.slug);
        
        const response = await authenticatedApiCall(
          endpoint,
          adminToken,
          { method: 'GET' }
        );

        if (!response.ok) {
          throw new Error(`Failed to load albums: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          setAlbums(result.data);
          console.log(`Loaded ${result.data.length} albums`);
        } else {
          throw new Error('Invalid response format from server');
        }
      } else {
        setAlbums([]);
      }
    } catch (err) {
      console.error('Error loading albums:', err);
      setError(err instanceof Error ? err.message : 'Failed to load albums');
    } finally {
      if (showLoading) {
      setLoading(false);
      }
    }
  };

  const updateAlbumForm = (field: keyof CreateAlbumPayload, value: string) => {
    setAlbumForm(prev => ({ ...prev, [field]: value }));
  };

  const resetAlbumForm = () => {
    setAlbumForm({
      albumName: '',
      departmentId: departmentInfo?.slug || ''
    });
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Validate that all required fields are filled
      if (!albumForm.albumName.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Department will be automatically set from JWT token
      const albumPayload = {
        albumName: albumForm.albumName
      };
      
      console.log('Creating album:', albumPayload);
      
      const newAlbum = await authenticatedApiCall(
        API_CONFIG.ENDPOINTS.CREATE_ALBUM,
        adminToken,
        {
          method: 'POST',
          body: JSON.stringify(albumPayload),
        }
      );

      if (!newAlbum.ok) {
        const errorData = await newAlbum.json().catch(() => ({}));
        console.error('Backend error response:', errorData);
        throw new Error(`Failed to create album: ${newAlbum.statusText} - ${errorData.msg || 'Unknown error'}`);
      }

      const result = await newAlbum.json();
      console.log('Album creation result:', result);
      
      if (result.success) {
        // Show success message first
        showNotification('Album created successfully!', 'success');
        
        // Reset form and close modal
        resetAlbumForm();
      setModalOpen(false);
      
        // Add a delay before refreshing albums to ensure backend has processed the data
        setLoading(true);
        setRefreshingAfterCreation(true);
        showNotification('Refreshing albums list...', 'success');
        setTimeout(async () => {
          try {
            await loadAlbums(false); // Don't show loading spinner since we're already showing it
          } catch (error) {
            console.error('Error refreshing albums after creation:', error);
            showNotification('Failed to refresh albums list', 'error');
          } finally {
            setLoading(false);
            setRefreshingAfterCreation(false);
          }
        }, 2000); // Wait 2 seconds before refreshing
      } else {
        throw new Error(result.msg || 'Failed to create album');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create album';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteAlbum = async (albumId: string) => {
    if (!adminToken || !confirm('Are you sure you want to delete this album? This action cannot be undone.')) return;

    try {
      const response = await authenticatedApiCall(
        `${API_CONFIG.ENDPOINTS.DELETE_ALBUM}/${albumId}`,
        adminToken,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete album: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
      setAlbums(prev => prev.filter(album => album._id !== albumId));
        showNotification('Album deleted successfully!', 'success');
      } else {
        throw new Error(result.msg || 'Failed to delete album');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete album';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (!adminToken) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to manage albums.</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Albums Management
            </h2>
            <p className="text-slate-600 mt-1">
              Create and manage albums for {departmentInfo?.name || 'your department'}
            </p>
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                <strong>✓ Department Integration:</strong> Albums are now automatically filtered by your department ({departmentInfo?.name || 'Current Department'})
              </p>
              {departmentInfo && (
                <div className="mt-2 text-xs text-green-600">
                  <p>Department Code: {departmentInfo.code}</p>
                  <p>Department Slug: {departmentInfo.slug}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => loadAlbums(true)}
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              disabled={loading}
            >
              <div className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}>
                {loading ? '⟳' : '⟳'}
              </div>
              <span>Refresh</span>
            </Button>
            <Button 
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Create Album</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Albums</p>
                <p className="text-2xl font-bold text-gray-900">{albums.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <FolderOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Albums</p>
                <p className="text-2xl font-bold text-gray-900">
                  {albums.filter(a => a.isActive).length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <ImageIcon className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
      </div>
      
        {/* Error Display */}
      {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading albums</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={() => loadAlbums(true)}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
        </div>
      )}

        {/* Albums Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {refreshingAfterCreation ? 'Refreshing albums list...' : 'Loading albums...'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {refreshingAfterCreation 
                ? 'Please wait while we refresh the albums list with your new album' 
                : 'Please wait while we fetch the latest albums'
              }
            </p>
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No albums yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first album</p>
            <Button 
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Album</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {albums.map((album) => (
            <div
              key={album._id}
                className="group relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Album Cover */}
                <div className="w-full h-48 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
                  <div className="text-center">
                    <FolderOpen className="h-16 w-16 text-indigo-500 mx-auto mb-2" />
                    <div className="text-indigo-700 font-semibold text-lg">{album.albumName}</div>
              </div>
                </div>
                
                {/* Album Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                      {album.albumName}
                    </h3>
                    <div className="text-sm text-slate-600">
                      Workspace: {album.workspaceName}
                    </div>
                  </div>
                  
                  {/* Album Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-slate-600">
                      <div className="flex items-center justify-center w-6 h-6 bg-emerald-50 rounded-full mr-2">
                        <span className="text-emerald-600 text-xs">📅</span>
                      </div>
                      <span className="text-sm">
                        Created: {formatDate(album.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-50 rounded-full mr-2">
                        <ImageIcon className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-sm">
                        Status: {album.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick Action Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 py-2 px-4 rounded-xl font-medium text-sm transition-all duration-200"
                    >
                      View Album
                    </button>
                </div>
              </div>
                
                {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAlbum(album._id);
                }}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label={`Delete album ${album.albumName}`}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Album Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Album">
        <form onSubmit={handleCreateAlbum} className="space-y-6">
          <div className="text-center pb-4 border-b border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3">
              <FolderOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Create New Album</h3>
            <p className="text-gray-600 text-sm mt-1">Fill in the details to create your album</p>
          </div>
          
          <FormField
            label="Album Name"
            value={albumForm.albumName}
            onChange={(value) => updateAlbumForm('albumName', value)}
            placeholder="e.g., Graduation 2024, Sports Day, Cultural Festival"
            required
          />
          
          <FormField
            label="Department"
            value={albumForm.departmentId}
            onChange={(value) => updateAlbumForm('departmentId', value)}
            placeholder="Department slug (auto-filled)"
            required
            readOnly
          />
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This album will be created for department: <span className="font-semibold">{departmentInfo?.name || 'Current Department'}</span>
            </p>
          </div>
          
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
          <Button 
              onClick={() => setModalOpen(false)} 
            variant="secondary"
              className="px-6"
          >
            Cancel
          </Button>
          <Button 
            disabled={submitting}
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-6"
          >
            {submitting ? 'Creating...' : 'Create Album'}
          </Button>
        </div>
        </form>
      </Modal>
    </>
  );
};

export default AlbumsManagement;
