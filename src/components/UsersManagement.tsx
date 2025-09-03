'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Users, Edit, Trash2, Upload, Download, Search, Filter } from 'lucide-react';
import { studentAPI } from '../utils';
import { Student, CreateStudentPayload, UpdateStudentPayload } from '../types';

interface UsersManagementProps {
  adminToken?: string;
  departmentInfo?: {
    name: string;
    code: string;
    slug: string;
  };
}

const UsersManagement: React.FC<UsersManagementProps> = ({ adminToken, departmentInfo }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('all');
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<CreateStudentPayload>({
    referenceNumber: '',
    workspace: departmentInfo?.name || ''
  });
  const [uploadData, setUploadData] = useState({
    workspace: '',
    referenceNumbers: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (adminToken) {
      loadStudents();
    }
  }, [adminToken]);

  // Update workspace fields when department info changes
  useEffect(() => {
    if (departmentInfo?.name) {
      console.log('🔍 UsersManagement: Setting workspace to department:', departmentInfo.name);
      setFormData(prev => ({ ...prev, workspace: departmentInfo.name }));
      setUploadData(prev => ({ ...prev, workspace: departmentInfo.name }));
    }
  }, [departmentInfo]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getStudentsByWorkspace(selectedWorkspace);
      setStudents(data);
      
      // Extract unique workspaces - Fixed TypeScript issue
      const uniqueWorkspaces = Array.from(new Set(data.map(student => student.workspace)));
      setWorkspaces(uniqueWorkspaces);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    try {
      setSubmitting(true);
      setError(null);
      
      if (editingStudent) {
        // Update existing student
        const updatedStudent = await studentAPI.updateStudent(formData);
        setStudents(prev => prev.map(s => 
          s._id === editingStudent._id ? updatedStudent : s
        ));
        setEditingStudent(null);
      } else {
        // Create new student
        const newStudent = await studentAPI.createStudent(formData, adminToken);
        setStudents(prev => [newStudent, ...prev]);
      }
      
      // Reset form
      setFormData({
        referenceNumber: '',
        workspace: departmentInfo?.name || ''
      });
      setShowCreateForm(false);
      
      alert(editingStudent ? 'Student updated successfully!' : 'Student created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    try {
      setSubmitting(true);
      setError(null);
      
      const referenceNumbers = uploadData.referenceNumbers
        .split('\n')
        .map(ref => ref.trim())
        .filter(ref => ref.length > 0);
      
      await studentAPI.uploadStudentList(uploadData.workspace, referenceNumbers, adminToken);
      
      // Refresh students list
      await loadStudents();
      
      // Reset form
      setUploadData({ workspace: '', referenceNumbers: '' });
      setShowUploadForm(false);
      
      alert('Student list uploaded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload student list');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      referenceNumber: student.referenceNumber,
      workspace: student.workspace
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (student: Student) => {
    if (!adminToken || !confirm(`Are you sure you want to delete ${student.name}?`)) return;

    try {
      await studentAPI.deleteStudent(student.referenceNumber, adminToken);
      setStudents(prev => prev.filter(s => s._id !== student._id));
      alert('Student deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };



  const filteredStudents = students.filter(student => {
    const search = searchTerm.trim();
  
    // make sure referenceNumber is always a string
    const referenceNumber = String(student.referenceNumber || "");
  
    const matchesSearch = referenceNumber.includes(search);
  
    const matchesWorkspace =
      selectedWorkspace === "all" || student.workspace === selectedWorkspace;
  
    return matchesSearch && matchesWorkspace;
  });
  

  if (!adminToken) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to manage students.</p>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
          <p className="text-gray-600">Manage student records and information</p>
        </div>
          <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <Upload className="h-5 w-5" />
            <span>Upload List</span>
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or reference number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Workspaces</option>
              {workspaces.map(workspace => (
                <option key={workspace} value={workspace}>{workspace}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Create/Edit Student Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> The workspace/department is automatically set to <span className="font-semibold">{departmentInfo?.name || 'Current Department'}</span> based on your admin account.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number *
                </label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace
                </label>
                <input
                  type="text"
                  value={formData.workspace}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  disabled
                  title="Automatically set to current department"
                />
                <p className="text-xs text-gray-500 mt-1">Automatically set to: {departmentInfo?.name || 'Current Department'}</p>
              </div>
            </div>
            
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : (editingStudent ? 'Update Student' : 'Create Student')}
              </button>
                      <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingStudent(null);
                  setFormData({
                    referenceNumber: '',
                    workspace: departmentInfo?.name || ''
                  });
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
                      </button>
          </div>
          </form>
        </div>
      )}

      {/* Upload Student List Form */}
      {showUploadForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Student List</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workspace
              </label>
              <input
                type="text"
                value={uploadData.workspace}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                disabled
                title="Automatically set to current department"
              />
              <p className="text-xs text-gray-500 mt-1">Automatically set to: {departmentInfo?.name || 'Current Department'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Numbers (one per line) *
              </label>
              <textarea
                value={uploadData.referenceNumbers}
                onChange={(e) => setUploadData(prev => ({ ...prev, referenceNumbers: e.target.value }))}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="REF001&#10;REF002&#10;REF003"
            required
          />
              <p className="text-sm text-gray-500 mt-1">
                Enter one reference number per line. Students will be created with these reference numbers.
              </p>
            </div>
            
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {submitting ? 'Uploading...' : 'Upload List'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm(false);
                  setUploadData({ workspace: '', referenceNumbers: '' });
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Students ({filteredStudents.length})
          </h3>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No students found.</p>
            <p className="text-sm">Try adjusting your search or create a new student.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <div key={student._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={student.image || '/default-avatar.png'}
                      alt={student.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.nickname}</p>
                      <p className="text-sm text-gray-500">Ref: {student.referenceNumber}</p>
                      <p className="text-xs text-gray-400">Workspace: {student.workspace}</p>
                      {student.quote && (
                        <p className="text-sm text-gray-700 mt-1 italic">"{student.quote}"</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="p-2 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      title="Edit student"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(student)}
                      className="p-2 text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      title="Delete student"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
        </div>
  );
};

export default UsersManagement;