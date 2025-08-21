// types/index.ts
import { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  indexNumber: string;
  name: string;
  email: string;
  joinedAt: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Event {
  imageUrl: string;
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  attendees: number;
  maxAttendees?: number;
}

export interface Album {
  id: string;
  name: string;
  description: string;
  imageCount: number;
  coverImage?: string;
  createdAt: string;
}

// // Add the Picture interface
// export interface Pictures {
//   id: string;
//   albumId: string;
//   title: string;
//   description: string;
//   tags: string[];
//   imageUrl: string;
//   uploadedBy: string;
//   uploadedAt: string;
//   likes: number;
//   views: number;
// }

export interface DepartmentInfo {
  name: string;
  description: string;
  logo?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  shareableLink: string;
}

export interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}

export interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'date' | 'time' | 'number';
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
  rows?: number;
  readOnly?: boolean;
}

export interface ButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  type?: 'button' | 'submit';
  className?: string;
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

export interface Album {
  id: string;
  name: string;
  description: string;
}

export interface Pictures {
  id: string;
  albumId: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  uploadedBy?: string;
  uploadedAt?: string;
  likes?: number;
  views?: number;
}