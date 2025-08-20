"use client";

import React, { useState, useRef } from 'react';
import { Upload, Camera, Quote, User, Mail, Phone, MapPin, Save, ArrowLeft, X } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  major: string;
  year: string;
  role: string;
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
    email: '',
    phone: '',
    location: '',
    major: '',
    year: '',
    role: '',
    quote: '',
    avatar: null,
    avatarPreview: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const newErrors: Partial<ProfileData> = {};
    if (!profileData.name.trim()) newErrors.name = 'Name is required';
    if (!profileData.email.trim()) newErrors.email = 'Email is required';
    if (!profileData.major.trim()) newErrors.major = 'Major is required';
    if (!profileData.year.trim()) newErrors.year = 'Year is required';
    if (!profileData.quote.trim()) newErrors.quote = 'Quote is required';
    if (!profileData.avatar) newErrors.avatar = 'Profile photo is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete(profileData);
    } catch (error) {
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-poppins font-bold text-slate-800">Complete Your Profile</h1>
                <p className="text-slate-600 font-poppins">Student ID: {studentId}</p>
              </div>
            </div>
            {onBackToProfiles && (
              <button
                onClick={onBackToProfiles}
                className="text-sm font-poppins text-slate-600 hover:text-slate-800 transition-colors duration-300"
              >
                Cancel & View Profiles
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-poppins font-semibold text-slate-800 mb-6">Profile Photo</h2>
              <div className="w-48 h-48 mx-auto border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer"
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
                    <Camera className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-poppins text-slate-600">Click to upload photo</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {errors.avatar && <p className="text-red-500 text-sm font-poppins mt-2">{errors.avatar}</p>}
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-poppins font-semibold text-slate-800 mb-6">Personal Information</h2>
              
              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 mb-2">Full Name *</label>
                <input type="text" value={profileData.name} onChange={(e) => handleInputChange('name', e.target.value)}
                       className="w-full px-4 py-3 border border-slate-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                {errors.name && <p className="text-red-500 text-sm font-poppins mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 mb-2">Email Address *</label>
                <input type="email" value={profileData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                       className="w-full px-4 py-3 border border-slate-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                {errors.email && <p className="text-red-500 text-sm font-poppins mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 mb-2">Major/Field of Study *</label>
                <input type="text" value={profileData.major} onChange={(e) => handleInputChange('major', e.target.value)}
                       className="w-full px-4 py-3 border border-slate-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                {errors.major && <p className="text-red-500 text-sm font-poppins mt-1">{errors.major}</p>}
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 mb-2">Graduation Year *</label>
                <input type="text" value={profileData.year} onChange={(e) => handleInputChange('year', e.target.value)}
                       className="w-full px-4 py-3 border border-slate-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                {errors.year && <p className="text-red-500 text-sm font-poppins mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-slate-700 mb-2">Personal Quote *</label>
                <textarea value={profileData.quote} onChange={(e) => handleInputChange('quote', e.target.value)} rows={3}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                {errors.quote && <p className="text-red-500 text-sm font-poppins mt-1">{errors.quote}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <button type="submit" disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl font-poppins font-medium hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
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
