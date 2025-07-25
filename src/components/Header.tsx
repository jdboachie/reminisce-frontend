"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Image, Calendar, Users, Building, BarChart3, User, ChevronDown } from 'lucide-react';

interface NavItem {
  name: string;
  icon: any;
  path: string;
}

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Albums', icon: Image, path: '/photos' },
    { name: 'Events', icon: Calendar, path: '/events' },
    { name: 'Class', icon: Users, path: '/profiles' },
    { name: 'Department', icon: Building, path: '/department' },
    { name: 'Report', icon: BarChart3, path: '/reports' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-reminisce-purple-100 soft-shadow sticky top-0 z-50">
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
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex items-center text-reminisce-gray-600 hover:text-reminisce-purple-600 hover:bg-reminisce-purple-50 px-4 py-2 rounded-xl text-sm font-poppins font-medium transition-all duration-300 group"
                >
                  <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            {/* Profile Icon with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 bg-gradient-to-r from-reminisce-purple-500 to-reminisce-purple-600 text-white p-2 rounded-xl hover:from-reminisce-purple-600 hover:to-reminisce-purple-700 transition-all duration-300 soft-shadow hover:soft-shadow-hover"
              >
                <User className="h-5 w-5" />
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-reminisce-purple-100 soft-shadow animate-soft-scale">
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-sm text-reminisce-gray-700 hover:bg-reminisce-purple-50 hover:text-reminisce-purple-600 font-poppins font-medium transition-all duration-300"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-3 text-sm text-reminisce-gray-700 hover:bg-reminisce-purple-50 hover:text-reminisce-purple-600 font-poppins font-medium transition-all duration-300"
                  >
                    Settings
                  </Link>
                  <div className="border-t border-reminisce-gray-100 my-1"></div>
                  <Link
                    href="/logout"
                    className="block px-4 py-3 text-sm text-reminisce-gray-700 hover:bg-red-50 hover:text-red-600 font-poppins font-medium transition-all duration-300"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-reminisce-gray-600 hover:text-reminisce-purple-600 p-2 rounded-xl hover:bg-reminisce-purple-50 transition-all duration-300">
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