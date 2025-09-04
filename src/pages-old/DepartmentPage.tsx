"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Building, Users, Award, BookOpen, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  office: string;
  avatar: string;
  bio: string;
  specialties: string[];
}

const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    title: 'Department Head',
    department: 'Computer Science',
    email: 'sarah.mitchell@university.edu',
    phone: '+1 (555) 123-4567',
    office: 'Building A, Room 301',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Leading our department with over 15 years of experience in computer science education and research.',
    specialties: ['Artificial Intelligence', 'Machine Learning', 'Computer Vision']
  },
  {
    id: '2',
    name: 'Prof. James Wilson',
    title: 'Associate Professor',
    department: 'Computer Science',
    email: 'james.wilson@university.edu',
    phone: '+1 (555) 234-5678',
    office: 'Building A, Room 205',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Specializing in software engineering and distributed systems with a focus on scalable applications.',
    specialties: ['Software Engineering', 'Distributed Systems', 'Cloud Computing']
  },
  {
    id: '3',
    name: 'Dr. Emily Chen',
    title: 'Assistant Professor',
    department: 'Computer Science',
    email: 'emily.chen@university.edu',
    phone: '+1 (555) 345-6789',
    office: 'Building A, Room 108',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Research focuses on human-computer interaction and user experience design.',
    specialties: ['HCI', 'UX Design', 'Human-Centered Computing']
  },
  {
    id: '4',
    name: 'Prof. Michael Rodriguez',
    title: 'Senior Lecturer',
    department: 'Computer Science',
    email: 'michael.rodriguez@university.edu',
    phone: '+1 (555) 456-7890',
    office: 'Building A, Room 112',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Expert in database systems and data management with industry experience.',
    specialties: ['Database Systems', 'Data Management', 'Big Data']
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    title: 'Research Professor',
    department: 'Computer Science',
    email: 'lisa.thompson@university.edu',
    phone: '+1 (555) 567-8901',
    office: 'Building A, Room 401',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    bio: 'Leading research in cybersecurity and network security protocols.',
    specialties: ['Cybersecurity', 'Network Security', 'Cryptography']
  },
  {
    id: '6',
    name: 'Prof. David Kim',
    title: 'Lecturer',
    department: 'Computer Science',
    email: 'david.kim@university.edu',
    phone: '+1 (555) 678-9012',
    office: 'Building A, Room 115',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: 'Specializing in web development and modern programming languages.',
    specialties: ['Web Development', 'JavaScript', 'Full-Stack Development']
  }
];

const DepartmentPage: React.FC = () => {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-slate-800 dark:text-white mb-4">
              Our Department
            </h1>
            <p className="text-lg font-poppins text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Meet the dedicated faculty and staff who guide our academic journey. 
              Their expertise and passion shape the future of computer science education.
            </p>
          </div>

          {/* Department Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-12 border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-poppins font-bold text-slate-800 dark:text-white mb-4">
                  Computer Science Department
                </h2>
                <p className="text-slate-600 dark:text-slate-300 font-poppins mb-6 leading-relaxed">
                  Our department is committed to excellence in computer science education, research, and innovation. 
                  We provide students with cutting-edge knowledge and practical skills needed for the digital age.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span className="text-slate-700 dark:text-slate-300 font-poppins">Building A, Science Complex</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span className="text-slate-700 dark:text-slate-300 font-poppins">6 Faculty Members</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span className="text-slate-700 dark:text-slate-300 font-poppins">Top 10% Nationally Ranked</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span className="text-slate-700 dark:text-slate-300 font-poppins">15+ Research Areas</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
                <h3 className="text-lg font-poppins font-semibold text-slate-800 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-slate-700 dark:text-slate-300 font-poppins text-sm">cs@university.edu</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-slate-700 dark:text-slate-300 font-poppins text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-slate-700 dark:text-slate-300 font-poppins text-sm">Building A, Room 301</span>
                  </div>
                </div>
                
                <button className="mt-4 flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-poppins text-sm font-medium transition-colors duration-300">
                  <span>Visit Department Website</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Faculty Section */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-poppins font-semibold text-slate-800 dark:text-white mb-4">
                Meet Our Faculty
              </h2>
              <p className="text-lg font-poppins text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Our dedicated faculty brings together expertise from academia and industry, 
                creating a rich learning environment for our students.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockStaff.map((staff, index) => (
                <div 
                  key={staff.id}
                  className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-500 hover:scale-105 animate-soft-scale border border-slate-200 dark:border-slate-700"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedStaff(staff)}
                >
                  {/* Staff Header */}
                  <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-700 soft-shadow"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white dark:border-slate-700"></div>
                      </div>
                      <h3 className="text-lg font-poppins font-semibold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {staff.name}
                      </h3>
                      <p className="text-sm font-poppins text-purple-600 dark:text-purple-400 font-medium">
                        {staff.title}
                      </p>
                    </div>
                  </div>

                  {/* Staff Content */}
                  <div className="p-6">
                    <p className="text-sm font-poppins text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                      {staff.bio}
                    </p>
                    
                    {/* Specialties */}
                    <div className="space-y-2">
                      <p className="text-xs font-poppins font-medium text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                        Specialties
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {staff.specialties.map((specialty, idx) => (
                          <span key={idx} className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full text-xs font-poppins">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-600 space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-poppins">
                        <Mail className="h-3 w-3" />
                        <span>{staff.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-poppins">
                        <MapPin className="h-3 w-3" />
                        <span>{staff.office}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DepartmentPage; 