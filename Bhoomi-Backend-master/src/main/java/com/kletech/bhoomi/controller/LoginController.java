package com.kletech.bhoomi.controller;

import com.kletech.bhoomi.Commons.Constants;
import com.kletech.bhoomi.DTO.LoginRequest;
import com.kletech.bhoomi.model.User;
import com.kletech.bhoomi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/login")
public class LoginController {
    @Autowired
    UserService userService;

    @PostMapping("/check")
    public Boolean checkLogin(@RequestBody() LoginRequest user) {
        System.out.println(user);
        User user1= userService.login(user.getEmail(), user.getPassword());
        System.out.println(user1);
        if(user1 != null) {
            return true;
        }
        return false ;
    }
}
