package com.dtu.proexam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.Cheating;

public interface CheatingRopository extends JpaRepository<Cheating, Integer> {
}