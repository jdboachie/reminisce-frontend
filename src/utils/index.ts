// utils/index.ts

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (time: string): string => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const getEventStatusColor = (status: 'upcoming' | 'ongoing' | 'completed'): string => {
  const colors = {
    upcoming: 'bg-gradient-to-r from-blue-400 to-blue-600',
    ongoing: 'bg-gradient-to-r from-green-400 to-green-600',
    completed: 'bg-gradient-to-r from-gray-400 to-gray-600'
  };
  return colors[status];
};

export const getEventStatusBadge = (status: 'upcoming' | 'ongoing' | 'completed'): string => {
  const badges = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800'
  };
  return badges[status];
};

export const getUserStatusBadge = (status: 'active' | 'inactive'): string => {
  return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateIndexNumber = (indexNumber: string): boolean => {
  // Assuming format like CS2024001
  const indexRegex = /^[A-Z]{2}\d{7}$/;
  return indexRegex.test(indexNumber);
};