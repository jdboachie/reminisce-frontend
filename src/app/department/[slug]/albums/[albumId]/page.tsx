'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, UserCheck, AlertCircle, ImageIcon, Plus, Heart, MessageCircle, Calendar, Building2, Moon, User } from 'lucide-react';
import { getDepartmentInfo } from '@/utils/clientApi';

interface Department {
  _id: string;
  name: string;
  code: string;
  slug: string;
  description?: string;
}

interface Album {
  _id: string;
  albumName: string;
  workspaceName: string;
  departmentId: string;
  workspace: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AlbumImage {
  _id: string;
  albumName: string;
  pictureURL: string;
  uploadedBy: string;
  isActive: boolean;
  createdAt: Date;
}

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const departmentSlug = params?.slug as string;
  const albumId = params?.albumId as string;
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<AlbumImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Reference number verification modal
  const [showRefModal, setShowRefModal] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [refVerifying, setRefVerifying] = useState(false);
  const [refError, setRefError] = useState<string | null>(null);
  const [refVerified, setRefVerified] = useState(false);
  
  // Image upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (departmentSlug && albumId) {
      fetchAlbumData();
    }
  }, [departmentSlug, albumId]);

  const fetchAlbumData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get department info from localStorage
      const departmentInfo = getDepartmentInfo();
      if (!departmentInfo) {
        throw new Error('Department information not found. Please select a department first.');
      }
      
      setDepartment(departmentInfo);

      // Fetch album details
      const albumResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/album/${albumId}`);
      if (albumResponse.ok) {
        const albumResult = await albumResponse.json();
        if (albumResult.success && albumResult.data) {
          const albumData = albumResult.data;
          console.log('🔍 Frontend - Album data received:', albumData);
          setAlbum(albumData);
          
          // Fetch images for this album after album is loaded
          console.log('🔍 Frontend - Fetching images for album ID:', albumData._id);
          const imagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/image/getimages/${albumData._id}`);
          if (imagesResponse.ok) {
            const imagesResult = await imagesResponse.json();
            if (imagesResult.success && imagesResult.data) {
              console.log('🔍 Frontend - Images data received:', imagesResult.data);
              setImages(imagesResult.data);
            } else {
              console.log('🔍 Frontend - No images found for album');
              setImages([]);
            }
          } else {
            console.log('🔍 Frontend - Failed to fetch images:', imagesResponse.status);
            setImages([]);
          }
        } else {
          throw new Error('Album not found');
        }
      } else {
        throw new Error('Album not found');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load album data');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push(`/department/${departmentSlug}/albums`);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const refreshImages = async () => {
    if (!album?._id) return;
    
    try {
      const imagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/image/getimages/${album._id}`);
      if (imagesResponse.ok) {
        const imagesResult = await imagesResponse.json();
        if (imagesResult.success && imagesResult.data) {
          setImages(imagesResult.data);
        } else {
          setImages([]);
        }
      }
    } catch (error) {
      console.error('Error refreshing images:', error);
    }
  };

  const startUploadProcess = () => {
    setShowRefModal(true);
    setRefNumber('');
    setRefError(null);
  };

  const verifyReferenceNumber = async () => {
    if (!refNumber.trim()) {
      setRefError('Please enter your reference number');
      return;
    }

    try {
      setRefVerifying(true);
      setRefError(null);

      // Verify reference number exists in department
      const { getDepartmentStudents } = await import('@/utils/clientApi');
      const studentsResponse = await getDepartmentStudents();
      
      if (studentsResponse.ok) {
        const studentsResult = await studentsResponse.json();
        if (studentsResult.success && studentsResult.data) {
          const studentExists = studentsResult.data.some((student: any) => 
            student.referenceNumber === refNumber.trim()
          );

          if (studentExists) {
            // Reference number verified, show upload modal
            setRefVerified(true);
            setShowRefModal(false);
            setShowUploadModal(true);
          } else {
            setRefError('Reference number not found in this department. Please contact your department admin.');
          }
        } else {
          setRefError('Failed to verify reference number. Please try again.');
        }
      } else {
        setRefError('Failed to verify reference number. Please try again.');
      }
      
    } catch (error) {
      console.error('Error verifying reference number:', error);
      setRefError('Failed to verify reference number. Please try again.');
    } finally {
      setRefVerifying(false);
    }
  };

  const uploadImage = async () => {
    if (!imageUrl.trim()) {
      setUploadError('Please enter an image URL');
      return;
    }

    if (!album?.albumName) {
      setUploadError('Album information not found. Please refresh the page.');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      const requestData = {
        albumName: album.albumName,
        albumId: album._id,
        pictureURL: imageUrl.trim(),
        uploadedBy: refNumber.trim(),
        referenceNumber: refNumber.trim(),
        departmentSlug: departmentSlug
      };
      
      console.log('🔍 Frontend - Sending request data:', requestData);
      console.log('🔍 Frontend - Album data:', album);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/image/public/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Image uploaded successfully:', result);
        
        // Close modals and refresh images
        setShowUploadModal(false);
        setRefVerified(false);
        setRefNumber('');
        setImageUrl('');
        
        // Refresh images
        await refreshImages();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || 'Failed to upload image');
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-grow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 animate-watercolor-float"></div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-poppins">Loading album...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !album || !department) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-grow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 animate-watercolor-float"></div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-3xl font-poppins font-bold text-red-600 mb-4">Error Loading Album</h2>
              <p className="text-red-500 mb-6 font-poppins">{error || 'Album not found'}</p>
              <button 
                onClick={handleGoBack}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-poppins font-medium shadow-lg hover:shadow-xl"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Top Navigation Bar */}
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

      {/* Main Content */}
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-poppins"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Albums</span>
              </button>
              <div>
                <h1 className="text-3xl font-poppins font-bold text-slate-800 dark:text-white">
                  {album.albumName}
                </h1>
                <p className="text-slate-600 dark:text-slate-300 font-poppins">
                  {images.length} {images.length === 1 ? 'photo' : 'photos'} in this album
                </p>
              </div>
            </div>
            
            <button
              onClick={startUploadProcess}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-poppins font-medium shadow-lg hover:shadow-xl"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Photo</span>
            </button>
          </div>

          {/* Image Gallery */}
          {images.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="h-12 w-12 text-purple-400 dark:text-purple-500" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No photos yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-poppins mb-6">
                Be the first to add a photo to this album
              </p>
              <button
                onClick={startUploadProcess}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-poppins font-medium"
              >
                Upload First Photo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <div 
                  key={image._id} 
                  className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform transition-all duration-500 hover:scale-105 border border-slate-200 dark:border-slate-700"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.pictureURL}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => e.currentTarget.src = `https://placehold.co/400x400/e2e8f0/64748b?text=Image+${index + 1}`}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                        <button className="p-2 bg-white rounded-full text-slate-600 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-white rounded-full text-slate-600 hover:text-blue-500 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-poppins">
                        Uploaded by {image.uploadedBy}
                      </span>
                      <span className="font-poppins">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Reference Number Verification Modal */}
      {showRefModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-800 dark:text-white mb-2">
                Verify Your Reference Number
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-poppins">
                Enter your reference number to upload photos to this album
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="Enter your reference number"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-slate-800 dark:text-white"
                />
              </div>

              {refError && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>{refError}</span>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRefModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-poppins"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyReferenceNumber}
                  disabled={refVerifying}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-poppins"
                >
                  {refVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-800 dark:text-white mb-2">
                Upload Photo
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-poppins">
                Add a photo to {album.albumName}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-slate-800 dark:text-white"
                />
              </div>

              {uploadError && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setRefVerified(false);
                    setRefNumber('');
                    setImageUrl('');
                  }}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-poppins"
                >
                  Cancel
                </button>
                <button
                  onClick={uploadImage}
                  disabled={uploading}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-poppins"
                >
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
