package com.kletech.bhoomi.repository;

import com.kletech.bhoomi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User,Long> {
    User findByUserEmail(String email);
}
