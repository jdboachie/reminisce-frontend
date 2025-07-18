import React, { useState } from 'react';
import { Home, Image, Calendar, Users, Building, BarChart3, User, ChevronDown } from 'lucide-react';

interface NavItem {
  name: string;
  icon: any;
  path: string;
}

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: 'Home', icon: Home, path: '/home' },
    { name: 'Gallery', icon: Image, path: '/photos' },
    { name: 'Events', icon: Calendar, path: '/events' },
    { name: 'Profiles', icon: Users, path: '/profiles' },
    { name: 'Department', icon: Building, path: '/department' },
    { name: 'Report', icon: BarChart3, path: '/reports' },
  ];

  return (
    <header className="bg-reminisce-white shadow-md border-b border-reminisce-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-inter font-bold text-reminisce-brand">REMINISCE</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.path}
                  className="flex items-center text-reminisce-black hover:text-reminisce-brand px-3 py-2 rounded-md text-sm font-inter font-medium transition-colors duration-200"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            {/* Profile Icon with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 bg-reminisce-brand text-white p-2 rounded-full hover:bg-opacity-90 transition-colors duration-200"
              >
                <User className="h-5 w-5" />
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-reminisce-light-gray">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-reminisce-black hover:bg-reminisce-purple hover:text-white font-inter font-medium"
                  >
                    My Profile
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-reminisce-black hover:bg-reminisce-purple hover:text-white font-inter font-medium"
                  >
                    Settings
                  </a>
                  <a
                    href="/logout"
                    className="block px-4 py-2 text-sm text-reminisce-black hover:bg-reminisce-purple hover:text-white font-inter font-medium"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-reminisce-black hover:text-reminisce-brand">
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