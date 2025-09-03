"use client"
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  ImageIcon, 
  Building, 
  FileText,
  Share2,
  Copy
} from 'lucide-react';

import { Sidebar } from '@/components/SideBar';
import { Dashboard } from '@/components/DashBoard';
import UsersManagement from '../components/UsersManagement';
import { EventsManagement } from '../components/EventsManagement';
import AlbumsManagement from '../components/AlbumsManagement';
import DepartmentManagement from '../components/DepartmentManagement';
import { Reports } from '../components/Reports';
import { Notification } from '@/components/ui';
import AdminAuth from '../components/AdminAuth';

// Hooks
import { useNotification } from '../hooks/useNotification';
import { useAppState } from '../hooks/useAppState';

// Types
import { Tab } from '../types';
import { Header } from '@/components/ui/Header';

const AdminPanel: React.FC = () => {
  const { notification, copyToClipboard } = useNotification();
  const { 
    activeTab, 
    setActiveTab, 
    users, 
    events, 
    albums, 
    departmentInfo,
    setDepartmentInfo 
  } = useAppState();

  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAdminToken(token);
      setIsAuthenticated(true);
      
      // Load department info from localStorage
      const storedDepartmentInfo = localStorage.getItem('departmentInfo');
      if (storedDepartmentInfo) {
        try {
          const deptInfo = JSON.parse(storedDepartmentInfo);
          setDepartmentInfo(deptInfo);
        } catch (err) {
          console.error('Error parsing department info:', err);
        }
      }
    }
  }, [setDepartmentInfo]);

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsAuthenticated(false);
  };

  const tabs: Tab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'albums', label: 'Albums', icon: ImageIcon },
    { id: 'department', label: 'Departments', icon: Building },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const renderContent = () => {
    if (!adminToken) return null;
    
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard departmentSlug={departmentInfo?.slug || ''} adminToken={adminToken} />;
      case 'users':
        return <UsersManagement adminToken={adminToken} departmentInfo={departmentInfo} />;
              case 'events':
          return <EventsManagement adminToken={adminToken} departmentInfo={departmentInfo} />;
      case 'albums':
        return <AlbumsManagement adminToken={adminToken} />;
      case 'department':
        return <DepartmentManagement adminToken={adminToken} departmentInfo={departmentInfo} />;
      case 'reports':
        return <Reports users={users} events={events} albums={albums} />;
      default:
        return <Dashboard departmentSlug={departmentInfo?.slug || ''} adminToken={adminToken} />;
    }
  };

  if (!isAuthenticated) {
    return <AdminAuth onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header 
        departmentInfo={departmentInfo}
        copyToClipboard={copyToClipboard}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar 
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      <Notification notification={notification} />

      <style jsx>{`
        .soft-shadow {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .soft-shadow-hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }
        .animate-soft-scale {
          animation: softScale 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        @keyframes softScale {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;