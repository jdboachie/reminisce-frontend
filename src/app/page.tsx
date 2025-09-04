'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Calendar, 
  Users, 
  Building2, 
  Sparkles,
  ArrowRight,
  Heart,
  Star,
  Zap,
  Crown,
  Search,
  Building
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/config/api';
import { saveDepartmentInfo, DepartmentInfo } from '@/utils/clientApi';
import { ErrorMessages, getErrorMessage } from '@/utils/errorMessages';

// Helper function to get icon color from gradient
const getIconColor = (gradient: string) => {
  if (gradient.includes('violet')) return '#8b5cf6';
  if (gradient.includes('cyan')) return '#06b6d4';
  if (gradient.includes('emerald')) return '#10b981';
  if (gradient.includes('amber')) return '#f59e0b';
  return '#6b7280'; // fallback
};

const actionCards = [
  {
    title: 'View Albums',
    description: 'Browse through our collection of memories and moments captured throughout the year.',
    href: '/photos',
    icon: Camera,
    gradient: 'from-violet-400 via-purple-400 to-fuchsia-400',
    hoverGradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    accentColor: 'text-violet-100',
    borderColor: 'border-violet-500/60',
    glowColor: 'shadow-violet-400/20',
    badge: 'Memories',
    badgeIcon: Heart
  },
  {
    title: 'Explore Events',
    description: 'Relive the key moments and celebrations that made this year special.',
    href: '/events',
    icon: Calendar,
    gradient: 'from-cyan-400 via-blue-400 to-indigo-400',
    hoverGradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    accentColor: 'text-cyan-100',
    borderColor: 'border-cyan-500/60',
    glowColor: 'shadow-cyan-400/20',
    badge: 'Celebrations',
    badgeIcon: Sparkles
  },
  {
    title: 'Meet Our Class',
    description: 'Connect with classmates and discover the amazing people in our community.',
    href: '/profiles',
    icon: Users,
    gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
    hoverGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    accentColor: 'text-emerald-100',
    borderColor: 'border-emerald-500/60',
    glowColor: 'shadow-emerald-400/20',
    badge: 'Community',
    badgeIcon: Star
  },
  {
    title: 'About the Department',
    description: 'Learn about our department, faculty, and the academic journey we shared.',
    href: '/department',
    icon: Building2,
    gradient: 'from-amber-400 via-orange-400 to-red-400',
    hoverGradient: 'from-amber-500 via-orange-500 to-red-500',
    accentColor: 'text-amber-100',
    borderColor: 'border-amber-500/60',
    glowColor: 'shadow-amber-400/20',
    badge: 'Excellence',
    badgeIcon: Crown
  },
];

