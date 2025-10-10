# College Event Management System - REST API Documentation

## Base URL
All API requests are made to the Lovable Cloud backend.

## Authentication
All endpoints (except `/api/auth/*`) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Authentication Endpoints

### POST /auth/signup
Register a new user (student or faculty).

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "securepassword",
  "full_name": "John Doe",
  "student_id": "12345",
  "role": "student" // or "faculty"
}
```

**Response:** 201 Created
```json
{
  "user": { "id": "...", "email": "..." },
  "session": { "access_token": "...", "refresh_token": "..." }
}
```

---

### POST /auth/login
Log in an existing user.

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "securepassword"
}
```

**Response:** 200 OK
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "...",
  "user": { "id": "...", "email": "..." }
}
```

---

## User Endpoints

### GET /api/users/me
Get the current user's profile.

**Response:** 200 OK
```json
{
  "id": "uuid",
  "full_name": "John Doe",
  "email": "student@university.edu",
  "student_id": "12345",
  "role": "student",
  "qr_code_data": "STUDENT:uuid:12345:timestamp"
}
```

---

### GET /api/users/my-qr-code
Generate and return QR code for the logged-in student.

**Requirements:** Student role only

**Response:** 200 OK
```json
{
  "qr_code_data": "STUDENT:uuid:12345:timestamp",
  "student_id": "12345",
  "full_name": "John Doe"
}
```

---

## Event Endpoints

### POST /api/events
Create a new event (Faculty only).

**Request Body:**
```json
{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "event_date": "2025-03-15T10:00:00Z",
  "location": "Main Auditorium"
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "event_date": "2025-03-15T10:00:00Z",
  "location": "Main Auditorium",
  "created_by": "faculty-uuid"
}
```

---

### GET /api/events
Get all upcoming events.

**Query Parameters:**
- `upcoming` (boolean): Filter to show only future events

**Response:** 200 OK
```json
[
  {
    "id": "uuid",
    "title": "Tech Conference 2025",
    "description": "...",
    "event_date": "2025-03-15T10:00:00Z",
    "location": "Main Auditorium",
    "created_by": "uuid"
  }
]
```

---

### GET /api/events/{eventId}
Get details of a specific event.

**Response:** 200 OK
```json
{
  "id": "uuid",
  "title": "Tech Conference 2025",
  "description": "...",
  "event_date": "2025-03-15T10:00:00Z",
  "location": "Main Auditorium",
  "created_by": "uuid"
}
```

---

### PUT /api/events/{eventId}
Update an event (Faculty only - creator of the event).

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "event_date": "2025-03-16T10:00:00Z",
  "location": "New Location"
}
```

**Response:** 200 OK

---

### DELETE /api/events/{eventId}
Delete an event (Faculty only - creator of the event).

**Response:** 204 No Content

---

### POST /api/events/{eventId}/register
Register student for an event (Student only).

**Response:** 201 Created
```json
{
  "id": "uuid",
  "event_id": "uuid",
  "student_id": "uuid",
  "registered_at": "2025-01-10T14:00:00Z"
}
```

---

### GET /api/events/{eventId}/registrations
Get all students registered for an event (Faculty only).

**Response:** 200 OK
```json
[
  {
    "id": "uuid",
    "student": {
      "id": "uuid",
      "full_name": "John Doe",
      "student_id": "12345",
      "email": "student@university.edu"
    },
    "registered_at": "2025-01-10T14:00:00Z"
  }
]
```

---

## Attendance Endpoints

### POST /api/attendance/mark
Mark student attendance via QR code scan (Faculty only).

**Request Body:**
```json
{
  "qr_data": "STUDENT:uuid:12345:timestamp",
  "event_id": "uuid"
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "event_id": "uuid",
  "student_id": "uuid",
  "marked_by": "faculty-uuid",
  "marked_at": "2025-01-10T14:30:00Z"
}
```

---

### GET /api/attendance/event/{eventId}
Get all students who attended a specific event (Faculty only).

**Response:** 200 OK
```json
[
  {
    "id": "uuid",
    "student": {
      "id": "uuid",
      "full_name": "John Doe",
      "student_id": "12345"
    },
    "marked_at": "2025-01-10T14:30:00Z",
    "marked_by": "faculty-uuid"
  }
]
```

---

## Analytics Endpoints

### GET /api/analytics/student/{studentId}/attendance-percentage
Get overall attendance percentage for a student (Faculty or the student themselves).

**Response:** 200 OK
```json
{
  "student_id": "uuid",
  "total_registered": 10,
  "total_attended": 8,
  "attendance_percentage": 80.0
}
```

---

### GET /api/analytics/event/{eventId}/participation-report
Get participation summary for an event (Faculty only).

**Response:** 200 OK
```json
{
  "event_id": "uuid",
  "event_title": "Tech Conference 2025",
  "total_registered": 150,
  "total_attended": 120,
  "attendance_rate": 80.0
}
```

---

## Feedback Endpoints

### POST /api/feedback/event/{eventId}
Submit feedback for an event (Student only - must have attended).

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent event! Very informative."
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "event_id": "uuid",
  "student_id": "uuid",
  "rating": 5,
  "comment": "Excellent event! Very informative.",
  "submitted_at": "2025-01-10T16:00:00Z"
}
```

---

### GET /api/feedback/event/{eventId}
View all feedback for an event (Faculty only).

**Response:** 200 OK
```json
{
  "event_id": "uuid",
  "average_rating": 4.5,
  "total_feedback": 50,
  "feedback": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Excellent event!",
      "student_name": "John Doe",
      "submitted_at": "2025-01-10T16:00:00Z"
    }
  ]
}
```

---

## Database Schema

### Tables Created:
1. **profiles** - User profiles (students and faculty)
2. **events** - Event information
3. **event_registrations** - Student event registrations
4. **attendance** - Attendance records
5. **feedback** - Event feedback and ratings

### Row Level Security (RLS):
All tables have RLS policies enforcing:
- Students can only access/modify their own data
- Faculty can create events and view analytics
- Proper role-based access control

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "..."
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "..."
}
```

---

## Implementation Status

✅ **Completed:**
- Database schema with all tables
- Row Level Security policies
- Authentication (signup/login)
- User profiles with automatic QR generation
- All database triggers and functions

📋 **Usage:**
The backend is fully operational via Lovable Cloud. You can:
1. Use Supabase client directly in your React app for database operations
2. Create Edge Functions for complex business logic
3. Access the backend through the Lovable Cloud interface

<lov-actions>
<lov-open-backend>View Backend</lov-open-backend>
</lov-actions>
