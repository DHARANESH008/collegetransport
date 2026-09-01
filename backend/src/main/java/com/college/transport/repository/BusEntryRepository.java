package com.college.transport.repository;

import com.college.transport.entity.BusEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusEntryRepository extends JpaRepository<BusEntry, Long> {
    Optional<BusEntry> findByBusIdAndEntryDate(Long busId, LocalDate entryDate);
    Optional<BusEntry> findByBusNumberAndEntryDate(Integer busNumber, LocalDate entryDate);
    Boolean existsByBusIdAndEntryDate(Long busId, LocalDate entryDate);
    Boolean existsByBusNumberAndEntryDate(Integer busNumber, LocalDate entryDate);

    List<BusEntry> findByEntryDateOrderByEntryTimeDesc(LocalDate entryDate);

    @Query("SELECT be FROM BusEntry be WHERE be.entryDate BETWEEN :startDate AND :endDate ORDER BY be.entryDate DESC, be.entryTime DESC")
    List<BusEntry> findBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(be) FROM BusEntry be WHERE be.entryDate = :date")
    Long countByEntryDate(@Param("date") LocalDate date);

    // 3-Month Auto Data Retention Purge query
    @Modifying
    @Query("DELETE FROM BusEntry be WHERE be.createdAt < :cutoffDate")
    int deleteOlderThanCutoff(@Param("cutoffDate") LocalDateTime cutoffDate);

    @Modifying
    @Query("DELETE FROM BusEntry be WHERE be.bus.id = :busId")
    int deleteByBusId(@Param("busId") Long busId);

    @Modifying
    @Query("DELETE FROM BusEntry be WHERE be.securityUser.id = :securityId")
    int deleteBySecurityUserId(@Param("securityId") Long securityId);

    @Modifying
    @Query("DELETE FROM BusEntry be WHERE be.gate.id = :gateId")
    int deleteByGateId(@Param("gateId") Long gateId);
}
