package com.campusevents.controller;

import com.campusevents.dto.EventDTO;
import com.campusevents.entity.Event;
import com.campusevents.entity.EventRegistration;
import com.campusevents.entity.User;
import com.campusevents.service.EventService;
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
@RequestMapping("/api/events")
public class EventController {
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<Event> createEvent(@Valid @RequestBody EventDTO eventDTO, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        Event event = eventService.createEvent(eventDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }
    
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllUpcomingEvents());
    }
    
    @GetMapping("/{eventId}")
    public ResponseEntity<Event> getEventById(@PathVariable String eventId) {
        Event event = eventService.getEventById(eventId);
        return ResponseEntity.ok(event);
    }
    
    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable String eventId,
            @Valid @RequestBody EventDTO eventDTO,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        Event event = eventService.updateEvent(eventId, eventDTO, user);
        return ResponseEntity.ok(event);
    }
    
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String eventId, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        eventService.deleteEvent(eventId, user);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{eventId}/register")
    public ResponseEntity<EventRegistration> registerForEvent(
            @PathVariable String eventId,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        EventRegistration registration = eventService.registerForEvent(eventId, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(registration);
    }
    
    @GetMapping("/{eventId}/registrations")
    public ResponseEntity<List<Map<String, Object>>> getEventRegistrations(@PathVariable String eventId) {
        List<Map<String, Object>> registrations = eventService.getEventRegistrations(eventId);
        return ResponseEntity.ok(registrations);
    }
}
