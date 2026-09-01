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

    @Value("${app.cleanup.retention-minutes:3}")
    private int retentionMinutes; // 3 minutes retention

    @Value("${app.cleanup.enabled:true}")
    private boolean cleanupEnabled;

    /**
     * Automatic Scheduled Cleanup:
     * Runs every minute by default to delete transient logs older than 3 minutes.
     */
    @Scheduled(cron = "${app.cleanup.cron:0 */1 * * * ?}")
    @Transactional
    public void performScheduledDataCleanup() {
        if (!cleanupEnabled) {
            logger.info("Database 3-Minute auto-cleanup is disabled in configuration.");
            return;
        }

        executeCleanup();
    }

    /**
     * Executes the cleanup of bus entries and trip histories older than retention cutoff (3 minutes).
     */
    @Transactional
    public SystemCleanupLog executeCleanup() {
        LocalDateTime cutoffDateTime = LocalDateTime.now().minusMinutes(retentionMinutes);
        LocalDate cutoffDate = cutoffDateTime.toLocalDate();

        logger.info("Executing 3-Minute Data Retention Policy cleanup. Purging records created before: {}", cutoffDateTime);

        int entriesDeleted = 0;
        int tripsDeleted = 0;
        String status = "SUCCESS";
        String message;

        try {
            entriesDeleted = busEntryRepository.deleteOlderThanCutoff(cutoffDateTime);
            tripsDeleted = tripHistoryRepository.deleteOlderThanCutoff(cutoffDateTime);

            message = String.format("Successfully cleaned up records older than %d minutes (%s). Purged %d bus gate entries and %d trip history logs.",
                    retentionMinutes, cutoffDateTime, entriesDeleted, tripsDeleted);
            logger.info(message);
        } catch (Exception e) {
            status = "FAILED";
            message = "Cleanup failed: " + e.getMessage();
            logger.error("Error executing database 3-minute cleanup: {}", e.getMessage(), e);
        }

        SystemCleanupLog log = new SystemCleanupLog(cutoffDate, entriesDeleted, tripsDeleted, status, message);
        return systemCleanupLogRepository.save(log);
    }
}
