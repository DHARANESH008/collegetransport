package com.college.transport.repository;

import com.college.transport.entity.TripHistory;
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
public interface TripHistoryRepository extends JpaRepository<TripHistory, Long> {

    Optional<TripHistory> findByBusIdAndTripDate(Long busId, LocalDate tripDate);
    Optional<TripHistory> findByDriverIdAndTripDate(Long driverId, LocalDate tripDate);
    Optional<TripHistory> findByBusNumberAndTripDate(Integer busNumber, LocalDate tripDate);

    List<TripHistory> findByDriverIdOrderByTripDateDescCreatedAtDesc(Long driverId);
    List<TripHistory> findByTripDateOrderByCreatedAtDesc(LocalDate tripDate);

    @Query("SELECT t FROM TripHistory t WHERE t.tripDate BETWEEN :startDate AND :endDate ORDER BY t.tripDate DESC, t.startTime ASC")
    List<TripHistory> findBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Find the latest completed/recorded end_km for a bus to auto-populate today's Start KM
    @Query("SELECT t FROM TripHistory t WHERE t.bus.id = :busId AND t.endKm IS NOT NULL AND t.endKm > 0 ORDER BY t.tripDate DESC, t.id DESC")
    List<TripHistory> findPreviousTripsWithEndKm(@Param("busId") Long busId);

    @Query("SELECT COUNT(DISTINCT t.bus.id) FROM TripHistory t WHERE t.tripDate = :date AND t.journeyStatus != 'NOT_STARTED'")
    Long countActiveBusesToday(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(t.totalDistance), 0.0) FROM TripHistory t WHERE t.tripDate = :date")
    Double sumDistanceByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(t.studentCount), 0) FROM TripHistory t WHERE t.tripDate = :date")
    Long sumStudentsByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM TripHistory t WHERE t.tripDate = :date AND t.journeyStatus = 'IN_TRANSIT'")
    Long countRunningTripsToday(@Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM TripHistory t WHERE t.tripDate = :date AND t.journeyStatus = 'COMPLETED'")
    Long countCompletedTripsToday(@Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM TripHistory t WHERE t.tripDate = :date AND (t.journeyStatus = 'NOT_STARTED' OR t.journeyStatus = 'COLLEGE_ARRIVED')")
    Long countPendingTripsToday(@Param("date") LocalDate date);

    // 3-Month Auto Data Retention Purge query
    @Modifying
    @Query("DELETE FROM TripHistory th WHERE th.createdAt < :cutoffDate")
    int deleteOlderThanCutoff(@Param("cutoffDate") LocalDateTime cutoffDate);

    @Modifying
    @Query("DELETE FROM TripHistory th WHERE th.bus.id = :busId")
    int deleteByBusId(@Param("busId") Long busId);

    @Modifying
    @Query("DELETE FROM TripHistory th WHERE th.driver.id = :driverId")
    int deleteByDriverId(@Param("driverId") Long driverId);
}
