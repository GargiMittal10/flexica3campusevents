# Complete Postman Testing Guide - Campus Events API

## 🚀 Quick Start

### Step 1: Download Postman
Download from: https://www.postman.com/downloads/

### Step 2: Verify Backend is Running
Make sure your Spring Boot backend is running on `http://localhost:9091`

### Step 3: Start Testing!

---

## 📌 Base Configuration

**Base URL:** `http://localhost:9091/api`

**Common Headers:**
```
Content-Type: application/json
```

**For Authenticated Requests:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 🔐 1. Authentication APIs

### 1.1 Register New Student

**Method:** POST  
**URL:** `http://localhost:9091/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "fullName": "Alice Johnson",
  "email": "alice@university.edu",
  "password": "Alice123!",
  "studentId": "STU2024001",
  "role": "STUDENT"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGljZUB1bml2ZXJzaXR5LmVkdSIsInVzZXJJZCI6IjEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTBhYiIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNjk3MTIzNDU2LCJleHAiOjE2OTcyMDk4NTZ9.xyz123...",
  "id": "12345678-1234-1234-1234-1234567890ab",
  "email": "alice@university.edu",
  "fullName": "Alice Johnson",
  "role": "STUDENT"
}
```

**📝 Save the token!** Copy it from the response and use it in subsequent requests.

---

### 1.2 Login with Existing User

**Method:** POST  
**URL:** `http://localhost:9091/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON) - Student:**
```json
{
  "email": "student@test.com",
  "password": "student123"
}
```

**Body (raw JSON) - Faculty:**
```json
{
  "email": "faculty@test.com",
  "password": "faculty123"
}
```

**Body (raw JSON) - Admin:**
```json
{
  "email": "admin@campusevents.com",
  "password": "admin123"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "uuid-here",
  "email": "student@test.com",
  "fullName": "John Doe",
  "role": "STUDENT"
}
```

---

## 📅 2. Event Management APIs

### 2.1 Get All Events (Public)

**Method:** GET  
**URL:** `http://localhost:9091/api/events`

**Headers:** None required

**Expected Response (200 OK):**
```json
[
  {
    "id": "event-uuid-1",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference with industry leaders",
    "eventDate": "2025-11-15T10:00:00",
    "location": "Main Auditorium, Building A",
    "status": "upcoming",
    "createdBy": "faculty-uuid",
    "createdAt": "2025-10-11T12:00:00",
    "updatedAt": "2025-10-11T12:00:00"
  }
]
```

---

### 2.2 Get Upcoming Events Only

**Method:** GET  
**URL:** `http://localhost:9091/api/events/upcoming`

**Headers:** None required

**Expected Response (200 OK):**
```json
[
  {
    "id": "event-uuid",
    "title": "AI Workshop",
    "description": "Introduction to Artificial Intelligence",
    "eventDate": "2025-12-01T14:00:00",
    "location": "Computer Lab 101"
  }
]
```

---

### 2.3 Get Event by ID

**Method:** GET  
**URL:** `http://localhost:9091/api/events/{eventId}`

**Example:** `http://localhost:9091/api/events/12345678-1234-1234-1234-1234567890ab`

**Headers:** None required

**Expected Response (200 OK):**
```json
{
  "id": "12345678-1234-1234-1234-1234567890ab",
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "eventDate": "2025-11-15T10:00:00",
  "location": "Main Auditorium",
  "status": "upcoming",
  "createdBy": "faculty-uuid",
  "createdAt": "2025-10-11T12:00:00",
  "updatedAt": "2025-10-11T12:00:00"
}
```

---

### 2.4 Create New Event (Faculty/Admin Only)

**Method:** POST  
**URL:** `http://localhost:9091/api/events`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_FACULTY_TOKEN_HERE
```

**Body (raw JSON):**
```json
{
  "title": "Web Development Workshop",
  "description": "Learn modern web development with React and Spring Boot",
  "eventDate": "2025-12-10T15:00:00",
  "location": "Computer Lab 202"
}
```

**Expected Response (201 Created):**
```json
{
  "id": "new-event-uuid",
  "title": "Web Development Workshop",
  "description": "Learn modern web development with React and Spring Boot",
  "eventDate": "2025-12-10T15:00:00",
  "location": "Computer Lab 202",
  "status": "upcoming",
  "createdBy": "your-faculty-uuid",
  "createdAt": "2025-10-12T10:30:00"
}
```

**Possible Errors:**
- **401 Unauthorized:** No token or invalid token
- **403 Forbidden:** Not a faculty/admin user

---

### 2.5 Update Event (Faculty/Admin Only)

**Method:** PUT  
**URL:** `http://localhost:9091/api/events/{eventId}`

