"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, Filter, Grid, List } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Graduation Ceremony',
    description: 'Celebrating the achievements of our graduating class with family and friends.',
    date: 'May 15, 2024',
    time: '2:00 PM',
    location: 'Main Auditorium',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=250&fit=crop',
    attendees: 450,
    category: 'Academic',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Department Annual Dinner',
    description: 'A night of celebration, awards, and networking with faculty and alumni.',
    date: 'April 28, 2024',
    time: '7:00 PM',
    location: 'Grand Hotel Ballroom',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop',
    attendees: 120,
    category: 'Social',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Research Symposium',
    description: 'Showcasing student research projects and innovative academic work.',
    date: 'March 20, 2024',
    time: '9:00 AM',
    location: 'Science Building',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=250&fit=crop',
    attendees: 200,
    category: 'Academic',
    status: 'completed'
  },
  {
    id: '4',
    title: 'Sports Day',
    description: 'Annual inter-department sports competition and team building activities.',
    date: 'February 10, 2024',
    time: '8:00 AM',
    location: 'University Stadium',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
    attendees: 300,
    category: 'Sports',
    status: 'completed'
  },
  {
    id: '5',
    title: 'Career Fair',
    description: 'Connecting students with potential employers and career opportunities.',
    date: 'January 25, 2024',
    time: '10:00 AM',
    location: 'Student Center',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
    attendees: 180,
    category: 'Professional',
    status: 'completed'
  },
  {
    id: '6',
    title: 'Welcome Back Party',
    description: 'Kicking off the new academic year with fun, food, and friendship.',
    date: 'September 5, 2024',
    time: '6:00 PM',
    location: 'Campus Green',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=250&fit=crop',
    attendees: 250,
    category: 'Social',
    status: 'upcoming'
  }
];

const categories = ['All', 'Academic', 'Social', 'Sports', 'Professional'];

const EventsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredEvents = mockEvents.filter(event => 
    selectedCategory === 'All' || event.category === selectedCategory
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-slate-800 mb-4">
              Our Events & Milestones
            </h1>
            <p className="text-lg font-poppins text-slate-600 max-w-2xl mx-auto">
              Relive the key moments and celebrations that made this year special. 
              Every event tells a story of growth, achievement, and community.
            </p>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-purple-300 transition-all duration-300 font-poppins text-sm"
              >
                <Filter className="h-4 w-4 text-slate-600" />
                <span className="text-slate-700">{selectedCategory}</span>
              </button>
              
              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-slate-100 soft-shadow animate-soft-scale">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 text-sm font-poppins transition-all duration-300 ${
                        selectedCategory === category
                          ? 'text-purple-600 bg-purple-50'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
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
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'timeline' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-slate-600 hover:text-purple-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Events Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-500 hover:scale-105 animate-soft-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Event Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Status Badge */}
                    <div className={`absolute top-4 left-4 ${getStatusColor(event.status)} text-white px-3 py-1 rounded-full text-xs font-poppins font-medium`}>
                      {getStatusText(event.status)}
                    </div>
                    {/* Date Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-poppins font-medium">
                      {event.date}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-poppins font-semibold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 text-sm font-poppins mb-4 leading-relaxed">
                      {event.description}
                    </p>
                    
                    {/* Event Details */}
                    <div className="space-y-2 text-sm text-slate-500 font-poppins">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Timeline View */
            <div className="space-y-8">
              {filteredEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className="flex flex-col lg:flex-row bg-white rounded-2xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-500 hover:scale-105 animate-soft-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Event Image */}
                  <div className="lg:w-1/3 relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 lg:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute top-4 left-4 ${getStatusColor(event.status)} text-white px-3 py-1 rounded-full text-xs font-poppins font-medium`}>
                      {getStatusText(event.status)}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="lg:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-poppins font-semibold text-slate-800">
                        {event.title}
                      </h3>
                      <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-poppins font-medium">
                        {event.date}
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-base font-poppins mb-6 leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-500 font-poppins">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate-700 mb-2">
                No events found
              </h3>
              <p className="text-slate-500 font-poppins">
                Try adjusting your filter criteria
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventsPage; 