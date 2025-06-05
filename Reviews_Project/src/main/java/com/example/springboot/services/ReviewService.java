package com.example.springboot.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springboot.entity.Review;
import com.example.springboot.repository.ReviewRepository;

@Service
public class ReviewService {

	@Autowired
	private ReviewRepository reviewRepository;
	
	//method to save review
	public Review createReview(Review review) {
        return reviewRepository.save(review);
    }
	
	//method for get all reviews
	public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
//method for get reviews by id
    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

	//method to update the review
    public Review updateReview(Long id, Review updatedReview) {
        if (reviewRepository.existsById(id)) {
            updatedReview.setId(id); // Ensure the ID is set for update
            return reviewRepository.save(updatedReview);
        }
        return null; // Or throw an exception if review not found
    }

    //method to delete the review
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
