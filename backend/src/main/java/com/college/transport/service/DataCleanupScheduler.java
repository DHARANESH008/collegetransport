package com.college.transport.service;

import com.college.transport.entity.SystemCleanupLog;
import com.college.transport.repository.BusEntryRepository;
import com.college.transport.repository.SystemCleanupLogRepository;
import com.college.transport.repository.TripHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class DataCleanupScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DataCleanupScheduler.class);

    @Autowired
    private BusEntryRepository busEntryRepository;

    @Autowired
    private TripHistoryRepository tripHistoryRepository;

    @Autowired
    private SystemCleanupLogRepository systemCleanupLogRepository;

    @Value("${app.cleanup.retention-days:90}")
    private int retentionDays; // 90 days (3 months) retention

    @Value("${app.cleanup.enabled:true}")
    private boolean cleanupEnabled;

    /**
     * Automatic Scheduled Cleanup:
     * Runs every night at midnight to delete transient logs older than 90 days (3 months).
     */
    @Scheduled(cron = "${app.cleanup.cron:0 0 0 * * ?}")
    @Transactional
    public void performScheduledDataCleanup() {
        if (!cleanupEnabled) {
            logger.info("Database 90-Day auto-cleanup is disabled in configuration.");
            return;
        }

        executeCleanup();
    }

    /**
     * Executes the cleanup of bus entries and trip histories older than retention cutoff (90 days).
     */
    @Transactional
    public SystemCleanupLog executeCleanup() {
        LocalDateTime cutoffDateTime = LocalDateTime.now().minusDays(retentionDays);
        LocalDate cutoffDate = cutoffDateTime.toLocalDate();

        logger.info("Executing 90-Day Data Retention Policy cleanup. Purging records created before: {}", cutoffDateTime);

        int entriesDeleted = 0;
        int tripsDeleted = 0;
        String status = "SUCCESS";
        String message;

        try {
            entriesDeleted = busEntryRepository.deleteOlderThanCutoff(cutoffDateTime);
            tripsDeleted = tripHistoryRepository.deleteOlderThanCutoff(cutoffDateTime);

            message = String.format("Successfully cleaned up records older than %d days (%s). Purged %d bus gate entries and %d trip history logs.",
                    retentionDays, cutoffDateTime, entriesDeleted, tripsDeleted);
            logger.info(message);
        } catch (Exception e) {
            status = "FAILED";
            message = "Cleanup failed: " + e.getMessage();
            logger.error("Error executing database 90-day cleanup: {}", e.getMessage(), e);
        }

        SystemCleanupLog log = new SystemCleanupLog(cutoffDate, entriesDeleted, tripsDeleted, status, message);
        return systemCleanupLogRepository.save(log);
    }
}
