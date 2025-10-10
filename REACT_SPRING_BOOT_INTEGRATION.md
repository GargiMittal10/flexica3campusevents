# React Frontend Integration with Spring Boot

## Step 1: Create API Service Layer

Create a new file `src/services/api.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to attach JWT token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: {
    fullName: string;
    email: string;
    password: string;
    studentId: string;
    role: string;
  }) {
    const response = await this.api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async resetPassword(email: string) {
    return await this.api.post('/auth/reset-password', email);
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // User endpoints
  async getCurrentUser() {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  async getMyQRCode() {
    const response = await this.api.get('/users/my-qr-code');
    return response.data;
  }

  // Event endpoints
  async getAllEvents() {
    const response = await this.api.get('/events');
    return response.data;
  }

  async getEventById(id: string) {
    const response = await this.api.get(`/events/${id}`);
    return response.data;
  }

  async createEvent(data: {
    title: string;
    description: string;
    eventDate: string;
    location: string;
  }) {
    const response = await this.api.post('/events', data);
    return response.data;
  }

  async updateEvent(id: string, data: {
    title: string;
    description: string;
    eventDate: string;
    location: string;
  }) {
    const response = await this.api.put(`/events/${id}`, data);
    return response.data;
  }

  async deleteEvent(id: string) {
    await this.api.delete(`/events/${id}`);
  }

  async getUpcomingEvents() {
    const response = await this.api.get('/events/upcoming');
    return response.data;
  }

  async registerForEvent(eventId: string) {
    const response = await this.api.post(`/events/${eventId}/register`);
    return response.data;
  }

  // Attendance endpoints
  async markAttendance(data: { eventId: string; qrData: string }) {
    const response = await this.api.post('/attendance/mark', data);
    return response.data;
  }

  async getEventAttendance(eventId: string) {
    const response = await this.api.get(`/attendance/event/${eventId}`);
    return response.data;
  }

  async getStudentAttendance(studentId: string) {
    const response = await this.api.get(`/attendance/student/${studentId}`);
    return response.data;
  }

  async getMyAttendance() {
    const response = await this.api.get('/attendance/my-attendance');
    return response.data;
  }
}

export const apiService = new ApiService();
```

## Step 2: Install Axios

You need to add axios as a dependency. In Lovable, you can request this:

```bash
# The AI will add this for you
npm install axios
```

## Step 3: Environment Variables

Create a `.env` file in your project root (this will be gitignored):

```env
# For local development
VITE_API_URL=http://localhost:8080/api

# For production (after deploying Spring Boot)
# VITE_API_URL=https://your-spring-boot-app.railway.app/api
```

## Step 4: Update Login Component

Replace Supabase calls with API service:

```typescript
// Old Supabase code:
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// New Spring Boot code:
try {
  const data = await apiService.login(email, password);
  // User is automatically stored in localStorage
  navigate('/dashboard');
} catch (error: any) {
  toast({
    title: "Error",
    description: error.response?.data?.message || "Login failed",
    variant: "destructive",
  });
}
```

## Step 5: Update Signup Component

```typescript
// Old Supabase code:
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: { data: { full_name: formData.name } }
});

// New Spring Boot code:
try {
  const data = await apiService.register({
    fullName: formData.name,
    email: formData.email,
    password: formData.password,
    studentId: formData.studentId,
    role: formData.role.toUpperCase(),
  });
  navigate('/dashboard');
} catch (error: any) {
  toast({
    title: "Error",
    description: error.response?.data?.message || "Registration failed",
    variant: "destructive",
  });
}
```

## Step 6: Update Event Components

```typescript
// Fetch events - Old Supabase code:
const { data, error } = await supabase
  .from('events')
  .select('*')
  .order('event_date', { ascending: false });

// New Spring Boot code:
try {
  const events = await apiService.getAllEvents();
  setEvents(events);
} catch (error: any) {
  console.error("Error fetching events:", error);
}
```

```typescript
// Create event - Old Supabase code:
const { error } = await supabase
  .from('events')
  .insert({
    title: formData.title,
    description: formData.description,
    event_date: formData.event_date,
    location: formData.location,
    created_by: user?.id,
  });

// New Spring Boot code:
try {
  await apiService.createEvent({
    title: formData.title,
    description: formData.description,
    eventDate: formData.event_date,
    location: formData.location,
  });
  toast({ title: "Success", description: "Event created successfully" });
} catch (error: any) {
  toast({
    title: "Error",
    description: error.response?.data?.message || "Failed to create event",
    variant: "destructive",
  });
}
```

## Step 7: Authentication Check

Create a custom hook `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await apiService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return { user, loading, logout };
};
```

## Step 8: Protected Route Component

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
```

## Step 9: Update Routes

```typescript
import { ProtectedRoute } from './components/ProtectedRoute';

// In App.tsx
<Route 
  path="/student-dashboard" 
  element={
    <ProtectedRoute>
      <StudentDashboard />
    </ProtectedRoute>
  } 
/>
```

## Step 10: Testing

### 1. Start Spring Boot Backend
```bash
cd campus-events-backend
mvn spring-boot:run
```

### 2. Start React Frontend
```bash
# In Lovable, it's already running
# Just make sure VITE_API_URL is set correctly
```

### 3. Test Authentication Flow
- Try registering a new user
- Login with credentials
- Check if JWT token is stored in localStorage
- Try accessing protected routes

## Common Issues & Solutions

### CORS Errors
Make sure Spring Boot SecurityConfig has correct CORS configuration with your Lovable app URL.

### 401 Unauthorized
- Check if JWT token is being sent in Authorization header
- Verify token hasn't expired
- Check Spring Boot logs for authentication errors

### Connection Refused
- Ensure Spring Boot is running on port 8080
- Check VITE_API_URL environment variable
- For production, use your deployed Spring Boot URL

## Production Deployment Checklist

1. ✅ Deploy Spring Boot to Railway/Heroku
2. ✅ Update VITE_API_URL in Lovable environment
3. ✅ Configure CORS in Spring Boot with production URL
4. ✅ Set up PostgreSQL production database
5. ✅ Test all API endpoints
6. ✅ Deploy React app from Lovable
