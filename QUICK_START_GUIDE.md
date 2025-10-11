# Quick Start Guide - Setup from GitHub Download

## Prerequisites
- **Java 21** installed ([Download](https://www.oracle.com/java/technologies/downloads/#java21))
- **Maven** installed ([Download](https://maven.apache.org/download.cgi))
- **MySQL 8.0+** installed and running ([Download](https://dev.mysql.com/downloads/installer/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))

---

## Step 1: Setup MySQL Database

### 1.1 Start MySQL Service
```bash
# Windows (Run as Administrator in PowerShell)
net start MySQL80

# Or check MySQL Workbench if it's running
```

### 1.2 Run Schema Setup (ONE COMMAND)
Open **PowerShell/CMD** in your project folder and run:

```bash
cd C:\Users\aryan\OneDrive\Desktop\flexica3campusevents-main

mysql -u root -p < backend/src/main/resources/schema.sql
```

**Enter your MySQL root password when prompted.**

This single command will:
- ✅ Create the `campus_events` database
- ✅ Create the `campus_admin` user
- ✅ Create all tables (users, events, attendance, feedback, etc.)
- ✅ Insert 3 default users (admin, faculty, student)
- ✅ Show success message

### 1.3 Verify Setup
```bash
mysql -u campus_admin -p
# Password: Foilrocks200#Q

SHOW DATABASES;
USE campus_events;
SHOW TABLES;
SELECT full_name, email, role FROM users;
exit;
```

You should see 3 users created.

---

## Step 2: Run Backend (Spring Boot)

### 2.1 Navigate to Backend
```bash
cd backend
```

### 2.2 Build & Run
```bash
mvn clean install
mvn spring-boot:run
```

**Wait for:** `Started CampusEventsApplication` message

### 2.3 Verify Backend Running
Open browser: http://localhost:9091/api/auth/login
- Should see: `{"timestamp":"...","status":401,"error":"Unauthorized"...}`
- This means backend is working! ✅

---

## Step 3: Run Frontend (React)

### 3.1 Open New Terminal
Keep backend running, open **NEW PowerShell/CMD**

### 3.2 Navigate to Project Root
```bash
cd C:\Users\aryan\OneDrive\Desktop\flexica3campusevents-main
```

### 3.3 Install Dependencies & Run
```bash
npm install
npm run dev
```

### 3.4 Access Application
Open browser: http://localhost:5173

---

## Default Login Credentials

### Admin
- **Email:** admin@campus.com
- **Password:** Admin123!@#

### Faculty
- **Email:** faculty@campus.com
- **Password:** Faculty123!@#

### Student
- **Email:** student@campus.com
- **Password:** Student123!@#

---

## Quick Troubleshooting

### MySQL Issues
```bash
# Check if MySQL is running
net start | findstr MySQL

# Start MySQL if not running
net start MySQL80
```

### Backend Won't Start
```bash
# Check if port 9091 is free
netstat -ano | findstr :9091

# If port is busy, kill the process or change port in application.properties
```

### Frontend Won't Start
```bash
# Clear node_modules and reinstall
rmdir /s /q node_modules
npm install
npm run dev
```

### "Cannot connect to database"
1. Verify MySQL is running
2. Check database exists: `SHOW DATABASES;`
3. Verify user exists: `SELECT User FROM mysql.user WHERE User='campus_admin';`
4. Check credentials in `backend/src/main/resources/application.properties`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR BROWSER                         │
│                http://localhost:5173                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     │
┌────────────────────▼────────────────────────────────────┐
│              REACT FRONTEND (Vite)                      │
│  - Components (Student/Faculty/Admin Dashboards)        │
│  - Services (authService, eventService, etc.)           │
│  - Axios HTTP Client with JWT interceptors              │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ API Calls
                     │ http://localhost:9091/api/*
                     │
┌────────────────────▼────────────────────────────────────┐
│         SPRING BOOT BACKEND (Port 9091)                 │
│  - Controllers (AuthController, EventController)        │
│  - Services (AuthService, EventService, QRService)      │
│  - Security (JWT, Spring Security)                      │
│  - JPA Repositories                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ JDBC Connection
                     │
┌────────────────────▼────────────────────────────────────┐
│              MySQL DATABASE                             │
│                campus_events                            │
│  Tables: users, events, registrations, attendance, etc. │
└─────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. ✅ **Login** as any default user
2. ✅ **Create Events** (as Faculty/Admin)
3. ✅ **Register for Events** (as Student)
4. ✅ **Generate QR Codes** for events
5. ✅ **Scan Attendance** using QR codes
6. ✅ **Submit Feedback** after events

---

## Need Help?

- Check console logs in browser (F12)
- Check backend terminal for errors
- Review `COMPLETE_LOCAL_SETUP_GUIDE.md` for detailed explanations
- Check `backend/README.md` for API documentation
