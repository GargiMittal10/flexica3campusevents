package com.campusevents.repository;

import com.campusevents.entity.EventFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventFeedbackRepository extends JpaRepository<EventFeedback, String> {
    List<EventFeedback> findByEvent_Id(String eventId);
    List<EventFeedback> findByStudent_Id(String studentId);
    boolean existsByEvent_IdAndStudent_Id(String eventId, String studentId);
}
