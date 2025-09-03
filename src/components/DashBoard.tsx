// components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Users, Calendar, ImageIcon, Eye, UserPlus } from 'lucide-react';
import { StatCard } from './ui';
import { DepartmentStatistics } from '../types';
import { departmentAPI } from '../utils/api';

interface DashboardProps {
  departmentSlug: string;
  adminToken: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ departmentSlug, adminToken }) => {
  
  const [statistics, setStatistics] = useState<DepartmentStatistics | null>(null);
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

        const stats = await departmentAPI.getDepartmentStatistics(departmentSlug, adminToken);
        setStatistics(stats);
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

  if (!statistics) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard Overview</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <p className="text-gray-600">No statistics available</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: statistics.statistics.totalUsers, icon: Users, color: 'from-blue-400 to-blue-600' },
    { label: 'Active Events', value: statistics.statistics.activeEvents, icon: Calendar, color: 'from-green-400 to-green-600' },
    { label: 'Albums', value: statistics.statistics.totalAlbums, icon: ImageIcon, color: 'from-purple-400 to-purple-600' },
    { label: 'Total Images', value: statistics.statistics.totalImages, icon: Eye, color: 'from-pink-400 to-pink-600' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Dashboard Overview - {statistics.department.name}
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
              <p className="text-sm text-slate-800">Department: {statistics.department.name} ({statistics.department.code})</p>
              <p className="text-xs text-slate-500">Statistics updated</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-800">Total Users: {statistics.statistics.totalUsers}</p>
              <p className="text-xs text-slate-500">Active students in department</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};