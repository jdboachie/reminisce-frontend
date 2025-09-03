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
  _id: string;
  title: string;
  description: string;
  venue: string;
  eventDate: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  venue: string;
  eventDate: string;
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  venue?: string;
  eventDate?: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Album {
  _id: string;
  albumName: string;
  workspaceName: string;
  isActive: boolean;
  createdAt: Date;
}

export interface DepartmentInfo {
  _id: string;
  name: string;
  code: string;
  slug: string;
  adminId: string;
  createdAt: Date;
  description?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  shareableLink?: string;
}

export interface DepartmentStatistics {
  department: {
    name: string;
    code: string;
    slug: string;
  };
  statistics: {
    totalUsers: number;
    activeEvents: number;
    totalAlbums: number;
    totalImages: number;
  };
}

export interface Student {
  _id: string;
  name: string;
  nickname: string;
  image: string;
  referenceNumber: string;
  phoneNumber: string;
  quote: string;
  workspace: string;
  createdAt: Date;
}

export interface Image {
  _id: string;
  albumName: string;
  pictureURL: string;
  uploadedBy: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Report {
  _id: string;
  title: string;
  workspaceName: string;
  content: string;
  studentName: string;
  studentEmail: string;
  isActive: boolean;
  createdAt: Date;
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

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
}

export interface CreateDepartmentPayload {
  name: string;
  code: string;
}

export interface CreateStudentPayload {
  referenceNumber: string;
  workspace: string;
}

export interface UploadStudentListResponse {
  msg: string;
  unaddedReferenceNumbers: string[];
  alredyAddedReferenceNumbers: string[];
}

export interface UpdateStudentPayload {
  name?: string;
  nickname?: string;
  image?: string;
  phoneNumber?: string;
  quote?: string;
  workspace?: string;
}

export interface CreateImagePayload {
  albumName: string;
  pictureURL: string;
  uploadedBy: string;
}

export interface CreateReportPayload {
  title: string;
  content: string;
  workspaceName: string;
  studentName: string;
  studentEmail: string;
}

export interface CreateAlbumPayload {
  albumName: string;
  workspaceName: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  venue: string;
  eventDate: string;
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  venue?: string;
  eventDate?: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface EventStats {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  cancelled: number;
}