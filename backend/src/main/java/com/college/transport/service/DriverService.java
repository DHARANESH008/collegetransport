package com.college.transport.service;

import com.college.transport.dto.DriverBusInfoResponse;
import com.college.transport.dto.TripHistoryDTO;
import com.college.transport.entity.*;
import com.college.transport.exception.BadRequestException;
import com.college.transport.exception.ResourceNotFoundException;
import com.college.transport.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DriverService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverAssignmentRepository driverAssignmentRepository;

    @Autowired
    private TripHistoryRepository tripHistoryRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private BusEntryRepository busEntryRepository;

    // Driver loads assigned bus, route, auto-computed Start KM, and Gate entry status
    public DriverBusInfoResponse getDriverBusInfo(String username) {
        User driver = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + username));

        Optional<DriverAssignment> assignmentOpt = driverAssignmentRepository.findActiveByDriverId(driver.getId());
        if (assignmentOpt.isEmpty()) {
            DriverBusInfoResponse unassigned = new DriverBusInfoResponse();
            unassigned.setBusNumber(null);
            unassigned.setRegistrationNumber("Pending Assignment");
            unassigned.setRouteName("No Bus Assigned Yet — Please Contact Admin");
            unassigned.setJourneyStatus("NO_BUS_ASSIGNED");
            unassigned.setStartKm(0.0);
            unassigned.setIsAutoStartKm(true);
            unassigned.setGateEntryRecorded(false);
            return unassigned;
        }

        Bus bus = assignmentOpt.get().getBus();
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        DriverBusInfoResponse response = new DriverBusInfoResponse();
        response.setBusId(bus.getId());
        response.setBusNumber(bus.getBusNumber());
        response.setRegistrationNumber(bus.getRegistrationNumber());

        if (bus.getRoute() != null) {
            response.setRouteId(bus.getRoute().getId());
            response.setRouteName(bus.getRoute().getRouteName());
            response.setApproxDistanceKm(bus.getRoute().getApproxDistanceKm());
        }

        // Check if Security Gate Entry has been logged today
        Optional<BusEntry> gateEntryOpt = busEntryRepository.findByBusIdAndEntryDate(bus.getId(), today);
        if (gateEntryOpt.isPresent()) {
            BusEntry entry = gateEntryOpt.get();
            response.setGateEntryRecorded(true);
            response.setGateEntryTime(entry.getEntryTime());
            response.setGateName(entry.getGate() != null ? entry.getGate().getGateName() : "Campus Gate");
        } else {
            response.setGateEntryRecorded(false);
            if (bus.getAssignedGate() != null) {
                response.setGateName(bus.getAssignedGate().getGateName());
            }
        }

        // Allowed Student Count Window: 08:30 AM to 10:00 AM
        boolean withinWindow = !now.isBefore(LocalTime.of(8, 30)) && !now.isAfter(LocalTime.of(10, 0));
        boolean isLate = now.isAfter(LocalTime.of(10, 0));
        response.setIsWithinAllowedTimeWindow(withinWindow);
        response.setIsLateArrival(isLate);

        // Check if there is already a trip created for today
        Optional<TripHistory> todayTripOpt = tripHistoryRepository.findByBusIdAndTripDate(bus.getId(), today);
        if (todayTripOpt.isPresent()) {
            TripHistory trip = todayTripOpt.get();
            response.setTripId(trip.getId());
            response.setTripDate(trip.getTripDate());
            response.setJourneyStatus(trip.getJourneyStatus().name());
            response.setStartTime(trip.getStartTime());
            response.setEndTime(trip.getEndTime());
            response.setStartKm(trip.getStartKm());
            response.setEndKm(trip.getEndKm());
            response.setTotalDistance(trip.getTotalDistance());
            response.setStudentCount(trip.getStudentCount());
            response.setIsAutoStartKm(true);
            response.setPreviousEndKm(trip.getStartKm());
            response.setIsLateArrival(trip.getIsLateArrival());
            response.setStudentMarkedTime(trip.getStudentMarkedTime());
            if (trip.getGateName() != null) response.setGateName(trip.getGateName());
            if (trip.getGateEntryTime() != null) response.setGateEntryTime(trip.getGateEntryTime());
        } else {
            // Find previous day's end KM to auto-populate today's Start KM
            List<TripHistory> prevTrips = tripHistoryRepository.findPreviousTripsWithEndKm(bus.getId());
            if (!prevTrips.isEmpty() && prevTrips.get(0).getEndKm() != null && prevTrips.get(0).getEndKm() > 0) {
                Double prevEndKm = prevTrips.get(0).getEndKm();
                response.setStartKm(prevEndKm);
                response.setPreviousEndKm(prevEndKm);
                response.setIsAutoStartKm(true);
            } else {
                // Day 1 (First time ever for this bus): Driver must manually enter initial odometer Start KM
                response.setStartKm(null);
                response.setPreviousEndKm(null);
                response.setIsAutoStartKm(false);
            }
            response.setJourneyStatus(TripHistory.JourneyStatus.NOT_STARTED.name());
            response.setStudentCount(0);
        }

        return response;
    }

    // Start Journey (Driver presses Start Journey)
    @Transactional
    public DriverBusInfoResponse startJourney(String username, Double manualStartKm) {
        User driver = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        DriverAssignment assignment = driverAssignmentRepository.findActiveByDriverId(driver.getId())
                .orElseThrow(() -> new BadRequestException("No active bus assigned to this driver"));

        Bus bus = assignment.getBus();
        LocalDate today = LocalDate.now();

        TripHistory trip = tripHistoryRepository.findByBusIdAndTripDate(bus.getId(), today)
                .orElseGet(() -> new TripHistory(bus, driver, bus.getRoute(), today, 0.0));

        if (trip.getJourneyStatus() == TripHistory.JourneyStatus.COMPLETED) {
            throw new BadRequestException("Today's journey has already been completed for this bus.");
        }

        // Determine Start KM:
        Double effectiveStartKm;
        List<TripHistory> prevTrips = tripHistoryRepository.findPreviousTripsWithEndKm(bus.getId());
        if (!prevTrips.isEmpty() && prevTrips.get(0).getEndKm() != null && prevTrips.get(0).getEndKm() > 0) {
            effectiveStartKm = prevTrips.get(0).getEndKm();
        } else {
            if (manualStartKm != null && manualStartKm >= 0) {
                effectiveStartKm = manualStartKm;
            } else {
                throw new BadRequestException("First trip setup: Please enter initial vehicle Odometer Start KM.");
            }
        }

        trip.setStartKm(effectiveStartKm);
        trip.setStartTime(LocalTime.now());
        trip.setJourneyStatus(TripHistory.JourneyStatus.IN_TRANSIT);
        trip = tripHistoryRepository.save(trip);

        return getDriverBusInfo(username);
    }

    // Save Student Count upon reaching college (ONLY after Security Gate Entry)
    @Transactional
    public DriverBusInfoResponse saveStudentCount(String username, Integer studentCount) {
        if (studentCount == null || studentCount < 0) {
            throw new BadRequestException("Student count must be a non-negative number.");
        }

        User driver = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        DriverAssignment assignment = driverAssignmentRepository.findActiveByDriverId(driver.getId())
                .orElseThrow(() -> new BadRequestException("No active bus assigned"));

        Bus bus = assignment.getBus();
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // 1. Mandatory Security Gate Checkpoint Check:
        // Security gate must log bus entry before driver can mark student count
        Optional<BusEntry> gateEntryOpt = busEntryRepository.findByBusIdAndEntryDate(bus.getId(), today);
        if (gateEntryOpt.isEmpty()) {
            throw new BadRequestException("Security Gate Checkpoint Required: Security staff has not yet recorded Bus #"
                    + bus.getBusNumber() + " entering the gate today. Student count can only be entered after the bus enters the campus gate.");
        }

        TripHistory trip = tripHistoryRepository.findByBusIdAndTripDate(bus.getId(), today)
                .orElseThrow(() -> new BadRequestException("No active trip found for today. Please start journey first."));

        // Reject modification if student count was already submitted for today's trip
        if (trip.getStudentCount() != null && trip.getStudentCount() > 0) {
            throw new BadRequestException("Student count has already been submitted for today's trip ("
                    + trip.getStudentCount() + " students) and is locked. It cannot be changed again today.");
        }

        // 2. Allowed Arrival Window: 08:30 AM to 10:00 AM
        // If marked after 10:00 AM, mark as LATE ARRIVAL (flagged for RED display)
        boolean isLate = now.isAfter(LocalTime.of(10, 0));

        trip.setStudentCount(studentCount);
        trip.setStudentMarkedTime(now);
        trip.setIsLateArrival(isLate);
        trip.setGateName(gateEntryOpt.get().getGate() != null ? gateEntryOpt.get().getGate().getGateName() : "Campus Gate");
        trip.setGateEntryTime(gateEntryOpt.get().getEntryTime());

        if (trip.getJourneyStatus() == TripHistory.JourneyStatus.IN_TRANSIT) {
            trip.setJourneyStatus(TripHistory.JourneyStatus.COLLEGE_ARRIVED);
        }
        tripHistoryRepository.save(trip);

        return getDriverBusInfo(username);
    }

    // End Journey (Driver enters End KM, system computes Distance = End KM - Start KM)
    @Transactional
    public DriverBusInfoResponse endJourney(String username, Double endKm) {
        if (endKm == null || endKm < 0) {
            throw new BadRequestException("End KM is required and must be non-negative.");
        }

        User driver = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        DriverAssignment assignment = driverAssignmentRepository.findActiveByDriverId(driver.getId())
                .orElseThrow(() -> new BadRequestException("No active bus assigned"));

        LocalDate today = LocalDate.now();
        TripHistory trip = tripHistoryRepository.findByBusIdAndTripDate(assignment.getBus().getId(), today)
                .orElseThrow(() -> new BadRequestException("No trip record found for today. Please start journey first."));

        // Validation: End KM cannot be smaller than Start KM
        if (endKm < trip.getStartKm()) {
            throw new BadRequestException("Validation Error: End KM (" + endKm + ") cannot be smaller than Start KM (" + trip.getStartKm() + ").");
        }

        // Automatic Calculation: Distance = End KM - Start KM
        double distance = Math.round((endKm - trip.getStartKm()) * 100.0) / 100.0;

        trip.setEndKm(endKm);
        trip.setTotalDistance(distance);
        trip.setEndTime(LocalTime.now());
        trip.setJourneyStatus(TripHistory.JourneyStatus.COMPLETED);

        tripHistoryRepository.save(trip);

        return getDriverBusInfo(username);
    }

    // Permanent Trip History for Driver
    public List<TripHistoryDTO> getDriverTripHistory(String username) {
        User driver = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        return tripHistoryRepository.findByDriverIdOrderByTripDateDescCreatedAtDesc(driver.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private TripHistoryDTO toDTO(TripHistory th) {
        TripHistoryDTO dto = new TripHistoryDTO();
        dto.setId(th.getId());
        dto.setBusId(th.getBus().getId());
        dto.setBusNumber(th.getBusNumber());
        dto.setRegistrationNumber(th.getBus().getRegistrationNumber());
        dto.setDriverId(th.getDriver().getId());
        dto.setDriverName(th.getDriverName());
        dto.setDriverMobile(th.getDriverMobile());
        dto.setRouteName(th.getRouteName());
        dto.setGateName(th.getGateName());
        dto.setGateEntryTime(th.getGateEntryTime());
        dto.setTripDate(th.getTripDate());
        dto.setStartTime(th.getStartTime());
        dto.setEndTime(th.getEndTime());
        dto.setStartKm(th.getStartKm());
        dto.setEndKm(th.getEndKm());
        dto.setTotalDistance(th.getTotalDistance());
        dto.setStudentCount(th.getStudentCount());
        dto.setIsLateArrival(th.getIsLateArrival());
        dto.setStudentMarkedTime(th.getStudentMarkedTime());
        dto.setJourneyStatus(th.getJourneyStatus().name());
        return dto;
    }
}
