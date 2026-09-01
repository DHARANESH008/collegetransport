package com.college.transport.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SaveStudentsRequest {

    @NotNull(message = "Student count is required")
    @Min(value = 0, message = "Student count cannot be negative")
    private Integer studentCount;

    public SaveStudentsRequest() {}

    public SaveStudentsRequest(Integer studentCount) {
        this.studentCount = studentCount;
    }

    public Integer getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(Integer studentCount) {
        this.studentCount = studentCount;
    }
}
