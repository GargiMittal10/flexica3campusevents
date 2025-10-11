package com.campusevents.repository;

import com.campusevents.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, String> {
    List<EventRegistration> findByStudent_Id(String studentId);
    List<EventRegistration> findByEvent_Id(String eventId);
    boolean existsByEvent_IdAndStudent_Id(String eventId, String studentId);
}
