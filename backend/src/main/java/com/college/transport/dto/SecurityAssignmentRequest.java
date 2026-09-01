package com.college.transport.dto;

import jakarta.validation.constraints.NotNull;

public class SecurityAssignmentRequest {

    @NotNull(message = "Security User ID is required")
    private Long securityId;

    @NotNull(message = "Gate ID is required")
    private Long gateId;

    public SecurityAssignmentRequest() {}

    public SecurityAssignmentRequest(Long securityId, Long gateId) {
        this.securityId = securityId;
        this.gateId = gateId;
    }

    public Long getSecurityId() {
        return securityId;
    }

    public void setSecurityId(Long securityId) {
        this.securityId = securityId;
    }

    public Long getGateId() {
        return gateId;
    }

    public void setGateId(Long gateId) {
        this.gateId = gateId;
    }
}
