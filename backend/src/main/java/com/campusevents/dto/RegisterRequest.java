package com.campusevents.dto;

import com.campusevents.entity.UserRole;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String studentId;
    private UserRole role;
}
