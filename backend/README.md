# Campus Events Backend

Spring Boot backend for Campus Events Management System.

## Prerequisites
- Java 21
- Maven 3.8+
- MySQL 8.0+

## Setup

1. Make sure MySQL is running with the campus_events database created
2. Update `src/main/resources/application.properties` with your MySQL credentials
3. Build and run:

```bash
mvn clean install
mvn spring-boot:run
```

The API will be available at: http://localhost:9091/api

## Testing

Test the registration endpoint:
```bash
curl -X POST http://localhost:9091/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "studentId": "12345",
    "role": "STUDENT"
  }'
```

## Documentation

See the root project for complete documentation:
- SPRING_BOOT_SETUP.md
- SPRING_BOOT_CONTROLLERS.md
- LOCAL_DEVELOPMENT_GUIDE.md
