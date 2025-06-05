package com.example.springboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.entity.Review;
import com.example.springboot.services.ReviewService;

@RestController
@RequestMapping("/api/reviews")
//@CrossOrigin(origins="http://localhost:3000")//To communicate with front end
public class ReviewController 
{

	@Autowired
	private ReviewService reviewService;
	
	//API for Saving the Review data
	@PostMapping
	public ResponseEntity<Review> saveReview(@RequestBody Review review)
	{
		Review createdReview = reviewService.createReview(review);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
	}
	
	//API for getting Review based on id
	@GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        return reviewService.getReviewById(id)
                .map(review -> new ResponseEntity<>(review, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
	
	//API for getting All Reviews
	@GetMapping 
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }
	
	//API for updating (or) edit the Review data
	@PutMapping("/{id}")
	public ResponseEntity<Review> updateReview(@PathVariable Long id,@RequestBody Review review )
	{
Review updateReview = reviewService.updateReview(id, review);
		if(updateReview != null){
        return new ResponseEntity<Review>(updateReview,HttpStatus.OK);}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
     }
	
	//API for Deleting the Review Data
	@DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
	
	
}
