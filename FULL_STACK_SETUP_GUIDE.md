# Full Stack Setup Guide - Campus Events Management System

This guide will help you set up both the Spring Boot backend and React frontend.

## Project Structure

```
flexica3campusevents-main/
├── backend/                    # Spring Boot REST API
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── README.md
├── frontend/                   # React Application (TO BE CREATED)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/          # API integration layer
│   │   └── App.tsx
│   ├── package.json
│   └── README.md
└── Documentation files
```

## Part 1: Backend Setup (Spring Boot + MySQL)

### Step 1: MySQL Database
Make sure MySQL is running with the database created:
```sql
CREATE DATABASE campus_events;
CREATE USER 'campus_admin'@'localhost' IDENTIFIED BY 'Foilrocks200#Q';
GRANT ALL PRIVILEGES ON campus_events.* TO 'campus_admin'@'localhost';
FLUSH PRIVILEGES;
```

### Step 2: Configure Backend
The `backend/src/main/resources/application.properties` is already configured with your credentials.

### Step 3: Build and Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Verify: Open http://localhost:9091/api/auth/login (should see 401 error - that's good!)

### Step 4: Test Backend API
```bash
# Test registration
curl -X POST http://localhost:9091/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Student",
    "email": "test@test.com",
    "password": "password123",
    "studentId": "STU001",
    "role": "STUDENT"
  }'
```

## Part 2: Frontend Setup (React + API Integration)

### Step 1: Move Frontend Files
Your current `src/` folder needs to be moved to `frontend/src/`:

**Option A: Manual Move (Windows)**
1. Create `frontend` folder in project root
2. Copy entire `src/` folder into `frontend/`
3. Copy `index.html`, `package.json`, `vite.config.ts`, `tailwind.config.ts` into `frontend/`
4. Copy all other config files (tsconfig, eslint, etc.) into `frontend/`

**Option B: Use PowerShell**
```powershell
cd C:\Users\aryan\OneDrive\Desktop\flexica3campusevents-main

# Create frontend directory
New-Item -ItemType Directory -Force -Path frontend

# Copy files to frontend
Copy-Item -Path src -Destination frontend\ -Recurse
Copy-Item -Path public -Destination frontend\ -Recurse
Copy-Item -Path index.html -Destination frontend\
Copy-Item -Path package.json -Destination frontend\
Copy-Item -Path vite.config.ts -Destination frontend\
Copy-Item -Path tailwind.config.ts -Destination frontend\
Copy-Item -Path tsconfig*.json -Destination frontend\
Copy-Item -Path eslint.config.js -Destination frontend\
Copy-Item -Path postcss.config.js -Destination frontend\
Copy-Item -Path components.json -Destination frontend\
```

### Step 2: Install axios for API calls
```bash
cd frontend
npm install axios
```

### Step 3: Update API Integration
I've already created the API service files in `frontend/src/services/`:
- `api.ts` - Base axios configuration
- `authService.ts` - Authentication (login, register, logout)
- `eventService.ts` - Event CRUD operations
- `registrationService.ts` - Event registrations
- `attendanceService.ts` - Attendance marking
- `feedbackService.ts` - Event feedback
- `qrService.ts` - QR code generation/validation

### Step 4: Update Components (NEXT STEP)
You'll need to update your React components to use the new services instead of Supabase. I'll help you with this in the next step.

### Step 5: Run Frontend
```bash
cd frontend
npm install  # If you haven't already
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:9091

## How It Works

### Authentication Flow
1. User enters credentials on React login page
2. Frontend calls `authService.login(email, password)`
3. Service sends POST to `http://localhost:9091/api/auth/login`
4. Backend validates credentials, returns JWT token
5. Frontend stores token in localStorage
6. All subsequent requests include: `Authorization: Bearer <token>`

### API Request Flow
```
React Component → Service Layer → Axios → Spring Boot → MySQL → Response
```

Example:
```typescript
// In React component
import eventService from '@/services/eventService';

// Get upcoming events
const events = await eventService.getUpcomingEvents();
```

## Next Steps

1. ✅ Backend is running on port 9091
2. ✅ API service layer created
3. ⏳ Move frontend files to `frontend/` folder
4. ⏳ Update React components to use new services
5. ⏳ Remove Supabase dependencies
6. ⏳ Test full stack integration

## Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check port 9091 is free: `netstat -ano | findstr :9091`

### Frontend can't connect to backend
- Verify backend is running: http://localhost:9091/api/auth/login
- Check CORS configuration in `SecurityConfig.java`
- Look at browser console for errors

### CORS Issues
Backend is configured to accept requests from:
- http://localhost:5173 (React dev server)
- http://localhost:9091 (Backend)

If using different ports, update `cors.allowed.origins` in `application.properties`.

## Production Deployment

### Backend
1. Build: `mvn clean package`
2. Run: `java -jar target/campus-events-backend.jar`
3. Deploy to: Railway, Heroku, AWS, etc.

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to: Vercel, Netlify, etc.
3. Update API_BASE_URL to production backend URL

## Documentation

- `SPRING_BOOT_SETUP.md` - Backend setup details
- `SPRING_BOOT_CONTROLLERS.md` - API endpoints
- `LOCAL_DEVELOPMENT_GUIDE.md` - Development workflow
- `backend/README.md` - Backend-specific docs
- `frontend/README.md` - Frontend-specific docs
