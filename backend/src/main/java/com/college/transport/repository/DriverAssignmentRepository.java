package com.college.transport.repository;

import com.college.transport.entity.DriverAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverAssignmentRepository extends JpaRepository<DriverAssignment, Long> {
    Optional<DriverAssignment> findByDriverId(Long driverId);
    Optional<DriverAssignment> findByBusId(Long busId);
    Optional<DriverAssignment> findByDriverUsername(String username);

    @Query("SELECT da FROM DriverAssignment da WHERE da.driver.id = :driverId AND da.status = 'ACTIVE'")
    Optional<DriverAssignment> findActiveByDriverId(@Param("driverId") Long driverId);

    @Query("SELECT da FROM DriverAssignment da WHERE da.bus.id = :busId AND da.status = 'ACTIVE'")
    Optional<DriverAssignment> findActiveByBusId(@Param("busId") Long busId);

    @Query("SELECT da FROM DriverAssignment da WHERE da.bus.busNumber = :busNumber AND da.status = 'ACTIVE'")
    Optional<DriverAssignment> findActiveByBusNumber(@Param("busNumber") Integer busNumber);

    Boolean existsByDriverId(Long driverId);
    Boolean existsByBusId(Long busId);

    @Modifying
    @Query("DELETE FROM DriverAssignment da WHERE da.bus.id = :busId")
    int deleteByBusId(@Param("busId") Long busId);

    @Modifying
    @Query("DELETE FROM DriverAssignment da WHERE da.driver.id = :driverId")
    int deleteByDriverId(@Param("driverId") Long driverId);
}
