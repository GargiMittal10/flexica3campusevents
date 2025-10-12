package com.campusevents.service;

import com.campusevents.dto.EventDTO;
import com.campusevents.entity.Event;
import com.campusevents.entity.EventRegistration;
import com.campusevents.entity.User;
import com.campusevents.repository.EventRegistrationRepository;
import com.campusevents.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventRegistrationRepository registrationRepository;
    
    public Event createEvent(EventDTO eventDTO, User creator) {
        if (!"FACULTY".equals(creator.getRole().name()) && !"ADMIN".equals(creator.getRole().name())) {
            throw new RuntimeException("Only faculty and admin can create events");
        }
        
        Event event = new Event();
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setEventDate(eventDTO.getEventDate());
        event.setLocation(eventDTO.getLocation());
        event.setCreatedBy(creator);
        
        return eventRepository.save(event);
    }
    
    public List<Event> getAllUpcomingEvents() {
        return eventRepository.findByEventDateAfter(LocalDateTime.now());
    }
    
    public Event getEventById(String eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }
    
    public Event updateEvent(String eventId, EventDTO eventDTO, User user) {
        Event event = getEventById(eventId);
        
        if (!event.getCreatedBy().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole().name())) {
            throw new RuntimeException("You can only update your own events");
        }
        
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setEventDate(eventDTO.getEventDate());
        event.setLocation(eventDTO.getLocation());
        
        return eventRepository.save(event);
    }
    
    public void deleteEvent(String eventId, User user) {
        Event event = getEventById(eventId);
        
        if (!event.getCreatedBy().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole().name())) {
            throw new RuntimeException("You can only delete your own events");
        }
        
        eventRepository.delete(event);
    }
    
    public EventRegistration registerForEvent(String eventId, User student) {
        if (!"STUDENT".equals(student.getRole().name())) {
            throw new RuntimeException("Only students can register for events");
        }
        
        Event event = getEventById(eventId);
        
        if (registrationRepository.existsByEvent_IdAndStudent_Id(eventId, student.getId())) {
            throw new RuntimeException("Already registered for this event");
        }
        
        EventRegistration registration = new EventRegistration();
        registration.setEvent(event);
        registration.setStudent(student);
        
        return registrationRepository.save(registration);
    }
    
    public List<Map<String, Object>> getEventRegistrations(String eventId) {
        List<EventRegistration> registrations = registrationRepository.findByEvent_Id(eventId);
        
        return registrations.stream().map(reg -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", reg.getStudent().getId());
            map.put("fullName", reg.getStudent().getFullName());
            map.put("email", reg.getStudent().getEmail());
            map.put("studentId", reg.getStudent().getStudentId());
            map.put("registeredAt", reg.getRegisteredAt());
            return map;
        }).collect(Collectors.toList());
    }
}
