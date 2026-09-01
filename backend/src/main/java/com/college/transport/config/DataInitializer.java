package com.college.transport.config;

import com.college.transport.entity.*;
import com.college.transport.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AdminReferenceRepository adminReferenceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private GateRepository gateRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private DriverAssignmentRepository driverAssignmentRepository;

    @Autowired
    private SecurityAssignmentRepository securityAssignmentRepository;

    @Autowired
    private BusEntryRepository busEntryRepository;

    @Autowired
    private TripHistoryRepository tripHistoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing Smart College Transport Master Data & Seed Profiles...");

        // 1. Roles
        Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(RoleType.ROLE_ADMIN)));
        Role driverRole = roleRepository.findByName(RoleType.ROLE_DRIVER)
                .orElseGet(() -> roleRepository.save(new Role(RoleType.ROLE_DRIVER)));
        Role securityRole = roleRepository.findByName(RoleType.ROLE_SECURITY)
                .orElseGet(() -> roleRepository.save(new Role(RoleType.ROLE_SECURITY)));

        // 2. Reference IDs for Admin Registration
        if (!adminReferenceRepository.existsByReferenceCode("REF-ADM-INIT-ROOT")) {
            AdminReference rootRef = new AdminReference("REF-ADM-INIT-ROOT", "Root System Admin Authorization");
            rootRef.setStatus(AdminReference.Status.USED);
            rootRef.setUsedAt(LocalDateTime.now());
            rootRef.setUsedByEmail("admin@college.edu");
            adminReferenceRepository.save(rootRef);
        }
        if (!adminReferenceRepository.existsByReferenceCode("REF-ADM-2026-001")) {
            adminReferenceRepository.save(new AdminReference("REF-ADM-2026-001", "Authorized Transport Director Reference Code"));
        }
        if (!adminReferenceRepository.existsByReferenceCode("REF-ADM-2026-002")) {
            adminReferenceRepository.save(new AdminReference("REF-ADM-2026-002", "Authorized Assistant Admin Reference Code"));
        }
        if (!adminReferenceRepository.existsByReferenceCode("REF-ADM-2026-003")) {
            adminReferenceRepository.save(new AdminReference("REF-ADM-2026-003", "Authorized Campus Manager Reference Code"));
        }
        if (!adminReferenceRepository.existsByReferenceCode("REF-ADM-2026-004")) {
            adminReferenceRepository.save(new AdminReference("REF-ADM-2026-004", "Authorized Exam/Event Transport Admin Code"));
        }

        // 3. Default Admin Users: admin & svgiadmin with Password: admin+svgi
        User admin = userRepository.findByUsername("admin").orElseGet(() -> {
            User u = new User();
            u.setReferenceId("REF-ADM-INIT-ROOT");
            u.setName("Dr. S. Ramanathan (Transport Head)");
            u.setEmail("admin@svgi.edu");
            u.setMobileNumber("9842100001");
            u.setUsername("admin");
            u.setPassword(passwordEncoder.encode("admin+svgi"));
            u.setRole(adminRole);
            u.setStatus(User.Status.ACTIVE);
            return userRepository.save(u);
        });
        admin.setPassword(passwordEncoder.encode("admin+svgi"));
        userRepository.save(admin);

        if (userRepository.findByUsername("svgiadmin").isEmpty()) {
            User u = new User();
            u.setReferenceId("REF-ADM-2026-001");
            u.setName("SVGI Transport Admin Office");
            u.setEmail("svgiadmin@svgi.edu");
            u.setMobileNumber("9842100002");
            u.setUsername("svgiadmin");
            u.setPassword(passwordEncoder.encode("admin+svgi"));
            u.setRole(adminRole);
            u.setStatus(User.Status.ACTIVE);
            userRepository.save(u);
        }

        // 4. Default Gates Master
        Gate mainGate = gateRepository.findByGateName("Main Gate").orElseGet(() ->
                gateRepository.save(new Gate("Main Gate", "Primary College Arch Entrance on National Highway")));
        Gate southGate = gateRepository.findByGateName("South Gate").orElseGet(() ->
                gateRepository.save(new Gate("South Gate", "Hostel & Residential Zone Entry Gate")));
        Gate northGate = gateRepository.findByGateName("North Gate").orElseGet(() ->
                gateRepository.save(new Gate("North Gate", "Sports Complex & Engineering Block Gate")));
        Gate eastGate = gateRepository.findByGateName("East Gate").orElseGet(() ->
                gateRepository.save(new Gate("East Gate", "Service & Vendor Delivery Gate")));
        Gate westGate = gateRepository.findByGateName("West Gate").orElseGet(() ->
                gateRepository.save(new Gate("West Gate", "West Administrative & Campus Entrance Gate")));

        // 5. Default Routes Master
        Route erodeRoute = routeRepository.findByRouteName("Erode").orElseGet(() ->
                routeRepository.save(new Route("Erode", "Erode Central Bus Stand", "College Campus", "PS Park, GH Roundana, Solar, Thindal, Perundurai Road", 32.5)));
        Route tiruppurRoute = routeRepository.findByRouteName("Tiruppur").orElseGet(() ->
                routeRepository.save(new Route("Tiruppur", "Tiruppur Old Bus Stand", "College Campus", "Kumaran Road, Avinashi, Chengapalli, Vijayamangalam", 48.0)));
        Route gobiRoute = routeRepository.findByRouteName("Gobichettipalayam").orElseGet(() ->
                routeRepository.save(new Route("Gobichettipalayam", "Gobi Bus Stand", "College Campus", "Kullampalayam, Modachur, Kunnathur, Perundurai", 36.8)));
        Route perunduraiRoute = routeRepository.findByRouteName("Perundurai").orElseGet(() ->
                routeRepository.save(new Route("Perundurai", "Perundurai Old Bus Stand", "College Campus", "SIPCOT, Sanatorium, RS Road, Campus Entry", 14.2)));
        Route bhavaniRoute = routeRepository.findByRouteName("Bhavani").orElseGet(() ->
                routeRepository.save(new Route("Bhavani", "Bhavani Kooduthurai", "College Campus", "Komarapalayam Bypass, Lakshmi Nagar, Chithode, Nasiyanur", 28.6)));
        Route sathyRoute = routeRepository.findByRouteName("Sathyamangalam").orElseGet(() ->
                routeRepository.save(new Route("Sathyamangalam", "Sathy Bus Stand", "College Campus", "Puliyampatti, Nambiyur, Gobi Bypass, Kunnathur", 52.0)));
        Route anthiyurRoute = routeRepository.findByRouteName("Anthiyur").orElseGet(() ->
                routeRepository.save(new Route("Anthiyur", "Anthiyur Bus Stand", "College Campus", "Appakudal, Bhavani, Chithode, Campus", 42.0)));
        Route chennimalaiRoute = routeRepository.findByRouteName("Chennimalai").orElseGet(() ->
                routeRepository.save(new Route("Chennimalai", "Chennimalai Murugan Temple Stop", "College Campus", "Ingur, Perundurai Bypass, Campus", 22.5)));

        // 6. Default Buses (0 to 150)
        Bus bus25 = busRepository.findByBusNumber(25).orElseGet(() ->
                busRepository.save(new Bus(25, "TN 33 BM 1025", 60, erodeRoute, mainGate)));
        Bus bus42 = busRepository.findByBusNumber(42).orElseGet(() ->
                busRepository.save(new Bus(42, "TN 33 BM 1042", 60, tiruppurRoute, mainGate)));
        Bus bus18 = busRepository.findByBusNumber(18).orElseGet(() ->
                busRepository.save(new Bus(18, "TN 33 BM 1018", 55, gobiRoute, southGate)));
        Bus bus7 = busRepository.findByBusNumber(7).orElseGet(() ->
                busRepository.save(new Bus(7, "TN 33 BM 1007", 55, perunduraiRoute, mainGate)));
        Bus bus55 = busRepository.findByBusNumber(55).orElseGet(() ->
                busRepository.save(new Bus(55, "TN 33 BM 1055", 60, bhavaniRoute, northGate)));
        Bus bus88 = busRepository.findByBusNumber(88).orElseGet(() ->
                busRepository.save(new Bus(88, "TN 33 BM 1088", 60, sathyRoute, mainGate)));
        Bus bus105 = busRepository.findByBusNumber(105).orElseGet(() ->
                busRepository.save(new Bus(105, "TN 33 BM 1105", 55, anthiyurRoute, southGate)));
        Bus bus12 = busRepository.findByBusNumber(12).orElseGet(() ->
                busRepository.save(new Bus(12, "TN 33 BM 1012", 55, chennimalaiRoute, mainGate)));
        Bus bus0 = busRepository.findByBusNumber(0).orElseGet(() ->
                busRepository.save(new Bus(0, "TN 33 BM 1000", 30, perunduraiRoute, mainGate)));
        Bus bus150 = busRepository.findByBusNumber(150).orElseGet(() ->
                busRepository.save(new Bus(150, "TN 33 BM 1150", 60, erodeRoute, mainGate)));

        // 7. Driver Accounts: DR1, DR2, DR3... DR150 with Password: <busnumber>+svgi
        String[] bloodGroups = {"O+", "A+", "B+", "AB+", "O-", "A-", "B-"};
        java.util.List<Bus> allBuses = busRepository.findAll();
        for (int idx = 0; idx < allBuses.size(); idx++) {
            Bus bus = allBuses.get(idx);
            int busNum = bus.getBusNumber();
            String username = "DR" + busNum;
            String plainPassword = busNum + "+svgi";
            String email = "driver" + busNum + "@svgi.edu";
            String bg = bloodGroups[idx % bloodGroups.length];
            String lic = "TN-33-2018-" + String.format("%05d", 1000 + busNum);
            String addr = "No. " + (idx + 12) + " College Road, Gobichettipalayam, Erode - 638452";
            String photo = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

            User driverUser = userRepository.findByUsername(username).orElseGet(() -> {
                User u = new User();
                u.setName("Driver DR" + busNum);
                u.setEmail(email);
                u.setMobileNumber("98421" + String.format("%05d", busNum));
                u.setLicenseNumber(lic);
                u.setBloodGroup(bg);
                u.setAddress(addr);
                u.setPhotoUrl(photo);
                u.setUsername(username);
                u.setPassword(passwordEncoder.encode(plainPassword));
                u.setRole(driverRole);
                u.setStatus(User.Status.ACTIVE);
                return userRepository.save(u);
            });

            // Ensure License, Blood Group, Address, Photo & Password are set
            driverUser.setLicenseNumber(lic);
            driverUser.setBloodGroup(bg);
            driverUser.setAddress(addr);
            driverUser.setPhotoUrl(photo);
            driverUser.setPassword(passwordEncoder.encode(plainPassword));
            userRepository.save(driverUser);

            // Assign driver to bus
            if (driverAssignmentRepository.findByDriverId(driverUser.getId()).isEmpty() && driverAssignmentRepository.findByBusId(bus.getId()).isEmpty()) {
                driverAssignmentRepository.save(new DriverAssignment(driverUser, bus));
            }
        }

        // Also ensure sample sequential drivers DR1, DR2, DR3, DR4, DR5 exist
        for (int i = 1; i <= 5; i++) {
            final int driverSeq = i;
            String username = "DR" + driverSeq;
            String plainPassword = driverSeq + "+svgi";
            if (userRepository.findByUsername(username).isEmpty()) {
                User u = new User();
                u.setName("Driver DR" + driverSeq);
                u.setEmail("driver" + driverSeq + "@svgi.edu");
                u.setMobileNumber("98421" + String.format("%05d", driverSeq));
                u.setUsername(username);
                u.setPassword(passwordEncoder.encode(plainPassword));
                u.setRole(driverRole);
                u.setStatus(User.Status.ACTIVE);
                userRepository.save(u);
            }
        }

        // 8. Security Accounts: north, south, east, west, main with Password: <username>+svgi
        structSecurityAccount(userRepository, securityRole, gateRepository, securityAssignmentRepository, passwordEncoder, "north", "North Gate Security Officer", "north@svgi.edu", "9842199001", "north+svgi", "North Gate");
        structSecurityAccount(userRepository, securityRole, gateRepository, securityAssignmentRepository, passwordEncoder, "south", "South Gate Security Officer", "south@svgi.edu", "9842199002", "south+svgi", "South Gate");
        structSecurityAccount(userRepository, securityRole, gateRepository, securityAssignmentRepository, passwordEncoder, "east", "East Gate Security Officer", "east@svgi.edu", "9842199003", "east+svgi", "East Gate");
        structSecurityAccount(userRepository, securityRole, gateRepository, securityAssignmentRepository, passwordEncoder, "west", "West Gate Security Officer", "west@svgi.edu", "9842199004", "west+svgi", "West Gate");
        structSecurityAccount(userRepository, securityRole, gateRepository, securityAssignmentRepository, passwordEncoder, "main", "Main Gate Security Officer", "main@svgi.edu", "9842199005", "main+svgi", "Main Gate");
        structSecurityAccount(userRepository, securityRole, gateRepository, securityAssignmentRepository, passwordEncoder, "maingate", "Main Gate Security Desk", "maingate@svgi.edu", "9842199006", "maingate+svgi", "Main Gate");
        structSecurityAccount(userRepository, securityRole, gateRepository, securityAssignmentRepository, passwordEncoder, "security_main", "Chief Security Officer", "security_main@svgi.edu", "9842199007", "main+svgi", "Main Gate");

        logger.info("Smart College Transport Master Data and Initializer completed successfully (Admin, Driver & Security catalog ready)!");
    }

    private void structSecurityAccount(UserRepository userRepository, Role securityRole, GateRepository gateRepository, SecurityAssignmentRepository securityAssignmentRepository, PasswordEncoder passwordEncoder, String username, String name, String email, String mobile, String plainPassword, String gateName) {
        User secUser = userRepository.findByUsername(username).orElseGet(() -> {
            User u = new User();
            u.setName(name);
            u.setEmail(email);
            u.setMobileNumber(mobile);
            u.setUsername(username);
            u.setPassword(passwordEncoder.encode(plainPassword));
            u.setRole(securityRole);
            u.setStatus(User.Status.ACTIVE);
            return userRepository.save(u);
        });

        secUser.setPassword(passwordEncoder.encode(plainPassword));
        userRepository.save(secUser);

        gateRepository.findByGateName(gateName).ifPresent(gate -> {
            if (securityAssignmentRepository.findBySecurityId(secUser.getId()).isEmpty()) {
                securityAssignmentRepository.save(new SecurityAssignment(secUser, gate));
            }
        });
    }
}
