// components/Dashboard.tsx
import React from 'react';
import { Users, Calendar, ImageIcon, Eye, UserPlus } from 'lucide-react';
import { StatCard } from './ui';
import { User, Event, Album } from '../types';

interface DashboardProps {
  users: User[];
  events: Event[];
  albums: Album[];
}

export const Dashboard: React.FC<DashboardProps> = ({ users, events, albums }) => {
  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'from-blue-400 to-blue-600' },
    { label: 'Active Events', value: events.filter(e => e.status === 'upcoming').length, icon: Calendar, color: 'from-green-400 to-green-600' },
    { label: 'Albums', value: albums.length, icon: ImageIcon, color: 'from-purple-400 to-purple-600' },
    { label: 'Total Images', value: albums.reduce((sum, album) => sum + album.imageCount, 0), icon: Eye, color: 'from-pink-400 to-pink-600' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard Overview</h2>
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
              <p className="text-sm text-slate-800">New user registered: Jane Smith</p>
              <p className="text-xs text-slate-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-800">Event created: AI Workshop</p>
              <p className="text-xs text-slate-500">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};