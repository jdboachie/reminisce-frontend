"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { Filter, Search, Plus, Heart, MessageCircle, Calendar } from 'lucide-react';

interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  photoCount: number;
  date: string;
  category: string;
  likes: number;
  comments: number;
}

const mockAlbums: Album[] = [
  {
    id: '1',
    title: 'Graduation Day',
    description: 'Celebrating our achievements and new beginnings',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop',
    photoCount: 156,
    date: 'May 2024',
    category: 'Events',
    likes: 89,
    comments: 23
  },
  {
    id: '2',
    title: 'Campus Life',
    description: 'Everyday moments that made our journey special',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
    photoCount: 203,
    date: 'Throughout 2024',
    category: 'Lifestyle',
    likes: 124,
    comments: 45
  },
  {
    id: '3',
    title: 'Study Sessions',
    description: 'Late nights and coffee-fueled learning',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
    photoCount: 78,
    date: 'Spring 2024',
    category: 'Academic',
    likes: 67,
    comments: 12
  },
  {
    id: '4',
    title: 'Sports & Activities',
    description: 'Team spirit and athletic achievements',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    photoCount: 134,
    date: 'Fall 2024',
    category: 'Sports',
    likes: 156,
    comments: 34
  },
  {
    id: '5',
    title: 'Friends & Laughter',
    description: 'The people who made every day brighter',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    photoCount: 189,
    date: 'All Year',
    category: 'Social',
    likes: 203,
    comments: 67
  },
  {
    id: '6',
    title: 'Department Events',
    description: 'Academic celebrations and department milestones',
    coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
    photoCount: 92,
    date: '2024',
    category: 'Academic',
    likes: 78,
    comments: 19
  }
];

const categories = ['All', 'Events', 'Lifestyle', 'Academic', 'Sports', 'Social'];

const PhotosPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAlbums = mockAlbums.filter(album => {
    const matchesCategory = selectedCategory === 'All' || album.category === selectedCategory;
    const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         album.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-reminisce-gray-50">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-reminisce-black mb-4">
              Our Photo Albums
            </h1>
            <p className="text-lg font-poppins text-reminisce-gray-600 max-w-2xl mx-auto">
              Browse through our collection of memories and moments captured throughout the year. 
              Every photo tells a story, every album holds a chapter of our journey.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-reminisce-gray-400" />
              <input
                type="text"
                placeholder="Search albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-reminisce-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-reminisce-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-3 bg-white border border-reminisce-gray-200 rounded-xl hover:border-reminisce-purple-300 transition-all duration-300 font-poppins text-sm"
              >
                <Filter className="h-4 w-4 text-reminisce-gray-600" />
                <span className="text-reminisce-gray-700">{selectedCategory}</span>
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-reminisce-gray-100 soft-shadow animate-soft-scale">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 text-sm font-poppins transition-all duration-300 ${
                        selectedCategory === category
                          ? 'text-reminisce-purple-600 bg-reminisce-purple-50'
                          : 'text-reminisce-gray-700 hover:bg-reminisce-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-reminisce-purple-500 to-reminisce-purple-600 text-white rounded-xl hover:from-reminisce-purple-600 hover:to-reminisce-purple-700 transition-all duration-300 font-poppins font-medium soft-shadow hover:soft-shadow-hover">
              <Plus className="h-4 w-4" />
              <span>Create Album</span>
            </button>
          </div>

          {/* Albums Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlbums.map((album, index) => (
              <Link href={`/photos/${album.id}`} key={album.id}>
                <div 
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-500 hover:scale-105 animate-soft-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Album Cover */}
                  <div className="relative overflow-hidden">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Purple Label Strip */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-reminisce-purple-500 to-reminisce-purple-600 text-white px-3 py-1 rounded-full text-xs font-poppins font-medium">
                      {album.category}
                    </div>
                    {/* Photo Count Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-reminisce-gray-700 px-2 py-1 rounded-full text-xs font-poppins font-medium">
                      {album.photoCount} photos
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-poppins font-semibold text-reminisce-black mb-2 group-hover:text-reminisce-purple-600 transition-colors duration-300">
                      {album.title}
                    </h3>
                    <p className="text-reminisce-gray-600 text-sm font-poppins mb-4 leading-relaxed">
                      {album.description}
                    </p>
                    
                    {/* Album Meta */}
                    <div className="flex items-center justify-between text-sm text-reminisce-gray-500 font-poppins">
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

          {/* Empty State */}
          {filteredAlbums.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-reminisce-purple-100 flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-reminisce-purple-400" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-reminisce-gray-700 mb-2">
                No albums found
              </h3>
              <p className="text-reminisce-gray-500 font-poppins">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PhotosPage; 