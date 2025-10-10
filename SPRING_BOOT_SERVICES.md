# Spring Boot Service Layer

## AuthService.java
```java
package com.campusevents.service;

import com.campusevents.dto.AuthResponse;
import com.campusevents.dto.LoginRequest;
import com.campusevents.dto.RegisterRequest;
import com.campusevents.entity.User;
import com.campusevents.repository.UserRepository;
import com.campusevents.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStudentId(request.getStudentId());
        user.setRole(request.getRole());
        
        // Generate QR code data for students
        if (request.getRole().name().equals("STUDENT")) {
            user.setQrCodeData("STUDENT:" + user.getId() + ":" + request.getStudentId() + ":" + System.currentTimeMillis());
        }

        user = userRepository.save(user);

        String token = jwtService.generateToken(
            org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().name())
                .build()
        );

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(
            org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().name())
                .build()
        );

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    public void resetPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // TODO: Implement email sending logic
        // Generate password reset token and send email
    }
}
```

## EventService.java
```java
package com.campusevents.service;

import com.campusevents.dto.EventRequest;
import com.campusevents.dto.EventResponse;
import com.campusevents.entity.Event;
import com.campusevents.entity.EventRegistration;
import com.campusevents.entity.User;
import com.campusevents.repository.EventRegistrationRepository;
import com.campusevents.repository.EventRepository;
import com.campusevents.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventRegistrationRepository registrationRepository;

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return mapToResponse(event);
    }

    @Transactional
    public EventResponse createEvent(EventRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setCreatedBy(user);

        event = eventRepository.save(event);
        return mapToResponse(event);
    }

    @Transactional
    public EventResponse updateEvent(String id, EventRequest request, String userEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!event.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to update this event");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setUpdatedAt(LocalDateTime.now());

        event = eventRepository.save(event);
        return mapToResponse(event);
    }

    @Transactional
    public void deleteEvent(String id, String userEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!event.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this event");
        }

        eventRepository.delete(event);
    }

    public List<EventResponse> getUpcomingEvents() {
        return eventRepository.findByEventDateAfter(LocalDateTime.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void registerForEvent(String eventId, String userEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (registrationRepository.existsByEvent_IdAndStudent_Id(eventId, user.getId())) {
            throw new RuntimeException("Already registered for this event");
        }

        EventRegistration registration = new EventRegistration();
        registration.setEvent(event);
        registration.setStudent(user);

        registrationRepository.save(registration);
    }

    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .createdBy(event.getCreatedBy().getFullName())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
```

## AttendanceService.java
```java
package com.campusevents.service;

import com.campusevents.dto.AttendanceRequest;
import com.campusevents.dto.AttendanceResponse;
import com.campusevents.entity.Attendance;
import com.campusevents.entity.Event;
import com.campusevents.entity.User;
import com.campusevents.repository.AttendanceRepository;
import com.campusevents.repository.EventRepository;
import com.campusevents.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public AttendanceResponse markAttendance(AttendanceRequest request, String facultyEmail) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User faculty = userRepository.findByEmail(facultyEmail)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        // Parse QR code data to get student ID
        String qrData = request.getQrData();
        String[] parts = qrData.split(":");
        if (parts.length < 3) {
            throw new RuntimeException("Invalid QR code");
        }

        String studentId = parts[1];
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Check if already marked
        if (attendanceRepository.existsByEvent_IdAndStudent_Id(event.getId(), student.getId())) {
            throw new RuntimeException("Attendance already marked for this student");
        }

        Attendance attendance = new Attendance();
        attendance.setEvent(event);
        attendance.setStudent(student);
        attendance.setMarkedBy(faculty);
        attendance.setQrData(qrData);

        attendance = attendanceRepository.save(attendance);
        return mapToResponse(attendance);
    }

    public List<AttendanceResponse> getEventAttendance(String eventId) {
        return attendanceRepository.findByEvent_Id(eventId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getStudentAttendance(String studentId) {
        return attendanceRepository.findByStudent_Id(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getStudentAttendanceByEmail(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return getStudentAttendance(student.getId());
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .eventId(attendance.getEvent().getId())
                .eventTitle(attendance.getEvent().getTitle())
                .studentId(attendance.getStudent().getStudentId())
                .studentName(attendance.getStudent().getFullName())
                .markedBy(attendance.getMarkedBy().getFullName())
                .markedAt(attendance.getMarkedAt())
                .build();
    }
}
```

## UserService.java
```java
package com.campusevents.service;

import com.campusevents.dto.UserResponse;
import com.campusevents.entity.User;
import com.campusevents.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    public String getQRCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getQrCodeData();
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .studentId(user.getStudentId())
                .role(user.getRole().name())
                .qrCodeData(user.getQrCodeData())
                .build();
    }
}
```
