package com.kletech.bhoomi.service;

import com.kletech.bhoomi.model.User;
import com.kletech.bhoomi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User addUser(User user){
//        List<Student> list = studentRepository.findByPhoneNumberOrEmailId(student.getPhoneNumber(), student.getEmailId());
//        if(!list.isEmpty())
//            return null;
        return userRepository.save(user);
    }
    public User updateUser(User user){
        if(userRepository.existsById(user.getUserId())){
            return userRepository.save(user);
        }
        return null;
    }

    public User getUserById(Long id){
        Optional<User> opt = userRepository.findById(id);
        if(opt.isPresent())
            return opt.get();
        else
            return null;
    }
    public List<User> getAllUser(){
        List<User> studentList = userRepository.findAll();
        return studentList;
    }

    public User checkUserExist( Long id)
    {
        User user = userRepository.findById(id).get();
        return user; //Student does not exist
    }
    public User login( String userName, String password)
    {

        User user = userRepository.findByUserEmail(userName);
        if(user == null)
        {
            return null;
        }
        else {
            if(user.getUserPassword().equals(password)){
                return user;
            }
        }
        return null; //Student does not exist
    }
}
