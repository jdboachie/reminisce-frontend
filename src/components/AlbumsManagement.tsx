"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { albumAPI } from '../utils';
import { Album, CreateAlbumPayload } from '../types';

// A simplified Button component for reusability and consistent styling.
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  let baseClasses = 'px-4 py-2 font-poppins rounded-full transition-colors duration-200';
  if (variant === 'primary') {
    baseClasses += ' bg-reminisce-purple-600 text-white hover:bg-reminisce-purple-700';
  } else if (variant === 'secondary') {
    baseClasses += ' bg-reminisce-gray-200 text-reminisce-gray-700 hover:bg-reminisce-gray-300';
  }
  if (disabled) {
    baseClasses += ' opacity-50 cursor-not-allowed';
  }
  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

// A simplified Modal component to handle the album creation form.
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  titleClassName?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, titleClassName = '' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center pb-4 border-b border-reminisce-gray-200 mb-4">
          <h3 className={`text-xl font-poppins font-semibold ${titleClassName}`}>{title}</h3>
          <button onClick={onClose} className="text-reminisce-gray-500 hover:text-reminisce-gray-700">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// A simplified FormField component to handle form inputs.
interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  isTextarea?: boolean;
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({ label, value, onChange, placeholder, required = false, isTextarea = false, rows = 1 }) => (
  <div>
    <label className="block text-sm font-poppins font-medium text-reminisce-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isTextarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="block w-full px-3 py-2 border border-reminisce-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-reminisce-purple-500 focus:border-reminisce-purple-500 transition-colors text-reminisce-gray-700 placeholder-reminisce-gray-400"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full px-3 py-2 border border-reminisce-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-reminisce-purple-500 focus:border-reminisce-purple-500 transition-colors text-reminisce-gray-700 placeholder-reminisce-gray-400"
      />
    )}
  </div>
);

interface AlbumsManagementProps {
  adminToken: string;
}

// Main component for managing albums.
const AlbumsManagement: React.FC<AlbumsManagementProps> = ({ adminToken }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [albumForm, setAlbumForm] = useState({
    albumName: '',
    workspaceName: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (adminToken) {
      loadAlbums();
    }
  }, [adminToken]);
  
  const loadAlbums = async () => {
    try {
      setLoading(true);
      // For now, we'll load albums for the first department
      // In a real implementation, you'd get the department slug from the admin's department
      const departments = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/department`).then(res => res.json());
      
      if (departments.length > 0) {
        const departmentSlug = departments[0].slug;
        const albumsData = await albumAPI.getAlbums(departmentSlug);
        setAlbums(albumsData);
      } else {
        setAlbums([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  // Updates a field in the album creation form state.
  const updateAlbumForm = (field: string, value: string) => {
    setAlbumForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handles the creation of a new album.
  const handleAddAlbum = async () => {
    if (!albumForm.albumName || !albumForm.workspaceName) {
      setError('Album name and workspace name are required');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const payload: CreateAlbumPayload = {
        albumName: albumForm.albumName,
        workspaceName: albumForm.workspaceName
      };
      
      await albumAPI.createAlbum(payload, adminToken);
      
      // Refresh albums list
      await loadAlbums();
      
      // Reset form
      setAlbumForm({ albumName: '', workspaceName: '' });
      setModalOpen(false);
      
      alert('Album created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create album');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteAlbum = async (albumId: string) => {
    if (!adminToken || !confirm('Are you sure you want to delete this album?')) return;
    
    try {
      await albumAPI.deleteAlbum(albumId, adminToken);
      setAlbums(prev => prev.filter(album => album._id !== albumId));
      alert('Album deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete album');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Album Management</h2>
          <p className="text-gray-600">Create and manage albums for your department</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="soft-shadow">
          <Plus className="h-5 w-5 mr-2" />
          Create New Album
        </Button>
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-lg shadow">
            <p>No albums created yet.</p>
            <p className="text-sm">Create your first album to get started.</p>
          </div>
        ) : (
          albums.map((album) => (
            <div
              key={album._id}
              className="group relative bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300"
            >
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                <div className="text-gray-400 text-lg font-medium">{album.albumName}</div>
              </div>
              <div className="p-4">
                <div className="font-medium text-gray-900">{album.albumName}</div>
                <div className="text-sm text-gray-500">Workspace: {album.workspaceName}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Created: {new Date(album.createdAt).toLocaleDateString()}
                </div>
              </div>
              {/* Trash icon at the top right corner */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAlbum(album._id);
                }}
                className="absolute top-2 right-2 p-1 bg-white/70 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label={`Delete album ${album.albumName}`}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Album Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Album" titleClassName="text-black">
        <div className="space-y-4">
          <FormField
            label="Album Name"
            value={albumForm.albumName}
            onChange={(value: string) => updateAlbumForm('albumName', value)}
            placeholder="Enter album name"
            required
          />
          <FormField
            label="Workspace Name"
            value={albumForm.workspaceName}
            onChange={(value: string) => updateAlbumForm('workspaceName', value)}
            placeholder="Enter workspace name (e.g., department slug)"
            required
          />
          
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            onClick={() => {
              setModalOpen(false);
              setError(null);
              setAlbumForm({ albumName: '', workspaceName: '' });
            }} 
            variant="secondary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddAlbum}
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Album'}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AlbumsManagement;
