'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2 } from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import DepartmentHomepage from '../../../../components/DepartmentHomepage';

interface Department {
  _id: string;
  name: string;
  code: string;
  slug: string;
  description?: string;
}

export default function DepartmentHomeRoute() {
  const params = useParams();
  const router = useRouter();
  const departmentSlug = params?.slug as string;
  const [department, setDepartment] = useState<Department | null>(null);
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

      const deptResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_DEPARTMENT_BY_SLUG}/${departmentSlug}`);
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
    router.push(`/department/${departmentSlug}/${tab}`);
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
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700"
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
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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
        <DepartmentHomepage 
          department={department} 
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
}
