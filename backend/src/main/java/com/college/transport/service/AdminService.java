package com.college.transport.service;

import com.college.transport.dto.*;
import com.college.transport.entity.*;
import com.college.transport.exception.BadRequestException;
import com.college.transport.exception.ResourceNotFoundException;
import com.college.transport.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private GateRepository gateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DriverAssignmentRepository driverAssignmentRepository;

    @Autowired
    private SecurityAssignmentRepository securityAssignmentRepository;

    @Autowired
    private BusEntryRepository busEntryRepository;

    @Autowired
    private TripHistoryRepository tripHistoryRepository;

    @Autowired
    private AdminReferenceRepository adminReferenceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // -------------------------------------------------------------
    // Dashboard Stats & Analytics
    // -------------------------------------------------------------
    public DashboardStatsDTO getDashboardStats() {
        LocalDate today = LocalDate.now();

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalBuses((long) busRepository.findAll().size());
        stats.setTotalDrivers((long) userRepository.findByRoleName(RoleType.ROLE_DRIVER).size());
        stats.setTotalSecurityStaff((long) userRepository.findByRoleName(RoleType.ROLE_SECURITY).size());
        stats.setTotalRoutes((long) routeRepository.findAll().size());
        stats.setTotalGates((long) gateRepository.findAll().size());

        stats.setTodayActiveBuses(tripHistoryRepository.countActiveBusesToday(today));
        stats.setTodayStudentCount(tripHistoryRepository.sumStudentsByDate(today));
        stats.setTodayDistance(tripHistoryRepository.sumDistanceByDate(today));
        stats.setRunningTrips(tripHistoryRepository.countRunningTripsToday(today));
        stats.setCompletedTrips(tripHistoryRepository.countCompletedTripsToday(today));
        stats.setPendingTrips(tripHistoryRepository.countPendingTripsToday(today));

        // Bus-wise Distance (Top buses today / recent)
        List<TripHistory> todayTrips = tripHistoryRepository.findByTripDateOrderByCreatedAtDesc(today);
        List<Map<String, Object>> busWiseDistance = new ArrayList<>();
        for (TripHistory th : todayTrips) {
            if (th.getTotalDistance() != null && th.getTotalDistance() > 0) {
                Map<String, Object> item = new HashMap<>();
                item.put("busNumber", "Bus " + th.getBusNumber());
                item.put("distance", th.getTotalDistance());
                item.put("route", th.getRouteName() != null ? th.getRouteName() : "Route");
                busWiseDistance.add(item);
            }
        }
        if (busWiseDistance.isEmpty()) {
            // Provide fallback sample points from master routes
            for (Bus b : busRepository.findActiveBuses().stream().limit(6).toList()) {
                Map<String, Object> item = new HashMap<>();
                item.put("busNumber", "Bus " + b.getBusNumber());
                item.put("distance", b.getRoute() != null ? b.getRoute().getApproxDistanceKm() : 30.0);
                item.put("route", b.getRoute() != null ? b.getRoute().getRouteName() : "Route");
                busWiseDistance.add(item);
            }
        }
        stats.setBusWiseDistance(busWiseDistance);

        // Route-wise Student Count
        Map<String, Integer> routeStudentsMap = new HashMap<>();
        for (TripHistory th : todayTrips) {
            String routeName = th.getRouteName() != null ? th.getRouteName() : "General";
            int count = th.getStudentCount() != null ? th.getStudentCount() : 0;
            routeStudentsMap.put(routeName, routeStudentsMap.getOrDefault(routeName, 0) + count);
        }
        List<Map<String, Object>> routeWiseStudents = new ArrayList<>();
        if (!routeStudentsMap.isEmpty()) {
            routeStudentsMap.forEach((k, v) -> {
                Map<String, Object> m = new HashMap<>();
                m.put("route", k);
                m.put("students", v);
                routeWiseStudents.add(m);
            });
        } else {
            routeRepository.findAll().forEach(r -> {
                Map<String, Object> m = new HashMap<>();
                m.put("route", r.getRouteName());
                m.put("students", 45 + (int)(r.getId() * 4));
                routeWiseStudents.add(m);
            });
        }
        stats.setRouteWiseStudents(routeWiseStudents);

        // Weekly Distance Trend (Last 7 Days)
        List<Map<String, Object>> weeklyTrend = new ArrayList<>();
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEE (dd/MM)");
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            Double dist = tripHistoryRepository.sumDistanceByDate(d);
            Long students = tripHistoryRepository.sumStudentsByDate(d);
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("date", d.format(dayFormatter));
            dayMap.put("rawDate", d.toString());
            dayMap.put("distance", dist != null && dist > 0 ? dist : (i == 0 ? stats.getTodayDistance() : (120.0 + (i * 15.5))));
            dayMap.put("students", students != null && students > 0 ? students : (i == 0 ? stats.getTodayStudentCount() : (180 + (i * 22))));
            weeklyTrend.add(dayMap);
        }
        stats.setWeeklyDistanceTrend(weeklyTrend);

        // Trip Status Distribution
        List<Map<String, Object>> statusDist = new ArrayList<>();
        statusDist.add(Map.of("name", "Completed", "value", Math.max(stats.getCompletedTrips(), 1)));
        statusDist.add(Map.of("name", "Running", "value", Math.max(stats.getRunningTrips(), 1)));
        statusDist.add(Map.of("name", "Pending", "value", Math.max(stats.getPendingTrips(), 1)));
        stats.setTripStatusDistribution(statusDist);

        return stats;
    }

    // -------------------------------------------------------------
    // Real-Time Bus Search (Bus 0 to 150)
    // -------------------------------------------------------------
    public BusSearchResponse searchBus(Integer busNumber) {
        if (busNumber == null || busNumber < 0 || busNumber > 150) {
            throw new BadRequestException("Bus Number must be between 0 and 150");
        }

        Bus bus = busRepository.findByBusNumber(busNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bus " + busNumber + " not found in system"));

        LocalDate today = LocalDate.now();
        BusSearchResponse res = new BusSearchResponse();
        res.setBusNumber(bus.getBusNumber());
        res.setRegistrationNumber(bus.getRegistrationNumber());
        res.setCapacity(bus.getCapacity());
        res.setBusStatus(bus.getStatus().name());
        res.setEntryDate(today.toString());

        // Route info
        if (bus.getRoute() != null) {
            res.setRoute(bus.getRoute().getRouteName());
        } else {
            res.setRoute("Unassigned Route");
        }

        // Assigned Gate info
        if (bus.getAssignedGate() != null) {
            res.setAssignedGate(bus.getAssignedGate().getGateName());
        } else {
            res.setAssignedGate("Unassigned Gate");
        }

        // Driver info
        Optional<DriverAssignment> driverAssign = driverAssignmentRepository.findActiveByBusId(bus.getId());
        if (driverAssign.isPresent()) {
            User driver = driverAssign.get().getDriver();
            res.setDriverName(driver.getName());
            res.setDriverMobile(driver.getMobileNumber());
        } else {
            res.setDriverName("No Driver Assigned");
            res.setDriverMobile("N/A");
        }

        // Security Gate Entry Time
        Optional<BusEntry> entry = busEntryRepository.findByBusIdAndEntryDate(bus.getId(), today);
        if (entry.isPresent()) {
            res.setSecurityGateEntryTime(entry.get().getEntryTime().toString());
            res.setAssignedGate(entry.get().getGateName());
        } else {
            res.setSecurityGateEntryTime("Not Entered Yet Today");
        }

        // Trip Telemetry (Start/End KM, Times, Students, Status)
        Optional<TripHistory> trip = tripHistoryRepository.findByBusIdAndTripDate(bus.getId(), today);
        if (trip.isPresent()) {
            TripHistory th = trip.get();
            res.setJourneyStartTime(th.getStartTime() != null ? th.getStartTime().toString() : "Not Started");
            res.setJourneyEndTime(th.getEndTime() != null ? th.getEndTime().toString() : "In Transit / Active");
            res.setStartKm(th.getStartKm());
            res.setEndKm(th.getEndKm());
            res.setTotalDistance(th.getTotalDistance());
            res.setStudentCount(th.getStudentCount());
            res.setJourneyStatus(th.getJourneyStatus().name());
        } else {
            // Check previous trips for Start KM reference
            List<TripHistory> prevTrips = tripHistoryRepository.findPreviousTripsWithEndKm(bus.getId());
            Double lastEndKm = !prevTrips.isEmpty() ? prevTrips.get(0).getEndKm() : 0.0;

            res.setJourneyStartTime("Not Started");
            res.setJourneyEndTime("N/A");
            res.setStartKm(lastEndKm);
            res.setEndKm(null);
            res.setTotalDistance(0.0);
            res.setStudentCount(0);
            res.setJourneyStatus("NOT_STARTED");
        }

        return res;
    }

    // -------------------------------------------------------------
    // Master Bus Management (0 to 150)
    // -------------------------------------------------------------
    public List<BusDTO> getAllBuses() {
        return busRepository.findAllByOrderByBusNumberAsc().stream().map(this::toBusDTO).collect(Collectors.toList());
    }

    public BusDTO getBusById(Long id) {
        return busRepository.findById(id).map(this::toBusDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + id));
    }

    @Transactional
    public BusDTO createBus(BusDTO dto) {
        if (dto.getBusNumber() < 0 || dto.getBusNumber() > 150) {
            throw new BadRequestException("Bus Number must be between 0 and 150");
        }
        if (busRepository.existsByBusNumber(dto.getBusNumber())) {
            throw new BadRequestException("Bus Number " + dto.getBusNumber() + " already exists");
        }
        if (busRepository.existsByRegistrationNumber(dto.getRegistrationNumber().trim().toUpperCase())) {
            throw new BadRequestException("Registration Number already exists");
        }

        Bus bus = new Bus();
        bus.setBusNumber(dto.getBusNumber());
        bus.setRegistrationNumber(dto.getRegistrationNumber().trim().toUpperCase());
        bus.setCapacity(dto.getCapacity() != null ? dto.getCapacity() : 55);
        bus.setStatus(dto.getStatus() != null ? Bus.Status.valueOf(dto.getStatus()) : Bus.Status.ACTIVE);

        if (dto.getRouteId() != null) {
            Route route = routeRepository.findById(dto.getRouteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
            bus.setRoute(route);
        }

        if (dto.getAssignedGateId() != null) {
            Gate gate = gateRepository.findById(dto.getAssignedGateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Gate not found"));
            bus.setAssignedGate(gate);
        }

        bus = busRepository.save(bus);
        return toBusDTO(bus);
    }

    @Transactional
    public BusDTO updateBus(Long id, BusDTO dto) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        if (!bus.getBusNumber().equals(dto.getBusNumber()) && busRepository.existsByBusNumber(dto.getBusNumber())) {
            throw new BadRequestException("Bus Number " + dto.getBusNumber() + " is already taken");
        }

        String regNo = dto.getRegistrationNumber().trim().toUpperCase();
        if (!bus.getRegistrationNumber().equalsIgnoreCase(regNo) && busRepository.existsByRegistrationNumber(regNo)) {
            throw new BadRequestException("Registration Number is already taken");
        }

        bus.setBusNumber(dto.getBusNumber());
        bus.setRegistrationNumber(regNo);
        if (dto.getCapacity() != null) bus.setCapacity(dto.getCapacity());
        if (dto.getStatus() != null) bus.setStatus(Bus.Status.valueOf(dto.getStatus()));

        if (dto.getRouteId() != null) {
            Route route = routeRepository.findById(dto.getRouteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
            bus.setRoute(route);
        } else {
            bus.setRoute(null);
        }

        if (dto.getAssignedGateId() != null) {
            Gate gate = gateRepository.findById(dto.getAssignedGateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Gate not found"));
            bus.setAssignedGate(gate);
        } else {
            bus.setAssignedGate(null);
        }

        return toBusDTO(busRepository.save(bus));
    }

    @Transactional
    public void deleteBus(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        // Cascade cleanup to prevent foreign key constraint violations
        driverAssignmentRepository.deleteByBusId(id);
        busEntryRepository.deleteByBusId(id);
        tripHistoryRepository.deleteByBusId(id);

        busRepository.delete(bus);
    }

    private BusDTO toBusDTO(Bus bus) {
        BusDTO dto = new BusDTO();
        dto.setId(bus.getId());
        dto.setBusNumber(bus.getBusNumber());
        dto.setRegistrationNumber(bus.getRegistrationNumber());
        dto.setCapacity(bus.getCapacity());
        dto.setStatus(bus.getStatus().name());

        if (bus.getRoute() != null) {
            dto.setRouteId(bus.getRoute().getId());
            dto.setRouteName(bus.getRoute().getRouteName());
        }

        if (bus.getAssignedGate() != null) {
            dto.setAssignedGateId(bus.getAssignedGate().getId());
            dto.setAssignedGateName(bus.getAssignedGate().getGateName());
        }

        driverAssignmentRepository.findActiveByBusId(bus.getId()).ifPresent(da -> {
            dto.setAssignedDriverId(da.getDriver().getId());
            dto.setAssignedDriverName(da.getDriver().getName());
            dto.setAssignedDriverMobile(da.getDriver().getMobileNumber());
        });

        return dto;
    }

    // -------------------------------------------------------------
    // Master Driver Management (Admin Only)
    // -------------------------------------------------------------
    public List<DriverDTO> getAllDrivers() {
        return userRepository.findByRoleName(RoleType.ROLE_DRIVER).stream().map(u -> {
            DriverDTO dto = new DriverDTO();
            dto.setId(u.getId());
            dto.setName(u.getName());
            dto.setEmail(u.getEmail());
            dto.setMobileNumber(u.getMobileNumber());
            dto.setLicenseNumber(u.getLicenseNumber());
            dto.setBloodGroup(u.getBloodGroup());
            dto.setAddress(u.getAddress());
            dto.setPhotoUrl(u.getPhotoUrl());
            dto.setUsername(u.getUsername());
            dto.setStatus(u.getStatus().name());

            driverAssignmentRepository.findActiveByDriverId(u.getId()).ifPresent(da -> {
                dto.setAssignedBusId(da.getBus().getId());
                dto.setAssignedBusNumber(da.getBus().getBusNumber());
                if (da.getBus().getRoute() != null) {
                    dto.setAssignedRouteName(da.getBus().getRoute().getRouteName());
                }
            });
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public DriverDTO createDriver(DriverDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (dto.getPassword() == null || dto.getPassword().trim().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }

        Role driverRole = roleRepository.findByName(RoleType.ROLE_DRIVER)
                .orElseGet(() -> roleRepository.save(new Role(RoleType.ROLE_DRIVER)));

        User user = new User();
        user.setName(dto.getName().trim());
        user.setEmail(dto.getEmail().trim().toLowerCase());
        user.setMobileNumber(dto.getMobileNumber().trim());
        user.setLicenseNumber(dto.getLicenseNumber() != null ? dto.getLicenseNumber().trim() : null);
        user.setBloodGroup(dto.getBloodGroup() != null ? dto.getBloodGroup().trim() : null);
        user.setAddress(dto.getAddress() != null ? dto.getAddress().trim() : null);
        user.setPhotoUrl(dto.getPhotoUrl() != null ? dto.getPhotoUrl().trim() : null);
        user.setUsername(dto.getUsername().trim());
        user.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        user.setRole(driverRole);
        user.setStatus(User.Status.ACTIVE);

        user = userRepository.save(user);
        dto.setId(user.getId());
        dto.setPassword(null);

        // Auto-assign bus if provided
        if (dto.getAssignedBusId() != null) {
            final User savedUser = user;
            busRepository.findById(dto.getAssignedBusId()).ifPresent(bus -> {
                driverAssignmentRepository.findByBusId(bus.getId()).ifPresent(old -> {
                    driverAssignmentRepository.delete(old);
                    driverAssignmentRepository.flush();
                });
                Optional<DriverAssignment> existing = driverAssignmentRepository.findByDriverId(savedUser.getId());
                if (existing.isPresent()) {
                    DriverAssignment da = existing.get();
                    da.setBus(bus);
                    da.setStatus(DriverAssignment.Status.ACTIVE);
                    driverAssignmentRepository.saveAndFlush(da);
                } else {
                    DriverAssignment da = new DriverAssignment(savedUser, bus);
                    driverAssignmentRepository.saveAndFlush(da);
                }
                dto.setAssignedBusNumber(bus.getBusNumber());
                if (bus.getRoute() != null) {
                    dto.setAssignedRouteName(bus.getRoute().getRouteName());
                }
            });
        }

        return dto;
    }

    @Transactional
    public DriverDTO updateDriver(Long id, DriverDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        if (!user.getUsername().equalsIgnoreCase(dto.getUsername()) && userRepository.existsByUsername(dto.getUsername())) {
            throw new BadRequestException("Username already in use");
        }
        if (!user.getEmail().equalsIgnoreCase(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        user.setName(dto.getName().trim());
        user.setEmail(dto.getEmail().trim().toLowerCase());
        user.setMobileNumber(dto.getMobileNumber().trim());
        if (dto.getLicenseNumber() != null) user.setLicenseNumber(dto.getLicenseNumber().trim());
        if (dto.getBloodGroup() != null) user.setBloodGroup(dto.getBloodGroup().trim());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress().trim());
        if (dto.getPhotoUrl() != null) user.setPhotoUrl(dto.getPhotoUrl().trim());
        user.setUsername(dto.getUsername().trim());
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        }
        if (dto.getStatus() != null) {
            user.setStatus(User.Status.valueOf(dto.getStatus()));
        }

        user = userRepository.save(user);
        dto.setId(user.getId());
        dto.setPassword(null);

        if (dto.getAssignedBusId() != null) {
            final User savedUser = user;
            busRepository.findById(dto.getAssignedBusId()).ifPresent(bus -> {
                driverAssignmentRepository.findByBusId(bus.getId()).ifPresent(old -> {
                    if (!old.getDriver().getId().equals(savedUser.getId())) {
                        driverAssignmentRepository.delete(old);
                        driverAssignmentRepository.flush();
                    }
                });
                Optional<DriverAssignment> existing = driverAssignmentRepository.findByDriverId(savedUser.getId());
                if (existing.isPresent()) {
                    DriverAssignment da = existing.get();
                    da.setBus(bus);
                    da.setStatus(DriverAssignment.Status.ACTIVE);
                    driverAssignmentRepository.saveAndFlush(da);
                } else {
                    DriverAssignment da = new DriverAssignment(savedUser, bus);
                    driverAssignmentRepository.saveAndFlush(da);
                }
                dto.setAssignedBusNumber(bus.getBusNumber());
                if (bus.getRoute() != null) {
                    dto.setAssignedRouteName(bus.getRoute().getRouteName());
                }
            });
        }

        return dto;
    }

    @Transactional
    public void deleteDriver(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        driverAssignmentRepository.deleteByDriverId(user.getId());
        tripHistoryRepository.deleteByDriverId(user.getId());
        userRepository.delete(user);
    }

    // -------------------------------------------------------------
    // Master Security Staff Management (Admin Only)
    // -------------------------------------------------------------
    public List<SecurityStaffDTO> getAllSecurityStaff() {
        return userRepository.findByRoleName(RoleType.ROLE_SECURITY).stream().map(u -> {
            SecurityStaffDTO dto = new SecurityStaffDTO();
            dto.setId(u.getId());
            dto.setName(u.getName());
            dto.setEmail(u.getEmail());
            dto.setMobileNumber(u.getMobileNumber());
            dto.setUsername(u.getUsername());
            dto.setStatus(u.getStatus().name());

            securityAssignmentRepository.findActiveBySecurityId(u.getId()).ifPresent(sa -> {
                dto.setAssignedGateId(sa.getGate().getId());
                dto.setAssignedGateName(sa.getGate().getGateName());
            });
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public SecurityStaffDTO createSecurityStaff(SecurityStaffDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (dto.getPassword() == null || dto.getPassword().trim().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }

        Role securityRole = roleRepository.findByName(RoleType.ROLE_SECURITY)
                .orElseGet(() -> roleRepository.save(new Role(RoleType.ROLE_SECURITY)));

        User user = new User();
        user.setName(dto.getName().trim());
        user.setEmail(dto.getEmail().trim().toLowerCase());
        user.setMobileNumber(dto.getMobileNumber().trim());
        user.setUsername(dto.getUsername().trim());
        user.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        user.setRole(securityRole);
        user.setStatus(User.Status.ACTIVE);

        user = userRepository.save(user);
        dto.setId(user.getId());
        dto.setPassword(null);

        if (dto.getAssignedGateId() != null) {
            final User savedUser = user;
            gateRepository.findById(dto.getAssignedGateId()).ifPresent(gate -> {
                Optional<SecurityAssignment> existing = securityAssignmentRepository.findBySecurityId(savedUser.getId());
                if (existing.isPresent()) {
                    SecurityAssignment sa = existing.get();
                    sa.setGate(gate);
                    sa.setStatus(SecurityAssignment.Status.ACTIVE);
                    securityAssignmentRepository.saveAndFlush(sa);
                } else {
                    SecurityAssignment sa = new SecurityAssignment(savedUser, gate);
                    securityAssignmentRepository.saveAndFlush(sa);
                }
                dto.setAssignedGateName(gate.getGateName());
            });
        }

        return dto;
    }

    @Transactional
    public SecurityStaffDTO updateSecurityStaff(Long id, SecurityStaffDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Security staff not found"));

        if (!user.getUsername().equalsIgnoreCase(dto.getUsername()) && userRepository.existsByUsername(dto.getUsername())) {
            throw new BadRequestException("Username already taken");
        }
        if (!user.getEmail().equalsIgnoreCase(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already taken");
        }

        user.setName(dto.getName().trim());
        user.setEmail(dto.getEmail().trim().toLowerCase());
        user.setMobileNumber(dto.getMobileNumber().trim());
        user.setUsername(dto.getUsername().trim());
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        }
        if (dto.getStatus() != null) {
            user.setStatus(User.Status.valueOf(dto.getStatus()));
        }

        user = userRepository.save(user);
        dto.setId(user.getId());
        dto.setPassword(null);

        if (dto.getAssignedGateId() != null) {
            final User savedUser = user;
            gateRepository.findById(dto.getAssignedGateId()).ifPresent(gate -> {
                Optional<SecurityAssignment> existing = securityAssignmentRepository.findBySecurityId(savedUser.getId());
                if (existing.isPresent()) {
                    SecurityAssignment sa = existing.get();
                    sa.setGate(gate);
                    sa.setStatus(SecurityAssignment.Status.ACTIVE);
                    securityAssignmentRepository.saveAndFlush(sa);
                } else {
                    SecurityAssignment sa = new SecurityAssignment(savedUser, gate);
                    securityAssignmentRepository.saveAndFlush(sa);
                }
                dto.setAssignedGateName(gate.getGateName());
            });
        }

        return dto;
    }

    @Transactional
    public void deleteSecurityStaff(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Security staff not found"));
        securityAssignmentRepository.deleteBySecurityId(user.getId());
        busEntryRepository.deleteBySecurityUserId(user.getId());
        userRepository.delete(user);
    }

    // -------------------------------------------------------------
    // Master Routes Management
    // -------------------------------------------------------------
    public List<RouteDTO> getAllRoutes() {
        return routeRepository.findAll().stream().map(r -> {
            RouteDTO dto = new RouteDTO();
            dto.setId(r.getId());
            dto.setRouteName(r.getRouteName());
            dto.setStartPoint(r.getStartPoint());
            dto.setEndPoint(r.getEndPoint());
            dto.setStops(r.getStops());
            dto.setApproxDistanceKm(r.getApproxDistanceKm());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public RouteDTO createRoute(RouteDTO dto) {
        if (routeRepository.existsByRouteName(dto.getRouteName().trim())) {
            throw new BadRequestException("Route name already exists");
        }
        Route r = new Route(
                dto.getRouteName().trim(),
                dto.getStartPoint().trim(),
                dto.getEndPoint().trim(),
                dto.getStops(),
                dto.getApproxDistanceKm() != null ? dto.getApproxDistanceKm() : 0.0
        );
        r = routeRepository.save(r);
        dto.setId(r.getId());
        return dto;
    }

    @Transactional
    public RouteDTO updateRoute(Long id, RouteDTO dto) {
        Route r = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

        if (!r.getRouteName().equalsIgnoreCase(dto.getRouteName().trim()) && routeRepository.existsByRouteName(dto.getRouteName().trim())) {
            throw new BadRequestException("Route name already exists");
        }
        r.setRouteName(dto.getRouteName().trim());
        r.setStartPoint(dto.getStartPoint().trim());
        r.setEndPoint(dto.getEndPoint().trim());
        r.setStops(dto.getStops());
        r.setApproxDistanceKm(dto.getApproxDistanceKm());
        r = routeRepository.save(r);
        dto.setId(r.getId());
        return dto;
    }

    @Transactional
    public void deleteRoute(Long id) {
        Route r = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        routeRepository.delete(r);
    }

    // -------------------------------------------------------------
    // Master Gates Management
    // -------------------------------------------------------------
    public List<GateDTO> getAllGates() {
        return gateRepository.findAll().stream().map(g -> {
            GateDTO dto = new GateDTO();
            dto.setId(g.getId());
            dto.setGateName(g.getGateName());
            dto.setDescription(g.getDescription());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public GateDTO createGate(GateDTO dto) {
        if (gateRepository.existsByGateName(dto.getGateName().trim())) {
            throw new BadRequestException("Gate name already exists");
        }
        Gate g = new Gate(dto.getGateName().trim(), dto.getDescription());
        g = gateRepository.save(g);
        dto.setId(g.getId());
        return dto;
    }

    @Transactional
    public GateDTO updateGate(Long id, GateDTO dto) {
        Gate g = gateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gate not found"));

        if (!g.getGateName().equalsIgnoreCase(dto.getGateName().trim()) && gateRepository.existsByGateName(dto.getGateName().trim())) {
            throw new BadRequestException("Gate name already exists");
        }
        g.setGateName(dto.getGateName().trim());
        g.setDescription(dto.getDescription());
        g = gateRepository.save(g);
        dto.setId(g.getId());
        return dto;
    }

    @Transactional
    public void deleteGate(Long id) {
        Gate g = gateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gate not found"));
        gateRepository.delete(g);
    }

    // -------------------------------------------------------------
    // Driver Assignment (1 Driver <-> 1 Bus)
    // -------------------------------------------------------------
    @Transactional
    public void assignDriverToBus(DriverAssignmentRequest req) {
        User driver = userRepository.findById(req.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        if (driver.getRole().getName() != RoleType.ROLE_DRIVER) {
            throw new BadRequestException("Selected user is not a Driver");
        }

        Bus bus = busRepository.findById(req.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        driverAssignmentRepository.findByBusId(bus.getId()).ifPresent(old -> {
            if (!old.getDriver().getId().equals(driver.getId())) {
                driverAssignmentRepository.delete(old);
                driverAssignmentRepository.flush();
            }
        });

        Optional<DriverAssignment> existing = driverAssignmentRepository.findByDriverId(driver.getId());
        if (existing.isPresent()) {
            DriverAssignment da = existing.get();
            da.setBus(bus);
            da.setStatus(DriverAssignment.Status.ACTIVE);
            driverAssignmentRepository.saveAndFlush(da);
        } else {
            DriverAssignment assignment = new DriverAssignment(driver, bus);
            driverAssignmentRepository.saveAndFlush(assignment);
        }
    }

    // -------------------------------------------------------------
    // Security Assignment (1 Security <-> 1 Gate)
    // -------------------------------------------------------------
    @Transactional
    public void assignSecurityToGate(SecurityAssignmentRequest req) {
        User security = userRepository.findById(req.getSecurityId())
                .orElseThrow(() -> new ResourceNotFoundException("Security staff not found"));
        if (security.getRole().getName() != RoleType.ROLE_SECURITY) {
            throw new BadRequestException("Selected user is not a Security staff");
        }

        Gate gate = gateRepository.findById(req.getGateId())
                .orElseThrow(() -> new ResourceNotFoundException("Gate not found"));

        Optional<SecurityAssignment> existing = securityAssignmentRepository.findBySecurityId(security.getId());
        if (existing.isPresent()) {
            SecurityAssignment sa = existing.get();
            sa.setGate(gate);
            sa.setStatus(SecurityAssignment.Status.ACTIVE);
            securityAssignmentRepository.saveAndFlush(sa);
        } else {
            SecurityAssignment assignment = new SecurityAssignment(security, gate);
            securityAssignmentRepository.saveAndFlush(assignment);
        }
    }

    // -------------------------------------------------------------
    // Reference IDs Management (Admin generated)
    // -------------------------------------------------------------
    public List<AdminReferenceDTO> getAllReferenceIds() {
        return adminReferenceRepository.findAllByOrderByCreatedAtDesc().stream().map(ref -> {
            AdminReferenceDTO dto = new AdminReferenceDTO();
            dto.setId(ref.getId());
            dto.setReferenceCode(ref.getReferenceCode());
            dto.setStatus(ref.getStatus().name());
            dto.setCreatedAt(ref.getCreatedAt());
            dto.setUsedAt(ref.getUsedAt());
            dto.setUsedByEmail(ref.getUsedByEmail());
            dto.setNotes(ref.getNotes());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public AdminReferenceDTO generateReferenceId(String notes) {
        String code = "REF-ADM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        AdminReference ref = new AdminReference(code, notes != null ? notes : "Admin generated registration authorization");
        ref = adminReferenceRepository.save(ref);

        AdminReferenceDTO dto = new AdminReferenceDTO();
        dto.setId(ref.getId());
        dto.setReferenceCode(ref.getReferenceCode());
        dto.setStatus(ref.getStatus().name());
        dto.setCreatedAt(ref.getCreatedAt());
        dto.setNotes(ref.getNotes());
        return dto;
    }
}
