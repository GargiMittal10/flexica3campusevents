# Complete Local Development Setup Guide

## Overview
This guide will help you set up the entire Campus Events Management System locally with:
- Spring Boot backend (Java 17)
- MySQL database
- React frontend (already in Lovable)

## Step 1: Install Prerequisites

### 1.1 Install Java 21
```bash
# Check if Java is installed
java -version

# If not installed:
# Windows: Download from https://adoptium.net/temurin/releases/?version=21
# macOS: brew install openjdk@21
# Linux: sudo apt install openjdk-21-jdk
```

### 1.2 Install Maven
```bash
# Check if Maven is installed
mvn -version

# If not installed:
# Windows: Download from https://maven.apache.org/download.cgi
# macOS: brew install maven
# Linux: sudo apt install maven
```

### 1.3 Install MySQL
Follow the detailed instructions in `MYSQL_SETUP_GUIDE.md`

## Step 2: Set Up MySQL Database

### 2.1 Start MySQL
```bash
# macOS/Linux
sudo mysql

# Windows (MySQL Command Line Client)
mysql -u root -p
```

### 2.2 Create Database and User
```sql
CREATE DATABASE campus_events;
CREATE USER 'campus_admin'@'localhost' IDENTIFIED BY 'campus_password123';
GRANT ALL PRIVILEGES ON campus_events.* TO 'campus_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.3 Verify Connection
```bash
mysql -u campus_admin -p campus_events
# Enter password: campus_password123
```

## Step 3: Create Spring Boot Project

### 3.1 Create Project Directory
```bash
mkdir campus-events-backend
cd campus-events-backend
```

### 3.2 Create Maven Project Structure
```bash
mkdir -p src/main/java/com/campusevents
mkdir -p src/main/resources
mkdir -p src/test/java/com/campusevents
```

### 3.3 Copy pom.xml
Copy the `pom.xml` file from the project root to `campus-events-backend/pom.xml`

### 3.4 Create application.properties
Create `src/main/resources/application.properties`:
```properties
# Server Configuration
server.port=9091
spring.application.name=campus-events-api

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/campus_events?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=campus_admin
spring.datasource.password=campus_password123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT Configuration (Generate a secure key)
jwt.secret=mySecretKey123456789012345678901234567890123456789012345678901234
jwt.expiration=86400000

