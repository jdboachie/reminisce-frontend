'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Link, Copy, Check, Users, Calendar, ImageIcon } from 'lucide-react';
import { departmentAPI, studentAPI } from '../utils';
import { DepartmentInfo, Student } from '../types';

interface DepartmentManagementProps {
  adminToken: string;
  departmentInfo?: any;
}

const DepartmentManagement: React.FC<DepartmentManagementProps> = ({ adminToken, departmentInfo }) => {
  const [department, setDepartment] = useState<DepartmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [albumCount, setAlbumCount] = useState(0);

  useEffect(() => {
    loadAdminDepartment();
  }, [adminToken]);

  const loadAdminDepartment = async () => {
    try {
      setLoading(true);
      // Get all departments and filter by the current admin's token
      const departments = await departmentAPI.listDepartments();
      
      if (departments.length > 0) {
        // For now, we'll just take the first department
        // In a real implementation, you'd filter by the admin ID from the token
        const adminDepartment = departments[0];
        setDepartment(adminDepartment);
        
        // Load department statistics
        await loadDepartmentStats(adminDepartment.slug);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load department');
    } finally {
      setLoading(false);
    }
  };
  

  
  const loadDepartmentStats = async (slug: string) => {
    try {
      // Load students for this department
      const studentsData = await studentAPI.getStudentsByWorkspace(slug);
      setStudents(studentsData);
      setStudentCount(studentsData.length);
      
      // In a real implementation, you'd also load events and albums
      // For now, we'll just use placeholder values
      setEventCount(0);
      setAlbumCount(0);
    } catch (err) {
      console.error('Failed to load department statistics:', err);
    }
  };



  const copyLink = async (slug: string) => {
    const link = `${window.location.origin}/department/${slug}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(slug);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Department Management</h2>
          <p className="text-gray-600">Manage your department and view statistics</p>
        </div>
        {!department && departmentInfo ? (
          <div className="text-center p-8">
            <p className="text-gray-500">Loading department information...</p>
          </div>
        ) : !department && !departmentInfo ? (
          <div className="text-center p-8">
            <p className="text-gray-500">No department found.</p>
            <p className="text-sm">Your department should have been created during signup.</p>
          </div>
        ) : null}
        
        {/* Unique Client Link Section */}
        {departmentInfo && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Client Access Link</h3>
            <p className="text-blue-700 mb-4">
              Share this link with students to access your department page:
            </p>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600 mb-2">Unique Department Link:</p>
              <p className="font-mono text-blue-600 break-all">
                {window.location.origin}/department/{departmentInfo.slug}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/department/${departmentInfo.slug}`);
                  alert('Link copied to clipboard!');
                }}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Department Display */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Department</h3>
        </div>
        
        {!department ? (
          <div className="p-8 text-center text-gray-500">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No department found.</p>
            <p className="text-sm">You need to create a department during admin signup.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-2xl font-medium text-gray-900">{department.name}</h4>
                <p className="text-sm text-gray-600">Code: {department.code}</p>
                <p className="text-sm text-gray-500">Slug: {department.slug}</p>
                <p className="text-xs text-gray-400">
                  Created: {department.createdAt ? new Date(department.createdAt).toLocaleDateString() : '—'}
                </p>
                
                {/* Department Stats */}
                <div className="flex space-x-8 mt-6">
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-800">{studentCount}</span>
                    <span className="text-sm text-gray-600">Students</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-800">{eventCount}</span>
                    <span className="text-sm text-gray-600">Events</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                    <ImageIcon className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-800">{albumCount}</span>
                    <span className="text-sm text-gray-600">Albums</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Shareable Link</p>
                  <p className="text-sm text-gray-500 font-mono mb-2">
                    {window.location.origin}/department/{department.slug}
                  </p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyLink(department.slug)}
                      className={`px-3 py-1 rounded-md text-sm flex items-center space-x-1 ${copiedLink === department.slug ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {copiedLink === department.slug ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                    
                    <a
                      href={`/department/${department.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm flex items-center space-x-1 hover:bg-blue-200"
                    >
                      <Link className="h-4 w-4" />
                      <span>View Page</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Student List Summary */}
            <div className="mt-8">
              <h5 className="text-lg font-medium text-gray-900 mb-4">Enrolled Students</h5>
              
              {students.length === 0 ? (
                <p className="text-gray-500">No students enrolled yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Number</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nickname</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.slice(0, 5).map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                {student.image ? (
                                  <img src={student.image} alt={student.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500">
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.referenceNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.nickname || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.phoneNumber || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {students.length > 5 && (
                    <div className="px-6 py-3 bg-gray-50 text-right">
                      <span className="text-sm text-gray-500">
                        Showing 5 of {students.length} students
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;
