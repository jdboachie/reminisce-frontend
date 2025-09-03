'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Users, ArrowLeft, Building2, Moon, User, Search, Grid, List, Quote, Mail, MapPin } from 'lucide-react';
import { API_CONFIG } from '@/config/api';

interface Department {
  _id: string;
  name: string;
  code: string;
  slug: string;
  description?: string;
}

interface Student {
  _id: string;
  name: string;
  nickname?: string;
  image?: string;
  quote?: string;
  referenceNumber: string;
  workspace: string;
}

export default function DepartmentStudentsRoute() {
  const params = useParams();
  const router = useRouter();
  const departmentSlug = params?.slug as string;
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

      // Fetch students for this department only
      const studentsResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_STUDENTS_BY_WORKSPACE}/${departmentSlug}`);
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        // Filter students by workspace (department name) and add mock data for missing fields
        const departmentStudents = studentsData.filter((student: Student) => 
          student.workspace === deptData.name
        ).map((student: Student) => ({
          ...student,
          image: student.image || `https://placehold.co/200x200/e2e8f0/64748b?text=${encodeURIComponent(student.name?.charAt(0) || 'S')}`,
          nickname: student.nickname || 'Student',
          quote: student.quote || 'Learning and growing together!'
        }));
        setStudents(departmentStudents);
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You can add localStorage persistence here if needed
  };

  const filteredStudents = students.filter(student =>
    (student.name && student.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.nickname && student.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.quote && student.quote.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-grow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 animate-watercolor-float"></div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-poppins">Loading department students...</p>
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
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''} bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900`}>
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
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
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
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700"
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
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-300 hover:text-white transition-colors"
              >
                <Moon className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-300 hover:text-white transition-colors">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - EXACTLY matching ProfilesPage */}
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section - EXACT ProfilesPage styling */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-slate-800 dark:text-white mb-4">
              Meet Our Class
            </h1>
            <p className="text-lg font-poppins text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Connect with classmates and discover the amazing people in {department.name}. 
              Every student brings unique talents, dreams, and perspectives to our class.
            </p>
          </div>

          {/* Controls Section - EXACT ProfilesPage styling */}
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

          {/* Students Display - EXACT ProfilesPage styling */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStudents.map((student, index) => (
                <div 
                  key={student._id}
                  className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-500 hover:scale-105 animate-soft-scale border border-slate-200 dark:border-slate-700"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Profile Header - EXACT ProfilesPage styling */}
                  <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={student.image}
                          alt={student.name || 'Student'}
                          className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-slate-700 soft-shadow"
                          onError={(e) => e.currentTarget.src = `https://placehold.co/200x200/e2e8f0/64748b?text=${encodeURIComponent(student.name?.charAt(0) || 'S')}`}
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

                  {/* Profile Content - EXACT ProfilesPage styling */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-start space-x-2">
                        <Quote className="h-4 w-4 text-purple-400 dark:text-purple-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-poppins text-slate-600 dark:text-slate-300 italic">
                          &ldquo;{student.quote || 'No quote available'}&rdquo;
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-poppins">
                      Ref: {student.referenceNumber}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View - EXACT ProfilesPage styling */
            <div className="space-y-4">
              {filteredStudents.map((student, index) => (
                <div 
                  key={student._id}
                  className="group cursor-pointer bg-white dark:bg-slate-800 rounded-xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-300 hover:scale-102 animate-soft-scale border border-slate-200 dark:border-slate-700"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center p-6">
                    <div className="relative mr-6">
                      <img
                        src={student.image}
                        alt={student.name || 'Student'}
                        className="w-16 h-16 rounded-full object-cover border-3 border-purple-100 dark:border-purple-900/30"
                        onError={(e) => e.currentTarget.src = `https://placehold.co/200x200/e2e8f0/64748b?text=${encodeURIComponent(student.name?.charAt(0) || 'S')}`}
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
                      
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-poppins">
                        Ref: {student.referenceNumber}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State - EXACT ProfilesPage styling */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-purple-400 dark:text-purple-500" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No students found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-poppins">
                Try adjusting your search criteria or check back later for students in {department.name}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
