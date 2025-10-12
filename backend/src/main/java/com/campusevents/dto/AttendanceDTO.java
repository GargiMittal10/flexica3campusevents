package com.campusevents.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AttendanceDTO {
    @NotBlank(message = "Event ID is required")
    private String eventId;
    
    @NotBlank(message = "QR data is required")
    private String qrData;
}
