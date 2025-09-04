# 🔗 Frontend-Backend Integration Guide

This guide explains how the Reminisce frontend communicates with the backend API and how to test it with Postman.

## 📋 Overview

The application now has a complete frontend-backend integration where:
- Students authenticate using their student ID
- Only authenticated students can upload profiles
- All profile data is stored and retrieved from the backend
- The system validates student IDs against a database

## 🚀 API Endpoints

### 1. Student Authentication
- **POST** `/api/auth/student` - Authenticate student with ID
- **GET** `/api/auth/student` - Get API information

### 2. Profile Management
- **GET** `/api/profiles` - Get all student profiles
- **POST** `/api/profiles` - Get API information

### 3. Profile Upload
- **POST** `/api/profile/upload` - Upload/update student profile
- **GET** `/api/profile/upload` - Get API information

## 🧪 Testing with Postman

### Step 1: Import the Collection
1. Open Postman
2. Click "Import" button
3. Select the `postman_collection.json` file
4. The collection will be imported with all endpoints

### Step 2: Set Environment Variables
1. Create a new environment in Postman
2. Add variable: `baseUrl` = `https://reminisce-backend.onrender.com`
3. Select this environment for your requests

### Step 3: Test Authentication
1. **Test Valid Student ID:**
   ```json
   POST {{baseUrl}}/api/auth/student
   {
     "studentId": "2024001"
   }
   ```
   Expected: `200 OK` with student data

2. **Test Invalid Student ID:**
   ```json
   POST {{baseUrl}}/api/auth/student
   {
     "studentId": "9999999"
   }
   ```
   Expected: `401 Unauthorized`

### Step 4: Test Profile Upload
1. **Upload Profile:**
   ```json
   POST {{baseUrl}}/api/profile/upload
   {
     "studentId": "2024001",
     "name": "John Doe",
     "email": "john.doe@university.edu",
     "phone": "+1 (555) 123-4567",
     "location": "New York, NY",
     "major": "Computer Science",
     "year": "2024",
     "role": "Student",
     "quote": "Learning is a journey, not a destination.",
     "avatar": "data:image/jpeg;base64,..."
   }
   ```

### Step 5: Test Profile Retrieval
1. **Get All Profiles:**
   ```
   GET {{baseUrl}}/api/profiles
   ```

2. **Search Profiles:**
   ```
   GET {{baseUrl}}/api/profiles?search=computer
   ```

3. **Paginated Results:**
   ```
   GET {{baseUrl}}/api/profiles?limit=5&offset=0
   ```

## 🔐 Valid Student IDs for Testing

The following student IDs are valid in the mock database:
- `2024001` - John Doe
- `2024002` - Jane Smith  
- `2024003` - Mike Johnson

## 🔄 Frontend Integration Flow

### 1. Authentication Flow
```
User enters Student ID → Frontend calls /api/auth/student → 
Backend validates ID → Returns success/error → 
Frontend shows profile upload or error message
```

### 2. Profile Upload Flow
```
User fills profile form → Frontend calls /api/profile/upload → 
Backend saves profile → Returns success → 
Frontend shows success message → Refreshes profile list
```

### 3. Profile Display Flow
```
Page loads → Frontend calls /api/profiles → 
Backend returns profiles → Frontend displays profiles
```

## 🛠️ Backend Configuration

### Mock Database
The backend currently uses a mock database with these students:
```javascript
const mockStudents = [
  {
    id: 'STU001',
    studentId: '2024001',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    major: 'Computer Science',
    year: '2024',
    department: 'Computer Science'
  },
  // ... more students
];
```

### To Connect to Your Real Database
1. Replace the mock data in `/api/auth/student/route.ts`
2. Update the authentication logic to query your database
3. Modify the profile storage in `/api/profile/upload/route.ts`
4. Update the profile retrieval in `/api/profiles/route.ts`

## 🚨 Error Handling

The frontend handles these error scenarios:
- **Network errors** - Shows "Network error" message
- **Invalid student ID** - Shows "Invalid student ID" message
- **Missing required fields** - Shows validation errors
- **Server errors** - Shows "Internal server error" message

## 📱 Frontend Components Updated

1. **StudentAuth** - Now calls `/api/auth/student`
2. **ProfileUpload** - Now calls `/api/profile/upload`
3. **ProfilesPage** - Now calls `/api/profiles` for data

## 🔧 Development Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the API endpoints:**
   - Use Postman with the provided collection
   - Or use curl commands

3. **Monitor API calls:**
   - Check browser Network tab
   - Check server console logs

## 📊 API Response Format

All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "error": "Error message"
}
```

## 🎯 Next Steps

1. **Replace mock data** with your real database
2. **Add JWT authentication** for secure sessions
3. **Implement file upload** for profile images
4. **Add rate limiting** to prevent abuse
5. **Add logging** for debugging and monitoring

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify the API endpoints are working in Postman
3. Ensure the development server is running
4. Check that the student IDs exist in your database
