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

const PhotosPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlbums = mockAlbums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         album.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
          <div className="flex justify-center mb-8">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
          </div>

          {/* Albums Grid */}
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

          {/* Empty State */}
          {filteredAlbums.length === 0 && (
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
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PhotosPage; 