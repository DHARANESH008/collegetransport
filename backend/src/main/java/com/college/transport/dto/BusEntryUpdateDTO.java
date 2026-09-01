package com.college.transport.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class BusEntryUpdateDTO {

    @NotNull(message = "New Bus Number is required")
    @Min(value = 0, message = "Bus Number must be between 0 and 150")
    @Max(value = 150, message = "Bus Number must be between 0 and 150")
    private Integer newBusNumber;

    public BusEntryUpdateDTO() {}

    public BusEntryUpdateDTO(Integer newBusNumber) {
        this.newBusNumber = newBusNumber;
    }

    public Integer getNewBusNumber() {
        return newBusNumber;
    }

    public void setNewBusNumber(Integer newBusNumber) {
        this.newBusNumber = newBusNumber;
    }
}
