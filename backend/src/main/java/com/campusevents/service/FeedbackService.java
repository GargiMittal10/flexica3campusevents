package com.campusevents.service;

import com.campusevents.dto.FeedbackDTO;
import com.campusevents.entity.Event;
import com.campusevents.entity.EventFeedback;
import com.campusevents.entity.User;
import com.campusevents.repository.AttendanceRepository;
import com.campusevents.repository.EventFeedbackRepository;
import com.campusevents.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FeedbackService {
    
    @Autowired
    private EventFeedbackRepository feedbackRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    public EventFeedback submitFeedback(String eventId, FeedbackDTO feedbackDTO, User student) {
        if (!"STUDENT".equals(student.getRole().name())) {
            throw new RuntimeException("Only students can submit feedback");
        }
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check if student attended the event
        if (!attendanceRepository.existsByEvent_IdAndStudent_Id(eventId, student.getId())) {
            throw new RuntimeException("You can only provide feedback for events you attended");
        }
        
        // Check if feedback already submitted
        if (feedbackRepository.existsByEvent_IdAndStudent_Id(eventId, student.getId())) {
            throw new RuntimeException("You have already submitted feedback for this event");
        }
        
        EventFeedback feedback = new EventFeedback();
        feedback.setEvent(event);
        feedback.setStudent(student);
        feedback.setRating(feedbackDTO.getRating());
        feedback.setComment(feedbackDTO.getComment());
        
        return feedbackRepository.save(feedback);
    }
    
    public List<Map<String, Object>> getEventFeedback(String eventId) {
        List<EventFeedback> feedbackList = feedbackRepository.findByEvent_Id(eventId);
        
        return feedbackList.stream().map(fb -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", fb.getId());
            map.put("studentName", fb.getStudent().getFullName());
            map.put("rating", fb.getRating());
            map.put("comment", fb.getComment());
            map.put("submittedAt", fb.getSubmittedAt());
            return map;
        }).collect(Collectors.toList());
    }
}
