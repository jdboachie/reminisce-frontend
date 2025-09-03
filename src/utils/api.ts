import { 
  authenticatedApiCall, 
  getApiEndpoint, 
  API_CONFIG 
} from '../config/api';
import { 
  CreateDepartmentPayload, 
  CreateStudentPayload, 
  UpdateStudentPayload,
  CreateImagePayload,
  CreateReportPayload,
  CreateAlbumPayload,
  CreateEventPayload,
  UpdateEventPayload,
  DepartmentInfo,
  Student,
  Image,
  Report,
  Album,
  Event,
  EventStats,
  DepartmentStatistics,
  UploadStudentListResponse
} from '../types';

// Department API functions
export const departmentAPI = {
  async createDepartment(payload: CreateDepartmentPayload, token: string): Promise<DepartmentInfo> {
    const response = await authenticatedApiCall(
      API_CONFIG.ENDPOINTS.CREATE_DEPARTMENT,
      token,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create department: ${response.statusText}`);
    }

    return response.json();
  },

  async listDepartments(): Promise<DepartmentInfo[]> {
    const response = await fetch(getApiEndpoint('LIST_DEPARTMENTS'));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.statusText}`);
    }

    return response.json();
  },

  async getDepartmentBySlug(slug: string): Promise<DepartmentInfo> {
    const response = await fetch(`${getApiEndpoint('GET_DEPARTMENT_BY_SLUG')}/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch department: ${response.statusText}`);
    }

    return response.json();
  },

  async getDepartmentStatistics(slug: string, token: string): Promise<DepartmentStatistics> {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_DEPARTMENT_STATISTICS}/${slug}/statistics`;
    const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    console.log('🔍 Debugging department statistics API call:');
    console.log('  - API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
    console.log('  - API_CONFIG.ENDPOINTS.GET_DEPARTMENT_STATISTICS:', API_CONFIG.ENDPOINTS.GET_DEPARTMENT_STATISTICS);
    console.log('  - Endpoint:', endpoint);
    console.log('  - Full URL:', fullUrl);
    console.log('  - Slug:', slug);
    console.log('  - Token exists:', !!token);
    console.log('  - Token length:', token?.length);
    console.log('  - Token preview:', token ? `${token.substring(0, 20)}...` : 'None');
    
    const response = await authenticatedApiCall(
      endpoint,
      token,
      {
        method: 'GET',
      }
    );

    console.log('  - Response status:', response.status);
    console.log('  - Response ok:', response.ok);
    console.log('  - Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`Failed to fetch department statistics: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Department statistics received:', data);
    return data;
  },
};

// Student API functions
export const studentAPI = {
  async createStudent(payload: CreateStudentPayload, token: string): Promise<Student> {
    const response = await authenticatedApiCall(
      API_CONFIG.ENDPOINTS.CREATE_STUDENT,
      token,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create student: ${response.statusText}`);
    }

    return response.json();
  },

  async getAllStudents(): Promise<Student[]> {
    const response = await fetch(getApiEndpoint('GET_STUDENTS'));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.statusText}`);
    }

    return response.json();
  },

  async getStudentsByWorkspace(workspace: string): Promise<Student[]> {
    const response = await fetch(`${getApiEndpoint('GET_STUDENTS_BY_WORKSPACE')}/${workspace}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.statusText}`);
    }

    return response.json();
  },

  async updateStudent(payload: UpdateStudentPayload): Promise<Student> {
    const response = await fetch(getApiEndpoint('UPDATE_STUDENT'), {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update student: ${response.statusText}`);
    }

    return response.json();
  },

  async deleteStudent(referenceNumber: string, token: string): Promise<void> {
    const response = await authenticatedApiCall(
      API_CONFIG.ENDPOINTS.DELETE_STUDENT,
      token,
      {
        method: 'DELETE',
        body: JSON.stringify({ referenceNumber }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete student: ${response.statusText}`);
    }
  },

  async uploadStudentList(workspace: string, referenceNumbers: string[], token: string): Promise<UploadStudentListResponse> {
    const response = await authenticatedApiCall(
      `${API_CONFIG.ENDPOINTS.UPLOAD_STUDENT_LIST}/${workspace}`,
      token,
      {
        method: 'POST',
        body: JSON.stringify({ referenceNumbers }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload student list: ${response.statusText}`);
    }

    return response.json();
  },
};

// Album API functions
export const albumAPI = {
  async createAlbum(payload: CreateAlbumPayload, token: string): Promise<Album> {
    const response = await authenticatedApiCall(
      API_CONFIG.ENDPOINTS.CREATE_ALBUM,
      token,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create album: ${response.statusText}`);
    }

    return response.json();
  },

  async getAlbums(workspaceName: string): Promise<Album[]> {
    const response = await fetch(`${getApiEndpoint('GET_ALBUMS')}/${workspaceName}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch albums: ${response.statusText}`);
    }

    return response.json();
  },

  async deleteAlbum(albumId: string, token: string): Promise<void> {
    const response = await authenticatedApiCall(
      `${API_CONFIG.ENDPOINTS.DELETE_ALBUM}/${albumId}`,
      token,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete album: ${response.statusText}`);
    }
  },
};

// Event API functions
export const eventAPI = {
  async createEvent(payload: CreateEventPayload, token: string): Promise<Event> {
    const response = await authenticatedApiCall(
      API_CONFIG.ENDPOINTS.CREATE_EVENT,
      token,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    return response.json();
  },

  async getAllEvents(token: string): Promise<Event[]> {
    const response = await authenticatedApiCall(
      API_CONFIG.ENDPOINTS.GET_EVENTS,
      token
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return response.json();
  },

  async getEventById(eventId: string, token: string): Promise<Event> {
    const response = await authenticatedApiCall(
      `${API_CONFIG.ENDPOINTS.GET_EVENT_BY_ID}/${eventId}`,
      token
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    return response.json();
  },

  async updateEvent(eventId: string, payload: UpdateEventPayload, token: string): Promise<Event> {
    const response = await authenticatedApiCall(
      `${API_CONFIG.ENDPOINTS.UPDATE_EVENT}/${eventId}`,
      token,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update event: ${response.statusText}`);
    }

    return response.json();
  },

  async deleteEvent(eventId: string, token: string): Promise<void> {
    const response = await authenticatedApiCall(
      `${API_CONFIG.ENDPOINTS.DELETE_EVENT}/${eventId}`,
      token,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  },

  async getEventStats(token: string): Promise<EventStats> {
    const response = await authenticatedApiCall(
      API_CONFIG.ENDPOINTS.GET_EVENT_STATS,
      token
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch event stats: ${response.statusText}`);
    }

    return response.json();
  },
};

// Image API functions
export const imageAPI = {
  async uploadImage(payload: CreateImagePayload): Promise<Image> {
    const response = await fetch(getApiEndpoint('UPLOAD_IMAGE'), {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    return response.json();
  },

  async getImages(albumName: string): Promise<Image[]> {
    const response = await fetch(`${getApiEndpoint('GET_IMAGES')}/${albumName}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }

    return response.json();
  },

  async deleteImage(imageId: string): Promise<void> {
    const response = await fetch(`${getApiEndpoint('DELETE_IMAGE')}/${imageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete image: ${response.statusText}`);
    }
  },
};

