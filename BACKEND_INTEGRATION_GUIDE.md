# 🔗 Connect to Your Real Backend

This guide will help you connect your Reminisce frontend to your existing backend that you use with your "create student record" Postman collection.

## 📋 Overview

Your frontend is now configured to work with both:
- **Mock APIs** (for development/testing)
- **Your Real Backend** (for production)

## 🚀 Quick Setup

### Step 1: Create Environment File
Create a `.env.local` file in your project root:

```bash
# Copy the example file
cp env.example .env.local
```

### Step 2: Configure Your Backend URL
Edit `.env.local` and set your backend URL:

```env
# Your backend URL (update this with your actual backend URL)
NEXT_PUBLIC_API_BASE_URL=https://reminisce-backend.onrender.com

# Set to true to use your real backend
NEXT_PUBLIC_USE_REAL_BACKEND=true
```

### Step 3: Update API Endpoints
Edit `src/config/api.ts` and update the endpoints to match your backend:

```typescript
ENDPOINTS: {
  // Update these paths to match your backend endpoints
  AUTHENTICATE_STUDENT: '/student', // Your student authentication endpoint
  GET_PROFILES: '/api/profiles', // Your get profiles endpoint
  UPLOAD_PROFILE: '/api/profiles/upload', // Your upload profile endpoint
  CREATE_STUDENT: '/api/students/create', // Your "create student record" endpoint
  GET_STUDENTS: '/api/students', // Get all students
}
```

## 🔧 Backend Requirements

Your backend needs these endpoints:

### 1. Student Authentication
**Endpoint:** `POST /student` (your specific endpoint)

**Request:**
```json
{
  "studentId": "2024001"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "student": {
      "id": "STU001",
      "studentId": "2024001",
      "name": "John Doe",
      "email": "john.doe@university.edu",
      "major": "Computer Science",
      "year": "2024"
    }
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid student ID. Please check your credentials."
}
```

### 2. Get All Profiles
**Endpoint:** `GET /api/profiles` (or your path)

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "profiles": [
      {
        "id": "PROF001",
        "studentId": "2024001",
        "name": "John Doe",
        "email": "john.doe@university.edu",
        "phone": "+1 (555) 123-4567",
        "location": "New York, NY",
        "major": "Computer Science",
        "year": "2024",
        "role": "Student",
        "quote": "Learning is a journey, not a destination.",
        "avatar": "https://example.com/avatar.jpg"
      }
    ]
  }
}
```

### 3. Upload Profile
**Endpoint:** `POST /api/profiles/upload` (or your path)

**Request:**
```json
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

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "profile": {
      "id": "PROF001",
      "studentId": "2024001",
      "name": "John Doe",
      // ... other profile data
    }
  }
}
```

## 🔄 Integration with Your "Create Student Record" Collection

### Understanding the Flow
1. **Admin creates student records** using your Postman collection
2. **Students authenticate** using their student ID
3. **Students upload profiles** if authentication succeeds
4. **Profiles are displayed** to all users

### Connecting Your Collection
Your "create student record" collection should:
1. **Add student IDs** to your database
2. **Make them available** for authentication
3. **Store student information** (name, email, etc.)

### Example Integration
If your "create student record" endpoint is `POST /api/students`, update the config:

```typescript
ENDPOINTS: {
  CREATE_STUDENT: '/api/students', // Your create student record endpoint
  AUTHENTICATE_STUDENT: '/student', // Your student verification endpoint
  // ... other endpoints
}
```

## 🧪 Testing the Integration

### Step 1: Test Your Backend
First, test your backend endpoints in Postman:

```bash
# Test authentication
POST https://reminisce-backend.onrender.com/student
{
  "studentId": "2024001"
}

# Test profile upload
POST https://reminisce-backend.onrender.com/api/profiles/upload
{
  "studentId": "2024001",
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "major": "Computer Science",
  "year": "2024",
  "quote": "Learning is a journey"
}
```

### Step 2: Test Frontend Integration
1. **Start your backend server**
2. **Start the frontend:** `npm run dev`
3. **Go to Profiles page**
4. **Try authenticating** with a student ID from your database

### Step 3: Monitor Network Requests
Open browser DevTools → Network tab to see:
- API calls to your backend
- Request/response data
- Any errors

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors
**Error:** `Access to fetch at 'https://reminisce-backend.onrender.com' from origin 'https://reminisce-backend.onrender.com' has been blocked by CORS policy`

**Solution:** Configure CORS in your backend:
```javascript
// Express.js example
app.use(cors({
  origin: 'https://reminisce-backend.onrender.com',
  credentials: true
}));
```

### Issue 2: Wrong Endpoint Paths
**Error:** `404 Not Found`

**Solution:** Update the endpoint paths in `src/config/api.ts` to match your backend.

### Issue 3: Response Format Mismatch
**Error:** Frontend shows "Authentication failed"

**Solution:** Ensure your backend returns the expected response format:
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": { ... }
}
```

### Issue 4: Student ID Not Found
**Error:** "Invalid student ID"

**Solution:** 
1. Check if the student ID exists in your database
2. Use your "create student record" collection to add the student
3. Verify the authentication endpoint is working

## 🔄 Switching Between Mock and Real Backend

### Use Mock APIs (Development)
```env
NEXT_PUBLIC_USE_REAL_BACKEND=false
```

### Use Real Backend (Production)
```env
NEXT_PUBLIC_USE_REAL_BACKEND=true
NEXT_PUBLIC_API_BASE_URL=https://reminisce-backend.onrender.com
```

## 📊 API Response Format Requirements

Your backend must return responses in this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## 🎯 Next Steps

1. **Update your backend endpoints** to match the expected format
2. **Test authentication** with existing student IDs
3. **Test profile upload** functionality
4. **Deploy your backend** and update the URL
5. **Test the complete flow** end-to-end

## 📞 Support

If you encounter issues:
1. **Check browser console** for JavaScript errors
2. **Check Network tab** for API call failures
3. **Verify your backend** is running and accessible
4. **Test endpoints** directly in Postman first
5. **Check response formats** match the expected structure

## 🔗 Example Backend Integration

Here's what your backend endpoints should look like:

### Authentication Endpoint
```javascript
// POST /student
app.post('/student', async (req, res) => {
  const { studentId } = req.body;
  
  // Check if student exists in database
  const student = await db.students.findOne({ studentId });
  
  if (!student) {
    return res.status(401).json({
      error: 'Invalid student ID. Please check your credentials.'
    });
  }
  
  res.json({
    success: true,
    message: 'Authentication successful',
    data: { student }
  });
});
```

### Profile Upload Endpoint
```javascript
// POST /api/profiles/upload
app.post('/api/profiles/upload', async (req, res) => {
  const profileData = req.body;
  
  // Save profile to database
  const profile = await db.profiles.create(profileData);
  
  res.json({
    success: true,
    message: 'Profile created successfully',
    data: { profile }
  });
});
```
