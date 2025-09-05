"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { Filter, Search, Plus, Heart, MessageCircle, Calendar } from 'lucide-react';
import { useAlbums } from '../hooks/useAlbums';

const categories = ['All', 'Events', 'Lifestyle', 'Academic', 'Sports', 'Social', 'Click'];

const PhotosPage: React.FC = () => {
  const { albums, isLoaded, addAlbum } = useAlbums();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [albumForm, setAlbumForm] = useState({
    name: '',
    description: ''
  });

  const filteredAlbums = albums.filter(album => {
    const matchesCategory = selectedCategory === 'All' || album.category === selectedCategory;
    const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         album.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddAlbum = () => {
    if (!albumForm.name) {
      console.error('Please enter album name');
      return;
    }
    addAlbum(albumForm.name, albumForm.description);
    setIsModalOpen(false);
    setAlbumForm({ name: '', description: '' });
  };

  // Modal component
  interface LocalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }
  const Modal: React.FC<LocalModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center pb-4 border-b border-reminisce-gray-200 mb-4">
            <h3 className="text-xl font-poppins font-semibold">{title}</h3>
            <button onClick={onClose} className="text-reminisce-gray-500 hover:text-reminisce-gray-700">
              &times;
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // Form field component
  interface FormFieldPropsLocal {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    required?: boolean;
    isTextarea?: boolean;
    rows?: number;
  }
  const FormField: React.FC<FormFieldPropsLocal> = ({ label, value, onChange, placeholder, required = false, isTextarea = false, rows = 1 }) => (
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-slate-800 dark:text-white mb-4">
              Photo Gallery
            </h1>
            <p className="text-lg font-poppins text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Relive the moments that made this year unforgettable. 
              Browse through our collection of memories and share your own.
            </p>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 font-poppins text-sm text-slate-700 dark:text-slate-300"
              >
                <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span>{selectedCategory}</span>
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg py-2 z-50 border border-slate-200 dark:border-slate-600 soft-shadow animate-soft-scale">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 text-sm font-poppins transition-all duration-300 ${
                        selectedCategory === category
                          ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Create Album Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-poppins font-medium soft-shadow hover:soft-shadow-hover"
            >
              <Plus className="h-4 w-4" />
              <span>Create Album</span>
            </button>
          </div>

          {/* Conditional Rendering based on isLoaded */}
          {!isLoaded ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-poppins font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Loading albums...
              </h3>
            </div>
          ) : filteredAlbums.length === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-purple-400 dark:text-purple-500" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No albums found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-poppins">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            // Albums Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlbums.map((album, index) => (
                <Link href={`/photos/${album.id}`} key={album.id}>
                  <div 
                    className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-500 hover:scale-105 animate-soft-scale border border-slate-200 dark:border-slate-700"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Album Cover */}
                    <div className="relative overflow-hidden">
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => e.currentTarget.src = `https://placehold.co/400x300/e2e8f0/64748b?text=New+Album`}
                      />
                      {/* Purple Label Strip */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-poppins font-medium">
                        {album.category}
                      </div>
                      {/* Photo Count Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full text-xs font-poppins font-medium">
                        {album.photoCount} photos
                      </div>
                    </div>

                    {/* Album Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-poppins font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {album.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm font-poppins mb-4 leading-relaxed">
                        {album.description}
                      </p>
                      
                      {/* Album Meta */}
                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 font-poppins">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{album.date}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{album.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{album.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Add Album Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Album">
        <div className="space-y-4">
          <FormField
            label="Album Name"
            value={albumForm.name}
            onChange={(value) => setAlbumForm(prev => ({ ...prev, name: value }))}
            placeholder="Enter album name"
            required
          />
          <FormField
            label="Description"
            value={albumForm.description}
            onChange={(value) => setAlbumForm(prev => ({ ...prev, description: value }))}
            placeholder="Album description"
            isTextarea
            rows={3}
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button 
            onClick={() => setIsModalOpen(false)} 
            className="px-4 py-2 font-poppins rounded-full transition-colors duration-200 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
          <button 
            onClick={handleAddAlbum}
            className="px-4 py-2 font-poppins rounded-full transition-colors duration-200 bg-purple-600 text-white hover:bg-purple-700"
          >
            Create Album
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PhotosPage;