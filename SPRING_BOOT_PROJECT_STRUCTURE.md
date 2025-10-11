# Complete Spring Boot Project Structure with Java 21

## Directory Structure

```
campus-events-backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── campusevents/
│   │   │           ├── CampusEventsApplication.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   ├── CorsConfig.java
│   │   │           │   └── ModelMapperConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── EventController.java
│   │   │           │   ├── AttendanceController.java
│   │   │           │   ├── UserController.java
│   │   │           │   └── AdminController.java
│   │   │           ├── dto/
│   │   │           │   ├── request/
│   │   │           │   │   ├── LoginRequest.java
│   │   │           │   │   ├── RegisterRequest.java
│   │   │           │   │   ├── EventRequest.java
│   │   │           │   │   └── AttendanceRequest.java
│   │   │           │   └── response/
│   │   │           │       ├── AuthResponse.java
│   │   │           │       ├── EventResponse.java
│   │   │           │       ├── AttendanceResponse.java
│   │   │           │       └── UserResponse.java
│   │   │           ├── entity/
│   │   │           │   ├── User.java
│   │   │           │   ├── Event.java
│   │   │           │   ├── Attendance.java
│   │   │           │   ├── EventRegistration.java
│   │   │           │   ├── PendingFacultyApproval.java
│   │   │           │   └── UserRole.java
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── EventRepository.java
│   │   │           │   ├── AttendanceRepository.java
│   │   │           │   ├── EventRegistrationRepository.java
│   │   │           │   └── PendingFacultyApprovalRepository.java
│   │   │           ├── service/
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── EventService.java
│   │   │           │   ├── AttendanceService.java
│   │   │           │   ├── UserService.java
│   │   │           │   ├── AdminService.java
│   │   │           │   └── QRCodeService.java
│   │   │           ├── security/
│   │   │           │   ├── JwtService.java
│   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │           │   └── CustomUserDetailsService.java
│   │   │           ├── exception/
│   │   │           │   ├── GlobalExceptionHandler.java
│   │   │           │   ├── ResourceNotFoundException.java
│   │   │           │   ├── UnauthorizedException.java
│   │   │           │   └── BadRequestException.java
│   │   │           └── util/
│   │   │               ├── DateUtil.java
│   │   │               └── QRCodeGenerator.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── db/
│   │           └── migration/
│   │               └── V1__Initial_Schema.sql
│   └── test/
│       └── java/
│           └── com/
│               └── campusevents/
│                   ├── CampusEventsApplicationTests.java
│                   ├── controller/
│                   │   ├── AuthControllerTest.java
│                   │   └── EventControllerTest.java
│                   ├── service/
│                   │   ├── AuthServiceTest.java
│                   │   └── EventServiceTest.java
│                   └── integration/
│                       └── AuthIntegrationTest.java
├── .gitignore
├── README.md
└── Dockerfile
```

## Main Application Class

### CampusEventsApplication.java
```java
package com.campusevents;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CampusEventsApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusEventsApplication.class, args);
        System.out.println("Campus Events API is running...");
    }
}
```

## Configuration Files

### application.properties
```properties
# Application Name
spring.application.name=campus-events-api

# Server Configuration
server.port=9091
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/campus_events
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true

# JWT Configuration
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

# CORS Configuration
cors.allowed.origins=http://localhost:5173,http://localhost:9091,https://*.lovable.app

# File Upload Configuration
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Mail Configuration (for password reset)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Actuator Configuration
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always

# Logging Configuration
logging.level.root=INFO
logging.level.com.campusevents=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Profile
spring.profiles.active=dev
```

### application-dev.properties
```properties
# Development Profile
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
cors.allowed.origins=http://localhost:5173
```

### application-prod.properties
```properties
# Production Profile
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
cors.allowed.origins=https://your-production-app.lovable.app
```

## Additional Configuration Classes

### ModelMapperConfig.java
```java
package com.campusevents.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
```

### CorsConfig.java
```java
package com.campusevents.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${cors.allowed.origins}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## Exception Handling

### GlobalExceptionHandler.java
```java
package com.campusevents.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.NOT_FOUND.value());
        error.put("error", "Not Found");
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentialsException(BadCredentialsException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.UNAUTHORIZED.value());
        error.put("error", "Unauthorized");
        error.put("message", "Invalid email or password");
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorizedException(UnauthorizedException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.UNAUTHORIZED.value());
        error.put("error", "Unauthorized");
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequestException(BadRequestException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Bad Request");
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, Object> error = new HashMap<>();
        Map<String, String> validationErrors = new HashMap<>();
        
        ex.getBindingResult().getFieldErrors().forEach(fieldError -> 
            validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage())
        );
        
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Validation Failed");
        error.put("errors", validationErrors);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(Exception ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.put("error", "Internal Server Error");
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### Custom Exceptions

#### ResourceNotFoundException.java
```java
package com.campusevents.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

#### UnauthorizedException.java
```java
package com.campusevents.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
```

#### BadRequestException.java
```java
package com.campusevents.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
```

## .gitignore
```
HELP.md
target/
!.mvn/wrapper/maven-wrapper.jar
!**/src/main/**/target/
!**/src/test/**/target/

### STS ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/
build/
!**/src/main/**/build/
!**/src/test/**/build/

### VS Code ###
.vscode/

### Application Properties ###
application-local.properties
application-secret.properties
```

## Dockerfile (for deployment)
```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/campus-events-backend.jar app.jar
EXPOSE 9091
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## README.md
```markdown
# Campus Events Backend API

RESTful API for Campus Events Management System built with Spring Boot 3.2 and Java 21.

## Technologies
- Java 21
- Spring Boot 3.2.5
- Spring Security + JWT
- PostgreSQL
- Maven
- Docker

## Getting Started

### Prerequisites
- Java 21
- Maven 3.8+
- PostgreSQL 14+

### Installation
1. Clone the repository
2. Update database credentials in `application.properties`
3. Run: `mvn clean install`
4. Start: `mvn spring-boot:run`

API will be available at: http://localhost:9091/api

## API Documentation
See SPRING_BOOT_CONTROLLERS.md for all endpoints.
```
