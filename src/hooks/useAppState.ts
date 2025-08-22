// hooks/useAppState.ts
import { useState } from 'react';
import { User, Event, Album, DepartmentInfo, Pictures } from '../types'; // Add Picture import

const initialUsers: User[] = [
  {
    id: '1',
    indexNumber: 'CS2024001',
    name: 'John Doe',
    email: 'john@university.edu',
    joinedAt: '2024-01-15',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    indexNumber: 'CS2024002',
    name: 'Jane Smith',
    email: 'jane@university.edu',
    joinedAt: '2024-01-20',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  }
];

const initialEvents: Event[] = [
  {
      id: '1',
      title: 'AI Workshop',
      description: 'Introduction to Machine Learning and AI fundamentals',
      date: '2024-03-15',
      time: '14:00',
      location: 'Lab A-301',
      status: 'upcoming',
      attendees: 25,
      maxAttendees: 50,
      imageUrl: ''
  },
  {
      id: '2',
      title: 'Web Development Bootcamp',
      description: 'Intensive 3-day web development training',
      date: '2024-03-20',
      time: '09:00',
      location: 'Main Auditorium',
      status: 'upcoming',
      attendees: 45,
      maxAttendees: 100,
      imageUrl: ''
  }
];

const initialAlbums: Album[] = [
  {
    id: '1',
    name: 'Graduation 2024',
    description: 'Photos from the 2024 graduation ceremony',
    imageCount: 150,
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=300&h=200&fit=crop',
    createdAt: '2024-02-01'
  },
  {
    id: '2',
    name: 'Tech Fair 2024',
    description: 'Student projects and innovation showcase',
    imageCount: 85,
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop',
    createdAt: '2024-01-15'
  }
];

// Add initial pictures data
const initialPictures: Pictures[] = [
  {
    id: '1',
    albumId: '1',
    title: 'Class of 2024',
    description: 'Group photo of all graduating students',
    tags: ['graduation', 'ceremony', '2024'],
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=600&h=400&fit=crop',
    uploadedBy: 'John Doe',
    uploadedAt: '2024-02-01',
    likes: 45,
    views: 120
  },
  {
    id: '2',
    albumId: '1',
    title: 'Valedictorian Speech',
    description: 'Our valedictorian delivering an inspiring speech',
    tags: ['speech', 'valedictorian', 'ceremony'],
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
    uploadedBy: 'Jane Smith',
    uploadedAt: '2024-02-01',
    likes: 32,
    views: 89
  },
  {
    id: '3',
    albumId: '2',
    title: 'AI Robot Demo',
    description: 'Students demonstrating their AI-powered robot',
    tags: ['AI', 'robotics', 'demo', 'innovation'],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    uploadedBy: 'John Doe',
    uploadedAt: '2024-01-15',
    likes: 28,
    views: 156
  },
  {
    id: '4',
    albumId: '2',
    title: 'Mobile App Showcase',
    description: 'Award-winning mobile application presentation',
    tags: ['mobile', 'app', 'showcase', 'award'],
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop',
    uploadedBy: 'Jane Smith',
    uploadedAt: '2024-01-15',
    likes: 19,
    views: 73
  }
];

const initialDepartmentInfo: DepartmentInfo = {
  name: 'Computer Science Department',
  description: 'Leading innovation in technology education and research',
  contactEmail: 'cs@university.edu',
  contactPhone: '+1 (555) 123-4567',
  address: 'Building A, University Campus',
  shareableLink: 'https://workspace.university.edu/cs-dept-2024'
};

export const useAppState = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [pictures, setPictures] = useState<Pictures[]>(initialPictures); // Add pictures state
  const [departmentInfo, setDepartmentInfo] = useState<DepartmentInfo>(initialDepartmentInfo);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState('');

  return {
    activeTab,
    setActiveTab,
    users,
    setUsers,
    events,
    setEvents,
    albums,
    setAlbums,
    pictures,     // Add pictures to return object
    setPictures,  // Add setPictures to return object
    departmentInfo,
    setDepartmentInfo,
    // Authentication state
    isAuthenticated,
    setIsAuthenticated,
    currentStudentId,
    setCurrentStudentId
  };
};