package com.campusevents.controller;

import com.campusevents.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/student/{studentId}/attendance-percentage")
    public ResponseEntity<Map<String, Object>> getStudentAttendancePercentage(@PathVariable String studentId) {
        Map<String, Object> stats = analyticsService.getStudentAttendancePercentage(studentId);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/event/{eventId}/participation-report")
    public ResponseEntity<Map<String, Object>> getEventParticipationReport(@PathVariable String eventId) {
        Map<String, Object> report = analyticsService.getEventParticipationReport(eventId);
        return ResponseEntity.ok(report);
    }
}
