# Complete Local Setup Guide - Campus Events Management System

This guide will help you set up the complete project on your local machine from scratch.

## 📋 Prerequisites

Before starting, make sure you have:

- [x] **Java 21** installed ([Download](https://www.oracle.com/java/technologies/downloads/#java21))
- [x] **Maven 3.8+** installed ([Download](https://maven.apache.org/download.cgi))
- [x] **MySQL 8.0+** installed and running ([Download](https://dev.mysql.com/downloads/mysql/))
- [x] **Node.js 18+** and npm installed ([Download](https://nodejs.org/))
- [x] **Git** installed ([Download](https://git-scm.com/downloads))

## 🚀 Step-by-Step Setup

### Step 1: Clone the Project from GitHub

```bash
# Navigate to your desired directory
cd C:\Users\aryan\OneDrive\Desktop

# Clone the repository
git clone https://github.com/YOUR-USERNAME/flexica3campusevents.git

# Navigate into the project
cd flexica3campusevents
```

**If you already have the ZIP file downloaded:**
- Extract it to a folder
- Open PowerShell/Terminal in that folder

---

### Step 2: Setup MySQL Database

#### 2.1 Start MySQL and Login

```bash
# Start MySQL (if not already running)
# Windows:
net start MySQL80

# Login to MySQL
mysql -u root -p
# Enter your MySQL root password
```

#### 2.2 Create Database and User

```sql
-- Create the database
CREATE DATABASE campus_events CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user
CREATE USER 'campus_admin'@'localhost' IDENTIFIED BY 'Foilrocks200#Q';

-- Grant all privileges
GRANT ALL PRIVILEGES ON campus_events.* TO 'campus_admin'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Switch to the database
USE campus_events;

-- Exit MySQL
exit;
```

#### 2.3 Create All Tables

```bash
# Run the schema SQL file
mysql -u campus_admin -p campus_events < backend/src/main/resources/schema.sql

# When prompted, enter password: Foilrocks200#Q
```

**Or manually in MySQL:**
```bash
mysql -u campus_admin -p
# Enter password: Foilrocks200#Q

USE campus_events;

# Copy and paste the entire content of backend/src/main/resources/schema.sql
# Then press Enter
```

#### 2.4 Verify Tables Created

```sql
-- Login to MySQL
mysql -u campus_admin -p campus_events

-- Show all tables
SHOW TABLES;

-- You should see:
-- +---------------------------+
-- | Tables_in_campus_events   |
-- +---------------------------+
-- | attendance                |
-- | attendance_sessions       |
-- | event_registrations       |
-- | events                    |
-- | feedback                  |
-- | feedback_sessions         |
-- | pending_faculty_approvals |
-- | user_roles                |
-- | users                     |
-- +---------------------------+

-- Check sample users
SELECT id, full_name, email, role FROM users;

-- Exit
exit;
```

---

### Step 3: Configure Backend (Spring Boot)

#### 3.1 Verify Configuration

Open `backend/src/main/resources/application.properties` and verify:

```properties
# Server Configuration
server.port=9091

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/campus_events?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=campus_admin
spring.datasource.password=Foilrocks200#Q

# JWT Configuration
jwt.secret=your_secret_key_here_minimum_256_bits_make_it_long_and_random_for_production
jwt.expiration=86400000

# CORS Configuration
cors.allowed.origins=http://localhost:5173,http://localhost:9091
```

**IMPORTANT:** Update `jwt.secret` to a strong random string (at least 32 characters).

#### 3.2 Build and Run Backend

```bash
# Navigate to backend directory
cd backend

# Clean and build
mvn clean install

# This will:
# - Download all dependencies
# - Compile Java code
# - Run tests
# - Create JAR file

# Run the application
mvn spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2025-10-11 ... Started CampusEventsApplication in 5.432 seconds
2025-10-11 ... Tomcat started on port(s): 9091 (http)
```

#### 3.3 Test Backend API

Open a new terminal and test:

```bash
# Test health check
curl http://localhost:9091/api/auth/login

# Should return: {"status":"error","message":"Email is required"}
# This means backend is working!

# Test registration endpoint
curl -X POST http://localhost:9091/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Test User\",\"email\":\"testuser@example.com\",\"password\":\"Test123!\",\"studentId\":\"STU999\",\"role\":\"STUDENT\"}"
```

---

### Step 4: Setup Frontend (React)

#### 4.1 Install Dependencies

Open a NEW terminal (keep backend running):

```bash
# Navigate to project root
cd C:\Users\aryan\OneDrive\Desktop\flexica3campusevents

# Install npm packages
npm install

# Install axios (if not already installed)
npm install axios
```

#### 4.2 Verify API Configuration

Check `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:9091/api';
```

This should already be correct.

#### 4.3 Run Frontend

```bash
# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

### Step 5: Verify Complete Setup

#### 5.1 Access the Application

Open your browser and go to: **http://localhost:5173**

#### 5.2 Test User Registration

1. Click "Sign Up"
2. Fill in the form:
   - Full Name: `Test Student`
   - Email: `test@example.com`
   - Student ID: `STU100`
   - Role: `Student`
   - Password: `Test123!`
   - Confirm Password: `Test123!`
3. Click "Create Account"

**Success:** You should be redirected to the student dashboard!

#### 5.3 Test User Login

1. Click "Logout" (if logged in)
2. Click "Sign In"
3. Enter credentials:
   - Email: `test@example.com`
   - Password: `Test123!`
4. Click "Sign In"

**Success:** You should see the student dashboard!

#### 5.4 Test Default Users

Try logging in with the pre-created users:

**Admin Account:**
- Email: `admin@campusevents.com`
- Password: `admin123`
- URL: http://localhost:5173/admin-login
- Should redirect to Admin Dashboard

**Faculty Account:**
- Email: `faculty@test.com`
- Password: `faculty123`
- URL: http://localhost:5173/faculty-login
- Should redirect to Faculty Dashboard

**Student Account:**
- Email: `student@test.com`
- Password: `student123`
- URL: http://localhost:5173/login
- Should redirect to Student Dashboard

---

## 📊 Project Structure

```
flexica3campusevents/
├── backend/                    # Spring Boot API
│   ├── src/
│   │   └── main/
│   │       ├── java/com/campusevents/
│   │       │   ├── controller/     # REST endpoints
│   │       │   ├── service/        # Business logic
│   │       │   ├── repository/     # Database access
│   │       │   ├── entity/         # Database models
│   │       │   ├── dto/            # Request/Response objects
│   │       │   ├── security/       # JWT & auth config
│   │       │   └── exception/      # Error handling
│   │       └── resources/
│   │           ├── application.properties
│   │           └── schema.sql      # Database schema
│   └── pom.xml                     # Maven dependencies
│
├── src/                            # React Frontend
│   ├── components/                 # UI components
│   ├── pages/                      # Page components
│   ├── services/                   # API integration
│   │   ├── api.ts                  # Axios config
│   │   ├── authService.ts          # Auth API calls
│   │   ├── eventService.ts         # Event API calls
│   │   └── ...
│   ├── lib/                        # Utilities
│   │   └── validations.ts          # Zod schemas
│   └── App.tsx                     # Main app
│
├── package.json                    # Frontend dependencies
└── vite.config.ts                  # Vite configuration
```

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** `Table 'campus_events.users' doesn't exist`
```bash
# Solution: Run the schema.sql file again
mysql -u campus_admin -p campus_events < backend/src/main/resources/schema.sql
```

**Problem:** `Port 9091 already in use`
```bash
# Solution: Kill the process or change port
# Windows:
netstat -ano | findstr :9091
taskkill /PID <PID> /F

# Update application.properties to use different port
server.port=9092
```

**Problem:** `Could not connect to MySQL`
```bash
# Check if MySQL is running:
# Windows:
net start MySQL80

# Verify credentials:
mysql -u campus_admin -p campus_events
```

### Frontend Issues

**Problem:** `Cannot connect to server`
- Make sure backend is running on http://localhost:9091
- Check browser console for CORS errors
- Verify API_BASE_URL in `src/services/api.ts`

**Problem:** `Module not found: axios`
```bash
npm install axios
```

**Problem:** `Validation errors not showing`
```bash
npm install zod @hookform/resolvers react-hook-form
```

---

## ✅ Success Checklist

- [x] MySQL running with `campus_events` database
- [x] All 9 tables created successfully
- [x] Backend running on http://localhost:9091
- [x] Frontend running on http://localhost:5173
- [x] Can register new users
- [x] Can login with created users
- [x] Can access role-specific dashboards
- [x] Validation working on forms
- [x] JWT tokens being stored and used

---

## 🎯 Next Steps

1. **Start developing features:**
   - Add event creation UI
   - Implement QR code scanning
   - Add attendance tracking
   - Build analytics dashboards

2. **Customize the application:**
   - Update styling/branding
   - Add more validation rules
   - Enhance error handling

3. **Deploy to production:**
   - Deploy backend to Railway/Heroku
   - Deploy frontend to Vercel/Netlify
   - Use production database

---

## 📞 Need Help?

- Check `LOCAL_DEVELOPMENT_GUIDE.md` for detailed development workflow
- Check `SPRING_BOOT_SETUP.md` for backend architecture
- Check `API_DOCUMENTATION.md` for API endpoints

---

## 🔐 Security Notes

1. **Change default passwords** in production
2. **Update JWT secret** to a strong random string
3. **Enable HTTPS** in production
4. **Never commit** `application.properties` with real credentials
5. **Use environment variables** for sensitive data

---

**Your application is now ready to use! 🎉**

Backend: http://localhost:9091
Frontend: http://localhost:5173
