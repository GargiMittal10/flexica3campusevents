# Complete API Testing Guide - Campus Events Management System

## 🚀 Quick Start

### Prerequisites
1. **MySQL** running on port 3306
2. **Backend** running on port 9091
3. **Postman** installed

### Start the Application
```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend (optional)
npm run dev
```

---

## 📌 API Base Configuration

**Base URL:** `http://localhost:9091/api`

**Common Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**For Authenticated Requests:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

---

## 🔐 1. Authentication Endpoints

### 1.1 Register Student
**POST** `/api/auth/register`

**Body:**
```json
{
  "fullName": "Alice Johnson",
  "email": "alice@university.edu",
  "password": "Alice123!",
  "studentId": "STU2024001",
  "role": "STUDENT"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGci...",
  "id": "uuid-here",
  "email": "alice@university.edu",
  "fullName": "Alice Johnson",
  "role": "STUDENT"
}
```

### 1.2 Register Faculty
**POST** `/api/auth/register`

**Body:**
```json
{
  "fullName": "Dr. Jane Smith",
  "email": "jane.smith@university.edu",
  "password": "Faculty123!",
  "studentId": "FAC2024001",
  "role": "FACULTY"
}
```

### 1.3 Login
**POST** `/api/auth/login`

**Default Credentials:**
- **Student:** `student@test.com` / `student123`
- **Faculty:** `faculty@test.com` / `faculty123`
- **Admin:** `admin@campusevents.com` / `admin123`

**Body:**
```json
{
  "email": "student@test.com",
  "password": "student123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGci...",
  "id": "uuid-here",
  "email": "student@test.com",
  "fullName": "Test Student",
  "role": "STUDENT"
}
```

**⚠️ Important:** Save the `token` for authenticated requests!

---

## 👤 2. User Endpoints

### 2.1 Get Current User Profile
**GET** `/api/users/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "fullName": "Test Student",
  "email": "student@test.com",
  "studentId": "STU001",
  "role": "STUDENT",
  "qrCodeData": "encoded-qr-data",
  "createdAt": "2025-10-12T10:00:00",
  "updatedAt": "2025-10-12T10:00:00"
}
```

### 2.2 Get My QR Code (Student Only)
**GET** `/api/users/my-qr-code`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Response (200 OK):**
```json
"U1RVREVOVDp1dWlkLWhlcmU6U1RVMDAxOjE2OTcxMjM0NTY="
```

---

## 📅 3. Event Endpoints

### 3.1 Create Event (Faculty/Admin Only)
**POST** `/api/events`

**Headers:**
```
Authorization: Bearer FACULTY_TOKEN
```

**Body:**
```json
{
  "title": "AI Workshop 2025",
  "description": "Introduction to Artificial Intelligence",
  "eventDate": "2025-12-15T14:00:00",
  "location": "Computer Lab 101"
}
```

**Response (201 Created):**
```json
{
  "id": "event-uuid",
  "title": "AI Workshop 2025",
  "description": "Introduction to Artificial Intelligence",
  "eventDate": "2025-12-15T14:00:00",
  "location": "Computer Lab 101",
  "createdBy": { "id": "faculty-uuid", "fullName": "Dr. Jane Smith" },
  "createdAt": "2025-10-12T10:30:00",
  "updatedAt": "2025-10-12T10:30:00"
}
```

### 3.2 Get All Events (Public)
**GET** `/api/events`

**No authentication required**

**Response (200 OK):**
```json
[
  {
    "id": "event-uuid",
    "title": "AI Workshop 2025",
    "description": "Introduction to Artificial Intelligence",
    "eventDate": "2025-12-15T14:00:00",
    "location": "Computer Lab 101",
    "createdBy": { "id": "faculty-uuid", "fullName": "Dr. Jane Smith" },
    "createdAt": "2025-10-12T10:30:00"
  }
]
```

### 3.3 Get Event by ID (Public)
**GET** `/api/events/{eventId}`

**Example:** `/api/events/12345678-1234-1234-1234-1234567890ab`

### 3.4 Update Event (Faculty/Admin - Owner Only)
**PUT** `/api/events/{eventId}`

**Headers:**
```
Authorization: Bearer FACULTY_TOKEN
```

**Body:**
```json
{
  "title": "AI Workshop 2025 - Advanced",
  "description": "Advanced Introduction to AI",
  "eventDate": "2025-12-15T15:00:00",
  "location": "Computer Lab 102"
}
```

### 3.5 Delete Event (Faculty/Admin - Owner Only)
**DELETE** `/api/events/{eventId}`

**Headers:**
```
Authorization: Bearer FACULTY_TOKEN
```

**Response:** 204 No Content

