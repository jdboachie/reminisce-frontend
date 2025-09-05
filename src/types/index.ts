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

// Event type supports both backend schema and frontend mock fields
export interface Event {
  // Backend fields
  _id?: string;
  venue?: string;
  eventDate?: string; // backend date field
  createdBy?: string;
  departmentId?: string;
  createdAt?: string;
  updatedAt?: string;
  // Frontend/mock fields
  id?: string;
  date?: string;      // mock date
  time?: string;
  location?: string;
  attendees?: number;
  maxAttendees?: number;
  imageUrl?: string;
  // Shared
  title: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
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

// Album type broadened to support both mock/frontend shape (id, name, etc.) and backend shape (_id, albumName, etc.)
export interface Album {
  // Backend fields
  _id?: string;
  albumName?: string;
  workspaceName?: string;
  departmentId?: string;
  isActive?: boolean;
  updatedAt?: Date | string;
  // Frontend/mock fields
  id?: string;
  name?: string;
  description?: string;
  imageCount?: number;
  // Shared / optional fields
  coverImage?: string;
  createdAt: Date | string;
}

// Pictures (photo) entity used by gallery/album components (mock/local state)
export interface Pictures {
  id: string;
  albumId: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  uploadedBy: string;
  uploadedAt: string; // formatted date string
  likes: number;
  views: number;
}

export interface CreateAlbumPayload {
  albumName: string;
  coverImage?: string;
}

export interface DepartmentInfo {
  // Backend identifiers
  _id?: string;
  id?: string; // lightweight variant id
  // Core fields
  name: string;
  code: string;
  slug: string;
  // Optional administrative/meta fields
  adminId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  description?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  shareableLink?: string;
  workspace?: string;
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
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentPayload {
  referenceNumber: string;
  workspace: string;
}

export interface UpdateStudentPayload {
  name?: string;
  nickname?: string;
  image?: string;
  phoneNumber?: string;
  quote?: string;
  workspace?: string;
  departmentId?: string;
}

export interface Image {
  _id: string;
  albumName: string;
  pictureURL: string;
  uploadedBy: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateImagePayload {
  albumName: string;
  pictureURL: string;
  uploadedBy: string;
}

export interface Report {
  _id: string;
  title: string;
  content: string;
  departmentId: string;
  studentName: string;
  studentEmail: string;
  referenceNumber: string;
  workspaceName?: string; // Added to satisfy UI usage
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportPayload {
  title: string;
  content: string;
  referenceNumber: string;
  departmentId: string;
}

export interface CreateDepartmentPayload {
  name: string;
  code: string;
}

// (Removed duplicate DepartmentInfo declaration; merged into single interface above)

export interface SignupResponse {
  msg: string;
  token: string;
  tokenType: string;
  username: string;
  departmentId: string;
  departmentCode: string;
  departmentSlug: string;
  departmentName: string;
  department: DepartmentInfo;
}

export interface SigninResponse {
  token: string;
  tokenType: string;
  user: {
    username: string;
    departmentId: string;
  };
  department: DepartmentInfo;
}

export interface UploadStudentListResponse {
  msg: string;
  unaddedReferenceNumbers: string[];
  alredyAddedReferenceNumbers: string[];
}

export interface EventStats {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  cancelled: number;
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
  type?: 'text' | 'email' | 'tel' | 'date' | 'time' | 'datetime-local' | 'number';
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
  rows?: number;
  readOnly?: boolean;
}

export interface ButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
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