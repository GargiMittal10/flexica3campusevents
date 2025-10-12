package com.campusevents.service;

import com.campusevents.dto.AttendanceDTO;
import com.campusevents.entity.Attendance;
import com.campusevents.entity.Event;
import com.campusevents.entity.User;
import com.campusevents.repository.AttendanceRepository;
import com.campusevents.repository.EventRepository;
import com.campusevents.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AttendanceService {
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Attendance markAttendance(AttendanceDTO attendanceDTO, User faculty) {
        if (!"FACULTY".equals(faculty.getRole().name()) && !"ADMIN".equals(faculty.getRole().name())) {
            throw new RuntimeException("Only faculty and admin can mark attendance");
        }
        
        Event event = eventRepository.findById(attendanceDTO.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Parse QR data to extract student ID
        String qrData = attendanceDTO.getQrData();
        String[] parts = qrData.split(":");
        if (parts.length < 2) {
            throw new RuntimeException("Invalid QR code format");
        }
        
        String studentId = parts[1]; // Extract student UUID from QR data
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        if (!"STUDENT".equals(student.getRole().name())) {
            throw new RuntimeException("QR code does not belong to a student");
        }
        
        if (attendanceRepository.existsByEvent_IdAndStudent_Id(attendanceDTO.getEventId(), studentId)) {
            throw new RuntimeException("Attendance already marked for this student");
        }
        
        Attendance attendance = new Attendance();
        attendance.setEvent(event);
        attendance.setStudent(student);
        attendance.setMarkedBy(faculty);
        attendance.setQrData(qrData);
        
        return attendanceRepository.save(attendance);
    }
    
    public List<Map<String, Object>> getEventAttendance(String eventId) {
        List<Attendance> attendanceList = attendanceRepository.findByEvent_Id(eventId);
        
        return attendanceList.stream().map(att -> {
            Map<String, Object> map = new HashMap<>();
            map.put("studentId", att.getStudent().getId());
            map.put("fullName", att.getStudent().getFullName());
            map.put("studentId", att.getStudent().getStudentId());
            map.put("email", att.getStudent().getEmail());
            map.put("markedAt", att.getMarkedAt());
            return map;
        }).collect(Collectors.toList());
    }
}
