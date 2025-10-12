package com.campusevents.controller;

import com.campusevents.dto.FeedbackDTO;
import com.campusevents.entity.EventFeedback;
import com.campusevents.entity.User;
import com.campusevents.service.FeedbackService;
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
@RequestMapping("/api/feedback")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/event/{eventId}")
    public ResponseEntity<EventFeedback> submitFeedback(
            @PathVariable String eventId,
            @Valid @RequestBody FeedbackDTO feedbackDTO,
            Authentication authentication) {
        String email = authentication.getName();
        User student = userService.getUserByEmail(email);
        EventFeedback feedback = feedbackService.submitFeedback(eventId, feedbackDTO, student);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Map<String, Object>>> getEventFeedback(@PathVariable String eventId) {
        List<Map<String, Object>> feedbackList = feedbackService.getEventFeedback(eventId);
        return ResponseEntity.ok(feedbackList);
    }
}
