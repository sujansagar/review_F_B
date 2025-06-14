package com.example.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.springboot.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

}
