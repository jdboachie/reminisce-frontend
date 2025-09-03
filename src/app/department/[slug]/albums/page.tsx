'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImageIcon, ArrowLeft, Building2 } from 'lucide-react';
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
}

export default function DepartmentAlbumsRoute() {
  const params = useParams();
  const router = useRouter();
  const departmentSlug = params?.slug as string;
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          // Filter albums by department
          const departmentAlbums = albumsResult.data.filter((album: Album) => 
            album.department === deptData.name
          );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Department</h2>
          <p className="text-red-500 mb-4">{error || 'Department not found'}</p>
          <button 
            onClick={handleGoHome}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoHome}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome to {department.name}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Department Code: {department.code}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">{department.slug}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => router.push(`/department/${departmentSlug}`)}
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            Home
          </button>
          <button
            onClick={() => router.push(`/department/${departmentSlug}/events`)}
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            Events
          </button>
          <button
            onClick={() => router.push(`/department/${departmentSlug}/albums`)}
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700"
          >
            Albums
          </button>
          <button
            onClick={() => router.push(`/department/${departmentSlug}/students`)}
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            Students
          </button>
          <button
            onClick={() => router.push(`/department/${departmentSlug}/reports`)}
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            Reports
          </button>
          <button
            onClick={() => router.push(`/department/${departmentSlug}/about`)}
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            About
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Photo Albums</h2>
            <p className="text-gray-600">Browse through memories captured in {department.name}</p>
          </div>
          
          {albums.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Albums Yet</h3>
              <p className="text-gray-600">Be the first to create an album in {department.name}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <div key={album._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{album.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {album.imageCount} photos
                    </span>
                  </div>
                  {album.description && (
                    <p className="text-gray-600 mb-4">{album.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Click to view</span>
                    <span className="text-blue-600 font-medium">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