### 3.6 Register for Event (Student Only)
**POST** `/api/events/{eventId}/register`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Response (201 Created):**
```json
{
  "id": "registration-uuid",
  "event": { "id": "event-uuid", "title": "AI Workshop 2025" },
  "student": { "id": "student-uuid", "fullName": "Test Student" },
  "registeredAt": "2025-10-12T11:00:00"
}
```

### 3.7 Get Event Registrations (Faculty/Admin)
**GET** `/api/events/{eventId}/registrations`

**Headers:**
```
Authorization: Bearer FACULTY_TOKEN
```

**Response (200 OK):**
```json
[
  {
    "id": "student-uuid",
    "fullName": "Test Student",
    "email": "student@test.com",
    "studentId": "STU001",
    "registeredAt": "2025-10-12T11:00:00"
  }
]
```

---

## ✅ 4. Attendance Endpoints

### 4.1 Mark Attendance (Faculty/Admin Only)
**POST** `/api/attendance/mark`

**Headers:**
```
Authorization: Bearer FACULTY_TOKEN
```

**Body:**
```json
{
  "eventId": "event-uuid",
  "qrData": "STUDENT:student-uuid:STU001:1697123456"
}
```

**Response (201 Created):**
```json
{
  "id": "attendance-uuid",
  "event": { "id": "event-uuid", "title": "AI Workshop 2025" },
  "student": { "id": "student-uuid", "fullName": "Test Student" },
  "markedBy": { "id": "faculty-uuid", "fullName": "Dr. Jane Smith" },
  "qrData": "STUDENT:student-uuid:STU001:1697123456",
  "markedAt": "2025-10-12T14:30:00"
}
```

### 4.2 Get Event Attendance (Faculty/Admin)
**GET** `/api/attendance/event/{eventId}`

**Headers:**
```
Authorization: Bearer FACULTY_TOKEN
```

**Response (200 OK):**
```json
[
  {
    "studentId": "student-uuid",
    "fullName": "Test Student",
    "studentId": "STU001",
    "email": "student@test.com",
    "markedAt": "2025-10-12T14:30:00"
  }
]
```

---

## 📊 5. Analytics Endpoints

### 5.1 Get Student Attendance Percentage
**GET** `/api/analytics/student/{studentId}/attendance-percentage`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN or FACULTY_TOKEN
```

**Response (200 OK):**
```json
{
  "totalEventsRegistered": 10,
  "totalEventsAttended": 8,
  "attendancePercentage": 80.0,
  "recentAttendance": [
    {
      "eventTitle": "AI Workshop 2025",
      "eventDate": "2025-12-15T14:00:00",
      "markedAt": "2025-12-15T14:05:00"
    }
  ]
}
```

### 5.2 Get Event Participation Report (Faculty/Admin)
**GET** `/api/analytics/event/{eventId}/participation-report`

**Headers:**
```
Authorization: Bearer FACULTY_TOKEN
```

**Response (200 OK):**
```json
{
  "eventId": "event-uuid",
  "totalRegistered": 50,
  "totalAttended": 42,
  "attendanceRate": 84.0
}
```

---

## ⭐ 6. Feedback Endpoints

### 6.1 Submit Feedback (Student Only - Must Have Attended)
**POST** `/api/feedback/event/{eventId}`

**Headers:**
```
Authorization: Bearer STUDENT_TOKEN
```

**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent workshop! Very informative and well-organized."
}
```

**Response (201 Created):**
```json
{
  "id": "feedback-uuid",
  "event": { "id": "event-uuid", "title": "AI Workshop 2025" },
  "student": { "id": "student-uuid", "fullName": "Test Student" },
  "rating": 5,
  "comment": "Excellent workshop! Very informative and well-organized.",
  "createdAt": "2025-10-12T16:00:00"
}
```

### 6.2 Get Event Feedback (Faculty/Admin)
**GET** `/api/feedback/event/{eventId}`

**Headers:**
```
Authorization: Bearer FACULTY_TOKEN
```

**Response (200 OK):**
```json
[
  {
    "id": "feedback-uuid",
    "studentName": "Test Student",
    "rating": 5,
    "comment": "Excellent workshop!",
    "submittedAt": "2025-10-12T16:00:00"
  }
]
```

---

## 🧪 Complete Testing Workflow

### Workflow 1: Student Journey

1. **Login as Student**
   ```
   POST /api/auth/login
   email: student@test.com
   password: student123
   ```
   ✅ Save the JWT token

2. **Get My Profile**
   ```
   GET /api/users/me
   Authorization: Bearer STUDENT_TOKEN
   ```

3. **Get My QR Code**
   ```
   GET /api/users/my-qr-code
   Authorization: Bearer STUDENT_TOKEN
   ```

4. **View All Events**
   ```
   GET /api/events
   ```

