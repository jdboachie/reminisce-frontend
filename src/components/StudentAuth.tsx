"use client";

import React, { useState } from 'react';
import { User, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { getApiEndpoint, API_CONFIG } from '../config/api';
import { useAuth } from '../hooks/useAuth';

interface StudentAuthProps {
  onAuthenticated: (studentId: string) => void;
  onBack?: () => void;
}

const StudentAuth: React.FC<StudentAuthProps> = ({ onAuthenticated, onBack }) => {
  const [studentId, setStudentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { accessToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

            try {
                 // Call your backend API - check if student exists
       const response = await fetch(`https://reminisce-backend.onrender.com/student/${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      // Debug: Log the response
      console.log('=== AUTHENTICATION DEBUG ===');
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      console.log('Response ok:', response.ok);
      console.log('=== END DEBUG ===');
      
      if (response.ok) {
        // Student exists - authentication successful
        onAuthenticated(studentId);
      } else {
        // Student not found - authentication failed
        setError('Invalid reference number. Please check your credentials.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-poppins text-sm">Back to Profiles</span>
            </button>
          )}
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-poppins font-bold text-slate-800 dark:text-white mb-2">
              Student Authentication
            </h1>
                         <p className="text-slate-600 dark:text-slate-300 font-poppins">
               Enter your reference number to access your profile
             </p>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                                                           <label htmlFor="studentId" className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Reference Number
                </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                                     placeholder="Enter your reference number"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm font-poppins text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!studentId.trim() || isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl font-poppins font-medium hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
                         <p className="text-xs text-slate-500 dark:text-slate-400 font-poppins">
               Don&apos;t have a reference number? Contact your administrator.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAuth;
