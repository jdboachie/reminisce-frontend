// components/Reports.tsx
import React, { useState } from 'react';
import { Download, AlertTriangle, MessageSquare, CheckCircle, Clock, XCircle, Filter, Search } from 'lucide-react';
import { Button } from './ui';
import { User, Event, Album } from '../types';

interface UserReport {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'bug' | 'feature_request' | 'content_issue' | 'user_behavior' | 'technical_issue';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  category: string;
}

interface ReportsProps {
  users: User[];
  events: Event[];
  albums: Album[];
}

export const Reports: React.FC<ReportsProps> = ({ users, events, albums }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'user_reports'>('user_reports');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user reports data
  const userReports: UserReport[] = [
    {
      id: '1',
      userId: 'user_123',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      type: 'bug',
      title: 'Unable to upload photos to album',
      description: 'When trying to upload multiple photos to the "Summer Trip" album, the upload fails after the first image.',
      status: 'in_progress',
      priority: 'high',
      createdAt: '2024-08-20T10:30:00Z',
      updatedAt: '2024-08-21T09:15:00Z',
      category: 'Media Upload'
    },
    {
      id: '2',
      userId: 'user_456',
      userName: 'Sarah Johnson',
      userEmail: 'sarah.j@example.com',
      type: 'feature_request',
      title: 'Add video support for events',
      description: 'It would be great to have the ability to upload and share videos from events, not just photos.',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-08-19T14:22:00Z',
      updatedAt: '2024-08-19T14:22:00Z',
      category: 'Feature Enhancement'
    },
    {
      id: '3',
      userId: 'user_789',
      userName: 'Mike Wilson',
      userEmail: 'mike.w@example.com',
      type: 'content_issue',
      title: 'Inappropriate content in Class of 2023 album',
      description: 'There are some inappropriate photos in the Class of 2023 graduation album that should be reviewed.',
      status: 'resolved',
      priority: 'high',
      createdAt: '2024-08-18T16:45:00Z',
      updatedAt: '2024-08-20T11:30:00Z',
      category: 'Content Moderation'
    },
    {
      id: '4',
      userId: 'user_321',
      userName: 'Emily Chen',
      userEmail: 'emily.chen@example.com',
      type: 'technical_issue',
      title: 'Page loading very slowly',
      description: 'The albums page takes more than 30 seconds to load, especially when viewing larger albums.',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-08-21T08:15:00Z',
      updatedAt: '2024-08-21T08:15:00Z',
      category: 'Performance'
    },
    {
      id: '5',
      userId: 'user_654',
      userName: 'David Brown',
      userEmail: 'david.b@example.com',
      type: 'user_behavior',
      title: 'User spamming comments on event photos',
      description: 'User @spammer123 is leaving inappropriate comments on multiple event photos.',
      status: 'dismissed',
      priority: 'low',
      createdAt: '2024-08-17T12:00:00Z',
      updatedAt: '2024-08-18T10:20:00Z',
      category: 'User Management'
    }
  ];

  const filteredReports = userReports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'dismissed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <AlertTriangle className="h-4 w-4" />;
      case 'feature_request': return <MessageSquare className="h-4 w-4" />;
      case 'content_issue': return <XCircle className="h-4 w-4" />;
      case 'technical_issue': return <AlertTriangle className="h-4 w-4" />;
      case 'user_behavior': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'dismissed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleExport = (type: string) => {
    console.log(`Exporting ${type} report...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800">Reports & Analytics</h2>
        
        {/* Tab Navigation */}
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('user_reports')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'user_reports'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            User Reports
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeTab === 'user_reports' ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl soft-shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Reports</p>
                  <p className="text-2xl font-bold text-slate-800">{userReports.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl soft-shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {userReports.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl soft-shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {userReports.filter(r => r.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl soft-shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {userReports.filter(r => r.status === 'resolved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl soft-shadow p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border-0 bg-transparent placeholder-slate-400 focus:ring-0 text-sm text-slate-800 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-slate-200 rounded-md text-sm px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-slate-200 rounded-md text-sm px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="content_issue">Content Issue</option>
                  <option value="technical_issue">Technical Issue</option>
                  <option value="user_behavior">User Behavior</option>
                </select>
                <Button onClick={() => handleExport('reports')} variant="secondary">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-2xl soft-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      {getTypeIcon(report.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">{report.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Reported by: {report.userName}</span>
                        <span>•</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Category: {report.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      {report.status.replace('_', ' ').charAt(0).toUpperCase() + report.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Last updated: {new Date(report.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                    {report.status === 'pending' && (
                      <Button size="sm">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
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

          {/* Media Analytics */}
          <div className="bg-white rounded-2xl soft-shadow p-6 lg:col-span-2">
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
      )}
    </div>
  );
};