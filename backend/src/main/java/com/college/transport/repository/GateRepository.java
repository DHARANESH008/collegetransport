package com.college.transport.repository;

import com.college.transport.entity.Gate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GateRepository extends JpaRepository<Gate, Long> {
    Optional<Gate> findByGateName(String gateName);
    Boolean existsByGateName(String gateName);
}
