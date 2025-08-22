"use client";

import React, { useState, useRef } from 'react';
import { Upload, Camera, Quote, User, Save, ArrowLeft, X } from 'lucide-react';
import { getApiEndpoint } from '../config/api';
import { useAuth } from '../hooks/useAuth';

interface ProfileData {
  name: string;
  nickname: string;
  quote: string;
  avatar: File | null;
  avatarPreview: string;
}

interface ProfileUploadProps {
  studentId: string;
  onBack: () => void;
  onComplete: (profileData: ProfileData) => void;
  onBackToProfiles?: () => void;
}

const ProfileUpload: React.FC<ProfileUploadProps> = ({ studentId, onBack, onComplete, onBackToProfiles }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    nickname: '',
    quote: '',
    avatar: null,
    avatarPreview: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string | undefined}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accessToken } = useAuth();

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: file,
          avatarPreview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string | undefined} = {};
    if (!profileData.name.trim()) newErrors.name = 'Name is required';
    if (!profileData.nickname.trim()) newErrors.nickname = 'Nickname is required';
    if (!profileData.quote.trim()) newErrors.quote = 'Quote is required';
    if (!profileData.avatarPreview) newErrors.avatar = 'Profile photo is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    
         try {
       const endpoint = getApiEndpoint('UPLOAD_PROFILE');
       
       // Debug: Log the request data
       console.log('=== PROFILE UPLOAD REQUEST DEBUG ===');
       console.log('Student ID:', studentId);
       console.log('Profile data:', profileData);
       console.log('Request body:', {
         referenceNumber: studentId,
         name: profileData.name,
         nickname: profileData.nickname,
         quote: profileData.quote,
         image: profileData.avatarPreview ? 'Base64 image data (truncated)' : 'No image'
       });
       console.log('=== END REQUEST DEBUG ===');
       
       // Call your backend API to upload profile
       const response = await fetch('http://localhost:3000/student', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referenceNumber: studentId,
          name: profileData.name,
          nickname: profileData.nickname,
          quote: profileData.quote,
          image: profileData.avatarPreview, // Send base64 string as 'image'
        }),
      });

      const data = await response.json();

      // Debug: Log the response
      console.log('=== PROFILE UPLOAD DEBUG ===');
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      console.log('Response ok:', response.ok);
      console.log('=== END DEBUG ===');

      if (response.ok) {
        // Profile uploaded successfully
        console.log('Profile saved successfully!');
        onComplete(profileData);
      } else {
        // Profile upload failed
        console.log('Profile upload failed:', data);
        alert(data.error || data.message || 'Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile upload error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </button>
              <div>
                <h1 className="text-2xl font-poppins font-bold text-slate-800 dark:text-white">Complete Your Profile</h1>
                                 <p className="text-slate-600 dark:text-slate-300 font-poppins">Reference Number: {studentId}</p>
              </div>
            </div>
            {onBackToProfiles && (
              <button
                onClick={onBackToProfiles}
                className="text-sm font-poppins text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors duration-300"
              >
                Cancel & View Profiles
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-poppins font-semibold text-slate-800 dark:text-white mb-6">Profile Photo</h2>
              <div className="w-48 h-48 mx-auto border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-300"
                   onClick={() => fileInputRef.current?.click()}>
                {profileData.avatarPreview ? (
                  <div className="relative w-full h-full">
                    <img src={profileData.avatarPreview} alt="Profile preview" className="w-full h-full object-cover rounded-2xl" />
                    <button type="button" onClick={(e) => {
                      e.stopPropagation();
                      setProfileData(prev => ({ ...prev, avatar: null, avatarPreview: '' }));
                    }} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                    <p className="text-sm font-poppins text-slate-600 dark:text-slate-400">Click to upload photo</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {errors.avatar && <p className="text-red-500 dark:text-red-400 text-sm font-poppins mt-2">{errors.avatar}</p>}
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-poppins font-semibold text-slate-800 dark:text-white mb-6">Personal Information</h2>
              
              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-200 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" 
                />
                {errors.name && <p className="text-red-500 dark:text-red-400 text-sm font-poppins mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-200 mb-2">Nickname *</label>
                <input 
                  type="text" 
                  value={profileData.nickname} 
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  placeholder="Enter your nickname"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" 
                />
                {errors.nickname && <p className="text-red-500 dark:text-red-400 text-sm font-poppins mt-1">{errors.nickname}</p>}
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 dark:text-slate-200 mb-2">Personal Quote *</label>
                <textarea 
                  value={profileData.quote} 
                  onChange={(e) => handleInputChange('quote', e.target.value)} 
                  rows={4}
                  placeholder="Share a meaningful quote or message"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" 
                />
                {errors.quote && <p className="text-red-500 dark:text-red-400 text-sm font-poppins mt-1">{errors.quote}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl font-poppins font-medium hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpload;
