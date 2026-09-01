package com.college.transport.repository;

import com.college.transport.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByRouteName(String routeName);
    Boolean existsByRouteName(String routeName);
}
