package com.kletech.bhoomi.service;

import com.kletech.bhoomi.model.Feedback;
import com.kletech.bhoomi.model.User;
import com.kletech.bhoomi.repository.FeedbackRepository;
import com.kletech.bhoomi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback addFeedback(Feedback feedback) {
//        List<Student> list = studentRepository.findByPhoneNumberOrEmailId(student.getPhoneNumber(), student.getEmailId());
//        if(!list.isEmpty())
//            return null;
        return feedbackRepository.save(feedback);
    }

    public Feedback updateFeedback(Feedback feedback) {
        if (feedbackRepository.existsById(feedback.getFeedbackId())) {
            return feedbackRepository.save(feedback);
        }
        return null;
    }

    public Feedback getFeedbackById(Long id) {
        Optional<Feedback> opt = feedbackRepository.findById(id);
        if (opt.isPresent())
            return opt.get();
        else
            return null;
    }

    public List<Feedback> getAllFeedback() {
        List<Feedback> studentList = feedbackRepository.findAll();
        return studentList;
    }

    public Feedback checkFeedbackExist(Long id) {
        Feedback feedback = feedbackRepository.findById(id).get();
        return feedback; //Student does not exist
    }
}