# CORS Configuration
cors.allowed.origins=http://localhost:9091,http://localhost:5173
```

## Step 4: Create All Java Files

Refer to these documentation files for complete code:

### 4.1 Main Application Class
See `SPRING_BOOT_PROJECT_STRUCTURE.md` - Section: Main Application Class

### 4.2 Entity Classes
See `SPRING_BOOT_SETUP.md` - Section: Entity Classes
Create these files in `src/main/java/com/campusevents/entity/`:
- User.java
- Event.java
- Attendance.java
- EventRegistration.java
- UserRole.java (enum)
- Feedback.java (add this)

### 4.3 Repository Interfaces
See `SPRING_BOOT_SETUP.md` - Section: Repository Interfaces
Create these files in `src/main/java/com/campusevents/repository/`:
- UserRepository.java
- EventRepository.java
- AttendanceRepository.java
- EventRegistrationRepository.java
- FeedbackRepository.java (add this)

### 4.4 Service Classes
See `SPRING_BOOT_SERVICES.md` - All service implementations
Create these files in `src/main/java/com/campusevents/service/`:
- AuthService.java
- EventService.java
- AttendanceService.java
- UserService.java
- FeedbackService.java (add this)

### 4.5 Controller Classes
See `SPRING_BOOT_CONTROLLERS.md` - All controllers
Create these files in `src/main/java/com/campusevents/controller/`:
- AuthController.java
- EventController.java
- AttendanceController.java
- UserController.java
- FeedbackController.java (add this)

### 4.6 Security Configuration
See `SPRING_BOOT_SECURITY.md` - All security classes
Create these files in `src/main/java/com/campusevents/security/`:
- SecurityConfig.java
- JwtService.java
- JwtAuthenticationFilter.java
- CustomUserDetailsService.java

### 4.7 DTO Classes
See `SPRING_BOOT_CONTROLLERS.md` - Section: DTO Classes
Create these files in `src/main/java/com/campusevents/dto/`:
- LoginRequest.java
- RegisterRequest.java
- AuthResponse.java
- EventRequest.java
- EventResponse.java
- AttendanceRequest.java
- AttendanceResponse.java
- UserResponse.java
- FeedbackRequest.java (add this)
- FeedbackResponse.java (add this)

### 4.8 Exception Handling
See `SPRING_BOOT_PROJECT_STRUCTURE.md` - Section: Exception Handling
Create these files in `src/main/java/com/campusevents/exception/`:
- GlobalExceptionHandler.java
- ResourceNotFoundException.java
- UnauthorizedException.java
- BadRequestException.java

## Step 5: Build and Run Spring Boot

### 5.1 Build the Project
```bash
cd campus-events-backend
mvn clean install
```

### 5.2 Run the Application
```bash
mvn spring-boot:run
```

You should see output like:
```
Started CampusEventsApplication in X.XXX seconds
```

### 5.3 Verify Backend is Running
Open browser and go to: `http://localhost:9091/api/events`
You should see an empty array `[]` or authentication error (which is good - means it's running)

## Step 6: Test with Postman

### 6.1 Import Postman Collection
See `POSTMAN_COLLECTION.md` for all endpoints

### 6.2 Test Registration
```bash
POST http://localhost:9091/api/auth/register
Content-Type: application/json

{
  "fullName": "Test Student",
  "email": "student@test.com",
  "password": "password123",
  "studentId": "STU001",
  "role": "STUDENT"
}
```

### 6.3 Test Login
```bash
POST http://localhost:9091/api/auth/login
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "password123"
}
```

Copy the JWT token from the response.

### 6.4 Test Protected Endpoint
```bash
GET http://localhost:9091/api/events
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## Step 7: Configure React Frontend

### 7.1 Create API Service File
Create `src/services/springBootApi.ts`:

```typescript
import axios from 'axios';

const BASE_URL = 'http://localhost:9091/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spring_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('spring_jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const springBootApi = {
  // Auth endpoints
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('spring_jwt_token', response.data.token);
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('spring_jwt_token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('spring_jwt_token');
  },

  // User endpoints
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getMyQRCode: async () => {
    const response = await api.get('/users/my-qr-code');
    return response.data;
  },

  // Event endpoints
  getAllEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  getEventById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data: any) => {
    const response = await api.post('/events', data);
    return response.data;
  },

  updateEvent: async (id: string, data: any) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  getUpcomingEvents: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },

  registerForEvent: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  // Attendance endpoints
  markAttendance: async (data: any) => {
    const response = await api.post('/attendance/mark', data);
    return response.data;
  },

  getEventAttendance: async (eventId: string) => {
    const response = await api.get(`/attendance/event/${eventId}`);
    return response.data;
  },

  getMyAttendance: async () => {
    const response = await api.get('/attendance/my-attendance');
    return response.data;
  },

  // Feedback endpoints
  submitFeedback: async (data: any) => {
    const response = await api.post('/feedback/submit', data);
    return response.data;
  },

  getEventFeedback: async (eventId: string) => {
    const response = await api.get(`/feedback/event/${eventId}`);
    return response.data;
  },
};
```

### 7.2 Update Environment Configuration
You can toggle between Supabase and Spring Boot by changing the API service import in your components.

## Step 8: Testing Full Integration

### 8.1 Start All Services
1. MySQL should be running
2. Start Spring Boot: `mvn spring-boot:run` (in backend folder)
3. React is already running in Lovable

### 8.2 Test Flow
1. Register a new student account
2. Login with the account
3. View upcoming events
4. Register for an event
5. Check attendance marking (faculty role)
6. Submit feedback

## Step 9: Common Issues and Solutions

### Issue 1: Connection Refused
**Solution**: Make sure Spring Boot is running on port 9091
```bash
# Check if port is in use
# macOS/Linux
lsof -i :9091
# Windows
netstat -ano | findstr :9091
```

### Issue 2: CORS Error
**Solution**: Add your React URL to CORS configuration in `application.properties`
```properties
cors.allowed.origins=http://localhost:9091,http://localhost:5173,https://your-lovable-app.lovable.app
```

### Issue 3: JWT Token Invalid
**Solution**: Check JWT secret key length (must be at least 256 bits)

### Issue 4: Database Connection Failed
**Solution**: Verify MySQL credentials and database exists
```bash
mysql -u campus_admin -p campus_events
```

## Step 10: QR Code Feature in Local Setup

The QR code feature will work perfectly in local setup:

1. **Student QR Generation**: Handled by React frontend (qrcode.react library)
2. **QR Scanning**: Handled by React frontend (html5-qrcode library)
3. **QR Data Storage**: Stored in MySQL database via Spring Boot API

**QR Data Format**: `STUDENT:{userId}:{studentId}:{timestamp}`

No special configuration needed - it works out of the box!

## Next Steps

1. ✅ Set up MySQL database
2. ✅ Create Spring Boot project structure
3. ✅ Copy all Java code from documentation files
4. ✅ Build and run Spring Boot
5. ✅ Test all endpoints with Postman
6. ✅ Configure React to use Spring Boot API
7. ✅ Test full integration

## Useful Commands

```bash
# Build Spring Boot
mvn clean install

# Run Spring Boot
mvn spring-boot:run

# Run Spring Boot with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Create JAR file
mvn clean package

# Run JAR file
java -jar target/campus-events-backend-1.0.0.jar

# Check MySQL database
mysql -u campus_admin -p campus_events

# View all tables
SHOW TABLES;

# View table structure
DESCRIBE users;
```

## Production Deployment

For production deployment options (Heroku, Railway, AWS), see:
- `SPRING_BOOT_SETUP.md` - Section: Deployment Instructions
- `SPRING_BOOT_PROJECT_STRUCTURE.md` - Section: Dockerfile

## Additional Resources

- Full API Documentation: `API_DOCUMENTATION.md`
- Postman Collection: `POSTMAN_COLLECTION.md`
- Spring Boot Controllers: `SPRING_BOOT_CONTROLLERS.md`
- Spring Boot Services: `SPRING_BOOT_SERVICES.md`
- Spring Boot Security: `SPRING_BOOT_SECURITY.md`
- MySQL Setup: `MYSQL_SETUP_GUIDE.md`
