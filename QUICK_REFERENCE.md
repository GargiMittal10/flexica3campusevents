# Quick Reference - Campus Events System

## 🚀 Start the Application

### 1. Start Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
**URL:** http://localhost:9091

### 2. Start Frontend (React)
```bash
npm run dev
```
**URL:** http://localhost:5173

---

## 🔐 Default Login Credentials

| Role | Email | Password | Login URL |
|------|-------|----------|-----------|
| **Admin** | admin@campusevents.com | admin123 | /admin-login |
| **Faculty** | faculty@test.com | faculty123 | /faculty-login |
| **Student** | student@test.com | student123 | /login |

---

## 📊 Database Information

**Database Name:** `campus_events`  
**Username:** `campus_admin`  
**Password:** `Foilrocks200#Q`  
**Port:** `3306`

### Quick MySQL Commands
```sql
-- Login
mysql -u campus_admin -p campus_events

-- Show tables
SHOW TABLES;

-- View users
SELECT id, full_name, email, role FROM users;

-- View events
SELECT id, title, event_date, location FROM events;
```

---

## 🗂️ Database Tables (with Foreign Keys)

1. **users** (Primary Key: id)
   - Contains all user accounts

2. **events** (Primary Key: id, FK: created_by → users.id)
   - Events created by faculty/admin

3. **event_registrations** (Primary Key: id, FK: event_id → events.id, student_id → users.id)
   - Student registrations for events

4. **attendance** (Primary Key: id, FK: event_id → events.id, student_id → users.id, marked_by → users.id)
   - Attendance records

5. **feedback** (Primary Key: id, FK: event_id → events.id, student_id → users.id)
   - Event feedback from students

6. **attendance_sessions** (Primary Key: id, FK: event_id → events.id, created_by → users.id)

7. **feedback_sessions** (Primary Key: id, FK: event_id → events.id, created_by → users.id)

8. **pending_faculty_approvals** (Primary Key: id, FK: reviewed_by → users.id)

9. **user_roles** (Primary Key: id, FK: user_id → users.id)

**All foreign keys use `ON DELETE CASCADE`**

---

## 🔗 API Endpoints Summary

### Authentication (Public)
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login and get JWT token
```

### Events (Public Read, Faculty/Admin Write)
```
GET    /api/events                 - Get all events
GET    /api/events/upcoming        - Get upcoming events
GET    /api/events/{id}           - Get event by ID
POST   /api/events                - Create event (Faculty/Admin)
PUT    /api/events/{id}           - Update event (Faculty/Admin)
DELETE /api/events/{id}           - Delete event (Faculty/Admin)
```

### Event Registration (Student)
```
POST /api/events/{id}/register     - Register for event
GET  /api/registrations/my-events  - My registered events
```

### Attendance (Faculty mark, Student view own)
```
POST /api/attendance/mark                - Mark attendance (Faculty)
GET  /api/attendance/event/{id}         - Event attendance (Faculty)
GET  /api/attendance/student/{id}       - Student attendance (Faculty)
GET  /api/attendance/my-attendance      - My attendance (Student)
```

### Feedback (Student submit, Faculty view)
```
POST /api/feedback                - Submit feedback (Student)
GET  /api/feedback/events/{id}   - Event feedback (Faculty)
```

### User Info (Authenticated)
```
GET /api/users/me          - Current user info
GET /api/users/my-qr-code  - My QR code data
```

---

## 🧪 Postman Quick Test

### 1. Login
```
POST http://localhost:9091/api/auth/login
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "student123"
}
```
**Copy the `token` from response!**

### 2. Get Events (No Auth)
```
GET http://localhost:9091/api/events
```

### 3. Create Event (Faculty)
```
POST http://localhost:9091/api/events
Content-Type: application/json
Authorization: Bearer YOUR_FACULTY_TOKEN

{
  "title": "Test Event",
  "description": "Description here",
  "eventDate": "2025-12-15T14:00:00",
  "location": "Room 101"
}
```

---

## 🛠️ Common Commands

### Reset Database
```bash
# Windows
mysql -u root -p < backend/src/main/resources/schema.sql
```

### Check if Backend is Running
```bash
curl http://localhost:9091/api/events
```

### Kill Process on Port (Windows)
```powershell
# Backend (9091)
netstat -ano | findstr :9091
taskkill /PID <PID> /F

# Frontend (5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Clean Build Backend
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/src/main/resources/application.properties` | Backend config |
| `backend/src/main/resources/schema.sql` | Database schema |
| `src/services/api.ts` | Frontend API config |
| `src/services/authService.ts` | Auth API calls |
| `src/services/eventService.ts` | Event API calls |

---

## 🔍 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Backend won't start | Check if port 9091 is free, verify MySQL is running |
| Frontend won't start | Run `npm install`, check if port 5173 is free |
| Can't login | Verify database has users, check password is correct |
| CORS error | Backend must be running, check `cors.allowed.origins` |
| JWT expired | Login again to get new token |
| Table doesn't exist | Run schema.sql again |

---

## 📖 Complete Documentation

- **Full Setup Guide:** `COMPLETE_LOCAL_SETUP_GUIDE.md`
- **Postman Testing:** `POSTMAN_TESTING_GUIDE.md`
- **API Documentation:** `POSTMAN_COLLECTION.md`
- **Spring Boot Details:** `SPRING_BOOT_SETUP.md`

---

## 🎯 Project Architecture

```
┌─────────────┐      HTTP      ┌──────────────┐      JDBC      ┌─────────┐
│   React     │ ────────────> │ Spring Boot  │ ────────────> │  MySQL  │
│  Frontend   │ <──────────── │   Backend    │ <──────────── │   DB    │
│ Port: 5173  │   JSON/JWT    │  Port: 9091  │  SQL Queries  │Port:3306│
└─────────────┘                └──────────────┘                └─────────┘
```

**Flow:**
1. User interacts with React UI
2. React makes API calls to Spring Boot
3. Spring Boot validates JWT token
4. Spring Boot queries MySQL database
5. Data flows back through the chain

---

## 🔐 Security Features

- ✅ **JWT Authentication:** Stateless auth with bearer tokens
- ✅ **Password Encryption:** BCrypt hashing
- ✅ **Role-Based Access:** STUDENT, FACULTY, ADMIN roles
- ✅ **CORS Protection:** Configured allowed origins
- ✅ **SQL Injection Prevention:** JPA/Hibernate parameterized queries
- ✅ **Foreign Key Constraints:** Data integrity at database level

---

**Need more details? Check the complete guides!** 📚
