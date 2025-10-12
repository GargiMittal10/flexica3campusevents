# Campus Events Management System - Postman Collection

## Base Configuration

**Base URL**: `http://localhost:9091/api`

**Headers for all requests**:
```
Content-Type: application/json
```

**Headers for authenticated requests**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register Student
**POST** `/auth/register`

**Body**:
```json
{
  "fullName": "John Doe",
  "email": "john.doe@university.edu",
  "password": "Password123!",
  "studentId": "STU001"
}
```

**Expected Response** (201 Created):
```json
{
  "id": "uuid-here",
  "fullName": "John Doe",
  "email": "john.doe@university.edu",
  "studentId": "STU001",
  "role": "STUDENT",
  "qrCodeData": "STUDENT:uuid:STU001:timestamp"
}
```

---

### 1.2 Register Faculty
**POST** `/auth/register/faculty`

**Body**:
```json
{
  "fullName": "Dr. Jane Smith",
  "email": "jane.smith@university.edu",
  "password": "Password123!",
  "studentId": "FAC001"
}
```

**Expected Response** (201 Created):
```json
{
  "id": "uuid-here",
  "fullName": "Dr. Jane Smith",
  "email": "jane.smith@university.edu",
  "studentId": "FAC001",
  "role": "FACULTY",
  "qrCodeData": null
}
```

---

### 1.3 Login
**POST** `/auth/login`

**Body**:
```json
{
  "email": "john.doe@university.edu",
  "password": "Password123!"
}
```

**Expected Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": "uuid-here",
  "email": "john.doe@university.edu",
  "role": "STUDENT"
}
```

**Save the token** - You'll need it for authenticated requests!

---

### 1.4 Get Current User Profile
**GET** `/auth/me`

**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Expected Response** (200 OK):
```json
{
  "id": "uuid-here",
  "fullName": "John Doe",
  "email": "john.doe@university.edu",
  "studentId": "STU001",
  "role": "STUDENT",
  "qrCodeData": "STUDENT:uuid:STU001:timestamp"
}
```

---

## 2. Event Endpoints

### 2.1 Get All Events
**GET** `/events`

**No authentication required**

**Expected Response** (200 OK):
```json
[
  {
    "id": "uuid-here",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "eventDate": "2025-11-15T10:00:00",
    "location": "Main Auditorium",
    "createdBy": "faculty-uuid",
    "createdAt": "2025-10-11T12:00:00"
  }
]
```

---

### 2.2 Get Upcoming Events
**GET** `/events/upcoming`

**No authentication required**

**Expected Response** (200 OK):
```json
[
  {
    "id": "uuid-here",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "eventDate": "2025-11-15T10:00:00",
    "location": "Main Auditorium",
    "createdBy": "faculty-uuid"
  }
]
```

---

### 2.3 Get Event by ID
**GET** `/events/{eventId}`

**Example**: `/events/123e4567-e89b-12d3-a456-426614174000`

**Expected Response** (200 OK):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "eventDate": "2025-11-15T10:00:00",
  "location": "Main Auditorium",
  "createdBy": "faculty-uuid",
  "createdAt": "2025-10-11T12:00:00",
  "updatedAt": "2025-10-11T12:00:00"
}
```

---

### 2.4 Create Event (Faculty Only)
**POST** `/events`

**Headers**:
```
Authorization: Bearer <faculty_jwt_token>
```

**Body**:
```json
{
  "title": "AI Workshop 2025",
  "description": "Introduction to Artificial Intelligence",
  "eventDate": "2025-12-01T14:00:00",
  "location": "Computer Lab 101"
}
```

**Expected Response** (201 Created):
```json
{
  "id": "new-uuid-here",
  "title": "AI Workshop 2025",
  "description": "Introduction to Artificial Intelligence",
  "eventDate": "2025-12-01T14:00:00",
  "location": "Computer Lab 101",
  "createdBy": "faculty-uuid",
  "createdAt": "2025-10-11T12:30:00"
}
```

---

### 2.5 Update Event (Faculty Only - Own Events)
**PUT** `/events/{eventId}`

**Headers**:
```
Authorization: Bearer <faculty_jwt_token>
```

**Body**:
```json
{
  "title": "AI Workshop 2025 - Updated",
  "description": "Advanced Introduction to Artificial Intelligence",
  "eventDate": "2025-12-01T15:00:00",
  "location": "Computer Lab 102"
}
```

