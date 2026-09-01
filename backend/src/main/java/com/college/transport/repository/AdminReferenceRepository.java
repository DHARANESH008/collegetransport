package com.college.transport.repository;

import com.college.transport.entity.AdminReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminReferenceRepository extends JpaRepository<AdminReference, Long> {
    Optional<AdminReference> findByReferenceCode(String referenceCode);
    Optional<AdminReference> findByReferenceCodeAndStatus(String referenceCode, AdminReference.Status status);
    Boolean existsByReferenceCode(String referenceCode);
    List<AdminReference> findAllByOrderByCreatedAtDesc();
}
