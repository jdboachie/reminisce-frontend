'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DepartmentInfo, Student, Image } from '../../../types';
import { departmentAPI, studentAPI, imageAPI } from '../../../utils';
import { cloudinaryService } from '../../../utils';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function DepartmentPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [department, setDepartment] = useState<DepartmentInfo | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Student authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showAuthForm, setShowAuthForm] = useState(true);
  
  // Image upload state
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [albumName, setAlbumName] = useState('');

  useEffect(() => {
    if (slug) {
      loadDepartmentData();
    }
  }, [slug]);

  const loadDepartmentData = async () => {
    try {
      setLoading(true);
      const [deptData, studentsData, imagesData] = await Promise.all([
        departmentAPI.getDepartmentBySlug(slug),
        studentAPI.getStudentsByWorkspace(slug),
        imageAPI.getImages(slug)
      ]);
      
      setDepartment(deptData);
      setStudents(studentsData);
      setImages(imagesData);
      setAlbumName(slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load department data');
    } finally {
      setLoading(false);
    }
  };

  const authenticateStudent = async () => {
    if (!referenceNumber.trim()) return;
    
    try {
      const student = await studentAPI.authenticateStudent(referenceNumber);
      setCurrentStudent(student);
      setIsAuthenticated(true);
      setShowAuthForm(false);
      setError(null);
    } catch (err) {
      setError('Invalid reference number. Please try again.');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const uploadImages = async () => {
    if (!selectedFiles.length || !currentStudent || !albumName) return;
    
    try {
      setUploading(true);
      
      // Upload each file to Cloudinary
      const uploadPromises = selectedFiles.map(file => cloudinaryService.uploadImage(file));
      const uploadResults = await Promise.all(uploadPromises);
      
      // Create image records in the backend
      const imagePromises = uploadResults.map(result => 
        imageAPI.uploadImage({
          albumName,
          pictureURL: result.secure_url,
          uploadedBy: currentStudent.referenceNumber
        })
      );
      
      await Promise.all(imagePromises);
      
      // Refresh images
      await loadDepartmentData();
      
      // Reset form
      setSelectedFiles([]);
      setError(null);
      alert('Images uploaded successfully!');
    } catch (err) {
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading department information...</p>
        </div>
      </div>
    );
  }

  if (error && !department) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">The department may not exist or there was an error loading the data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Department Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {department?.name}
          </h1>
          <p className="text-gray-600 mb-4">
            Department Code: {department?.code}
          </p>
          {department?.description && (
            <p className="text-gray-700">{department.description}</p>
          )}
        </div>

        {/* Student Authentication */}
        {!isAuthenticated && showAuthForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Student Authentication
            </h2>
            <p className="text-gray-600 mb-4">
              Enter your reference number to upload photos and access department features.
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter your reference number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={authenticateStudent}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Authenticate
              </button>
            </div>
            {error && (
              <p className="text-red-600 mt-2 text-sm">{error}</p>
            )}
          </div>
        )}

        {/* Authenticated Student Info */}
        {isAuthenticated && currentStudent && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Welcome, {currentStudent.name}!
            </h3>
            <p className="text-green-700">
              You are now authenticated and can upload photos to the department album.
            </p>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setCurrentStudent(null);
                setShowAuthForm(true);
              }}
              className="mt-2 text-sm text-green-600 hover:text-green-800 underline"
            >
              Sign out
            </button>
          </div>
        )}

        {/* Image Upload Section */}
        {isAuthenticated && currentStudent && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Photos
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can select multiple images. Supported formats: JPG, PNG, GIF
                </p>
              </div>
              
              {selectedFiles.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Selected {selectedFiles.length} file(s):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {file.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={uploadImages}
                disabled={uploading || selectedFiles.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Images'}
              </button>
            </div>
          </div>
        )}

        {/* Students Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Department Students ({students.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={student.image || '/default-avatar.png'}
                    alt={student.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.nickname}</p>
                    <p className="text-xs text-gray-500">{student.workspace}</p>
                  </div>
                </div>
                {student.quote && (
                  <p className="text-sm text-gray-700 mt-3 italic">"{student.quote}"</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Photos Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Department Photos ({images.length})
          </h2>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image._id} className="relative group">
                  <img
                    src={image.pictureURL}
                    alt={`Photo by ${image.uploadedBy}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 text-center">
                      <p className="text-sm">By: {image.uploadedBy}</p>
                      <p className="text-xs">{new Date(image.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No photos uploaded yet. Be the first to share memories from this department!
            </p>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
