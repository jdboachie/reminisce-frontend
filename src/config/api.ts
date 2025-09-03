// API Configuration
export const API_CONFIG = {
  // Set this to your actual backend URL
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://reminisce-backend.onrender.com',
  // BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  
  // Set this to true to use your real backend, false to use mock APIs
  USE_REAL_BACKEND: true, // Use your real backend
  
  // Your real backend endpoints (update these with your actual endpoints)
  ENDPOINTS: {
    // Authentication endpoints
    SIGNUP: '/signup', // Admin signup endpoint
    SIGNIN: '/signin', // Admin signin endpoint
    AUTHENTICATE_STUDENT: '/student', // Your reference number authentication endpoint
    
    // Student management
    CREATE_STUDENT: '/student', // Create student record
    GET_STUDENTS: '/student', // Get all students
    GET_STUDENTS_BY_WORKSPACE: '/student', // Get students by workspace
    UPDATE_STUDENT: '/student', // Update student data
    DELETE_STUDENT: '/student', // Delete student record
    UPLOAD_STUDENT_LIST: '/student', // Upload list of student reference numbers
    
    // Department management
    CREATE_DEPARTMENT: '/department',
    LIST_DEPARTMENTS: '/department',
    GET_DEPARTMENT_BY_SLUG: '/department',
    GET_DEPARTMENT_STATISTICS: '/department',
    
    // Album management
    CREATE_ALBUM: '/album/createalbum',
    GET_ALBUMS: '/album/getalbums',
    DELETE_ALBUM: '/album/deletealbum',
    
    // Image/Photo management
    UPLOAD_IMAGE: '/image/uploadimage',
    GET_IMAGES: '/image/getimages',
    DELETE_IMAGE: '/image/deleteimage',
    
    // Events management
    CREATE_EVENT: '/events',
    GET_EVENTS: '/events',
    GET_EVENT_BY_ID: '/events',
    UPDATE_EVENT: '/events',
    DELETE_EVENT: '/events',
    GET_EVENT_STATS: '/events/stats',
    
    // Reports
    CREATE_REPORT: '/report',
    GET_REPORTS: '/report',
    GET_REPORT_BY_ID: '/report',
    CLOSE_REPORT: '/report',
  },
  
  // Mock API endpoints (removed since we're using real backend)
  MOCK_ENDPOINTS: {
    // These are no longer needed
  }
};

// Helper function to get the correct endpoint
export const getApiEndpoint = (endpointKey: keyof typeof API_CONFIG.ENDPOINTS) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpointKey]}`;
};

// Helper function to make API calls
export const apiCall = async (
  endpoint: string, 
  options: RequestInit = {}
) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  return response;
};

// Helper function to make authenticated API calls
export const authenticatedApiCall = async (
  endpoint: string,
  token: string,
  options: RequestInit = {}
) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
      ...options.headers,
    },
    ...options,
  });
  
  return response;
};
