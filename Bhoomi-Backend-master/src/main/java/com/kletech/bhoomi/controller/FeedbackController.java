package com.kletech.bhoomi.controller;

import com.kletech.bhoomi.Commons.Constants;
import com.kletech.bhoomi.DTO.LoginRequest;
import com.kletech.bhoomi.model.Feedback;
import com.kletech.bhoomi.model.User;
import com.kletech.bhoomi.service.FeedbackService;
import com.kletech.bhoomi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = Constants.crossOrigins)
@RestController
@RequestMapping("/feedback")
public class FeedbackController {
    @Autowired
    FeedbackService feedbackService;

    @PostMapping("/add")
    public Feedback addFeedback(@RequestBody() Feedback feedback) {
        return feedbackService.addFeedback(feedback);
    }

    @GetMapping("/getall")
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

}
