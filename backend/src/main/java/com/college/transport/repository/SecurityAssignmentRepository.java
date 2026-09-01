package com.college.transport.repository;

import com.college.transport.entity.SecurityAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SecurityAssignmentRepository extends JpaRepository<SecurityAssignment, Long> {
    Optional<SecurityAssignment> findBySecurityId(Long securityId);
    Optional<SecurityAssignment> findBySecurityUsername(String username);

    @Query("SELECT sa FROM SecurityAssignment sa WHERE sa.security.id = :securityId AND sa.status = 'ACTIVE'")
    Optional<SecurityAssignment> findActiveBySecurityId(@Param("securityId") Long securityId);

    @Query("SELECT sa FROM SecurityAssignment sa WHERE sa.security.username = :username AND sa.status = 'ACTIVE'")
    Optional<SecurityAssignment> findActiveBySecurityUsername(@Param("username") String username);

    List<SecurityAssignment> findByGateId(Long gateId);
    Boolean existsBySecurityId(Long securityId);

    @Modifying
    @Query("DELETE FROM SecurityAssignment sa WHERE sa.security.id = :securityId")
    int deleteBySecurityId(@Param("securityId") Long securityId);

    @Modifying
    @Query("DELETE FROM SecurityAssignment sa WHERE sa.gate.id = :gateId")
    int deleteByGateId(@Param("gateId") Long gateId);
}
