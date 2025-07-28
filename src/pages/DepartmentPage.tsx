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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-poppins font-bold text-slate-800 mb-4">
              About Our Department
            </h1>
            <p className="text-lg font-poppins text-slate-600 max-w-3xl mx-auto">
              Discover our academic community, dedicated faculty, and the journey we&apos;ve shared together.
            </p>
          </div>

          {/* Department Overview Section */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-poppins font-semibold text-slate-800">
                    Computer Science Department
                  </h2>
                  <p className="text-lg font-poppins text-slate-600 leading-relaxed">
                    Our department has been at the forefront of computer science education for over two decades. 
                    We pride ourselves on fostering innovation, critical thinking, and practical skills that prepare 
                    our students for the ever-evolving technology landscape.
                  </p>
                  <p className="text-lg font-poppins text-slate-600 leading-relaxed">
                    With state-of-the-art facilities, dedicated faculty, and a curriculum that balances theoretical 
                    foundations with hands-on experience, we&apos;ve created an environment where students can thrive 
                    and develop into the next generation of technology leaders.
                  </p>
                </div>

                {/* Department Stats */}
                <div className="grid grid-cols-3 gap-6 pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-poppins font-bold text-slate-800">150+</h3>
                    <p className="text-sm font-poppins text-slate-600">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-poppins font-bold text-slate-800">25+</h3>
                    <p className="text-sm font-poppins text-slate-600">Awards</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-poppins font-bold text-slate-800">50+</h3>
                    <p className="text-sm font-poppins text-slate-600">Publications</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-2xl p-6 soft-shadow">
                  <h3 className="text-lg font-poppins font-semibold text-slate-800 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-slate-600 font-poppins">
                      <Building className="h-5 w-5 text-purple-500" />
                      <span>Building A, Computer Science Department</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 font-poppins">
                      <Mail className="h-5 w-5 text-purple-500" />
                      <span>cs@university.edu</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 font-poppins">
                      <Phone className="h-5 w-5 text-purple-500" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 soft-shadow">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Building className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-poppins font-semibold text-slate-800 mb-4">
                      Our Mission
                    </h3>
                    <p className="text-slate-600 font-poppins leading-relaxed">
                      To provide exceptional computer science education that empowers students 
                      to become innovative problem solvers and technology leaders of tomorrow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Faculty Section */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-poppins font-semibold text-slate-800 mb-4">
                Meet Our Faculty
              </h2>
              <p className="text-lg font-poppins text-slate-600 max-w-2xl mx-auto">
                Our dedicated faculty brings together expertise from academia and industry, 
                creating a rich learning environment for our students.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockStaff.map((staff, index) => (
                <div 
                  key={staff.id}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden soft-shadow hover:soft-shadow-hover transform transition-all duration-500 hover:scale-105 animate-soft-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedStaff(staff)}
                >
                  {/* Staff Header */}
                  <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white soft-shadow"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <h3 className="text-lg font-poppins font-semibold text-slate-800 group-hover:text-purple-600 transition-colors duration-300">
                        {staff.name}
                      </h3>
                      <p className="text-sm font-poppins text-purple-600 font-medium">
                        {staff.title}
                      </p>
                    </div>
                  </div>

                  {/* Staff Content */}
                  <div className="p-6">
                    <p className="text-sm font-poppins text-slate-600 mb-4 leading-relaxed">
                      {staff.bio}
                    </p>
                    
                    {/* Specialties */}
                    <div className="space-y-2">
                      <p className="text-xs font-poppins font-medium text-slate-700 uppercase tracking-wide">
                        Specialties
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {staff.specialties.map((specialty, idx) => (
                          <span key={idx} className="bg-purple-50 text-purple-600 px-2 py-1 rounded-full text-xs font-poppins">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-slate-500 font-poppins">
                        <Mail className="h-3 w-3" />
                        <span>{staff.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 font-poppins">
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