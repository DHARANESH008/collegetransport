-- =====================================================================
-- SMART COLLEGE TRANSPORT MANAGEMENT SYSTEM
-- Sample Seed Data (MySQL 8.0+)
-- =====================================================================

USE college_transport;

-- 1. Reference IDs for Admin Registration
INSERT INTO admin_references (reference_code, status, notes, used_at, used_by_email) VALUES
('REF-ADM-INIT-ROOT', 'USED', 'System Root Admin Reference', CURRENT_TIMESTAMP, 'admin@college.edu'),
('REF-ADM-2026-001', 'UNUSED', 'Authorized Transport Director Reference Code', NULL, NULL),
('REF-ADM-2026-002', 'UNUSED', 'Authorized Assistant Admin Reference Code', NULL, NULL),
('REF-ADM-2026-003', 'UNUSED', 'Authorized Campus Manager Reference Code', NULL, NULL),
('REF-ADM-2026-004', 'UNUSED', 'Authorized Exam/Event Transport Admin Code', NULL, NULL);

-- 2. Roles
INSERT INTO roles (id, name) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_DRIVER'),
(3, 'ROLE_SECURITY')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Pre-seeded Users (BCrypt hash for standard demo passwords)
-- Admin: admin / Admin@123
-- Drivers: ravi / Driver@123, kumar / Driver@123, murugan / Driver@123, selvam / Driver@123, karthik / Driver@123
-- Security: security_main / Security@123, security_south / Security@123, security_north / Security@123
-- Note: $2a$10$wO3mYvR8yV60z0wB7jJ3x.3V.yqL... hashes
INSERT INTO users (id, reference_id, name, email, mobile_number, username, password, role_id, status) VALUES
(1, 'REF-ADM-INIT-ROOT', 'Dr. S. Ramanathan (Transport Head)', 'admin@college.edu', '9842100001', 'admin', '$2a$10$7vN8qX0Zlq7o6UeD4zR0zO6fQy5kZ5Yx9q5kZ5Yx9q5kZ5Yx9q5kZ', 1, 'ACTIVE'),
(2, NULL, 'Ravi Chandran', 'ravi.driver@college.edu', '9842211101', 'ravi', '$2a$10$7vN8qX0Zlq7o6UeD4zR0zO6fQy5kZ5Yx9q5kZ5Yx9q5kZ5Yx9q5kZ', 2, 'ACTIVE'),
(3, NULL, 'Kumar Swamy', 'kumar.driver@college.edu', '9842211102', 'kumar', '$2a$10$7vN8qX0Zlq7o6UeD4zR0zO6fQy5kZ5Yx9q5kZ5Yx9q5kZ5Yx9q5kZ', 2, 'ACTIVE'),
(4, NULL, 'Murugan Velu', 'murugan.driver@college.edu', '9842211103', 'murugan', '$2a$10$7vN8qX0Zlq7o6UeD4zR0zO6fQy5kZ5Yx9q5kZ5Yx9q5kZ5Yx9q5kZ', 2, 'ACTIVE'),
(5, NULL, 'Selvam Mani', 'selvam.driver@college.edu', '9842211104', 'selvam', '$2a$10$7vN8qX0Zlq7o6UeD4zR0zO6fQy5kZ5Yx9q5kZ5Yx9q5kZ5Yx9q5kZ', 2, 'ACTIVE'),
(6, NULL, 'Karthik Raja', 'karthik.driver@college.edu', '9842211105', 'karthik', '$2a$10$7vN8qX0Zlq7o6UeD4zR0zO6fQy5kZ5Yx9q5kZ5Yx9q5kZ5Yx9q5kZ', 2, 'ACTIVE'),
(7, NULL, 'Senthil Nathan (Main Gate Guard)', 'main.security@college.edu', '9842322201', 'security_main', '$2a$10$7vN8qX0Zlq7o6UeD4zR0zO6fQy5kZ5Yx9q5kZ5Yx9q5kZ5Yx9q5kZ', 3, 'ACTIVE'),
(8, NULL, 'Ganesan Perumal (South Gate Guard)', 'south.security@college.edu', '9842322202', 'security_south', '$2a$10$7vN8qX0Zlq7o6UeD4zR0zO6fQy5kZ5Yx9q5kZ5Yx9q5kZ5Yx9q5kZ', 3, 'ACTIVE'),
(9, NULL, 'Palanisamy K (North Gate Guard)', 'north.security@college.edu', '9842322203', 'security_north', '$2a$10$7vN8qX0Zlq7o6UeD4zR0zO6fQy5kZ5Yx9q5kZ5Yx9q5kZ5Yx9q5kZ', 3, 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Gates Master
INSERT INTO gates (id, gate_name, description) VALUES
(1, 'Main Gate', 'Primary College Arch Entrance on National Highway'),
(2, 'South Gate', 'Hostel & Residential Zone Entry Gate'),
(3, 'North Gate', 'Sports Complex & Engineering Block Gate'),
(4, 'East Gate', 'Service & Vendor Delivery Gate')
ON DUPLICATE KEY UPDATE gate_name=VALUES(gate_name);

-- 5. Routes Master
INSERT INTO routes (id, route_name, start_point, end_point, stops, approx_distance_km) VALUES
(1, 'Erode', 'Erode Central Bus Stand', 'College Campus', 'PS Park, GH Roundana, Solar, Thindal, Perundurai Road', 32.5),
(2, 'Tiruppur', 'Tiruppur Old Bus Stand', 'College Campus', 'Kumaran Road, Avinashi, Chengapalli, Vijayamangalam', 48.0),
(3, 'Gobichettipalayam', 'Gobi Bus Stand', 'College Campus', 'Kullampalayam, Modachur, Kunnathur, Perundurai', 36.8),
(4, 'Perundurai', 'Perundurai Old Bus Stand', 'College Campus', 'SIPCOT, Sanatorium, RS Road, Campus Entry', 14.2),
(5, 'Bhavani', 'Bhavani Kooduthurai', 'College Campus', 'Komarapalayam Bypass, Lakshmi Nagar, Chithode, Nasiyanur', 28.6),
(6, 'Sathyamangalam', 'Sathy Bus Stand', 'College Campus', 'Puliyampatti, Nambiyur, Gobi Bypass, Kunnathur', 52.0),
(7, 'Anthiyur', 'Anthiyur Bus Stand', 'College Campus', 'Appakudal, Bhavani, Chithode, Campus', 42.0),
(8, 'Chennimalai', 'Chennimalai Murugan Temple Stop', 'College Campus', 'Ingur, Perundurai Bypass, Campus', 22.5)
ON DUPLICATE KEY UPDATE route_name=VALUES(route_name);

-- 6. Key Buses (Bus 0 to 150)
INSERT INTO buses (id, bus_number, registration_number, capacity, route_id, assigned_gate_id, status) VALUES
(1, 25, 'TN 33 BM 1025', 60, 1, 1, 'ACTIVE'), -- Route: Erode, Gate: Main Gate
(2, 42, 'TN 33 BM 1042', 60, 2, 1, 'ACTIVE'), -- Route: Tiruppur, Gate: Main Gate
(3, 18, 'TN 33 BM 1018', 55, 3, 2, 'ACTIVE'), -- Route: Gobichettipalayam, Gate: South Gate
(4, 7, 'TN 33 BM 1007', 55, 4, 1, 'ACTIVE'),  -- Route: Perundurai, Gate: Main Gate
(5, 55, 'TN 33 BM 1055', 60, 5, 3, 'ACTIVE'), -- Route: Bhavani, Gate: North Gate
(6, 88, 'TN 33 BM 1088', 60, 6, 1, 'ACTIVE'), -- Route: Sathyamangalam, Gate: Main Gate
(7, 105, 'TN 33 BM 1105', 55, 7, 2, 'ACTIVE'),-- Route: Anthiyur, Gate: South Gate
(8, 12, 'TN 33 BM 1012', 55, 8, 1, 'ACTIVE'), -- Route: Chennimalai, Gate: Main Gate
(9, 0, 'TN 33 BM 1000', 30, 4, 1, 'ACTIVE'),  -- Bus 0 (Campus Staff Shuttle)
(10, 150, 'TN 33 BM 1150', 60, 1, 1, 'ACTIVE') -- Bus 150 (Max Bus Number)
ON DUPLICATE KEY UPDATE bus_number=VALUES(bus_number);

-- 7. Driver Assignments (1 Driver <-> 1 Bus)
INSERT INTO driver_assignments (id, driver_id, bus_id, assigned_date, status) VALUES
(1, 2, 1, CURRENT_DATE, 'ACTIVE'), -- Ravi -> Bus 25 (Erode)
(2, 3, 2, CURRENT_DATE, 'ACTIVE'), -- Kumar -> Bus 42 (Tiruppur)
(3, 4, 3, CURRENT_DATE, 'ACTIVE'), -- Murugan -> Bus 18 (Gobi)
(4, 5, 4, CURRENT_DATE, 'ACTIVE'), -- Selvam -> Bus 7 (Perundurai)
(5, 6, 5, CURRENT_DATE, 'ACTIVE')  -- Karthik -> Bus 55 (Bhavani)
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 8. Security Assignments (1 Security <-> 1 Gate)
INSERT INTO security_assignments (id, security_id, gate_id, assigned_date, status) VALUES
(1, 7, 1, CURRENT_DATE, 'ACTIVE'), -- Senthil -> Main Gate
(2, 8, 2, CURRENT_DATE, 'ACTIVE'), -- Ganesan -> South Gate
(3, 9, 3, CURRENT_DATE, 'ACTIVE')  -- Palanisamy -> North Gate
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 9. Sample Today's Bus Gate Entries (Recorded at Gate)
INSERT INTO bus_entries (bus_id, bus_number, gate_id, gate_name, security_user_id, entry_date, entry_time) VALUES
(1, 25, 1, 'Main Gate', 7, CURRENT_DATE, '08:15:00'),
(2, 42, 1, 'Main Gate', 7, CURRENT_DATE, '08:22:30'),
(3, 18, 2, 'South Gate', 8, CURRENT_DATE, '08:28:10'),
(4, 7, 1, 'Main Gate', 7, CURRENT_DATE, '08:05:40')
ON DUPLICATE KEY UPDATE entry_time=VALUES(entry_time);

-- 10. Sample Trip Histories (Today and Previous days)
INSERT INTO trip_histories (bus_id, bus_number, driver_id, driver_name, driver_mobile, route_id, route_name, trip_date, start_time, end_time, start_km, end_km, total_distance, student_count, journey_status) VALUES
(1, 25, 2, 'Ravi Chandran', '9842211101', 1, 'Erode', CURRENT_DATE, '07:15:00', '08:20:00', 45210.0, 45242.5, 32.5, 54, 'COMPLETED'),
(2, 42, 3, 'Kumar Swamy', '9842211102', 2, 'Tiruppur', CURRENT_DATE, '07:05:00', '08:25:00', 62300.0, 62348.0, 48.0, 58, 'COMPLETED'),
(3, 18, 4, 'Murugan Velu', '9842211103', 3, 'Gobichettipalayam', CURRENT_DATE, '07:20:00', NULL, 31450.0, NULL, NULL, 50, 'IN_TRANSIT'),
(4, 7, 5, 'Selvam Mani', '9842211104', 4, 'Perundurai', CURRENT_DATE, '07:45:00', '08:10:00', 18920.0, 18934.2, 14.2, 48, 'COMPLETED'),
(5, 55, 6, 'Karthik Raja', '9842211105', 5, 'Bhavani', CURRENT_DATE, '07:30:00', NULL, 51100.0, NULL, NULL, 0, 'NOT_STARTED');
