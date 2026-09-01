package com.college.transport.repository;

import com.college.transport.entity.SystemCleanupLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemCleanupLogRepository extends JpaRepository<SystemCleanupLog, Long> {
    List<SystemCleanupLog> findAllByOrderByCleanupTimestampDesc();
}
