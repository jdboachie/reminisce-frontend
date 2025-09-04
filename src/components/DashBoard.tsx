// components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Users, Calendar, ImageIcon, Eye, UserPlus } from 'lucide-react';
import { StatCard } from './ui';
import { API_CONFIG, authenticatedApiCall } from '@/config/api';

interface DashboardProps {
  departmentSlug: string;
  adminToken: string;
}

interface DashboardStats {
  totalUsers: number;
  activeEvents: number;
  totalAlbums: number;
  totalImages: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ departmentSlug, adminToken }) => {
  
  const [statistics, setStatistics] = useState<DashboardStats>({
    totalUsers: 0,
    activeEvents: 0,
    totalAlbums: 0,
    totalImages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Dashboard: Starting to fetch statistics');
        console.log('🔍 Dashboard: Department slug:', departmentSlug);
        console.log('🔍 Dashboard: Admin token exists:', !!adminToken);
        
        if (!departmentSlug) {
          setError('No department selected');
          setLoading(false);
          return;
        }

        if (!adminToken) {
          setError('No admin token available');
          setLoading(false);
          return;
        }

        // Fetch data the same way other components do
        
        // Get students count (onboarded reference numbers)
        const studentsResponse = await authenticatedApiCall(
          API_CONFIG.ENDPOINTS.GET_STUDENTS_BY_WORKSPACE,
          adminToken,
          { method: 'GET' }
        );
        
        // Get events count
        const eventsResponse = await authenticatedApiCall(
          API_CONFIG.ENDPOINTS.GET_EVENTS,
          adminToken,
          { method: 'GET' }
        );
        
        // Get albums count
        const albumsResponse = await authenticatedApiCall(
          API_CONFIG.ENDPOINTS.GET_ALBUMS,
          adminToken,
          { method: 'GET' }
        );

        // Get total image count
        console.log('🔍 Dashboard: Fetching image count...');
        const imageCountResponse = await authenticatedApiCall(
          API_CONFIG.ENDPOINTS.GET_IMAGE_COUNT,
          adminToken,
          { method: 'GET' }
        );
        console.log('🔍 Dashboard: Image count response status:', imageCountResponse.status);

        // Process students count
        let totalUsers = 0;
        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          // Students API returns array directly - backend already filters by department
          totalUsers = studentsData.length;
        }

        // Process events count
        let activeEvents = 0;
        if (eventsResponse.ok) {
          const eventsResult = await eventsResponse.json();
          if (eventsResult.success && eventsResult.data && eventsResult.data.events) {
            // Filter active events (ongoing + upcoming) - backend already filters by department
            activeEvents = eventsResult.data.events.filter((event: any) => 
              ['ongoing', 'upcoming'].includes(event.status)
            ).length;
          }
        }

        // Process albums count
        let totalAlbums = 0;
        if (albumsResponse.ok) {
          const albumsResult = await albumsResponse.json();
          if (albumsResult.success && albumsResult.data) {
            totalAlbums = albumsResult.data.length;
          }
        }

        // Process image count
        let totalImages = 0;
        if (imageCountResponse.ok) {
          const imageCountResult = await imageCountResponse.json();
          console.log('🔍 Dashboard: Image count result:', imageCountResult);
          if (imageCountResult.success && imageCountResult.data) {
            totalImages = imageCountResult.data.totalImages;
            console.log('🔍 Dashboard: Total images found:', totalImages);
          }
        } else {
          console.error('🔍 Dashboard: Failed to fetch image count:', imageCountResponse.status);
        }

        const newStats = {
          totalUsers,
          activeEvents,
          totalAlbums,
          totalImages
        };

        setStatistics(newStats);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (departmentSlug && adminToken) {
      fetchStatistics();
    } else {
      setLoading(false)
    }
  }, [departmentSlug, adminToken]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-white rounded-2xl soft-shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard Overview</h2>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-600">Error loading dashboard: {error}</p>
            {!departmentSlug && (
              <p className="text-red-500 text-sm mt-2">Please select a department first</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: statistics.totalUsers, icon: Users, color: 'from-blue-400 to-blue-600' },
    { label: 'Active Events', value: statistics.activeEvents, icon: Calendar, color: 'from-green-400 to-green-600' },
    { label: 'Albums', value: statistics.totalAlbums, icon: ImageIcon, color: 'from-purple-400 to-purple-600' },
    { label: 'Total Images', value: statistics.totalImages, icon: Eye, color: 'from-pink-400 to-pink-600' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Dashboard Overview - {departmentSlug}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl soft-shadow p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-800">Department: {departmentSlug}</p>
              <p className="text-xs text-slate-500">Statistics updated</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-800">Total Users: {statistics.totalUsers}</p>
              <p className="text-xs text-slate-500">Active students in department</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};