// Report API functions
export const reportAPI = {
  async createReport(payload: CreateReportPayload): Promise<Report> {
    const response = await fetch(getApiEndpoint('CREATE_REPORT'), {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to create report: ${response.statusText}`);
    }

    return response.json();
  },

  async getReports(token: string): Promise<Report[]> {
    const response = await authenticatedApiCall(
      API_CONFIG.ENDPOINTS.GET_REPORTS,
      token
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reports: ${response.statusText}`);
    }

    return response.json();
  },

  async getReportById(reportId: string, token: string): Promise<Report> {
    const response = await authenticatedApiCall(
      `${API_CONFIG.ENDPOINTS.GET_REPORT_BY_ID}/${reportId}`,
      token
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch report: ${response.statusText}`);
    }

    return response.json();
  },

  async closeReport(reportId: string, token: string): Promise<void> {
    const response = await authenticatedApiCall(
      `${API_CONFIG.ENDPOINTS.CLOSE_REPORT}/${reportId}/close`,
      token,
      {
        method: 'PATCH',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to close report: ${response.statusText}`);
    }
  },
};

// Authentication API functions
export const authAPI = {
  async signup(username: string, password: string, departmentName?: string, departmentCode?: string): Promise<{ msg: string; username: string; departmentSlug: string; departmentName: string }> {
    console.log('Attempting signup with:', { username, password, departmentName, departmentCode });
    
    const payload: any = { username, password };
    if (departmentName && departmentCode) {
      payload.departmentName = departmentName;
      payload.departmentCode = departmentCode;
    }
    
    console.log('Signup payload:', payload);
    console.log('Signup endpoint:', getApiEndpoint('SIGNUP'));
    
    const response = await fetch(getApiEndpoint('SIGNUP'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Signup response status:', response.status);
    console.log('Signup response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Signup error response:', errorText);
      throw new Error(errorText || 'Signup failed');
    }

    const result = await response.json();
    console.log('Signup success:', result);
    return result;
  },

  async signin(username: string, password: string): Promise<{ token: string; user: any }> {
    console.log('Attempting signin with:', { username, password });
    
    const response = await fetch(getApiEndpoint('SIGNIN'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log('Signin response status:', response.status);
    console.log('Signin response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Signin error response:', errorText);
      throw new Error(errorText || 'Login failed');
    }

    const result = await response.json();
    console.log('Signin success:', result);
    return result;
  },

  async authenticateStudent(referenceNumber: string): Promise<Student> {
    const response = await fetch(getApiEndpoint('AUTHENTICATE_STUDENT'), {
      method: 'POST',
      body: JSON.stringify({ referenceNumber }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Authentication failed');
    }

    return response.json();
  },
};
