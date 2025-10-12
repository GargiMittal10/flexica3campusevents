package com.campusevents.service;

import com.campusevents.entity.Attendance;
import com.campusevents.entity.EventRegistration;
import com.campusevents.repository.AttendanceRepository;
import com.campusevents.repository.EventRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {
    
    @Autowired
    private EventRegistrationRepository registrationRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    public Map<String, Object> getStudentAttendancePercentage(String studentId) {
        List<EventRegistration> registrations = registrationRepository.findByStudent_Id(studentId);
        List<Attendance> attendances = attendanceRepository.findByStudent_Id(studentId);
        
        int totalRegistered = registrations.size();
        int totalAttended = attendances.size();
        double percentage = totalRegistered > 0 ? (totalAttended * 100.0) / totalRegistered : 0;
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEventsRegistered", totalRegistered);
        stats.put("totalEventsAttended", totalAttended);
        stats.put("attendancePercentage", Math.round(percentage * 100.0) / 100.0);
        
        // Get recent attendance
        List<Map<String, Object>> recentAttendance = new ArrayList<>();
        for (int i = 0; i < Math.min(5, attendances.size()); i++) {
            Attendance att = attendances.get(i);
            Map<String, Object> attMap = new HashMap<>();
            attMap.put("eventTitle", att.getEvent().getTitle());
            attMap.put("eventDate", att.getEvent().getEventDate());
            attMap.put("markedAt", att.getMarkedAt());
            recentAttendance.add(attMap);
        }
        stats.put("recentAttendance", recentAttendance);
        
        return stats;
    }
    
    public Map<String, Object> getEventParticipationReport(String eventId) {
        List<EventRegistration> registrations = registrationRepository.findByEvent_Id(eventId);
        List<Attendance> attendances = attendanceRepository.findByEvent_Id(eventId);
        
        Map<String, Object> report = new HashMap<>();
        report.put("eventId", eventId);
        report.put("totalRegistered", registrations.size());
        report.put("totalAttended", attendances.size());
        report.put("attendanceRate", registrations.size() > 0 ? 
                (attendances.size() * 100.0) / registrations.size() : 0);
        
        return report;
    }
}
