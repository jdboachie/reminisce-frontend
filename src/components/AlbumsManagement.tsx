// components/AlbumsManagement.tsx - Updated with click functionality
import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2 } from 'lucide-react';
import { Button, Modal, FormField } from './ui';
import { useAppState } from '../hooks/useAppState';
import { useNotification } from '../hooks/useNotification';
import { Album } from '../types';

// Add interface for props
interface AlbumsManagementProps {
  onAlbumClick?: (albumId: string) => void;
}

export const AlbumsManagement: React.FC<AlbumsManagementProps> = ({ onAlbumClick }) => {
  const { albums, setAlbums } = useAppState();
  const { showNotification } = useNotification();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [albumForm, setAlbumForm] = useState({
    name: '',
    description: ''
  });

  const generateId = () => Date.now().toString() + Math.random();

  const updateAlbumForm = (field: keyof typeof albumForm, value: string) => {
    setAlbumForm(prev => ({ ...prev, [field]: value }));
  };

  const resetAlbumForm = () => {
    setAlbumForm({
      name: '',
      description: ''
    });
  };

  const addAlbum = () => {
    const { name, description } = albumForm;
    if (!name) {
      showNotification('Please enter album name', 'error');
      return;
    }

    const album: Album = {
      id: generateId(),
      name,
      description,
      imageCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAlbums(prev => [...prev, album]);
    resetAlbumForm();
    setModalOpen(false);
    showNotification('Album created successfully!', 'success');
  };

  const deleteAlbum = (albumId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering album click
    if (window.confirm('Are you sure you want to delete this album and all its images?')) {
      setAlbums(prev => prev.filter(a => a.id !== albumId));
      showNotification('Album deleted successfully!', 'success');
    }
  };

  const handleAlbumClick = (albumId: string) => {
    if (onAlbumClick) {
      onAlbumClick(albumId);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Albums Management</h2>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Create Album</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div 
              key={album.id} 
              className="bg-white rounded-2xl soft-shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleAlbumClick(album.id)}
            >
              {album.coverImage && (
                <Image 
                  src={album.coverImage} 
                  alt={album.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">{album.name}</h3>
                  <button
                    onClick={(e) => deleteAlbum(album.id, e)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors z-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-600 mb-4">{album.description}</p>
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>{album.imageCount} images</span>
                  <span>Created {album.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Album Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Album">
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
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={() => setModalOpen(false)} variant="secondary">Cancel</Button>
          <Button onClick={addAlbum}>Create Album</Button>
        </div>
      </Modal>
    </>
  );
};

// // Wrapper component that handles navigation between album list and album view
// import { AlbumView } from './AlbumView';

// export const AlbumsManagementWithView: React.FC = () => {
//   const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

//   if (selectedAlbumId) {
//     return (
//       <AlbumView 
//         albumId={selectedAlbumId} 
//         onBack={() => setSelectedAlbumId(null)} 
//       />
//     );
//   }

//   return <AlbumsManagement onAlbumClick={setSelectedAlbumId} />;
// };