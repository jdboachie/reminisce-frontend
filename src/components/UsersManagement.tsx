// components/UsersManagement.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Upload, Search, Filter, Trash2 } from 'lucide-react';
import { Button, Modal, FormField } from './ui';
import { useAppState } from '../hooks/useAppState';
import { useNotification } from '../hooks/useNotification';
import { User } from '../types';

export const UsersManagement: React.FC = () => {
  const { users, setUsers } = useAppState();
  const { showNotification } = useNotification();
  
  const [modals, setModals] = useState({
    user: false,
    bulkUpload: false
  });

  const [forms, setForms] = useState({
    user: { indexNumber: '', name: '', email: '' },
    bulkUsers: ''
  });

  const generateId = () => Date.now().toString() + Math.random();

  const openModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  const updateForm = (
    formName: 'user' | 'bulkUsers', 
    field: string, 
    value: string
  ) => {
    if (formName === 'user') {
      setForms(prev => ({
        ...prev,
        user: { ...prev.user, [field]: value }
      }));
    } else if (formName === 'bulkUsers') {
      setForms(prev => ({
        ...prev,
        bulkUsers: value
      }));
    }
  };

  const resetForm = (formName: 'user' | 'bulkUsers') => {
    if (formName === 'user') {
      setForms(prev => ({ ...prev, user: { indexNumber: '', name: '', email: '' } }));
    } else if (formName === 'bulkUsers') {
      setForms(prev => ({ ...prev, bulkUsers: '' }));
    }
  };

  const addUser = () => {
    const { indexNumber, name, email } = forms.user;
    if (!indexNumber || !name || !email) {
      showNotification('Please fill all required fields', 'error');
      return;
    }
    
    const user: User = {
      id: generateId(),
      indexNumber,
      name,
      email,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    
    setUsers(prev => [...prev, user]);
    resetForm('user');
    closeModal('user');
    showNotification('User added successfully!', 'success');
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      showNotification('User deleted successfully!', 'success');
    }
  };

  const processBulkUpload = () => {
    if (!forms.bulkUsers.trim()) {
      showNotification('Please enter index numbers', 'error');
      return;
    }

    const indexNumbers = forms.bulkUsers.split('\n').filter(num => num.trim());
    const newUsers: User[] = indexNumbers.map(indexNumber => ({
      id: generateId(),
      indexNumber: indexNumber.trim(),
      name: `Student ${indexNumber.trim()}`,
      email: `${indexNumber.trim().toLowerCase()}@university.edu`,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active'
    }));

    setUsers(prev => [...prev, ...newUsers]);
    resetForm('bulkUsers');
    closeModal('bulkUpload');
    showNotification(`${newUsers.length} users added successfully!`, 'success');
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Users Management</h2>
          <div className="flex space-x-3">
            <Button onClick={() => openModal('bulkUpload')} variant="secondary">
              <Upload className="h-4 w-4" />
              <span>Bulk Upload</span>
            </Button>
            <Button onClick={() => openModal('user')}>
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl soft-shadow overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                />
              </div>
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                <Filter className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Index Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.avatar ? (
                          <Image 
                            src={user.avatar} 
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                            <span className="text-white font-medium">{user.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{user.indexNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{user.joinedAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={modals.user} onClose={() => closeModal('user')} title="Add New User">
        <div className="space-y-4">
          <FormField
            label="Index Number"
            value={forms.user.indexNumber}
            onChange={(value) => updateForm('user', 'indexNumber', value)}
            placeholder="e.g., CS2024003"
            required
          />
          <FormField
            label="Full Name"
            value={forms.user.name}
            onChange={(value) => updateForm('user', 'name', value)}
            placeholder="Enter full name"
            required
          />
          <FormField
            label="Email"
            type="email"
            value={forms.user.email}
            onChange={(value) => updateForm('user', 'email', value)}
            placeholder="user@university.edu"
            required
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={() => closeModal('user')} variant="secondary">Cancel</Button>
          <Button onClick={addUser}>Add User</Button>
        </div>
      </Modal>

      <Modal isOpen={modals.bulkUpload} onClose={() => closeModal('bulkUpload')} title="Bulk Upload Users">
        <div className="space-y-4">
          <FormField
            label="Index Numbers (one per line)"
            value={forms.bulkUsers}
            onChange={(value) => updateForm('bulkUsers', 'bulkUsers', value)}
            placeholder="CS2024003&#10;CS2024004&#10;CS2024005&#10;..."
            isTextarea
            rows={10}
          />
          <p className="text-sm text-slate-500">
            Enter index numbers, one per line. Email addresses will be auto-generated.
          </p>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={() => closeModal('bulkUpload')} variant="secondary">Cancel</Button>
          <Button onClick={processBulkUpload}>Upload Users</Button>
        </div>
      </Modal>
    </>
  );
};