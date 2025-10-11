# Campus Events Frontend

React frontend for Campus Events Management System, connected to Spring Boot backend.

## Prerequisites
- Node.js 18+
- npm or yarn
- Spring Boot backend running on http://localhost:9091

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at: http://localhost:5173

## API Configuration

The frontend connects to the Spring Boot backend at `http://localhost:9091/api`. 

To change this, update `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://your-backend-url/api';
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # API service layer (connects to Spring Boot)
│   ├── lib/           # Utilities
│   └── App.tsx        # Main app component
├── public/            # Static assets
└── package.json
```

## Features

- **Student Dashboard**: View QR code, register for events, track attendance
- **Faculty Dashboard**: Create events, scan QR codes, manage attendance
- **Admin Dashboard**: Approve faculty, manage system
- **Authentication**: JWT-based authentication with Spring Boot
