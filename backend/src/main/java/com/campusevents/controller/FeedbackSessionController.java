package com.campusevents.controller;

import com.campusevents.entity.User;
import com.campusevents.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback-sessions")
public class FeedbackSessionController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startFeedbackSession(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        String email = authentication.getName();
        User faculty = userService.getUserByEmail(email);
        String eventId = request.get("event_id");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Feedback session started for event: " + eventId);
        response.put("event_id", eventId);
        response.put("faculty_id", faculty.getId());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/end")
    public ResponseEntity<Map<String, Object>> endFeedbackSession(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        String eventId = request.get("event_id");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Feedback session ended for event: " + eventId);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/active/{eventId}")
    public ResponseEntity<Map<String, Object>> getActiveSession(@PathVariable String eventId) {
        Map<String, Object> response = new HashMap<>();
        response.put("is_active", true);
        response.put("event_id", eventId);
        
        return ResponseEntity.ok(response);
    }
}
