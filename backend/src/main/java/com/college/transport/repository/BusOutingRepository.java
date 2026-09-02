package com.college.transport.repository;

import com.college.transport.entity.BusOuting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BusOutingRepository extends JpaRepository<BusOuting, Long> {

    List<BusOuting> findByOutingDateOrderByExitTimeDesc(LocalDate date);

    @Query("SELECT o FROM BusOuting o WHERE o.outingDate = :today ORDER BY o.exitTime DESC")
    List<BusOuting> findTodayOutings(LocalDate today);

    void deleteByCreatedAtBefore(LocalDateTime cutoff);
}
