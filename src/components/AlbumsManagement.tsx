"use client";

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAlbums } from '../hooks/useAlbums';

// A simplified Button component for reusability and consistent styling.
const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  let baseClasses = 'px-4 py-2 font-poppins rounded-full transition-colors duration-200';
  if (variant === 'primary') {
    baseClasses += ' bg-reminisce-purple-600 text-white hover:bg-reminisce-purple-700';
  } else if (variant === 'secondary') {
    baseClasses += ' bg-reminisce-gray-200 text-reminisce-gray-700 hover:bg-reminisce-gray-300';
  }
  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};

// A simplified Modal component to handle the album creation form.
const Modal = ({ isOpen, onClose, title, children, titleClassName = '' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center pb-4 border-b border-reminisce-gray-200 mb-4">
          {/* Apply the new prop here */}
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
const FormField = ({ label, value, onChange, placeholder, required = false, isTextarea = false, rows = 1 }) => (
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

// Main component for managing albums.
const AlbumsManagement: React.FC = () => {
  const { albums, isLoaded, addAlbum, deleteAlbum } = useAlbums();
  const [modalOpen, setModalOpen] = useState(false);
  const [albumForm, setAlbumForm] = useState({
    name: '',
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Updates a field in the album creation form state.
  const updateAlbumForm = (field: string, value: string) => {
    setAlbumForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handles the file input change event to get selected files.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  // Handles the creation of a new album.
  const handleAddAlbum = () => {
    if (!albumForm.name) {
      console.error('Please enter album name');
      return;
    }
    const photoCount = selectedFiles ? selectedFiles.length : 0;
    addAlbum(albumForm.name, albumForm.description, photoCount);
    setModalOpen(false);
    setAlbumForm({ name: '', description: '' });
    setSelectedFiles(null);
  };
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h3 className="text-xl font-poppins font-semibold text-reminisce-gray-700">
          Loading albums...
        </h3>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-poppins font-bold text-reminisce-black">My Albums</h2>
        <Button onClick={() => setModalOpen(true)} className="soft-shadow">
          <Plus className="h-5 w-5 mr-2" />
          Create New Album
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album) => (
          <div
            key={album.id}
            className="group relative bg-white rounded-xl overflow-hidden soft-shadow hover:soft-shadow-hover transition-all duration-300"
          >
            <img
              src={album.coverImage}
              alt={album.title}
              className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => e.currentTarget.src = `https://placehold.co/400x300/e2e8f0/64748b?text=Album`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-full flex items-center justify-between">
                <div className="font-poppins font-semibold text-lg">{album.title}</div>
                <div className="text-sm">
                  {album.photoCount} Photos
                </div>
              </div>
            </div>
            {/* Trash icon at the top right corner */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteAlbum(album.id);
              }}
              className="absolute top-2 right-2 p-1 bg-white/70 backdrop-blur-sm rounded-full text-reminisce-gray-400 hover:text-red-500 transition-colors duration-200"
              aria-label={`Delete album ${album.title}`}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Album Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Album" titleClassName="text-black">
        <div className="space-y-4">
          <FormField
            label="Album Name"
            value={albumForm.name}
            onChange={(value) => updateAlbumForm('name', value)}
            placeholder="Enter album name"
            required
          />
          <FormField
            label="Description"
            value={albumForm.description}
            onChange={(value) => updateAlbumForm('description', value)}
            placeholder="Album description"
            isTextarea
            rows={3}
          />
          {/* File Input for Photos */}
          <div>
            <label className="block text-sm font-poppins font-medium text-reminisce-gray-700 mb-1">
              Add Photos
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-reminisce-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-reminisce-purple-50 file:text-reminisce-purple-700
                hover:file:bg-reminisce-purple-100"
            />
            {selectedFiles && (
              <p className="mt-2 text-sm text-reminisce-gray-600">
                {selectedFiles.length} photo(s) selected.
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={() => setModalOpen(false)} variant="secondary">Cancel</Button>
          <Button onClick={handleAddAlbum}>Create Album</Button>
        </div>
      </Modal>
    </>
  );
};

export default AlbumsManagement;
