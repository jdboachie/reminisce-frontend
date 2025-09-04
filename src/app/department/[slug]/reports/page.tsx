'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, CheckCircle, AlertCircle, MessageSquare, Bug, Lightbulb, User, Mail, Moon, ArrowLeft } from 'lucide-react';
import { API_CONFIG } from '@/config/api';

interface Department {
  _id: string;
  name: string;
  code: string;
  slug: string;
  description?: string;
}

interface ReportForm {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  department: string;
}

export default function DepartmentReportsRoute() {
  const params = useParams();
  const router = useRouter();
  const departmentSlug = params?.slug as string;
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // Light theme as default
  
  const [formData, setFormData] = useState<ReportForm>({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    department: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'bug', label: 'Bug Report', icon: Bug, description: 'Report technical issues or problems' },
    { value: 'suggestion', label: 'Suggestion', icon: Lightbulb, description: 'Share ideas for improvement' },
    { value: 'feedback', label: 'General Feedback', icon: MessageSquare, description: 'Share your thoughts and comments' },
    { value: 'other', label: 'Other', icon: AlertCircle, description: 'Anything else you\'d like to share' }
  ];

  useEffect(() => {
    if (departmentSlug) {
      fetchDepartmentData();
    }
  }, [departmentSlug]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch department info
      const deptResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_DEPARTMENT_BY_SLUG}/${departmentSlug}`);
      if (!deptResponse.ok) {
        throw new Error('Department not found');
      }
      const deptData = await deptResponse.json();
      setDepartment(deptData);
      
      // Set department in form data
      setFormData(prev => ({ ...prev, department: deptData.name }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load department data');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You can add localStorage persistence here if needed
  };

  const handleInputChange = (field: keyof ReportForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get reference number from user (students need to enter their reference number)
      const referenceNumber = prompt('Please enter your reference number to submit this report:');
      
      if (!referenceNumber) {
        alert('Reference number is required to submit a report.');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare report data
      const reportData = {
        title: formData.subject,
        content: formData.message,
        referenceNumber: referenceNumber.trim(),
        departmentSlug: departmentSlug
      };
      
      console.log('Submitting report:', reportData);
      
      // Submit report to backend
      const response = await fetch(`${API_CONFIG.BASE_URL}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || `Failed to submit report: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Report submitted successfully:', result);
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after showing success message
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          category: '',
          subject: '',
          message: '',
          department: department?.name || ''
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(`Failed to submit report: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-grow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 animate-watercolor-float"></div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-poppins">Loading department reports...</p>
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
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''} bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900`}>
      {/* Top Navigation Bar - Light Theme Optimized */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-slate-800 dark:text-white font-bold text-xl font-poppins">REMINISCE</span>
            </div>

            {/* Main Navigation Tabs - Light Theme Colors */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-600">
              <button
                onClick={() => router.push(`/department/${departmentSlug}`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-300 dark:hover:border-slate-500"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Home</span>
              </button>
              <button
                onClick={() => router.push(`/department/${departmentSlug}/albums`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-300 dark:hover:border-slate-500"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span>Albums</span>
              </button>
              <button
                onClick={() => router.push(`/department/${departmentSlug}/events`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-300 dark:hover:border-slate-500"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Events</span>
              </button>
              <button
                onClick={() => router.push(`/department/${departmentSlug}/students`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-300 dark:hover:border-slate-500"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>Class</span>
              </button>
              {/* <button
                onClick={() => router.push(`/department/${departmentSlug}/about`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-300 dark:hover:border-slate-500"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span>Department</span>
              </button> */}
              <button
                onClick={() => router.push(`/department/${departmentSlug}/reports`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700 shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>Report</span>
              </button>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Moon className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - EXACTLY matching ReportsPage */}
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section - EXACT ReportsPage styling */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-poppins font-bold text-slate-800 dark:text-white mb-4">
              Report & Feedback
            </h1>
            <p className="text-lg font-poppins text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Having a problem or something to share? We&apos;re here to listen and help.
            </p>
          </div>

          {/* Main Content - EXACT ReportsPage styling */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Illustration & Message - EXACT ReportsPage styling */}
            <div className="space-y-8">
              {/* Illustration */}
              <div className="text-center">
                <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6 soft-shadow">
                  <User className="h-24 w-24 text-purple-500 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-poppins font-semibold text-slate-800 dark:text-white mb-4">
                  We&apos;re Here to Help
                </h2>
                <p className="text-lg font-poppins text-slate-600 dark:text-slate-300 leading-relaxed">
                  Whether you&apos;ve found a bug, have a suggestion for improvement, or just want to share your thoughts, 
                  we value your feedback. Your input helps us make {department.name} better for everyone.
                </p>
              </div>

              {/* Support Info - EXACT ReportsPage styling */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 soft-shadow border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-poppins font-semibold text-slate-800 dark:text-white mb-4">
                  What can you report?
                </h3>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div key={category.value} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-poppins font-semibold text-slate-800 dark:text-white">
                            {category.label}
                          </h4>
                          <p className="text-sm font-poppins text-slate-600 dark:text-slate-300">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Feedback Form - EXACT ReportsPage styling */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 soft-shadow border border-slate-200 dark:border-slate-700">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-poppins font-semibold text-slate-800 dark:text-white mb-6">
                    Send us a message
                  </h3>

                  {/* Name Field - EXACT ReportsPage styling */}
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 top-3 text-slate-500 dark:text-slate-400 font-poppins text-sm transition-all duration-300 pointer-events-none"
                    >
                      Your Name
                    </label>
                  </div>

                  {/* Email Field - EXACT ReportsPage styling */}
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 top-3 text-slate-500 dark:text-slate-400 font-poppins text-sm transition-all duration-300 pointer-events-none"
                    >
                      Email Address
                    </label>
                  </div>

                  {/* Category Field - EXACT ReportsPage styling */}
                  <div className="relative">
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 appearance-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Field - EXACT ReportsPage styling */}
                  <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="subject"
                      className="absolute left-4 top-3 text-slate-500 dark:text-slate-400 font-poppins text-sm transition-all duration-300 pointer-events-none"
                    >
                      Subject
                    </label>
                  </div>

                  {/* Message Field - EXACT ReportsPage styling */}
                  <div className="relative">
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 resize-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-4 top-3 text-slate-500 dark:text-slate-400 font-poppins text-sm transition-all duration-300 pointer-events-none"
                    >
                      Your Message
                    </label>
                  </div>

                  {/* Submit Button - EXACT ReportsPage styling */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl font-poppins font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 soft-shadow hover:soft-shadow-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success Message - EXACT ReportsPage styling */
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-soft-scale">
                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-poppins font-semibold text-slate-800 dark:text-white mb-4">
                    Thank You!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 font-poppins">
                    Your message has been sent successfully. We&apos;ll get back to you soon!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Support Info - EXACT ReportsPage styling */}
          <div className="mt-16 text-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 soft-shadow max-w-2xl mx-auto border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-poppins font-semibold text-slate-800 dark:text-white mb-4">
                Need immediate help?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-poppins mb-6">
                For urgent matters, you can also reach us directly:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 font-poppins">
                  <Mail className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  <span>support@reminisce.com</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 font-poppins">
                  <MessageSquare className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  <span>Live Chat Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
