package com.campusevents.repository;

import com.campusevents.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    List<Attendance> findByEvent_Id(String eventId);
    List<Attendance> findByStudent_Id(String studentId);
    boolean existsByEvent_IdAndStudent_Id(String eventId, String studentId);
}
