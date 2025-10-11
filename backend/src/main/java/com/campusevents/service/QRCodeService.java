package com.campusevents.service;

import com.campusevents.entity.User;
import org.springframework.stereotype.Service;
import java.util.Base64;

@Service
public class QRCodeService {
    
    public String generateQRData(User user) {
        String data = String.format("STUDENT:%s:%s:%d", 
            user.getId(), 
            user.getStudentId(),
            System.currentTimeMillis() / 1000
        );
        return Base64.getEncoder().encodeToString(data.getBytes());
    }
}
