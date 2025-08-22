"use client";

import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface SuccessMessageProps {
  onContinue: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-2xl font-poppins font-bold text-slate-800 dark:text-white mb-4">
            Profile Uploaded Successfully!
          </h1>
          
          <p className="text-slate-600 dark:text-slate-300 font-poppins mb-8">
            Your profile has been successfully uploaded and is now visible to your classmates. 
            You can view it along with other student profiles.
          </p>
          
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl font-poppins font-medium hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>View All Profiles</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