const HomePage: React.FC = () => {
  const [showDepartmentInput, setShowDepartmentInput] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [inputLoading, setInputLoading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const router = useRouter();

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departmentName.trim()) {
      setInputError('Please enter your department name');
      return;
    }

    try {
      setInputLoading(true);
      setInputError(null);
      
      // Search for department by name
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LIST_DEPARTMENTS}`);
      
      if (!response.ok) {
        throw new Error(ErrorMessages.FETCH_FAILED);
      }
      
      const departments = await response.json();
      
      // Find department by name (case-insensitive)
      const department = departments.find((dept: any) => 
        dept.name.toLowerCase() === departmentName.toLowerCase().trim()
      );
      
      if (department) {
        // Store department information for client-side requests
        const departmentInfo: DepartmentInfo = {
          _id: department._id,
          name: department.name,
          code: department.code,
          slug: department.slug,
          workspace: department._id // Use department ID as workspace
        };
        
        // Store in localStorage using the centralized function
        saveDepartmentInfo(departmentInfo);
        
        console.log('Department found and stored:', departmentInfo);
        
        // Redirect to department page
        router.push(`/department/${department.slug}`);
      } else {
        setInputError('Workspace not found. Please check the spelling or contact your administrator.');
      }
    } catch (err) {
      setInputError(getErrorMessage(err, 'fetch'));
    } finally {
      setInputLoading(false);
    }
  };

  const toggleDepartmentInput = () => {
    setShowDepartmentInput(!showDepartmentInput);
    setDepartmentName('');
    setInputError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-lavender-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section with Subtle Background */}
      <main className="flex-grow relative overflow-hidden">
        {/* Clean background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-lavender-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <div className="max-w-4xl mx-auto animate-gentle-fade-in">
            {/* Welcome Illustration */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-lavender-100 dark:from-purple-800 dark:to-lavender-800 border-4 border-white/50 dark:border-slate-700/50 flex items-center justify-center mb-8 mx-auto soft-shadow">
              <span className="text-6xl">📖</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl font-poppins font-bold mb-4 text-slate-800 dark:text-white">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-purple-600 via-lavender-600 to-indigo-600 bg-clip-text text-transparent">
                REMINISCE
              </span>
            </h1>
            
            {/* Tagline */}
            <p className="text-2xl font-poppins font-light mb-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Relive, Reflect, Remember
            </p>
            
            {/* Subtitle */}
            <p className="text-lg font-poppins text-slate-500 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Step into our digital yearbook where memories come alive. Every photo, every event, 
              every moment captured and preserved for you to cherish forever.
            </p>

            {/* Call to Action Section */}
            <div className="mb-12">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-lavender-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-poppins font-semibold text-slate-800 dark:text-white mb-2">
                    Ready to Get Started?
                  </h2>
                  
                  <p className="text-slate-600 dark:text-slate-300 mb-6 font-poppins">
                    Enter your Reminisce workspace name below to access your digital yearbook, view memories, and connect with your classmates.
                  </p>

                  {!showDepartmentInput ? (
                    <div className="relative">
                      <button
                        onClick={toggleDepartmentInput}
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-lavender-600 text-white rounded-xl hover:from-purple-700 hover:to-lavender-700 transition-all duration-300 font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <Building className="h-5 w-5 mr-3" />
                        Get Ready and Enter Reminisce Workspace
                        <ArrowRight className="h-5 w-5 ml-3" />
                      </button>
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-lavender-600 rounded-xl blur-lg opacity-20 -z-10"></div>
                    </div>
                  ) : (
                    <div className="max-w-md mx-auto">
                      <form onSubmit={handleDepartmentSubmit} className="space-y-6">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g., Computer Engineering 2024, Computer Science KNUST, Math101..."
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-700 backdrop-blur-sm text-slate-700 dark:text-slate-300 text-lg font-poppins transition-all duration-200"
                            disabled={inputLoading}
                            autoFocus
                          />
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            disabled={inputLoading || !departmentName.trim()}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-lavender-600 text-white rounded-xl hover:from-purple-700 hover:to-lavender-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                          >
                            {inputLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                Finding Workspace...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <Search className="h-5 w-5 mr-2" />
                                Continue to Workspace
                              </div>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={toggleDepartmentInput}
                            className="px-6 py-4 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 font-poppins font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                      
                      {/* Input Error Display */}
                      {inputError && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                          <div className="flex items-center">
                            <div className="w-5 h-5 text-red-500 mr-2">⚠️</div>
                            <p className="text-red-700 dark:text-red-300 text-sm font-poppins">{inputError}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Help Section */}
        <section className="relative z-10 px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="text-center">
                <h3 className="text-lg font-poppins font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Not sure what to enter?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 font-poppins mb-4">
                  Enter the name of your Reminisce workspace. Common examples include:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Computer Engineering 2024', 'Computer Science KNUST', 'Math101', 'Business Admin 2024', 'Engineering KNUST', 'Medicine 2024', 'Law KNUST', 'Arts 2024'].map((dept) => (
                    <span key={dept} className="px-3 py-1 bg-white/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 rounded-full text-sm font-poppins border border-slate-200 dark:border-slate-600">
                      {dept}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 font-poppins">
                  If you're unsure, contact your workspace administrator for the exact name.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Action Cards Section */}
        <section className="relative z-10 px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-poppins font-semibold text-center text-slate-800 dark:text-white mb-12">
              Begin Your Journey
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {actionCards.map((card, index) => {
                const Icon = card.icon;
                const BadgeIcon = card.badgeIcon;
                return (
                  <Link href={card.href} key={card.title}>
                    <div 
                      className={`group cursor-pointer rounded-2xl p-8 bg-transparent border-2 ${card.borderColor} hover:border-opacity-80 soft-shadow transform transition-all duration-500 hover:scale-105 hover:soft-shadow-hover flex flex-col items-center justify-center min-h-[320px] animate-soft-scale relative overflow-hidden`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Subtle background pattern */}
                      <div className="absolute inset-0 opacity-5 dark:opacity-10">
                        <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 dark:from-slate-300 dark:to-slate-500"></div>
                        <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 dark:from-slate-300 dark:to-slate-500"></div>
                      </div>
                      
                      {/* Badge */}
                      <div className={`absolute top-4 left-4 flex items-center space-x-1 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-poppins font-medium`}>
                        <BadgeIcon className="w-3 h-3" />
                        <span>{card.badge}</span>
                      </div>
                      
                      {/* Main Icon */}
                      <div className={`text-6xl mb-6 group-hover:scale-110 transition-all duration-300 relative z-10`}>
                        <Icon className="w-16 h-16" style={{ color: getIconColor(card.gradient) }} />
                      </div>
                      
                      {/* Content */}
                      <div className="text-center relative z-10">
                        <h3 className="text-xl font-poppins font-semibold mb-3 text-center text-slate-800 dark:text-white">
                          {card.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 text-center leading-relaxed mb-4">
                          {card.description}
                        </p>
                        
                        {/* Arrow indicator */}
                        <div className="flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                          <span className="text-xs font-poppins font-medium">Explore</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                      
                      {/* Hover glow effect */}
                      <div className={`absolute inset-0 rounded-2xl ${card.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage; 