5. **Register for an Event**
   ```
   POST /api/events/{eventId}/register
   Authorization: Bearer STUDENT_TOKEN
   ```

6. **View My Attendance Stats**
   ```
   GET /api/analytics/student/{myStudentId}/attendance-percentage
   Authorization: Bearer STUDENT_TOKEN
   ```

7. **Submit Feedback (After Attending)**
   ```
   POST /api/feedback/event/{eventId}
   Authorization: Bearer STUDENT_TOKEN
   Body: { "rating": 5, "comment": "Great event!" }
   ```

### Workflow 2: Faculty Journey

1. **Login as Faculty**
   ```
   POST /api/auth/login
   email: faculty@test.com
   password: faculty123
   ```
   ✅ Save the JWT token

2. **Create an Event**
   ```
   POST /api/events
   Authorization: Bearer FACULTY_TOKEN
   ```

3. **View Event Registrations**
   ```
   GET /api/events/{eventId}/registrations
   Authorization: Bearer FACULTY_TOKEN
   ```

4. **Mark Student Attendance (Scan QR)**
   ```
   POST /api/attendance/mark
   Authorization: Bearer FACULTY_TOKEN
   Body: { "eventId": "...", "qrData": "STUDENT:uuid:..." }
   ```

5. **View Event Attendance**
   ```
   GET /api/attendance/event/{eventId}
   Authorization: Bearer FACULTY_TOKEN
   ```

6. **View Event Feedback**
   ```
   GET /api/feedback/event/{eventId}
   Authorization: Bearer FACULTY_TOKEN
   ```

7. **Get Participation Report**
   ```
   GET /api/analytics/event/{eventId}/participation-report
   Authorization: Bearer FACULTY_TOKEN
   ```

8. **Update Event**
   ```
   PUT /api/events/{eventId}
   Authorization: Bearer FACULTY_TOKEN
   ```

9. **Delete Event**
   ```
   DELETE /api/events/{eventId}
   Authorization: Bearer FACULTY_TOKEN
   ```

---

## 🎯 Postman Collection Setup

### Step 1: Create Environment Variables

1. Click **Environments** → **Create Environment**
2. Name it "Campus Events Local"
3. Add these variables:

| Variable | Initial Value |
|----------|---------------|
| `baseUrl` | `http://localhost:9091/api` |
| `studentToken` | (leave empty) |
| `facultyToken` | (leave empty) |
| `adminToken` | (leave empty) |

### Step 2: Use Variables in Requests

**URL Example:**
```
{{baseUrl}}/events
```

**Authorization Header:**
```
Bearer {{studentToken}}
```

### Step 3: Auto-Save Tokens (Optional)

Add this to **Tests** tab after login requests:

```javascript
var jsonData = pm.response.json();
pm.environment.set("studentToken", jsonData.token);
```

---

## ⚠️ Common Errors

### 401 Unauthorized
**Problem:** Missing or expired JWT token  
**Solution:** Login again and get a fresh token

### 403 Forbidden
**Problem:** User role doesn't have permission  
**Solution:** Use the correct role token (e.g., faculty token for creating events)

### 400 Bad Request
**Problem:** Invalid request body or validation failure  
**Solution:** Check request body matches expected format

### 404 Not Found
**Problem:** Resource doesn't exist  
**Solution:** Verify the UUID exists in database

### 409 Conflict
**Problem:** Duplicate registration or feedback  
**Solution:** Check if already registered/submitted

---

## ✅ Testing Checklist

- [ ] Register new student user
- [ ] Register new faculty user
- [ ] Login with all three roles
- [ ] Get current user profile
- [ ] Get student QR code
- [ ] Create event as faculty
- [ ] Update event as faculty (owner)
- [ ] Delete event as faculty (owner)
- [ ] Get all events (public)
- [ ] Get event by ID
- [ ] Register for event as student
- [ ] Get event registrations as faculty
- [ ] Mark attendance as faculty
- [ ] Get event attendance as faculty
- [ ] Get student attendance percentage
- [ ] Get event participation report
- [ ] Submit feedback as student (after attending)
- [ ] Get event feedback as faculty
- [ ] Test authorization (try faculty operations with student token)

---

## 📚 Additional Resources

- **Backend Controllers:** `backend/src/main/java/com/campusevents/controller/`
- **Services:** `backend/src/main/java/com/campusevents/service/`
- **DTOs:** `backend/src/main/java/com/campusevents/dto/`
- **Entities:** `backend/src/main/java/com/campusevents/entity/`
- **Security Config:** `backend/src/main/java/com/campusevents/security/SecurityConfig.java`
- **Database Schema:** `backend/src/main/resources/schema.sql`

---

**Happy Testing! 🚀**

For issues, check backend console logs and verify JWT tokens are valid and using the correct role.
