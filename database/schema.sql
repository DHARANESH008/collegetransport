-- =====================================================================
-- SMART COLLEGE TRANSPORT MANAGEMENT SYSTEM
-- Database Schema (MySQL 8.0+)
-- Database Name: college_transport
-- =====================================================================

CREATE DATABASE IF NOT EXISTS college_transport
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE college_transport;

-- 1. Reference IDs Table for Protected Admin Registration
CREATE TABLE IF NOT EXISTS admin_references (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reference_code VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('UNUSED', 'USED') DEFAULT 'UNUSED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    used_by_email VARCHAR(150) NULL,
    notes VARCHAR(255) NULL,
    INDEX idx_ref_code (reference_code),
    INDEX idx_ref_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Users Table (Admin, Driver, Security)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reference_id VARCHAR(100) NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile_number VARCHAR(20) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_user_username (username),
    INDEX idx_user_email (email),
    INDEX idx_user_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Routes Master Table
CREATE TABLE IF NOT EXISTS routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(150) NOT NULL UNIQUE,
    start_point VARCHAR(150) NOT NULL,
    end_point VARCHAR(150) NOT NULL,
    stops TEXT NULL,
    approx_distance_km DECIMAL(6,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Gates Master Table
CREATE TABLE IF NOT EXISTS gates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gate_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Buses Master Table (Bus Number 0 to 150)
CREATE TABLE IF NOT EXISTS buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_number INT NOT NULL UNIQUE CHECK (bus_number >= 0 AND bus_number <= 150),
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    capacity INT DEFAULT 55,
    route_id BIGINT NULL,
    assigned_gate_id BIGINT NULL,
    status ENUM('ACTIVE', 'MAINTENANCE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_gate_id) REFERENCES gates(id) ON DELETE SET NULL,
    INDEX idx_bus_number (bus_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Driver Assignments Table (1 Driver <-> 1 Bus)
CREATE TABLE IF NOT EXISTS driver_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    driver_id BIGINT NOT NULL UNIQUE,
    bus_id BIGINT NOT NULL UNIQUE,
    assigned_date DATE NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Security Assignments Table (1 Security <-> 1 Gate)
CREATE TABLE IF NOT EXISTS security_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    security_id BIGINT NOT NULL UNIQUE,
    gate_id BIGINT NOT NULL,
    assigned_date DATE NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (security_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (gate_id) REFERENCES gates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Bus Gate Entries Table (Recorded by Security)
-- Records are automatically purged after 3 months (90 days) by the background cleanup scheduler
CREATE TABLE IF NOT EXISTS bus_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_id BIGINT NOT NULL,
    bus_number INT NOT NULL,
    gate_id BIGINT NOT NULL,
    gate_name VARCHAR(100) NOT NULL,
    security_user_id BIGINT NOT NULL,
    entry_date DATE NOT NULL,
    entry_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (gate_id) REFERENCES gates(id) ON DELETE CASCADE,
    FOREIGN KEY (security_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_bus_entry_per_day (bus_id, entry_date),
    INDEX idx_entry_date (entry_date),
    INDEX idx_entry_bus (bus_number),
    INDEX idx_entry_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Trip Histories Table (Recorded by Driver)
-- Records are automatically purged after 3 months (90 days) by the background cleanup scheduler
CREATE TABLE IF NOT EXISTS trip_histories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_id BIGINT NOT NULL,
    bus_number INT NOT NULL,
    driver_id BIGINT NOT NULL,
    driver_name VARCHAR(150) NOT NULL,
    driver_mobile VARCHAR(20) NOT NULL,
    route_id BIGINT NULL,
    route_name VARCHAR(150) NULL,
    trip_date DATE NOT NULL,
    start_time TIME NULL,
    end_time TIME NULL,
    start_km DECIMAL(9,2) NOT NULL DEFAULT 0.00,
    end_km DECIMAL(9,2) NULL,
    total_distance DECIMAL(9,2) NULL,
    student_count INT DEFAULT 0,
    journey_status ENUM('NOT_STARTED', 'IN_TRANSIT', 'COLLEGE_ARRIVED', 'COMPLETED') DEFAULT 'NOT_STARTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL,
    INDEX idx_trip_date (trip_date),
    INDEX idx_trip_bus (bus_id, trip_date),
    INDEX idx_trip_driver (driver_id),
    INDEX idx_trip_status (journey_status),
    INDEX idx_trip_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. System Maintenance & Cleanup Audit Logs
CREATE TABLE IF NOT EXISTS system_cleanup_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cleanup_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cutoff_date DATE NOT NULL,
    bus_entries_deleted INT NOT NULL DEFAULT 0,
    trip_histories_deleted INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    message VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
