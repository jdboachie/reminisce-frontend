// Error message utilities for consistent user-friendly messaging
// Never expose technical details to users

export const ErrorMessages = {
  // Generic user-friendly messages
  GENERIC_ERROR: "Oops! Something went wrong. Please try again.",
  NETWORK_ERROR: "Unable to connect. Please check your internet connection and try again.",
  AUTH_ERROR: "Authentication failed. Please log in again.",
  PERMISSION_ERROR: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested item was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Our servers are experiencing issues. Please try again later.",
  
  // Specific action errors
  UPLOAD_FAILED: "Failed to upload. Please try again.",
  SAVE_FAILED: "Failed to save changes. Please try again.",
  DELETE_FAILED: "Failed to delete item. Please try again.",
  FETCH_FAILED: "Unable to load data. Please refresh the page.",
  
  // Department/workspace errors
  DEPARTMENT_NOT_FOUND: "Department not found. Please go to the home page and select your department.",
  DEPARTMENT_LOAD_ERROR: "Unable to load department information. Please refresh the page.",
  
  // Reference number errors (generic, no technical details)
  REF_NUMBER_INVALID: "Invalid reference number. Please check and try again.",
  REF_NUMBER_NOT_FOUND: "Reference number not found in this department.",
  REF_NUMBER_VERIFICATION_FAILED: "Reference number verification failed. Please try again.",
  
  // Form validation errors
  REQUIRED_FIELDS: "Please fill in all required fields.",
  INVALID_FORMAT: "Please check the format of your input.",
  
  // Image/upload specific
  IMAGE_UPLOAD_ERROR: "Failed to upload image. Please try again.",
  IMAGE_TOO_LARGE: "Image is too large. Please choose a smaller file.",
  INVALID_IMAGE_FORMAT: "Invalid image format. Please choose a valid image file.",
  
  // Student/Profile errors
  PROFILE_UPDATE_FAILED: "Failed to update profile. Please try again.",
  STUDENT_NOT_FOUND: "Student information not found.",
  
  // Report errors
  REPORT_SUBMISSION_FAILED: "Failed to submit report. Please try again.",
  REPORT_NOT_FOUND: "Report not found.",
  
  // Event errors
  EVENT_CREATION_FAILED: "Failed to create event. Please try again.",
  EVENT_UPDATE_FAILED: "Failed to update event. Please try again.",
  EVENT_DELETE_FAILED: "Failed to delete event. Please try again.",
  
  // Album errors
  ALBUM_CREATION_FAILED: "Failed to create album. Please try again.",
  ALBUM_UPDATE_FAILED: "Failed to update album. Please try again.",
  ALBUM_DELETE_FAILED: "Failed to delete album. Please try again.",
  ALBUM_NOT_FOUND: "Album not found.",
  
  // Admin specific
  ADMIN_AUTH_FAILED: "Admin authentication failed. Please log in again.",
  ADMIN_PERMISSION_DENIED: "You don't have admin permissions for this action.",
};

// Function to get appropriate error message based on error type
export const getErrorMessage = (error: any, context?: string): string => {
  // If it's already a user-friendly message, return it
  if (typeof error === 'string' && Object.values(ErrorMessages).includes(error)) {
    return error;
  }
  
  // Log technical details for debugging (but don't show to user)
  console.error('Technical error details:', error);
  
  // Return generic error based on context
  switch (context) {
    case 'upload':
      return ErrorMessages.UPLOAD_FAILED;
    case 'save':
      return ErrorMessages.SAVE_FAILED;
    case 'delete':
      return ErrorMessages.DELETE_FAILED;
    case 'fetch':
      return ErrorMessages.FETCH_FAILED;
    case 'auth':
      return ErrorMessages.AUTH_ERROR;
    case 'department':
      return ErrorMessages.DEPARTMENT_LOAD_ERROR;
    case 'reference':
      return ErrorMessages.REF_NUMBER_VERIFICATION_FAILED;
    case 'profile':
      return ErrorMessages.PROFILE_UPDATE_FAILED;
    case 'report':
      return ErrorMessages.REPORT_SUBMISSION_FAILED;
    case 'event':
      return ErrorMessages.EVENT_CREATION_FAILED;
    case 'album':
      return ErrorMessages.ALBUM_CREATION_FAILED;
    case 'image':
      return ErrorMessages.IMAGE_UPLOAD_ERROR;
    default:
      return ErrorMessages.GENERIC_ERROR;
  }
};

// Function to sanitize error messages for display
export const sanitizeErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    // Check if it's already a user-friendly message
    if (Object.values(ErrorMessages).includes(error)) {
      return error;
    }
    
    // Check for common technical error patterns and replace with generic messages
    if (error.includes('400') || error.includes('Bad Request')) {
      return ErrorMessages.VALIDATION_ERROR;
    }
    if (error.includes('401') || error.includes('Unauthorized')) {
      return ErrorMessages.AUTH_ERROR;
    }
    if (error.includes('403') || error.includes('Forbidden')) {
      return ErrorMessages.PERMISSION_ERROR;
    }
    if (error.includes('404') || error.includes('Not Found')) {
      return ErrorMessages.NOT_FOUND;
    }
    if (error.includes('500') || error.includes('Internal Server Error')) {
      return ErrorMessages.SERVER_ERROR;
    }
    if (error.includes('Network') || error.includes('fetch')) {
      return ErrorMessages.NETWORK_ERROR;
    }
  }
  
  // Default to generic error
  return ErrorMessages.GENERIC_ERROR;
};
