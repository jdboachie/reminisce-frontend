'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, ArrowLeft, Moon, Plus, Search, Filter, Mail, Phone, Quote, UserCheck, AlertCircle } from 'lucide-react';
import { getDepartmentStudents, getDepartmentInfo, updateStudentProfile } from '@/utils/clientApi';

interface Department {
  _id: string;
  name: string;
  code: string;
  slug: string;
  description?: string;
}

interface Student {
  _id: string;
  name: string;
  nickname: string;
  image: string;
  referenceNumber: string;
  phoneNumber: string;
  quote: string;
  workspace: string;
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface StudentFormData {
  name: string;
  nickname: string;
  image: string;
  phoneNumber: string;
  quote: string;
}

export default function DepartmentStudentsRoute() {
  const params = useParams();
  const router = useRouter();
  const departmentSlug = params?.slug as string;
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reference number verification modal
  const [showRefModal, setShowRefModal] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [refVerifying, setRefVerifying] = useState(false);
  const [refError, setRefError] = useState<string | null>(null);
  
  // Student form modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    nickname: '',
    image: '',
    phoneNumber: '',
    quote: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (departmentSlug) {
      fetchDepartmentData();
    }
  }, [departmentSlug]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get department info from localStorage (set by landing page)
      const departmentInfo = getDepartmentInfo();
      if (!departmentInfo) {
        throw new Error('Department information not found. Please select a department first.');
      }
      
      setDepartment(departmentInfo);

      // Fetch students using the department workspace
      const studentsResponse = await getDepartmentStudents();
      if (studentsResponse.ok) {
        const studentsResult = await studentsResponse.json();
        if (studentsResult.success && studentsResult.data) {
          // Only show students with complete profiles (all required fields filled)
          const completeStudents = studentsResult.data.filter((student: Student) => 
            student.name && 
            student.nickname && 
            student.image && 
            student.phoneNumber && 
            student.quote
          );
          setStudents(completeStudents);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load department data');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleAddStudent = () => {
    setShowRefModal(true);
    setRefNumber('');
    setRefError(null);
  };

  const verifyReferenceNumber = async () => {
    if (!refNumber.trim()) {
      setRefError('Please enter your reference number');
      return;
    }

    try {
      setRefVerifying(true);
      setRefError(null);

      // Check if reference number exists in department students
      const studentsResponse = await getDepartmentStudents();
      if (studentsResponse.ok) {
        const studentsResult = await studentsResponse.json();
        if (studentsResult.success && studentsResult.data) {
          const existingStudent = studentsResult.data.find((student: Student) => 
            student.referenceNumber === refNumber.trim()
          );

          if (existingStudent) {
            // Reference number found, show form
            setFormData({
              name: existingStudent.name || '',
              nickname: existingStudent.nickname || '',
              image: existingStudent.image || '',
              phoneNumber: existingStudent.phoneNumber || '',
              quote: existingStudent.quote || ''
            });
            setShowRefModal(false);
            setShowFormModal(true);
          } else {
            setRefError('Reference number not found in this department. Please contact your department admin.');
          }
        }
      }
    } catch (err) {
      setRefError('Failed to verify reference number. Please try again.');
    } finally {
      setRefVerifying(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!formData.name.trim() || !formData.nickname.trim() || !formData.image.trim() || 
        !formData.phoneNumber.trim() || !formData.quote.trim()) {
      setFormError('All fields are required');
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);

      // Update student profile using client API
      const response = await updateStudentProfile({
        referenceNumber: refNumber,
        ...formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Refresh students list
          await fetchDepartmentData();
          setShowFormModal(false);
          setFormData({
            name: '',
            nickname: '',
            image: '',
            phoneNumber: '',
            quote: ''
          });
        } else {
          setFormError(result.msg || 'Failed to update profile');
        }
      } else {
        setFormError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      setFormError('Failed to update profile. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.quote.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-grow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 animate-watercolor-float"></div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-poppins">Loading class members...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-grow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 animate-watercolor-float"></div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-3xl font-poppins font-bold text-red-600 mb-4">Error Loading Department</h2>
              <p className="text-red-500 mb-6 font-poppins">{error || 'Department not found'}</p>
              <button 
                onClick={handleGoHome}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-poppins font-medium shadow-lg hover:shadow-xl"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Top Navigation Bar */}
      <div className="bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-white font-bold text-xl font-poppins">REMINISCE</span>
            </div>

            {/* Main Navigation Tabs */}
            <div className="flex space-x-1 bg-slate-700 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => router.push(`/department/${departmentSlug}`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Home</span>
              </button>
              <button
                onClick={() => router.push(`/department/${departmentSlug}/albums`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span>Albums</span>
              </button>
              <button
                onClick={() => router.push(`/department/${departmentSlug}/events`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Events</span>
              </button>
              <button
                onClick={() => router.push(`/department/${departmentSlug}/students`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>Class</span>
              </button>
              <button
                onClick={() => router.push(`/department/${departmentSlug}/reports`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>Report</span>
              </button>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-300 hover:text-white transition-colors">
                <Moon className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-300 hover:text-white transition-colors">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-slate-800 dark:text-white mb-4">
              Class Members
            </h1>
            <p className="text-lg font-poppins text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Connect with your classmates in {department.name}. 
              If you're a member of this class, we'd love for you to update your class info.
            </p>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search classmates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>

            {/* Add Student Button */}
            <button
              onClick={handleAddStudent}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-poppins font-medium shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your Info</span>
            </button>

            {/* Back to Home Button */}
            <button
              onClick={handleGoHome}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-300 font-poppins font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Students Content */}
          {filteredStudents.length === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-purple-400 dark:text-purple-500" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {searchQuery ? 'No classmates found' : 'No class members yet'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-poppins">
                {searchQuery 
                  ? 'Try adjusting your search criteria'
                  : `Be the first to add your information to the ${department.name} class page`
                }
              </p>
            </div>
          ) : (
            // Students Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudents.map((student, index) => (
                <div 
                  key={student._id} 
                  className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform transition-all duration-500 hover:scale-105 border border-slate-200 dark:border-slate-700"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Student Photo */}
                  <div className="relative overflow-hidden">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => e.currentTarget.src = `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(student.name.charAt(0))}`}
                    />
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-poppins font-medium">
                      <UserCheck className="h-3 w-3 inline mr-1" />
                      Active
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-poppins font-semibold text-slate-800 dark:text-white mb-1">
                      {student.name}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-poppins font-medium mb-3">
                      "{student.nickname}"
                    </p>
                    
                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
                        <Phone className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{student.phoneNumber}</span>
                      </div>
                    </div>
                    
                    {/* Quote */}
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                      <div className="flex items-start">
                        <Quote className="h-4 w-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-poppins italic">
                          "{student.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Reference Number Verification Modal */}
      {showRefModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-800 dark:text-white mb-2">
                Verify Your Reference Number
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-poppins">
                Enter your reference number to update your class information
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="Enter your reference number"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-slate-800 dark:text-white"
                />
              </div>

              {refError && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>{refError}</span>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRefModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-poppins"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyReferenceNumber}
                  disabled={refVerifying}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-poppins"
                >
                  {refVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-800 dark:text-white mb-2">
                Update Your Class Information
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-poppins">
                Fill in your details to appear on the class page
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nickname *
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                    placeholder="Enter your nickname"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Profile Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="Enter image URL"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Personal Quote *
                </label>
                <textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({...formData, quote: e.target.value})}
                  placeholder="Share a quote or something about yourself"
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-slate-800 dark:text-white resize-none"
                  required
                />
              </div>

              {formError && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-poppins"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-poppins"
                >
                  {formSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}