**Expected Response** (200 OK):
```json
{
  "id": "event-uuid",
  "title": "AI Workshop 2025 - Updated",
  "description": "Advanced Introduction to Artificial Intelligence",
  "eventDate": "2025-12-01T15:00:00",
  "location": "Computer Lab 102",
  "createdBy": "faculty-uuid",
  "updatedAt": "2025-10-11T13:00:00"
}
```

---

### 2.6 Delete Event (Faculty Only - Own Events)
**DELETE** `/events/{eventId}`

**Headers**:
```
Authorization: Bearer <faculty_jwt_token>
```

**Expected Response** (204 No Content)

---

## 3. Event Registration Endpoints

### 3.1 Register for Event (Student Only)
**POST** `/registrations/events/{eventId}/register`

**Headers**:
```
Authorization: Bearer <student_jwt_token>
```

**Expected Response** (201 Created):
```json
{
  "id": "registration-uuid",
  "eventId": "event-uuid",
  "studentId": "student-uuid",
  "registeredAt": "2025-10-11T14:00:00"
}
```

---

### 3.2 Get My Registered Events (Student Only)
**GET** `/registrations/my-events`

**Headers**:
```
Authorization: Bearer <student_jwt_token>
```

**Expected Response** (200 OK):
```json
[
  {
    "id": "event-uuid-1",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "eventDate": "2025-11-15T10:00:00",
    "location": "Main Auditorium",
    "registeredAt": "2025-10-11T14:00:00"
  },
  {
    "id": "event-uuid-2",
    "title": "AI Workshop 2025",
    "eventDate": "2025-12-01T14:00:00",
    "location": "Computer Lab 101",
    "registeredAt": "2025-10-12T09:00:00"
  }
]
```

---

### 3.3 Get Event Registrations (Faculty Only)
**GET** `/registrations/events/{eventId}/registrations`

**Headers**:
```
Authorization: Bearer <faculty_jwt_token>
```

**Expected Response** (200 OK):
```json
[
  {
    "id": "student-uuid-1",
    "fullName": "John Doe",
    "email": "john.doe@university.edu",
    "studentId": "STU001",
    "registeredAt": "2025-10-11T14:00:00"
  },
  {
    "id": "student-uuid-2",
    "fullName": "Jane Smith",
    "email": "jane.smith@university.edu",
    "studentId": "STU002",
    "registeredAt": "2025-10-11T15:00:00"
  }
]
```

---

## 4. Attendance Endpoints

### 4.1 Mark Attendance (Faculty Only)
**POST** `/attendance/mark`

**Headers**:
```
Authorization: Bearer <faculty_jwt_token>
```

**Body**:
```json
{
  "eventId": "event-uuid",
  "qrData": "STUDENT:student-uuid:STU001:1697123456"
}
```

**Expected Response** (201 Created):
```json
{
  "id": "attendance-uuid",
  "eventId": "event-uuid",
  "studentId": "student-uuid",
  "qrData": "STUDENT:student-uuid:STU001:1697123456",
  "markedAt": "2025-10-11T16:00:00",
  "markedBy": "faculty-uuid"
}
```

---

### 4.2 Get Event Attendance (Faculty Only)
**GET** `/attendance/events/{eventId}`

**Headers**:
```
Authorization: Bearer <faculty_jwt_token>
```

**Expected Response** (200 OK):
```json
[
  {
    "studentId": "student-uuid-1",
    "fullName": "John Doe",
    "studentId": "STU001",
    "markedAt": "2025-10-11T16:00:00"
  },
  {
    "studentId": "student-uuid-2",
    "fullName": "Jane Smith",
    "studentId": "STU002",
    "markedAt": "2025-10-11T16:05:00"
  }
]
```

---

### 4.3 Get My Attendance (Student Only)
**GET** `/attendance/my-attendance`

**Headers**:
```
Authorization: Bearer <student_jwt_token>
```

**Expected Response** (200 OK):
```json
[
  {
    "eventId": "event-uuid-1",
    "eventTitle": "Tech Conference 2025",
    "markedAt": "2025-10-11T16:00:00"
  },
  {
    "eventId": "event-uuid-2",
    "eventTitle": "AI Workshop 2025",
    "markedAt": "2025-11-01T14:30:00"
  }
]
```

