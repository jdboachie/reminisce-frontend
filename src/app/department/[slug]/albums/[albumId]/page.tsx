'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, UserCheck, AlertCircle, ImageIcon, Plus, Heart, MessageCircle, Calendar, Building2, Moon, User, X } from 'lucide-react';
import { getDepartmentInfo, ensureDepartmentInfo } from '@/utils/clientApi';
import ImageViewer from '@/components/ImageViewer';
import ImageUpload from '@/components/ImageUpload';
import { uploadMultipleToCloudinary, CloudinaryUploadResult } from '@/utils/cloudinary';

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
  albumId: string;
  pictureURL: string;
  uploadedBy: string;
  referenceNumber?: string;
  departmentId: string;
  workspace: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
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
  const [uploadedImages, setUploadedImages] = useState<CloudinaryUploadResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Image viewer modal
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (departmentSlug && albumId) {
      fetchAlbumData();
    }
  }, [departmentSlug, albumId]);

  const fetchAlbumData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Ensure department info is available (fetch if missing)
      const departmentInfo = await ensureDepartmentInfo(departmentSlug);
      if (!departmentInfo) {
        throw new Error('Unable to load department information. Please go to the home page and select your department.');
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
          const imagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/image/public/getimages/${albumData._id}`);
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
      const imagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/image/public/getimages/${album._id}`);
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

  const removeImageFromPreview = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
  };

  const removeAllImages = () => {
    setUploadedImages([]);
  };

  const saveImagesToBackend = async () => {
    if (uploadedImages.length === 0) {
      setUploadError('Please upload at least one image');
      return;
    }

    if (!album?.albumName) {
      setUploadError('Album information not found. Please refresh the page.');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      console.log('🔍 Frontend - Saving', uploadedImages.length, 'images to backend');

      // Upload each image to our backend
      const uploadPromises = uploadedImages.map(async (result: CloudinaryUploadResult) => {
        const requestData = {
          albumName: album.albumName,
          albumId: album._id,
          pictureURL: result.secure_url,
          uploadedBy: refNumber.trim(),
          referenceNumber: refNumber.trim(),
          departmentSlug: departmentSlug
        };
        
        console.log('🔍 Frontend - Upload request data:', requestData);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/image/public/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.msg || 'Failed to upload image');
        }

        return response.json();
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      
      console.log('🔍 Frontend - All uploads successful');
      
      // Refresh images after successful upload
      await refreshImages();
      
      // Close modal and reset form
      setShowUploadModal(false);
      removeAllImages();
      setRefNumber('');
      setRefVerified(false);
      
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageViewer(true);
  };

  const handleImageViewerClose = () => {
    setShowImageViewer(false);
  };

  const handleImageNavigate = (index: number) => {
    setCurrentImageIndex(index);
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
    const isDepartmentError = error?.includes('department information') || error?.includes('Unable to load department');
    
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-grow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 animate-watercolor-float"></div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="mb-6">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-3xl font-poppins font-bold text-red-600 mb-4">
                  {isDepartmentError ? 'Department Access Required' : 'Error Loading Album'}
                </h2>
                <p className="text-red-500 mb-4 font-poppins">
                  {error || 'Album not found'}
                </p>
                {isDepartmentError && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 dark:text-blue-200 text-sm font-poppins">
                      <strong>Direct Link Access:</strong> You've accessed this page directly. 
                      To view this album, please go to the home page and select your department first.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={handleGoHome}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-poppins font-medium shadow-lg hover:shadow-xl"
                >
                  Go to Home Page
                </button>
                <button 
                  onClick={handleGoBack}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-poppins font-medium shadow-lg hover:shadow-xl"
                >
                  Go Back to Albums
                </button>
              </div>
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
                  onClick={() => handleImageClick(index)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.pictureURL}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => e.currentTarget.src = `https://placehold.co/400x400/e2e8f0/64748b?text=Image+${index + 1}`}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                        <button 
                          className="p-2 bg-white rounded-full text-slate-600 hover:text-red-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add like functionality here if needed
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 bg-white rounded-full text-slate-600 hover:text-blue-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add comment functionality here if needed
                          }}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Click to view overlay */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="p-2 bg-black bg-opacity-50 rounded-full text-white">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                      <span className="font-poppins flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {new Date(image.createdAt).toLocaleTimeString()}
                      </span>
                      <span className="font-poppins flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(image.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      Click to view full size
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
                  Select Images
                </label>
                <ImageUpload
                  onUpload={(results) => {
                    setUploadedImages(results);
                    setUploadError(null);
                  }}
                  onError={(error) => setUploadError(error)}
                  multiple={true}
                  maxFiles={10}
                />
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {uploadedImages.length} image(s) uploaded successfully
                      </div>
                      <button
                        onClick={removeAllImages}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      >
                        Remove All
                      </button>
                    </div>
                    
                    {/* Image Preview Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.secure_url}
                            alt={`Uploaded image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm"
                          />
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeImageFromPreview(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg"
                            title="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          
                          {/* Image Info */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {image.public_id.split('/').pop()?.split('.')[0] || `Image ${index + 1}`}
                          </div>
                          
                          {/* Image Number Badge */}
                          <div className="absolute top-1 left-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Preview Instructions */}
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Hover over images to see details. Click the X to remove individual images.
                    </div>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploading && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Saving images to album...
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setRefVerified(false);
                    setRefNumber('');
                    removeAllImages();
                    setUploadError(null);
                  }}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-poppins"
                >
                  Cancel
                </button>
                <button
                  onClick={saveImagesToBackend}
                  disabled={uploading || uploadedImages.length === 0}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-poppins"
                >
                  {uploading ? 'Saving...' : `Save ${uploadedImages.length} Photo${uploadedImages.length !== 1 ? 's' : ''} to Album`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      <ImageViewer
        images={images}
        currentIndex={currentImageIndex}
        isOpen={showImageViewer}
        onClose={handleImageViewerClose}
        onNavigate={handleImageNavigate}
      />
    </div>
  );
}
