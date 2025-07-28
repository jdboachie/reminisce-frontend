"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Send, CheckCircle, AlertCircle, MessageSquare, Bug, Lightbulb, User, Mail } from 'lucide-react';

interface ReportForm {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

const ReportsPage: React.FC = () => {
  const [formData, setFormData] = useState<ReportForm>({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'bug', label: 'Bug Report', icon: Bug, description: 'Report technical issues or problems' },
    { value: 'suggestion', label: 'Suggestion', icon: Lightbulb, description: 'Share ideas for improvement' },
    { value: 'feedback', label: 'General Feedback', icon: MessageSquare, description: 'Share your thoughts and comments' },
    { value: 'other', label: 'Other', icon: AlertCircle, description: 'Anything else you\'d like to share' }
  ];

  const handleInputChange = (field: keyof ReportForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-poppins font-bold text-slate-800 mb-4">
              Report & Feedback
            </h1>
            <p className="text-lg font-poppins text-slate-600 max-w-2xl mx-auto">
              Having a problem or something to share? We&apos;re here to listen and help.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Illustration & Message */}
            <div className="space-y-8">
              {/* Illustration */}
              <div className="text-center">
                <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 soft-shadow">
                  <User className="h-24 w-24 text-purple-500" />
                </div>
                <h2 className="text-2xl font-poppins font-semibold text-slate-800 mb-4">
                  We&apos;re Here to Help
                </h2>
                <p className="text-lg font-poppins text-slate-600 leading-relaxed">
                  Whether you&apos;ve found a bug, have a suggestion for improvement, or just want to share your thoughts, 
                  we value your feedback. Your input helps us make REMINISCE better for everyone.
                </p>
              </div>

              {/* Support Info */}
              <div className="bg-white rounded-2xl p-6 soft-shadow">
                <h3 className="text-lg font-poppins font-semibold text-slate-800 mb-4">
                  What can you report?
                </h3>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div key={category.value} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-poppins font-semibold text-slate-800">
                            {category.label}
                          </h4>
                          <p className="text-sm font-poppins text-slate-600">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Feedback Form */}
            <div className="bg-white rounded-2xl p-8 soft-shadow">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-poppins font-semibold text-slate-800 mb-6">
                    Send us a message
                  </h3>

                  {/* Name Field */}
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 top-3 text-slate-500 font-poppins text-sm transition-all duration-300 pointer-events-none"
                    >
                      Your Name
                    </label>
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 top-3 text-slate-500 font-poppins text-sm transition-all duration-300 pointer-events-none"
                    >
                      Email Address
                    </label>
                  </div>

                  {/* Category Field */}
                  <div className="relative">
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 appearance-none bg-white"
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

                  {/* Subject Field */}
                  <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="subject"
                      className="absolute left-4 top-3 text-slate-500 font-poppins text-sm transition-all duration-300 pointer-events-none"
                    >
                      Subject
                    </label>
                  </div>

                  {/* Message Field */}
                  <div className="relative">
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins text-sm transition-all duration-300 resize-none"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-4 top-3 text-slate-500 font-poppins text-sm transition-all duration-300 pointer-events-none"
                    >
                      Your Message
                    </label>
                  </div>

                  {/* Submit Button */}
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
                /* Success Message */
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-soft-scale">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-poppins font-semibold text-slate-800 mb-4">
                    Thank You!
                  </h3>
                  <p className="text-slate-600 font-poppins">
                    Your message has been sent successfully. We&apos;ll get back to you soon!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Support Info */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 soft-shadow max-w-2xl mx-auto">
              <h3 className="text-xl font-poppins font-semibold text-slate-800 mb-4">
                Need immediate help?
              </h3>
              <p className="text-slate-600 font-poppins mb-6">
                For urgent matters, you can also reach us directly:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center space-x-2 text-slate-600 font-poppins">
                  <Mail className="h-5 w-5 text-purple-500" />
                  <span>support@reminisce.com</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 font-poppins">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  <span>Live Chat Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportsPage; 