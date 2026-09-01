-- =====================================================================
-- SMART COLLEGE TRANSPORT MANAGEMENT SYSTEM
-- MySQL Database Setup Script
-- =====================================================================

-- 1. Create the Database in MySQL Workbench / XAMPP / CLI:
CREATE DATABASE IF NOT EXISTS college_transport
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE college_transport;

-- Note: Spring Boot JPA with `spring.jpa.hibernate.ddl-auto=update`
-- automatically creates all tables, foreign keys, indexes, 
-- and seeds the initial master data!

-- Useful Queries to check data:
-- SHOW TABLES;
-- SELECT * FROM users;
-- SELECT * FROM buses;
-- SELECT * FROM routes;
-- SELECT * FROM gates;
-- SELECT * FROM bus_entries;
-- SELECT * FROM trip_histories;
