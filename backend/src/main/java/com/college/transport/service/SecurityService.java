package com.college.transport.service;

import com.college.transport.dto.BusEntryResponse;
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
public class SecurityService {

    @Autowired
    private SecurityAssignmentRepository securityAssignmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private BusEntryRepository busEntryRepository;

    @Autowired
    private GateRepository gateRepository;

    // Fetch assigned gate for logged in security user
    public Gate getAssignedGate(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Optional<SecurityAssignment> assignOpt = securityAssignmentRepository.findActiveBySecurityId(user.getId());
        if (assignOpt.isEmpty()) {
            // Fallback to Main Gate if no specific assignment
            return gateRepository.findById(1L).orElseGet(() -> {
                Gate g = new Gate("Main Gate", "Default Campus Entrance");
                return gateRepository.save(g);
            });
        }
        return assignOpt.get().getGate();
    }

    // Bus Enter (1-click automatic logging)
    @Transactional
    public BusEntryResponse recordBusEntry(String username, Integer busNumber) {
        if (busNumber == null || busNumber < 0 || busNumber > 150) {
            throw new BadRequestException("Please select a valid Bus Number between 0 and 150");
        }

        User securityUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Security user not found"));

        Bus bus = busRepository.findByBusNumber(busNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bus " + busNumber + " does not exist in master records"));

        LocalDate today = LocalDate.now();

        // Validation: Same Bus cannot be entered twice on the same day
        if (busEntryRepository.existsByBusIdAndEntryDate(bus.getId(), today)) {
            throw new BadRequestException("Validation Error: Bus #" + busNumber + " has ALREADY been entered today (" + today + "). Duplicate entries on the same day are rejected.");
        }

        Gate gate = getAssignedGate(username);
        LocalTime now = LocalTime.now();

        BusEntry entry = new BusEntry(bus, gate, securityUser, today, now);
        entry = busEntryRepository.save(entry);

        return toResponse(entry);
    }

    // Edit Bus Number ONLY (Security cannot edit date or time)
    @Transactional
    public BusEntryResponse updateBusEntryNumber(Long entryId, Integer newBusNumber) {
        if (newBusNumber == null || newBusNumber < 0 || newBusNumber > 150) {
            throw new BadRequestException("Bus Number must be between 0 and 150");
        }

        BusEntry entry = busEntryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Gate entry record not found with id: " + entryId));

        LocalDate today = LocalDate.now();

        // Check if changing to a bus that was already entered today
        if (!entry.getBusNumber().equals(newBusNumber)) {
            Bus newBus = busRepository.findByBusNumber(newBusNumber)
                    .orElseThrow(() -> new ResourceNotFoundException("Bus #" + newBusNumber + " does not exist in master records"));

            if (busEntryRepository.existsByBusIdAndEntryDate(newBus.getId(), today)) {
                throw new BadRequestException("Bus #" + newBusNumber + " has already been entered at the gate today.");
            }

            entry.setBus(newBus);
            entry.setBusNumber(newBus.getBusNumber());
            entry = busEntryRepository.save(entry);
        }

        return toResponse(entry);
    }

    // Get today's gate entries
    public List<BusEntryResponse> getTodayEntries() {
        LocalDate today = LocalDate.now();
        return busEntryRepository.findByEntryDateOrderByEntryTimeDesc(today)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private BusEntryResponse toResponse(BusEntry entry) {
        BusEntryResponse res = new BusEntryResponse();
        res.setId(entry.getId());
        res.setBusId(entry.getBus().getId());
        res.setBusNumber(entry.getBusNumber());
        res.setRegistrationNumber(entry.getBus().getRegistrationNumber());
        res.setGateId(entry.getGate().getId());
        res.setGateName(entry.getGateName());
        res.setEntryDate(entry.getEntryDate());
        res.setEntryTime(entry.getEntryTime());

        if (entry.getBus().getRoute() != null) {
            res.setRouteName(entry.getBus().getRoute().getRouteName());
        }
        return res;
    }
}
