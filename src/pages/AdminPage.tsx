"use client"
import React, { useState } from 'react';
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
import { UsersManagement } from '../components/UsersManagement';
import { EventsManagement } from '../components/EventsManagement';
import { AlbumsManagement } from '../components/AlbumsManagement';
import { DepartmentInfo } from '../components/DepartmentInfo';
import { Reports } from '../components/Reports';
import { Notification } from '@/components/ui';

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

  const tabs: Tab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'albums', label: 'Albums', icon: ImageIcon },
    { id: 'department', label: 'Department', icon: Building },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard users={users} events={events} albums={albums} />;
      case 'users':
        return <UsersManagement />;
      case 'events':
        return <EventsManagement />;
      case 'albums':
        return <AlbumsManagement />;
      case 'department':
        return (
          <DepartmentInfo 
            departmentInfo={departmentInfo} 
            setDepartmentInfo={setDepartmentInfo}
            copyToClipboard={copyToClipboard}
          />
        );
      case 'reports':
        return <Reports users={users} events={events} albums={albums} />;
      default:
        return <Dashboard users={users} events={events} albums={albums} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header 
        departmentInfo={departmentInfo}
        copyToClipboard={copyToClipboard}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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