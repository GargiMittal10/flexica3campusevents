package com.campusevents.dto;

import com.campusevents.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String id;
    private String email;
    private String fullName;
    private UserRole role;
}
