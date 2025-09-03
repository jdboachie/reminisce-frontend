'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImageIcon, ArrowLeft, Building2, Moon, User, Filter, Search, Plus, Heart, MessageCircle, Calendar } from 'lucide-react';
import { API_CONFIG } from '@/config/api';

interface Department {
  _id: string;
  name: string;
  code: string;
  slug: string;
  description?: string;
}

interface Album {
  _id: string;
  name: string;
  description?: string;
  imageCount: number;
  department: string;
  coverImage?: string;
  category?: string;
  date?: string;
  likes?: number;
  comments?: number;
}

export default function DepartmentAlbumsRoute() {
  const params = useParams();
  const router = useRouter();
  const departmentSlug = params?.slug as string;
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ['All', 'Events', 'Lifestyle', 'Academic', 'Sports', 'Social', 'User Created'];

  useEffect(() => {
    if (departmentSlug) {
      fetchDepartmentData();
    }
  }, [departmentSlug]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch department info
      const deptResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_DEPARTMENT_BY_SLUG}/${departmentSlug}`);
      if (!deptResponse.ok) {
        throw new Error('Department not found');
      }
      const deptData = await deptResponse.json();
      setDepartment(deptData);

      // Fetch albums for this department only
      const albumsResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_ALBUMS}/${departmentSlug}`);
      if (albumsResponse.ok) {
        const albumsResult = await albumsResponse.json();
        if (albumsResult.success && albumsResult.data) {
          // Filter albums by department and add mock data for missing fields
          const departmentAlbums = albumsResult.data.filter((album: Album) => 
            album.department === deptData.name
          ).map((album: Album) => ({
            ...album,
            coverImage: album.coverImage || `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(album.name)}`,
            category: album.category || 'User Created',
            date: album.date || new Date().toLocaleDateString(),
            likes: album.likes || Math.floor(Math.random() * 50),
            comments: album.comments || Math.floor(Math.random() * 20)
          }));
          setAlbums(departmentAlbums);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load department data');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleAlbumClick = (album: Album) => {
    // Navigate to album photos page
    router.push(`/department/${departmentSlug}/albums/${album._id}`);
  };

  const filteredAlbums = albums.filter(album => {
    const matchesCategory = selectedCategory === 'All' || album.category === selectedCategory;
    const matchesSearch = album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (album.description && album.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-grow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 animate-watercolor-float"></div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-poppins">Loading department albums...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-grow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 animate-watercolor-float"></div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-3xl font-poppins font-bold text-red-600 mb-4">Error Loading Department</h2>
              <p className="text-red-500 mb-6 font-poppins">{error || 'Department not found'}</p>
              <button 
                onClick={handleGoHome}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-poppins font-medium shadow-lg hover:shadow-xl"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Top Navigation Bar - Matching HomePage Style */}
      <div className="bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-white font-bold text-xl font-poppins">REMINISCE</span>
            </div>

            {/* Main Navigation Tabs */}
            <div className="flex space-x-1 bg-slate-700 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => router.push(`/department/${departmentSlug}`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Home</span>
              </button>
              <button
                onClick={() => router.push(`/department/${departmentSlug}/albums`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span>Albums</span>
              </button>
              <button
                onClick={() => router.push(`/department/${departmentSlug}/events`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Events</span>
              </button>
              <button
                onClick={() => router.push(`/department/${departmentSlug}/students`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>Class</span>
              </button>
              {/* <button
                onClick={() => router.push(`/department/${departmentSlug}/about`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span>Department</span>
              </button> */}
              <button
                onClick={() => router.push(`/department/${departmentSlug}/reports`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>Report</span>
              </button>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-300 hover:text-white transition-colors">
                <Moon className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-300 hover:text-white transition-colors">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - EXACTLY matching PhotosPage */}
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section - EXACT PhotosPage styling */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-slate-800 dark:text-white mb-4">
              Photo Gallery
            </h1>
            <p className="text-lg font-poppins text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Relive the moments that made {department.name} unforgettable. 
              Browse through our collection of memories and share your own.
            </p>
          </div>

          {/* Controls Section - EXACT PhotosPage styling */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            {/* Search Bar - EXACT PhotosPage styling */}
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

            {/* Filter Dropdown - EXACT PhotosPage styling */}
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

            {/* Back to Home Button - EXACT PhotosPage styling */}
            <button
              onClick={handleGoHome}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-poppins font-medium soft-shadow hover:soft-shadow-hover"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Albums Content - EXACT PhotosPage styling */}
          {filteredAlbums.length === 0 ? (
            // Empty State - EXACT PhotosPage styling
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-purple-400 dark:text-purple-500" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No albums found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-poppins">
                {searchQuery || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filter criteria'
                  : `Be the first to create an album in ${department.name}`
                }
              </p>
            </div>
          ) : (
            // Albums Grid - EXACT PhotosPage styling
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlbums.map((album, index) => (
                <div 
                  key={album._id} 
                  onClick={() => handleAlbumClick(album)}
                  className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-500 hover:scale-105 animate-soft-scale border border-slate-200 dark:border-slate-700"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Album Cover - EXACT PhotosPage styling */}
                  <div className="relative overflow-hidden">
                    <img
                      src={album.coverImage}
                      alt={album.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => e.currentTarget.src = `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(album.name)}`}
                    />
                    {/* Purple Label Strip - EXACT PhotosPage styling */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-poppins font-medium">
                      {album.category}
                    </div>
                    {/* Photo Count Badge - EXACT PhotosPage styling */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full text-xs font-poppins font-medium">
                      {album.imageCount} photos
                    </div>
                  </div>

                  {/* Album Info - EXACT PhotosPage styling */}
                  <div className="p-6">
                    <h3 className="text-xl font-poppins font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {album.name}
                    </h3>
                    {album.description && (
                      <p className="text-slate-600 dark:text-slate-300 text-sm font-poppins mb-4 leading-relaxed">
                        {album.description}
                      </p>
                    )}
                    
                    {/* Album Meta - EXACT PhotosPage styling */}
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
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