---

### 4.4 Get Student Attendance Stats (Student Only)
**GET** `/attendance/students/{studentId}/stats`

**Headers**:
```
Authorization: Bearer <student_jwt_token>
```

**Expected Response** (200 OK):
```json
{
  "totalEventsRegistered": 10,
  "totalEventsAttended": 8,
  "attendancePercentage": 80.0,
  "recentAttendance": [
    {
      "eventTitle": "Tech Conference 2025",
      "eventDate": "2025-11-15T10:00:00",
      "markedAt": "2025-11-15T10:05:00"
    }
  ]
}
```

---

## 5. Feedback Endpoints

### 5.1 Submit Feedback (Student Only)
**POST** `/feedback`

**Headers**:
```
Authorization: Bearer <student_jwt_token>
```

**Body**:
```json
{
  "eventId": "event-uuid",
  "rating": 5,
  "comment": "Excellent event! Very informative."
}
```

**Expected Response** (201 Created):
```json
{
  "id": "feedback-uuid",
  "eventId": "event-uuid",
  "studentId": "student-uuid",
  "rating": 5,
  "comment": "Excellent event! Very informative.",
  "submittedAt": "2025-10-11T17:00:00"
}
```

---

### 5.2 Get Event Feedback (Faculty Only)
**GET** `/feedback/events/{eventId}`

**Headers**:
```
Authorization: Bearer <faculty_jwt_token>
```

**Expected Response** (200 OK):
```json
[
  {
    "id": "feedback-uuid-1",
    "studentId": "student-uuid-1",
    "rating": 5,
    "comment": "Excellent event!",
    "submittedAt": "2025-10-11T17:00:00"
  },
  {
    "id": "feedback-uuid-2",
    "studentId": "student-uuid-2",
    "rating": 4,
    "comment": "Very good, but could be longer.",
    "submittedAt": "2025-10-11T17:15:00"
  }
]
```

---

### 5.3 Get Event Feedback Summary (Faculty Only)
**GET** `/feedback/events/{eventId}/summary`

**Headers**:
```
Authorization: Bearer <faculty_jwt_token>
```

**Expected Response** (200 OK):
```json
{
  "eventId": "event-uuid",
  "eventTitle": "Tech Conference 2025",
  "totalFeedback": 25,
  "averageRating": 4.5,
  "ratingDistribution": {
    "1": 0,
    "2": 2,
    "3": 3,
    "4": 8,
    "5": 12
  }
}
```

---

## Testing Flow in Postman

### Step 1: Setup Environment Variables
1. Create a new Environment in Postman
2. Add variables:
   - `base_url`: `http://localhost:8080/api`
   - `student_token`: (leave empty, will be filled after login)
   - `faculty_token`: (leave empty, will be filled after login)

### Step 2: Register Users
1. Register a student using endpoint 1.1
2. Register a faculty using endpoint 1.2

### Step 3: Login and Save Tokens
1. Login as student (endpoint 1.3)
2. Copy the token from response
3. Save it in environment variable `student_token`
4. Repeat for faculty user

### Step 4: Test Student Flow
1. Get all events (2.1)
2. Register for an event (3.1)
3. Get my registered events (3.2)
4. Get my attendance stats (4.4)

### Step 5: Test Faculty Flow
1. Create an event (2.4)
2. Update the event (2.5)
3. Mark student attendance using QR data (4.1)
4. Get event attendance (4.2)
5. Get event feedback (5.2)

### Step 6: Test Authorization
1. Try to create event with student token (should fail with 403)
2. Try to mark attendance with student token (should fail with 403)
3. Try to update another faculty's event (should fail with 403)

---

## Common Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2025-10-11T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    "Email must be valid",
    "Password must be at least 8 characters"
  ]
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2025-10-11T12:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2025-10-11T12:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "timestamp": "2025-10-11T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Event not found with id: uuid-here"
}
```

### 409 Conflict
```json
{
  "timestamp": "2025-10-11T12:00:00",
  "status": 409,
  "error": "Conflict",
  "message": "User already registered with this email"
}
```

---

## Import to Postman

To import this collection:
1. Copy the JSON below
2. Open Postman → Import → Raw Text
3. Paste and import

```json
{
  "info": {
    "name": "Campus Events Management",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8080/api"
    }
  ]
}
```
