package com.campusevents.controller;

import com.campusevents.entity.User;
import com.campusevents.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/my-qr-code")
    public ResponseEntity<String> getMyQRCode(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        
        if (!"STUDENT".equals(user.getRole().name())) {
            return ResponseEntity.badRequest().body("Only students have QR codes");
        }
        
        return ResponseEntity.ok(user.getQrCodeData());
    }
}
