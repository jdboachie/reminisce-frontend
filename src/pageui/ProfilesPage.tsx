"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentAuth from '../components/StudentAuth';
import ProfileUpload from '../components/ProfileUpload';
import SuccessMessage from '../components/SuccessMessage';
import { User, Search, Grid, List, Quote, Mail, MapPin, AlertCircle } from 'lucide-react';
import { useAppStateContext } from '../components/AppProvider';
import { getApiEndpoint } from '../config/api';

interface Student {
  id: string;
  studentId: string;
  name: string;
  nickname: string;
  quote: string;
  avatar: string;
  image?: string; // optional fallback image field from backend
}

const ProfilesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Use global authentication state (defensive in case provider missing)
  const appState = (() => {
    try { return useAppStateContext(); } catch { return null; }
  })();
  const isAuthenticated = appState?.isAuthenticated ?? false;
  const setIsAuthenticated = appState?.setIsAuthenticated ?? (() => {});
  const currentStudentId = appState?.currentStudentId ?? '';
  const setCurrentStudentId = appState?.setCurrentStudentId ?? (() => {});

  // Fetch students from backend API (disabled temporarily to avoid auth issues)
  useEffect(() => {
             const fetchStudents = async () => {
           try {
             // Call your backend API to get all students
             const response = await fetch('https://reminisce-backend.onrender.com/student');
             const data = await response.json();

                           if (response.ok) {
                // Debug: Log the response data
                console.log('=== PROFILES DEBUG ===');
                console.log('Response data:', data);
                console.log('Data type:', typeof data);
                console.log('Is array:', Array.isArray(data));
                console.log('=== END DEBUG ===');
                
                // Handle different possible data structures
                let studentsData = [];
                if (Array.isArray(data)) {
                  studentsData = data;
                } else if (data && data.students && Array.isArray(data.students)) {
                  studentsData = data.students;
                } else if (data && data.data && Array.isArray(data.data)) {
                  studentsData = data.data;
                } else {
                  console.log('No valid students array found in response');
                  studentsData = [];
                }
                
                setStudents(studentsData);
              } else {
                setError('Failed to load student profiles');
              }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Network error. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    (student.name && student.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.nickname && student.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.quote && student.quote.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStudentAuthenticated = (studentId: string) => {
    setCurrentStudentId(studentId);
    setIsAuthenticated(true);
    setIsUploadingProfile(true);
  };

  const handleProfileComplete = (profileData: any) => {
    console.log('Profile complete callback triggered:', profileData);
    
    // Refresh the students list after profile upload
    const fetchStudents = async () => {
      try {
                 console.log('Refreshing students list...');
         const response = await fetch('https://reminisce-backend.onrender.com/student');
        const data = await response.json();
        
        console.log('Refresh response:', data);
        
        if (response.ok) {
          // Handle different possible data structures
          let studentsData = [];
          if (Array.isArray(data)) {
            studentsData = data;
          } else if (data && data.students && Array.isArray(data.students)) {
            studentsData = data.students;
          } else if (data && data.data && Array.isArray(data.data)) {
            studentsData = data.data;
          } else {
            studentsData = [];
          }
          
          setStudents(studentsData);
          console.log('Students list updated:', studentsData);
        }
      } catch (error) {
        console.error('Error refreshing students:', error);
      }
    };

    fetchStudents();
    setIsUploadingProfile(false);
    setShowSuccess(true);
  };

  const handleContinueToProfiles = () => {
    setShowSuccess(false);
    setIsAuthenticated(false);
    setCurrentStudentId('');
  };

  const handleBackToAuth = () => {
    setIsUploadingProfile(false);
    setIsAuthenticated(false);
    setCurrentStudentId('');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300 font-poppins">Loading student profiles...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-poppins mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg font-poppins hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show success message if profile was just uploaded
  if (showSuccess) {
    return <SuccessMessage onContinue={handleContinueToProfiles} />;
  }

  // Show profile upload screen if uploading profile
  if (isUploadingProfile) {
    return (
      <ProfileUpload 
        studentId={currentStudentId}
        onBack={handleBackToAuth}
        onComplete={handleProfileComplete}
        onBackToProfiles={() => {
          setIsUploadingProfile(false);
          setIsAuthenticated(false);
          setCurrentStudentId('');
        }}
      />
    );
  }

  // Show authentication screen if user wants to add profile
  if (isAuthenticated) {
    return <StudentAuth onAuthenticated={handleStudentAuthenticated} onBack={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-slate-800 dark:text-white mb-4">
              Meet Our Class
            </h1>
                         <p className="text-lg font-poppins text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
               Connect with classmates and discover the amazing people in our community. 
               Every student brings unique talents, dreams, and perspectives to our class.
             </p>
             <button
               onClick={() => setIsAuthenticated(true)}
               className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-poppins font-medium hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 flex items-center space-x-2 mx-auto"
             >
               <User className="h-5 w-5" />
               <span>Add Your Profile</span>
             </button>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-600">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Students Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStudents.map((student, index) => (
                <div 
                  key={student.id}
                  className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-500 hover:scale-105 animate-soft-scale border border-slate-200 dark:border-slate-700"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedStudent(student)}
                >
                  {/* Profile Header */}
                  <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                                                 <img
                           src={student.avatar || student.image || '/default-avatar.png'}
                           alt={student.name || 'Student'}
                           className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-slate-700 soft-shadow"
                         />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white dark:border-slate-700"></div>
                      </div>
                      <div className="flex-1">
                                                 <h3 className="text-lg font-poppins font-semibold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                           {student.name || 'Unknown Name'}
                         </h3>
                                                  <p className="text-sm font-poppins text-purple-600 dark:text-purple-400 font-medium">
                            {student.nickname || 'No Nickname'}
                          </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="p-6">
                                         <div className="mb-4">
                       <div className="flex items-start space-x-2">
                         <Quote className="h-4 w-4 text-purple-400 dark:text-purple-500 mt-0.5 flex-shrink-0" />
                                                   <p className="text-sm font-poppins text-slate-600 dark:text-slate-300 italic">
                            &ldquo;{student.quote || 'No quote available'}&rdquo;
                          </p>
                       </div>
                     </div>
                    

                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredStudents.map((student, index) => (
                <div 
                  key={student.id}
                  className="group cursor-pointer bg-white dark:bg-slate-800 rounded-xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-300 hover:scale-102 animate-soft-scale border border-slate-200 dark:border-slate-700"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center p-6">
                    <div className="relative mr-6">
                                             <img
                         src={student.avatar || student.image || '/default-avatar.png'}
                         alt={student.name || 'Student'}
                         className="w-16 h-16 rounded-full object-cover border-3 border-purple-100 dark:border-purple-900/30"
                       />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-slate-700"></div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                                                 <h3 className="text-xl font-poppins font-semibold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                           {student.name || 'Unknown Name'}
                         </h3>
                                                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-poppins font-medium">
                            {student.nickname || 'No Nickname'}
                          </span>
                      </div>
                      
                                             <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400 font-poppins">
                         <div className="flex items-center space-x-1">
                           <Quote className="h-4 w-4 text-purple-400 dark:text-purple-500" />
                                                       <span className="italic">&ldquo;{student.quote || 'No quote available'}&rdquo;</span>
                         </div>
                       </div>
                    </div>
                    
                    
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-purple-400 dark:text-purple-500" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No students found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-poppins">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilesPage; 