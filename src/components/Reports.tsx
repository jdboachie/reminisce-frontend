// components/Reports.tsx
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui';
import { User, Event, Album } from '../types';

interface ReportsProps {
  users: User[];
  events: Event[];
  albums: Album[];
}

export const Reports: React.FC<ReportsProps> = ({ users, events, albums }) => {
  const handleExport = (type: string) => {
    console.log(`Exporting ${type} report...`);
    // Implementation for export functionality
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800">Reports & Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Analytics */}
        <div className="bg-white rounded-2xl soft-shadow p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">User Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Registered Users</span>
              <span className="text-lg font-semibold text-slate-800">{users.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Active Users</span>
              <span className="text-lg font-semibold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">New Users (This Month)</span>
              <span className="text-lg font-semibold text-blue-600">12</span>
            </div>
          </div>
          <Button onClick={() => handleExport('user')} variant="secondary" className="w-full mt-4">
            <Download className="h-4 w-4" />
            <span>Export User Report</span>
          </Button>
        </div>

        {/* Event Analytics */}
        <div className="bg-white rounded-2xl soft-shadow p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Event Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Events</span>
              <span className="text-lg font-semibold text-slate-800">{events.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Upcoming Events</span>
              <span className="text-lg font-semibold text-blue-600">
                {events.filter(e => e.status === 'upcoming').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Attendees</span>
              <span className="text-lg font-semibold text-purple-600">
                {events.reduce((sum, event) => sum + event.attendees, 0)}
              </span>
            </div>
          </div>
          <Button onClick={() => handleExport('event')} variant="secondary" className="w-full mt-4">
            <Download className="h-4 w-4" />
            <span>Export Event Report</span>
          </Button>
        </div>
      </div>

      {/* Media Analytics */}
      <div className="bg-white rounded-2xl soft-shadow p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Media Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{albums.length}</div>
            <div className="text-sm text-slate-600">Albums</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">
              {albums.reduce((sum, album) => sum + album.imageCount, 0)}
            </div>
            <div className="text-sm text-slate-600">Total Images</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">2.4GB</div>
            <div className="text-sm text-slate-600">Storage Used</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">1,250</div>
            <div className="text-sm text-slate-600">Total Views</div>
          </div>
        </div>
      </div>
    </div>
  );
};