package com.college.transport.repository;

import com.college.transport.entity.RoleType;
import com.college.transport.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameIgnoreCase(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    List<User> findByRoleName(RoleType roleName);

    @Query("SELECT u FROM User u WHERE u.role.name = :roleName AND u.status = 'ACTIVE'")
    List<User> findActiveUsersByRole(@Param("roleName") RoleType roleName);
}
