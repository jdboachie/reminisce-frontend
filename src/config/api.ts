// API Configuration
export const API_CONFIG = {
  // Set this to your actual backend URL
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  
  // Set this to true to use your real backend, false to use mock APIs
  USE_REAL_BACKEND: true, // Use your real backend
  
  // Your real backend endpoints (update these with your actual endpoints)
  ENDPOINTS: {
    // Authentication endpoints
    LOGIN: '/auth/login', // Admin login endpoint
    AUTHENTICATE_STUDENT: '/student', // Your reference number authentication endpoint
    
             // Profile management
         GET_PROFILES: '/student', // Get student profile
         UPLOAD_PROFILE: '/student', // Update student profile (PATCH)
    
    // Student management
    CREATE_STUDENT: '/api/students/create', // Your "create student record" endpoint
    GET_STUDENTS: '/api/students', // Get all students
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
