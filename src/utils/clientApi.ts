// Client-side API utility functions
import { API_CONFIG } from '@/config/api';

export interface DepartmentInfo {
  _id: string;
  name: string;
  code: string;
  slug: string;
  workspace: string;
}

// Get department information from localStorage
export const getDepartmentInfo = (): DepartmentInfo | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('departmentInfo');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing department info from localStorage:', error);
    return null;
  }
};

// Client-side API call with department workspace
export const clientApiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const departmentInfo = getDepartmentInfo();
  
  if (!departmentInfo) {
    throw new Error('Department information not found. Please select a department first.');
  }
  
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Add department workspace to request body for POST/PUT/PATCH requests
  if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method)) {
    const body = options.body ? JSON.parse(options.body as string) : {};
    body.workspace = departmentInfo.workspace;
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  return response;
};

// Get events for the current department using workspace ID
export const getDepartmentEvents = async () => {
  const departmentInfo = getDepartmentInfo();
  if (!departmentInfo) throw new Error('Department information not found');
  
  // Use workspace ID in request body for filtering
  const response = await fetch(`${API_CONFIG.BASE_URL}/events/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace: departmentInfo.workspace })
  });
  return response;
};

// Get albums for the current department using workspace ID
export const getDepartmentAlbums = async () => {
  const departmentInfo = getDepartmentInfo();
  if (!departmentInfo) throw new Error('Department information not found');
  
  // Use workspace ID in request body for filtering
  const response = await fetch(`${API_CONFIG.BASE_URL}/album/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace: departmentInfo.workspace })
  });
  return response;
};

// Get students for the current department using workspace ID
export const getDepartmentStudents = async () => {
  const departmentInfo = getDepartmentInfo();
  if (!departmentInfo) throw new Error('Department information not found');
  
  // Use workspace ID in request body for filtering
  const response = await fetch(`${API_CONFIG.BASE_URL}/student/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace: departmentInfo.workspace })
  });
  return response;
};

// Create report for the current department
export const createDepartmentReport = async (reportData: {
  title: string;
  content: string;
  referenceNumber: string;
}) => {
  const departmentInfo = getDepartmentInfo();
  if (!departmentInfo) throw new Error('Department information not found');
  
  return clientApiCall('/report', {
    method: 'POST',
    body: JSON.stringify({
      ...reportData,
      departmentSlug: departmentInfo.slug
    })
  });
};

export const updateStudentProfile = async (profileData: {
  referenceNumber: string;
  name: string;
  nickname: string;
  image: string;
  phoneNumber: string;
  quote: string;
}) => {
  const departmentInfo = getDepartmentInfo();
  if (!departmentInfo) throw new Error('Department information not found');
  
  return clientApiCall('/student/update-profile', {
    method: 'PUT',
    body: JSON.stringify({
      ...profileData,
      departmentSlug: departmentInfo.slug
    })
  });
};
