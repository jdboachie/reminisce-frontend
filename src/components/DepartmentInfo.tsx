// components/DepartmentInfo.tsx
import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { Button, FormField } from './ui';
import { useNotification } from '../hooks/useNotification';
import { DepartmentInfo as DepartmentInfoType } from '../types';

interface DepartmentInfoProps {
  departmentInfo: DepartmentInfoType;
  setDepartmentInfo: (info: DepartmentInfoType) => void;
  copyToClipboard: (text: string) => void;
}

export const DepartmentInfo: React.FC<DepartmentInfoProps> = ({ 
  departmentInfo, 
  setDepartmentInfo, 
  copyToClipboard 
}) => {
  const { showNotification } = useNotification();

  const handleSave = () => {
    showNotification('Department information updated!', 'success');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800">Department Information</h2>
      
      <div className="bg-white rounded-2xl soft-shadow p-6">
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Department Name"
              value={departmentInfo.name}
              onChange={(value) => setDepartmentInfo({...departmentInfo, name: value})}
            />
            <FormField
              label="Contact Email"
              type="email"
              value={departmentInfo.contactEmail}
              onChange={(value) => setDepartmentInfo({...departmentInfo, contactEmail: value})}
            />
            <FormField
              label="Contact Phone"
              type="tel"
              value={departmentInfo.contactPhone}
              onChange={(value) => setDepartmentInfo({...departmentInfo, contactPhone: value})}
            />
            <FormField
              label="Address"
              value={departmentInfo.address}
              onChange={(value) => setDepartmentInfo({...departmentInfo, address: value})}
            />
          </div>
          
          <FormField
            label="Description"
            value={departmentInfo.description}
            onChange={(value) => setDepartmentInfo({...departmentInfo, description: value})}
            isTextarea
            rows={4}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Shareable Link</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={departmentInfo.shareableLink}
                readOnly
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
              />
              <Button onClick={() => copyToClipboard(departmentInfo.shareableLink)} variant="secondary" type="button">
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </Button>
              <Button onClick={() => window.open(departmentInfo.shareableLink, '_blank')} variant="secondary" type="button">
                <ExternalLink className="h-4 w-4" />
                <span>Visit</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} type="button">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};