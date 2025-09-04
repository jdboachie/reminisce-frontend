'use client';

import React, { useState } from 'react';
import { User, Lock, AlertCircle, ArrowRight, UserPlus, LogIn, Building } from 'lucide-react';
import { authAPI, departmentAPI } from '../utils';
import { CreateDepartmentPayload, SignupResponse, SigninResponse } from '../types';

interface AdminAuthProps {
  onSuccess: (token: string) => void;
  onBack?: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onSuccess, onBack }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Department fields for signup
  const [departmentName, setDepartmentName] = useState('');
  const [departmentCode, setDepartmentCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignup) {
        // Validate passwords match
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        // Validate password length
        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        // Validate department fields for signup
        if (!departmentName || !departmentCode) {
          setError('Department information is required');
          return;
        }

        // Signup with department info
        const signupResult: SignupResponse = await authAPI.signup(username, password, departmentName, departmentCode);
        setSuccess('Admin account and department created successfully!');
        
        // Store department info for the admin panel
        const departmentInfo = {
          slug: signupResult.department.slug,
          name: signupResult.department.name,
          code: signupResult.department.code,
          id: signupResult.department.id
        };
        
        localStorage.setItem('departmentInfo', JSON.stringify(departmentInfo));
        
        // Use token directly from signup response
        const token = signupResult.token;
        
        // Store token and redirect to admin panel
        localStorage.setItem('adminToken', token);
        onSuccess(token);
      } else {
        // Signin
        const data: SigninResponse = await authAPI.signin(username, password);
        
        // Store department info from signin response
        localStorage.setItem('departmentInfo', JSON.stringify({
          slug: data.department.slug,
          name: data.department.name,
          code: data.department.code,
          id: data.department.id
        }));
        
        localStorage.setItem('adminToken', data.token);
        onSuccess(data.token);
      }
    } catch (error) {
      console.error('Admin auth error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepartmentNameChange = (name: string) => {
    setDepartmentName(name);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setDepartmentName('');
    setDepartmentCode('');
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
              <span className="font-poppins text-sm">Back</span>
            </button>
          )}
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {isSignup ? (
                <UserPlus className="h-8 w-8 text-white" />
              ) : (
                <User className="h-8 w-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-poppins font-bold text-slate-800 dark:text-white mb-2">
              {isSignup ? 'Admin Signup' : 'Admin Login'}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 font-poppins">
              {isSignup 
                ? 'Create your first admin account' 
                : 'Sign in to access admin features'
              }
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl mb-6">
              <div className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-poppins text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-200 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Confirm Password for Signup */}
            {isSignup && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                {/* Department Information */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    Department Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="departmentName" className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-200 mb-2">
                        Department Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                        <input
                          id="departmentName"
                          type="text"
                          value={departmentName}
                          onChange={(e) => handleDepartmentNameChange(e.target.value)}
                          placeholder="e.g., Computer Science"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="departmentCode" className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-200 mb-2">
                        Department Code
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                        <input
                          id="departmentCode"
                          type="text"
                          value={departmentCode}
                          onChange={(e) => setDepartmentCode(e.target.value)}
                          placeholder="e.g., CS"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    

                  </div>
                </div>
              </>
            )}

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
              disabled={!username.trim() || !password.trim() || (isSignup && (!confirmPassword.trim() || !departmentName.trim() || !departmentCode.trim())) || isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl font-poppins font-medium hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isSignup ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <>
                  <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-poppins underline transition-colors duration-300"
            >
              {isSignup 
                ? 'Already have an account? Sign in' 
                : 'First time here? Create an account'
              }
            </button>
          </div>

          {/* First Time Setup Info */}
          {isSignup && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                First Time Setup
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                This will create your admin account and department. Each admin can manage one department. The department URL slug will be used to create a shareable link for students.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
