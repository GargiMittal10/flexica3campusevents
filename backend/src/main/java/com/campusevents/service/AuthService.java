package com.campusevents.service;

import com.campusevents.dto.AuthRequest;
import com.campusevents.dto.AuthResponse;
import com.campusevents.dto.RegisterRequest;
import com.campusevents.entity.User;
import com.campusevents.repository.UserRepository;
import com.campusevents.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private QRCodeService qrCodeService;
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStudentId(request.getStudentId());
        user.setRole(request.getRole());
        
        // Generate QR code for students
        if (request.getRole().name().equals("STUDENT")) {
            String qrData = qrCodeService.generateQRData(user);
            user.setQrCodeData(qrData);
        }
        
        user = userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
    
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}
