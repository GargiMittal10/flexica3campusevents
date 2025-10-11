# Spring Boot Backend Setup Guide

## Prerequisites
- Java 21
- Maven 3.8+
- MySQL 8.0+
- IntelliJ IDEA or Eclipse

## 1. Database Configuration

### application.properties
```properties
# Server Configuration
server.port=9091
spring.application.name=campus-events-api

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/campus_events?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT Configuration
jwt.secret=your_secret_key_here_minimum_256_bits
jwt.expiration=86400000

# CORS Configuration
cors.allowed.origins=http://localhost:5173,http://localhost:9091,https://your-lovable-app.lovable.app
```

## 2. Entity Classes

### User.java
```java
package com.campusevents.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String studentId;
    
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    private String qrCodeData;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
}
```

### Event.java
```java
package com.campusevents.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime eventDate;
    
    private String location;
    
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
}
```

### Attendance.java
```java
package com.campusevents.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "marked_by", nullable = false)
    private User markedBy;
    
    private String qrData;
    
    @Column(nullable = false)
    private LocalDateTime markedAt = LocalDateTime.now();
}
```

### EventRegistration.java
```java
package com.campusevents.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations")
@Data
public class EventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @Column(nullable = false)
    private LocalDateTime registeredAt = LocalDateTime.now();
}
```

### UserRole.java
```java
package com.campusevents.entity;

public enum UserRole {
    STUDENT,
    FACULTY,
    ADMIN
}
```

## 3. Repository Interfaces

### UserRepository.java
```java
package com.campusevents.repository;

import com.campusevents.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

### EventRepository.java
```java
package com.campusevents.repository;

import com.campusevents.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    List<Event> findByEventDateAfter(LocalDateTime date);
    List<Event> findByEventDateBefore(LocalDateTime date);
    List<Event> findByCreatedBy_Id(String userId);
}
```

### AttendanceRepository.java
```java
package com.campusevents.repository;

import com.campusevents.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    List<Attendance> findByEvent_Id(String eventId);
    List<Attendance> findByStudent_Id(String studentId);
    boolean existsByEvent_IdAndStudent_Id(String eventId, String studentId);
}
```

### EventRegistrationRepository.java
```java
package com.campusevents.repository;

import com.campusevents.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, String> {
    List<EventRegistration> findByStudent_Id(String studentId);
    List<EventRegistration> findByEvent_Id(String eventId);
    boolean existsByEvent_IdAndStudent_Id(String eventId, String studentId);
}
```

## 4. Deployment Instructions

### Local Development
```bash
# Clone your Spring Boot project
git clone <your-repo>
cd campus-events-backend

# Build with Maven
mvn clean install

# Run the application
mvn spring-boot:run
```

### Deploy to Railway (Recommended)
1. Create account at https://railway.app/
2. Connect your GitHub repository
3. Add MySQL database service
4. Set environment variables in Railway dashboard
5. Deploy automatically on git push

### Deploy to Heroku
```bash
# Install Heroku CLI
heroku login
heroku create campus-events-api

# Add MySQL
heroku addons:create jawsdb:kitefin

# Deploy
git push heroku main
```

## 5. Testing Endpoints

### Test with cURL
```bash
# Register User
curl -X POST http://localhost:9091/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "studentId": "12345",
    "role": "STUDENT"
  }'

# Login
curl -X POST http://localhost:9091/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Events (with JWT token)
curl -X GET http://localhost:9091/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Next Steps
1. Complete the controller and service implementations (see SPRING_BOOT_CONTROLLERS.md)
2. Set up JWT authentication (see SPRING_BOOT_SECURITY.md)
3. Deploy to Railway or Heroku
4. Update React frontend to use Spring Boot API
