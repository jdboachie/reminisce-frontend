'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Moon, User } from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import DepartmentHomepage from '../../../components/DepartmentHomepage';

interface Department {
  _id: string;
  name: string;
  code: string;
  slug: string;
  description?: string;
}

export default function DepartmentPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchDepartmentData();
    }
  }, [slug]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const deptResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_DEPARTMENT_BY_SLUG}/${slug}`);
      if (!deptResponse.ok) {
        throw new Error('Department not found');
      }
      const deptData = await deptResponse.json();
      setDepartment(deptData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load department data');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleTabChange = (tab: string) => {
    router.push(`/department/${slug}/${tab}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-grow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 animate-watercolor-float"></div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-poppins">Loading department information...</p>
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
                onClick={() => router.push(`/department/${slug}`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Home</span>
              </button>
              <button
                onClick={() => router.push(`/department/${slug}/albums`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span>Albums</span>
              </button>
              <button
                onClick={() => router.push(`/department/${slug}/events`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Events</span>
              </button>
              <button
                onClick={() => router.push(`/department/${slug}/students`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>Class</span>
              </button>
              {/* <button
                onClick={() => router.push(`/department/${slug}/about`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span>Department</span> */}
              {/* </button> */}
              <button
                onClick={() => router.push(`/department/${slug}/reports`)}
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
      <main className="flex-grow relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 animate-watercolor-float"></div>
        
        <div className="relative z-10">
          {/* Welcome Section */}
          <section className="px-4 py-16">
            <div className="max-w-4xl mx-auto text-center animate-gentle-fade-in">
              {/* Welcome Illustration */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 border-4 border-white/50 dark:border-slate-700/50 flex items-center justify-center mb-8 mx-auto soft-shadow">
                <Building2 className="h-16 w-16 text-purple-600" />
              </div>
              
              {/* Main Title */}
              <h1 className="text-5xl font-poppins font-bold mb-4 text-slate-800 dark:text-white">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  {department.name}
                </span>
              </h1>
              
              {/* Department Code */}
              <p className="text-xl font-poppins font-light mb-6 text-slate-600 dark:text-slate-300">
                Department Code: {department.code}
              </p>
              
              {/* Description */}
              {department.description && (
                <p className="text-lg font-poppins text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {department.description}
                </p>
              )}
              
              {/* Back to Home Button */}
              <button
                onClick={handleGoHome}
                className="inline-flex items-center px-6 py-3 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 text-sm font-medium border border-slate-200 dark:border-slate-600 backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
            </div>
          </section>

          {/* Department Content */}
          <section className="px-4 pb-16">
            <div className="max-w-7xl mx-auto">
              {department && (
                <DepartmentHomepage 
                  department={department} 
                  onTabChange={handleTabChange}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}