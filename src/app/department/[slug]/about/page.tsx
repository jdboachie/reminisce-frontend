'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Users, Calendar, ImageIcon } from 'lucide-react';
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

interface Event {
  _id: string;
  title: string;
  description: string;
  venue: string;
  eventDate: string;
  department: string;
  status: string;
}

interface Album {
  _id: string;
  name: string;
  description?: string;
  imageCount: number;
  department: string;
}

export default function DepartmentAboutRoute() {
  const params = useParams();
  const router = useRouter();
  const departmentSlug = params?.slug as string;
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
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

      const eventsResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_EVENTS}?department=${deptData.name}`);
      if (eventsResponse.ok) {
        const eventsResult = await eventsResponse.json();
        if (eventsResult.success && eventsResult.data && eventsResult.data.events) {
          const departmentEvents = eventsResult.data.events.filter((event: Event) => 
            event.department === deptData.name
          );
          setEvents(departmentEvents);
        }
      }

      // Fetch albums for this department only
      const albumsResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_ALBUMS}/${departmentSlug}`);
      if (albumsResponse.ok) {
        const albumsResult = await albumsResponse.json();
        if (albumsResult.success && albumsResult.data) {
          const departmentAlbums = albumsResult.data.filter((album: Album) => 
            album.department === deptData.name
          );
          setAlbums(departmentAlbums);
        }
      }

      const studentsResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_STUDENTS_BY_WORKSPACE}/${departmentSlug}`);
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        const departmentStudents = studentsData.filter((student: Student) => 
          student.workspace === deptData.name
        );
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
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700"
          >
            About
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">About {department.name}</h2>
            <p className="text-gray-600">Learn about our department, faculty, and the academic journey we shared</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Department Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-600">{department.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Code:</span>
                    <span className="ml-2 text-gray-600 font-mono">{department.code}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Slug:</span>
                    <span className="ml-2 text-gray-600 font-mono">{department.slug}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                {department.description ? (
                  <p className="text-gray-600 leading-relaxed">{department.description}</p>
                ) : (
                  <p className="text-gray-500 italic">No description available for this department.</p>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{events.length}</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{albums.length}</div>
                  <div className="text-sm text-gray-600">Albums</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
