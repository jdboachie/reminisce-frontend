"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentAuth from '../components/StudentAuth';
import ProfileUpload from '../components/ProfileUpload';
import SuccessMessage from '../components/SuccessMessage';
import { Grid, List, Search, User, Mail, Phone, MapPin, Quote } from 'lucide-react';

interface Student {
  id: string;
  studentId: string;
  name: string;
  role: string;
  year: string;
  major: string;
  quote: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
}

const mockStudents: Student[] = [
  {
    id: '1',
    studentId: 'STU001',
    name: 'Sarah Johnson',
    role: 'Class President',
    year: '2024',
    major: 'Computer Science',
    quote: 'The future belongs to those who believe in the beauty of their dreams.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY'
  },
  {
    id: '2',
    studentId: 'STU002',
    name: 'Michael Chen',
    role: 'Vice President',
    year: '2024',
    major: 'Engineering',
    quote: 'Innovation distinguishes between a leader and a follower.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA'
  },
  {
    id: '3',
    studentId: 'STU003',
    name: 'Emily Rodriguez',
    role: 'Secretary',
    year: '2024',
    major: 'Business Administration',
    quote: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    location: 'Miami, FL'
  },
  {
    id: '4',
    studentId: 'STU004',
    name: 'David Kim',
    role: 'Treasurer',
    year: '2024',
    major: 'Mathematics',
    quote: 'Mathematics is the language in which God has written the universe.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'david.kim@email.com',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA'
  },
  {
    id: '5',
    studentId: 'STU005',
    name: 'Jessica Williams',
    role: 'Student Representative',
    year: '2024',
    major: 'Psychology',
    quote: 'The mind is everything. What you think you become.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    email: 'jessica.williams@email.com',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, IL'
  },
  {
    id: '6',
    studentId: 'STU006',
    name: 'Alex Thompson',
    role: 'Class Representative',
    year: '2024',
    major: 'Biology',
    quote: 'The science of today is the technology of tomorrow.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    email: 'alex.thompson@email.com',
    phone: '+1 (555) 678-9012',
    location: 'Boston, MA'
  }
];

const ProfilesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState('');
  const [students, setStudents] = useState<Student[]>(mockStudents);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStudentAuthenticated = (studentId: string) => {
    setCurrentStudentId(studentId);
    setIsAuthenticated(true);
    setIsUploadingProfile(true);
  };

  const handleProfileComplete = (profileData: any) => {
    // In a real app, this would save to backend
    const newStudent: Student = {
      id: Date.now().toString(),
      studentId: currentStudentId,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      major: profileData.major,
      year: profileData.year,
      role: profileData.role,
      quote: profileData.quote,
      avatar: profileData.avatarPreview
    };
    
    setStudents(prev => [...prev, newStudent]);
    setIsUploadingProfile(false);
    setShowSuccess(true);
  };

  const handleContinueToProfiles = () => {
    setShowSuccess(false);
    setIsAuthenticated(false);
    setCurrentStudentId('');
  };

  const handleBackToAuth = () => {
    setIsUploadingProfile(false);
    setIsAuthenticated(false);
    setCurrentStudentId('');
  };

  // Show success message if profile was just uploaded
  if (showSuccess) {
    return <SuccessMessage onContinue={handleContinueToProfiles} />;
  }

  // Show profile upload screen if uploading profile
  if (isUploadingProfile) {
    return (
      <ProfileUpload 
        studentId={currentStudentId}
        onBack={handleBackToAuth}
        onComplete={handleProfileComplete}
        onBackToProfiles={() => {
          setIsUploadingProfile(false);
          setIsAuthenticated(false);
          setCurrentStudentId('');
        }}
      />
    );
  }

  // Show authentication screen if user wants to add profile
  if (isAuthenticated) {
    return <StudentAuth onAuthenticated={handleStudentAuthenticated} onBack={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-slate-800 mb-4">
              Meet Our Class
            </h1>
                         <p className="text-lg font-poppins text-slate-600 max-w-2xl mx-auto mb-8">
               Connect with classmates and discover the amazing people in our community. 
               Every student brings unique talents, dreams, and perspectives to our class.
             </p>
             <button
               onClick={() => setIsAuthenticated(true)}
               className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-poppins font-medium hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 flex items-center space-x-2 mx-auto"
             >
               <User className="h-5 w-5" />
               <span>Add Your Profile</span>
             </button>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-white rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-slate-600 hover:text-purple-600'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-slate-600 hover:text-purple-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Students Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStudents.map((student, index) => (
                <div 
                  key={student.id}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-500 hover:scale-105 animate-soft-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedStudent(student)}
                >
                  {/* Profile Header */}
                  <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-16 h-16 rounded-full object-cover border-4 border-white soft-shadow"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-poppins font-semibold text-slate-800 group-hover:text-purple-600 transition-colors duration-300">
                          {student.name}
                        </h3>
                        <p className="text-sm font-poppins text-purple-600 font-medium">
                          {student.role}
                        </p>
                        <div className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-poppins font-medium mt-1 inline-block">
                          Class of {student.year}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-sm font-poppins text-slate-600 mb-2">
                        <span className="font-medium">Major:</span> {student.major}
                      </p>
                      <div className="flex items-start space-x-2">
                        <Quote className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-poppins text-slate-600 italic">
                          &ldquo;{student.quote}&rdquo;
                        </p>
                      </div>
                    </div>
                    

                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredStudents.map((student, index) => (
                <div 
                  key={student.id}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-300 hover:scale-102 animate-soft-scale"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center p-6">
                    <div className="relative mr-6">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-16 h-16 rounded-full object-cover border-3 border-purple-100"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-xl font-poppins font-semibold text-slate-800 group-hover:text-purple-600 transition-colors duration-300">
                          {student.name}
                        </h3>
                        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-poppins font-medium">
                          {student.role}
                        </span>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-poppins font-medium">
                          Class of {student.year}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 font-poppins mb-2">
                        <span className="font-medium">Major:</span> {student.major}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-slate-500 font-poppins">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{student.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-sm text-slate-500 font-poppins">
                        <Quote className="h-4 w-4 text-purple-400" />
                        <span className="italic">&ldquo;{student.quote}&rdquo;</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-700 mb-2">
                No students found
              </h3>
              <p className="text-slate-500 font-poppins">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilesPage; 