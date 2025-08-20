// hooks/useNotification.ts
import { useState } from 'react';
import { NotificationState } from '../types';

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('Link copied to clipboard!', 'success');
  };

  return { notification, showNotification, copyToClipboard };
};