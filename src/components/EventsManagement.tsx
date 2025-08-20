// components/EventsManagement.tsx
import React, { useState } from 'react';
import { Plus, Calendar, Building, Users, MoreVertical, Eye, Trash2, Edit3, MapPin, Clock, Star } from 'lucide-react';
import { Button, Modal, FormField } from './ui';
import { useAppState } from '../hooks/useAppState';
import { useNotification } from '../hooks/useNotification';
import { Event } from '../types';
import Image from 'next/image';

export const EventsManagement: React.FC = () => {
  const { events, setEvents } = useAppState();
  const { showNotification } = useNotification();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    imageUrl: ''
  });

  const generateId = () => Date.now().toString() + Math.random();

  const updateEventForm = (field: keyof typeof eventForm, value: string) => {
    setEventForm(prev => ({ ...prev, [field]: value }));
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxAttendees: '',
      imageUrl: ''
    });
  };

  const addEvent = () => {
    const { title, description, date, time, location, maxAttendees, imageUrl } = eventForm;
    if (!title || !date || !time) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const event: Event = {
      id: generateId(),
      title,
      description,
      date,
      time,
      location,
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      status: 'upcoming',
      attendees: 0,
      imageUrl: imageUrl || `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}`
    };

    setEvents(prev => [...prev, event]);
    resetEventForm();
    setModalOpen(false);
    showNotification('Event created successfully!', 'success');
  };

  const deleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      showNotification('Event deleted successfully!', 'success');
      setDropdownOpen(null);
    }
  };

  const getEventStatusColor = (status: Event['status']) => {
    const colors = {
      upcoming: 'from-indigo-500 via-purple-500 to-pink-500',
      ongoing: 'from-emerald-400 via-cyan-500 to-blue-500',
      completed: 'from-gray-400 via-gray-500 to-gray-600'
    };
    return colors[status];
  };

  const getEventStatusBadge = (status: Event['status']) => {
    const badges = {
      upcoming: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      completed: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return badges[status];
  };

  const getAttendeeProgress = (current: number, max?: number) => {
    if (!max) return 0;
    return (current / max) * 100;
  };

  const toggleDropdown = (eventId: string) => {
    setDropdownOpen(dropdownOpen === eventId ? null : eventId);
  };

  const viewEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setDetailsModalOpen(true);
    setDropdownOpen(null);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Events Management
            </h2>
            <p className="text-slate-600 mt-1">Create and manage your community events</p>
          </div>
          <Button 
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(e => e.status === 'upcoming').length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.reduce((sum, event) => sum + event.attendees, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first event</p>
            <Button 
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Event</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1">
                {/* Status Header */}
                <div className={`h-1 bg-gradient-to-r ${getEventStatusColor(event.status)}`}></div>
                
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.imageUrl || `https://picsum.photos/400/200?random=${event.id}`}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <Image
                    src={event.imageUrl || `https://picsum.photos/400/200?random=${event.id}`}
                    alt={event.title}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    style={{ zIndex: 0 }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}`;
                    }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false}
                  />
                  <span className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${getEventStatusBadge(event.status)}`}>
                    {event.status === 'upcoming' && <Star className="h-3 w-3 mr-1" />}
                    {event.status === 'ongoing' && <Clock className="h-3 w-3 mr-1" />}
                    {event.status}
                  </span>
                </div>
                
                <div className="p-6">
                  {/* Header with Title and Menu */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                    </div>
                    <div className="relative ml-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(event.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                      
                      {dropdownOpen === event.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                          <button 
                            onClick={() => viewEventDetails(event)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-3 text-gray-400" />
                            View Details
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Edit3 className="h-4 w-4 mr-3 text-gray-400" />
                            Edit Event
                          </button>
                          <hr className="my-2" />
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete Event
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Description */}
                  {event.description && (
                    <p className="text-sm text-slate-600 mb-6 line-clamp-2">{event.description}</p>
                  )}
                  
                  {/* Event Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-slate-600">
                      <div className="flex items-center justify-center w-8 h-8 bg-indigo-50 rounded-full mr-3">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium">{event.date} at {event.time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-slate-600">
                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-50 rounded-full mr-3">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Attendees Section */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-slate-700">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm font-semibold">
                          {event.attendees}{event.maxAttendees && `/${event.maxAttendees}`} attendees
                        </span>
                      </div>
                      {event.maxAttendees && (
                        <span className="text-xs text-slate-500">
                          {Math.round(getAttendeeProgress(event.attendees, event.maxAttendees))}% full
                        </span>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    {event.maxAttendees && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(getAttendeeProgress(event.attendees, event.maxAttendees), 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => viewEventDetails(event)}
                      className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 py-2 px-4 rounded-xl font-medium text-sm transition-all duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Event">
        <div className="space-y-6">
          <div className="text-center pb-4 border-b border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Create New Event</h3>
            <p className="text-gray-600 text-sm mt-1">Fill in the details to create your event</p>
          </div>
          
          <FormField
            label="Event Title"
            value={eventForm.title}
            onChange={(value) => updateEventForm('title', value)}
            placeholder="e.g., Community Meetup, Workshop, Conference"
            required
          />
          
          <FormField
            label="Description"
            value={eventForm.description}
            onChange={(value) => updateEventForm('description', value)}
            placeholder="Describe what this event is about..."
            isTextarea
            rows={4}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date"
              type="date"
              value={eventForm.date}
              onChange={(value) => updateEventForm('date', value)}
              required
            />
            <FormField
              label="Time"
              type="time"
              value={eventForm.time}
              onChange={(value) => updateEventForm('time', value)}
              required
            />
          </div>
          
          <FormField
            label="Location"
            value={eventForm.location}
            onChange={(value) => updateEventForm('location', value)}
            placeholder="e.g., Conference Hall, Online, Community Center"
          />
          
          <FormField
            label="Maximum Attendees"
            type="number"
            value={eventForm.maxAttendees}
            onChange={(value) => updateEventForm('maxAttendees', value)}
            placeholder="Leave empty for unlimited capacity"
          />
          
          <FormField
            label="Event Image URL"
            value={eventForm.imageUrl}
            onChange={(value) => updateEventForm('imageUrl', value)}
            placeholder="https://example.com/image.jpg (optional)"
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
          <Button 
            onClick={() => setModalOpen(false)} 
            variant="secondary"
            className="px-6"
          >
            Cancel
          </Button>
          <Button 
            onClick={addEvent}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-6"
          >
            Create Event
          </Button>
        </div>
      </Modal>

      {/* Event Details Modal */}
      <Modal 
        isOpen={detailsModalOpen} 
        onClose={() => setDetailsModalOpen(false)} 
        title=""
        maxWidth="4xl"
      >
        {selectedEvent && (
          <div className="space-y-6">
            {/* Event Image Header */}
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img 
                src={selectedEvent.imageUrl || `https://picsum.photos/800/400?random=${selectedEvent.id}`}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 1000)}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border backdrop-blur-sm ${getEventStatusBadge(selectedEvent.status)}`}>
                      {selectedEvent.status === 'upcoming' && <Star className="h-4 w-4 mr-1" />}
                      {selectedEvent.status === 'ongoing' && <Clock className="h-4 w-4 mr-1" />}
                      {selectedEvent.status}
                    </span>
                  </div>
                  <button
                    onClick={() => setDetailsModalOpen(false)}
                    className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">About This Event</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedEvent.description || "No description provided for this event."}
                  </p>
                </div>

                {/* Event Timeline */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Event Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Event Date & Time</h4>
                        <p className="text-gray-600">{selectedEvent.date} at {selectedEvent.time}</p>
                      </div>
                    </div>
                    {selectedEvent.location && (
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Location</h4>
                          <p className="text-gray-600">{selectedEvent.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Attendance Info */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Attendance</h3>
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Current Attendees</span>
                        <span className="text-2xl font-bold text-indigo-600">{selectedEvent.attendees}</span>
                      </div>
                      {selectedEvent.maxAttendees && (
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-600">Maximum Capacity</span>
                          <span className="text-lg font-semibold text-gray-900">{selectedEvent.maxAttendees}</span>
                        </div>
                      )}
                    </div>

                    {selectedEvent.maxAttendees && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-500">Capacity</span>
                          <span className="text-xs text-gray-500">
                            {Math.round(getAttendeeProgress(selectedEvent.attendees, selectedEvent.maxAttendees))}% Full
                          </span>
                        </div>
                        <div className="w-full bg-white rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(getAttendeeProgress(selectedEvent.attendees, selectedEvent.maxAttendees), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Register for Event</span>
                    </button>
                    <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-medium border border-gray-200 transition-all duration-200 flex items-center justify-center space-x-2">
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Event</span>
                    </button>
                    <button 
                      onClick={() => {
                        deleteEvent(selectedEvent.id);
                        setDetailsModalOpen(false);
                      }}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Event</span>
                    </button>
                  </div>
                </div>

                {/* Event Stats */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Event Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Event ID</span>
                      <span className="text-sm font-mono text-gray-900">#{selectedEvent.id.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">{selectedEvent.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created</span>
                      <span className="text-sm text-gray-900">Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};