package com.college.transport.dto;

import jakarta.validation.constraints.NotBlank;

public class GateDTO {

    private Long id;

    @NotBlank(message = "Gate name is required")
    private String gateName;

    private String description;

    public GateDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGateName() {
        return gateName;
    }

    public void setGateName(String gateName) {
        this.gateName = gateName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
