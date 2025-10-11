package com.campusevents.repository;

import com.campusevents.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    List<Event> findByEventDateAfter(LocalDateTime date);
    List<Event> findByEventDateBefore(LocalDateTime date);
    List<Event> findByCreatedBy_Id(String userId);
}
