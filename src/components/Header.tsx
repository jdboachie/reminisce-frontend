"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image, Calendar, Users, Building, BarChart3, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAppStateContext, useTheme } from './AppProvider';

interface NavItem {
  name: string;
  icon: any;
  path: string;
}

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setCurrentStudentId, currentStudentId } = useAppStateContext();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Albums', icon: Image, path: '/photos' },
    { name: 'Events', icon: Calendar, path: '/events' },
    { name: 'Class', icon: Users, path: '/profiles' },
    { name: 'Department', icon: Building, path: '/department' },
    { name: 'Report', icon: BarChart3, path: '/reports' },
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentStudentId('');
    setIsProfileOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-reminisce-purple-100 dark:border-slate-700 soft-shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-reminisce-purple-400 to-reminisce-purple-600 flex items-center justify-center soft-shadow group-hover:soft-shadow-hover transition-all duration-300">
                <span className="text-white font-poppins font-bold text-lg">R</span>
              </div>
              <h1 className="text-xl font-poppins font-bold bg-gradient-to-r from-reminisce-purple-600 to-reminisce-purple-800 bg-clip-text text-transparent">
                REMINISCE
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-poppins font-medium transition-all duration-300 group relative ${
                    isActive
                      ? 'text-reminisce-purple-600 dark:text-purple-400 bg-reminisce-purple-50 dark:bg-slate-800 border-2 border-reminisce-purple-200 dark:border-purple-700'
                      : 'text-reminisce-gray-600 dark:text-slate-300 hover:text-reminisce-purple-600 dark:hover:text-purple-400 hover:bg-reminisce-purple-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`h-4 w-4 mr-2 transition-all duration-300 ${
                    isActive 
                      ? 'scale-110 text-reminisce-purple-600 dark:text-purple-400' 
                      : 'group-hover:scale-110'
                  }`} />
                  {item.name}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-reminisce-purple-600 dark:bg-purple-400 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Profile Section - Only show when authenticated */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated && (
              <>
                <div className="hidden md:block text-sm font-poppins text-reminisce-gray-600 dark:text-slate-300">
                  Welcome, <span className="font-medium text-reminisce-purple-600 dark:text-purple-400">{currentStudentId}</span>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-reminisce-purple-500 to-reminisce-purple-600 text-white p-2 rounded-xl hover:from-reminisce-purple-600 hover:to-reminisce-purple-700 transition-all duration-300 soft-shadow hover:soft-shadow-hover"
                  >
                    <User className="h-5 w-5" />
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg py-2 z-50 border border-reminisce-purple-100 dark:border-slate-700 soft-shadow animate-soft-scale">
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-sm text-reminisce-gray-700 dark:text-slate-300 hover:bg-reminisce-purple-50 dark:hover:bg-slate-700 hover:text-reminisce-purple-600 dark:hover:text-purple-400 font-poppins font-medium transition-all duration-300"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-3 text-sm text-reminisce-gray-700 dark:text-slate-300 hover:bg-reminisce-purple-50 dark:hover:bg-slate-700 hover:text-reminisce-purple-600 dark:hover:text-purple-400 font-poppins font-medium transition-all duration-300"
                      >
                        Settings
                      </Link>
                      <div className="border-t border-reminisce-gray-100 dark:border-slate-600 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-reminisce-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 font-poppins font-medium transition-all duration-300"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-reminisce-gray-600 dark:text-slate-300 hover:text-reminisce-purple-600 dark:hover:text-purple-400 p-2 rounded-xl hover:bg-reminisce-purple-50 dark:hover:bg-slate-800 transition-all duration-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 