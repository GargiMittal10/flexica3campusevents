package com.campusevents.controller;

import com.campusevents.dto.AttendanceDTO;
import com.campusevents.entity.Attendance;
import com.campusevents.entity.User;
import com.campusevents.service.AttendanceService;
import com.campusevents.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    
    @Autowired
    private AttendanceService attendanceService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/mark")
    public ResponseEntity<Attendance> markAttendance(
            @Valid @RequestBody AttendanceDTO attendanceDTO,
            Authentication authentication) {
        String email = authentication.getName();
        User faculty = userService.getUserByEmail(email);
        Attendance attendance = attendanceService.markAttendance(attendanceDTO, faculty);
        return ResponseEntity.status(HttpStatus.CREATED).body(attendance);
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Map<String, Object>>> getEventAttendance(@PathVariable String eventId) {
        List<Map<String, Object>> attendance = attendanceService.getEventAttendance(eventId);
        return ResponseEntity.ok(attendance);
    }
}
