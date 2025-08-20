// components/ui/index.ts
import React from 'react';
import { X } from 'lucide-react';
import { ModalProps, StatCardProps, FormFieldProps, ButtonProps } from '../../types';

// Modal Component
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl p-6 ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// StatCard Component
export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl p-6 soft-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// FormField Component
export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder, 
  required = false,
  isTextarea = false,
  rows = 4,
  readOnly = false
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label} {required && '*'}
    </label>
    {isTextarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 ${
          readOnly ? 'bg-slate-50 text-slate-600' : ''
        }`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 ${
          readOnly ? 'bg-slate-50 text-slate-600' : ''
        }`}
      />
    )}
  </div>
);

// Button Component
export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  variant = 'primary', 
  children, 
  type = 'button', 
  className = '' 
}) => {
  const baseClasses = "px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2";
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
    secondary: "text-slate-600 border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Export the Notification component from its own file
export { Notification } from './Notification';