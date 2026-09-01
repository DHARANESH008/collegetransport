package com.college.transport.repository;

import com.college.transport.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    Optional<Bus> findByBusNumber(Integer busNumber);
    Optional<Bus> findByRegistrationNumber(String registrationNumber);
    Boolean existsByBusNumber(Integer busNumber);
    Boolean existsByRegistrationNumber(String registrationNumber);
    List<Bus> findAllByOrderByBusNumberAsc();

    @Query("SELECT b FROM Bus b WHERE b.status = 'ACTIVE' ORDER BY b.busNumber ASC")
    List<Bus> findActiveBuses();
}