**Example:** `http://localhost:9091/api/events/12345678-1234-1234-1234-1234567890ab`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_FACULTY_TOKEN_HERE
```

**Body (raw JSON):**
```json
{
  "title": "Web Development Workshop - Advanced",
  "description": "Advanced topics in modern web development",
  "eventDate": "2025-12-10T16:00:00",
  "location": "Computer Lab 203"
}
```

**Expected Response (200 OK):**
```json
{
  "id": "12345678-1234-1234-1234-1234567890ab",
  "title": "Web Development Workshop - Advanced",
  "description": "Advanced topics in modern web development",
  "eventDate": "2025-12-10T16:00:00",
  "location": "Computer Lab 203",
  "updatedAt": "2025-10-12T11:00:00"
}
```

---

### 2.6 Delete Event (Faculty/Admin Only)

**Method:** DELETE  
**URL:** `http://localhost:9091/api/events/{eventId}`

**Example:** `http://localhost:9091/api/events/12345678-1234-1234-1234-1234567890ab`

**Headers:**
```
Authorization: Bearer YOUR_FACULTY_TOKEN_HERE
```

**Expected Response:** 204 No Content (empty response)

---

## 📝 3. Event Registration APIs

### 3.1 Register for Event (Student Only)

**Method:** POST  
**URL:** `http://localhost:9091/api/events/{eventId}/register`

**Example:** `http://localhost:9091/api/events/12345678-1234-1234-1234-1234567890ab/register`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_STUDENT_TOKEN_HERE
```

**Body:** Empty (no body required)

**Expected Response (201 Created):**
```json
{
  "id": "registration-uuid",
  "eventId": "event-uuid",
  "studentId": "your-student-uuid",
  "registeredAt": "2025-10-12T14:00:00"
}
```

**Possible Errors:**
- **400 Bad Request:** Already registered for this event
- **404 Not Found:** Event doesn't exist
- **401 Unauthorized:** Not logged in

---

## ✅ 4. Attendance APIs

### 4.1 Mark Attendance (Faculty Only)

**Method:** POST  
**URL:** `http://localhost:9091/api/attendance/mark`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_FACULTY_TOKEN_HERE
```

**Body (raw JSON):**
```json
{
  "eventId": "event-uuid",
  "qrData": "STUDENT:student-uuid:STU2024001:1697123456789"
}
```

**Expected Response (201 Created):**
```json
{
  "id": "attendance-uuid",
  "eventId": "event-uuid",
  "studentId": "student-uuid",
  "qrData": "STUDENT:student-uuid:STU2024001:1697123456789",
  "markedAt": "2025-10-12T16:00:00",
  "markedBy": "faculty-uuid"
}
```

---

### 4.2 Get Event Attendance (Faculty Only)

**Method:** GET  
**URL:** `http://localhost:9091/api/attendance/event/{eventId}`

**Example:** `http://localhost:9091/api/attendance/event/12345678-1234-1234-1234-1234567890ab`

**Headers:**
```
Authorization: Bearer YOUR_FACULTY_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
[
  {
    "studentId": "student-uuid-1",
    "fullName": "Alice Johnson",
    "studentId": "STU2024001",
    "email": "alice@university.edu",
    "markedAt": "2025-10-12T16:00:00"
  },
  {
    "studentId": "student-uuid-2",
    "fullName": "Bob Smith",
    "studentId": "STU2024002",
    "email": "bob@university.edu",
    "markedAt": "2025-10-12T16:05:00"
  }
]
```

---

### 4.3 Get My Attendance (Student Only)

**Method:** GET  
**URL:** `http://localhost:9091/api/attendance/my-attendance`

**Headers:**
```
Authorization: Bearer YOUR_STUDENT_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
[
  {
    "eventId": "event-uuid-1",
    "eventTitle": "Tech Conference 2025",
    "eventDate": "2025-11-15T10:00:00",
    "markedAt": "2025-11-15T10:05:00"
  },
  {
    "eventId": "event-uuid-2",
    "eventTitle": "AI Workshop",
    "eventDate": "2025-12-01T14:00:00",
    "markedAt": "2025-12-01T14:10:00"
  }
]
```

---

## ⭐ 5. Feedback APIs

### 5.1 Submit Feedback (Student Only)

