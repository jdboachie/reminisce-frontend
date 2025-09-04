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
  
  if (!departmentInfo) {
    throw new Error('Department information not found');
  }
  
  if (!departmentInfo.workspace) {
    throw new Error('Department workspace not found');
  }
  
  
  
  // Use workspace ID in request body for filtering
  const response = await fetch(`${API_CONFIG.BASE_URL}/student/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace: departmentInfo.workspace })
  });
  
  
  if (!response.ok) {
    const errorText = await response.text();
  }
  
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
  
  return clientApiCall('/report/public', {
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

// Save department information to localStorage
export const saveDepartmentInfo = (departmentInfo: DepartmentInfo): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('departmentInfo', JSON.stringify(departmentInfo));
  } catch (error) {
  }
};

// Fetch department information by slug from the backend
export const fetchDepartmentBySlug = async (slug: string): Promise<DepartmentInfo | null> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/department/${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      console.error('Failed to fetch department by slug:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('Department data fetched:', data);
    
    // The backend returns the department object directly, not wrapped in success/data
    if (data && data._id && data.slug) {
      // Add the workspace field (use _id as workspace)
      const departmentInfo: DepartmentInfo = {
        _id: data._id,
        name: data.name,
        code: data.code,
        slug: data.slug,
        workspace: data._id // Use department ID as workspace
      };
      return departmentInfo;
    } else {
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Ensure department information is available, fetch if missing
export const ensureDepartmentInfo = async (slug?: string): Promise<DepartmentInfo | null> => {
  
  // First, try to get from localStorage
  let departmentInfo = getDepartmentInfo();
  
  if (departmentInfo && slug) {
    if (departmentInfo.slug === slug) {
      if (departmentInfo.workspace) {
        return departmentInfo;
      } else {
        localStorage.removeItem('departmentInfo');
        departmentInfo = null;
      }
    } else {
      localStorage.removeItem('departmentInfo');
      departmentInfo = null;
    }
  } else if (departmentInfo && !slug) {
    if (departmentInfo.workspace) {
      return departmentInfo;
    } else {
      localStorage.removeItem('departmentInfo');
      departmentInfo = null;
    }
  }
  
  if (slug) {
    departmentInfo = await fetchDepartmentBySlug(slug);
    
    if (departmentInfo) {
      // Save to localStorage for future use
      saveDepartmentInfo(departmentInfo);
      return departmentInfo;
    } else {
    }
  }
  
  return null;
};
