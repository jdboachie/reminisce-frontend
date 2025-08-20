// components/ui/Notification.tsx
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { NotificationState } from '../../types';

interface NotificationProps {
  notification: NotificationState | null;
}

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-4 py-3 rounded-lg soft-shadow flex items-center space-x-3 ${
        notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}>
        {notification.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        <span>{notification.message}</span>
      </div>
    </div>
  );
};