# Spring Boot REST Controllers

## AuthController.java
```java
package com.campusevents.controller;

import com.campusevents.dto.LoginRequest;
import com.campusevents.dto.RegisterRequest;
import com.campusevents.dto.AuthResponse;
import com.campusevents.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody String email) {
        authService.resetPassword(email);
        return ResponseEntity.ok("Password reset email sent");
    }
}
```

## EventController.java
```java
package com.campusevents.controller;

import com.campusevents.dto.EventRequest;
import com.campusevents.dto.EventResponse;
import com.campusevents.entity.Event;
import com.campusevents.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EventController {
    
    private final EventService eventService;
    
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<EventResponse> createEvent(
            @RequestBody EventRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(eventService.createEvent(request, authentication.getName()));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable String id,
            @RequestBody EventRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(eventService.updateEvent(id, request, authentication.getName()));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable String id,
            Authentication authentication) {
        eventService.deleteEvent(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }
    
    @PostMapping("/{eventId}/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> registerForEvent(
            @PathVariable String eventId,
            Authentication authentication) {
        eventService.registerForEvent(eventId, authentication.getName());
        return ResponseEntity.ok("Successfully registered for event");
    }
}
```

## AttendanceController.java
```java
package com.campusevents.controller;

import com.campusevents.dto.AttendanceRequest;
import com.campusevents.dto.AttendanceResponse;
import com.campusevents.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    
    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<AttendanceResponse> markAttendance(
            @RequestBody AttendanceRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
            attendanceService.markAttendance(request, authentication.getName())
        );
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<AttendanceResponse>> getEventAttendance(
            @PathVariable String eventId) {
        return ResponseEntity.ok(attendanceService.getEventAttendance(eventId));
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceResponse>> getStudentAttendance(
            @PathVariable String studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendance(studentId));
    }
    
    @GetMapping("/my-attendance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<AttendanceResponse>> getMyAttendance(
            Authentication authentication) {
        return ResponseEntity.ok(
            attendanceService.getStudentAttendanceByEmail(authentication.getName())
        );
    }
}
```

## UserController.java
```java
package com.campusevents.controller;

import com.campusevents.dto.UserResponse;
import com.campusevents.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserByEmail(authentication.getName()));
    }
    
    @GetMapping("/my-qr-code")
    public ResponseEntity<String> getMyQRCode(Authentication authentication) {
        return ResponseEntity.ok(userService.getQRCode(authentication.getName()));
    }
}
```

## DTO Classes

### LoginRequest.java
```java
package com.campusevents.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
```

### RegisterRequest.java
```java
package com.campusevents.dto;

import com.campusevents.entity.UserRole;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String studentId;
    private UserRole role;
}
```

### AuthResponse.java
```java
package com.campusevents.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private String role;
}
```

### EventRequest.java
```java
package com.campusevents.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventRequest {
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String location;
}
```

### EventResponse.java
```java
package com.campusevents.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EventResponse {
    private String id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String location;
    private String createdBy;
    private LocalDateTime createdAt;
}
```

### AttendanceRequest.java
```java
package com.campusevents.dto;

import lombok.Data;

@Data
public class AttendanceRequest {
    private String eventId;
    private String qrData;
}
```

### AttendanceResponse.java
```java
package com.campusevents.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AttendanceResponse {
    private String id;
    private String eventId;
    private String eventTitle;
    private String studentId;
    private String studentName;
    private String markedBy;
    private LocalDateTime markedAt;
}
```

### UserResponse.java
```java
package com.campusevents.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private String id;
    private String fullName;
    private String email;
    private String studentId;
    private String role;
    private String qrCodeData;
}
```
