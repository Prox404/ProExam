package com.dtu.proexam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.Users;

public interface UserRepository extends JpaRepository<Users, String> {
    
}