package com.college.transport.dto;

public class ReferenceValidationResponse {

    private boolean valid;
    private String referenceCode;
    private String status;
    private String message;

    public ReferenceValidationResponse() {}

    public ReferenceValidationResponse(boolean valid, String referenceCode, String status, String message) {
        this.valid = valid;
        this.referenceCode = referenceCode;
        this.status = status;
        this.message = message;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public void setReferenceCode(String referenceCode) {
        this.referenceCode = referenceCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
