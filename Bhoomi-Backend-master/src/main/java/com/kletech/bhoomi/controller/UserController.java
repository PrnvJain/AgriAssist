package com.kletech.bhoomi.controller;

import com.kletech.bhoomi.Commons.Constants;
import com.kletech.bhoomi.model.User;
import com.kletech.bhoomi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = Constants.crossOrigins)
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserService userService;


    @GetMapping("/getall")
    List<User> getAllUser(){
        return userService.getAllUser();
    }

    @PostMapping("/add")
    User addUser(@RequestBody() User user)
    {
        return userService.addUser(user);
    }
    @GetMapping("/check")
    User checkStudent(@RequestBody() User user){
        return userService.checkUserExist(user.getUserId());
    }
    @PostMapping("/update")
    User updateStudent(@RequestBody() User user)
    {
        if(user.getUserId()==null){
            return null;
        }
        return userService.updateUser(user);
    }

//    @GetMapping("/projects/(id)")
//    List<Project> studentProjects(@PathVariable() Long studendId){
//        return projectService.getProjectByStudent(studendId);
//    }
}