**Method:** POST  
**URL:** `http://localhost:9091/api/feedback`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_STUDENT_TOKEN_HERE
```

**Body (raw JSON):**
```json
{
  "eventId": "event-uuid",
  "rating": 5,
  "comment": "Excellent event! Very informative and well organized."
}
```

**Note:** Rating must be between 1-5

**Expected Response (201 Created):**
```json
{
  "id": "feedback-uuid",
  "eventId": "event-uuid",
  "studentId": "your-student-uuid",
  "rating": 5,
  "comment": "Excellent event! Very informative and well organized.",
  "submittedAt": "2025-10-12T17:00:00"
}
```

**Possible Errors:**
- **400 Bad Request:** Invalid rating (not 1-5)
- **400 Bad Request:** Already submitted feedback for this event

---

### 5.2 Get Event Feedback (Faculty Only)

**Method:** GET  
**URL:** `http://localhost:9091/api/feedback/events/{eventId}`

**Example:** `http://localhost:9091/api/feedback/events/12345678-1234-1234-1234-1234567890ab`

**Headers:**
```
Authorization: Bearer YOUR_FACULTY_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
[
  {
    "id": "feedback-uuid-1",
    "studentName": "Alice Johnson",
    "rating": 5,
    "comment": "Excellent event!",
    "submittedAt": "2025-10-12T17:00:00"
  },
  {
    "id": "feedback-uuid-2",
    "studentName": "Bob Smith",
    "rating": 4,
    "comment": "Good event, would attend again.",
    "submittedAt": "2025-10-12T17:05:00"
  }
]
```

---

## 🧪 Complete Testing Workflow

### Workflow 1: Student Journey

1. **Register as Student**
   - POST `/api/auth/register` with role "STUDENT"
   - Save the JWT token

2. **Login**
   - POST `/api/auth/login`
   - Save the JWT token

3. **View Available Events**
   - GET `/api/events`

4. **Register for an Event**
   - POST `/api/events/{eventId}/register`

5. **View My Registered Events**
   - GET `/api/registrations/my-events`

6. **View My Attendance**
   - GET `/api/attendance/my-attendance`

7. **Submit Feedback**
   - POST `/api/feedback`

---

### Workflow 2: Faculty Journey

1. **Login as Faculty**
   - POST `/api/auth/login` with faculty credentials
   - Save the JWT token

2. **Create an Event**
   - POST `/api/events`

3. **View Event Registrations**
   - GET `/api/registrations/events/{eventId}/registrations`

4. **Mark Student Attendance**
   - POST `/api/attendance/mark`

5. **View Event Attendance**
   - GET `/api/attendance/event/{eventId}`

6. **View Event Feedback**
   - GET `/api/feedback/events/{eventId}`

7. **Update Event**
   - PUT `/api/events/{eventId}`

8. **Delete Event**
   - DELETE `/api/events/{eventId}`

---

## 🎯 Postman Tips

### Tip 1: Use Environment Variables

Create a Postman environment with these variables:
- `baseUrl`: `http://localhost:9091/api`
- `studentToken`: (paste JWT after login)
- `facultyToken`: (paste JWT after login)
- `adminToken`: (paste JWT after login)

Then use them in requests:
- URL: `{{baseUrl}}/events`
- Header: `Authorization: Bearer {{studentToken}}`

### Tip 2: Use Pre-request Scripts

Add this to automatically add auth headers:
```javascript
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('studentToken')
});
```

### Tip 3: Save Tests

Add assertions to verify responses:
```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.token).to.exist;
});
```

---

## 🔍 Debugging Common Issues

### Issue 1: 401 Unauthorized
**Cause:** Missing or expired JWT token  
**Solution:** Login again and get a fresh token

### Issue 2: 403 Forbidden
**Cause:** User role doesn't have permission  
**Solution:** Use correct role token (e.g., faculty token for creating events)

### Issue 3: 400 Bad Request
**Cause:** Invalid request body or missing required fields  
**Solution:** Check the request body matches expected format

### Issue 4: 404 Not Found
**Cause:** Resource doesn't exist  
**Solution:** Verify the UUID exists in database

### Issue 5: 500 Internal Server Error
**Cause:** Backend error  
**Solution:** Check backend console logs for stack trace

---

## ✅ Testing Checklist

- [ ] Register new student user
- [ ] Register new faculty user
- [ ] Login with all three roles (student, faculty, admin)
- [ ] Create event as faculty
- [ ] Update event as faculty
- [ ] Delete event as faculty
- [ ] Register for event as student
- [ ] Mark attendance as faculty
- [ ] View attendance as student
- [ ] Submit feedback as student
- [ ] View feedback as faculty
- [ ] Get all events (public)
- [ ] Get upcoming events (public)

---

## 📚 Additional Resources

- **Backend Code:** `backend/src/main/java/com/campusevents/controller/`
- **API Models:** `backend/src/main/java/com/campusevents/dto/`
- **Security Config:** `backend/src/main/java/com/campusevents/security/`
- **Database Schema:** `backend/src/main/resources/schema.sql`

---

**Happy Testing! 🚀**

For issues, check backend console logs and verify JWT tokens are valid.
