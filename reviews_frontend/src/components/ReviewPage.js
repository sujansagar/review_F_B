import React, { useState, useEffect } from 'react';
import './ReviewPage.css'; // Assuming your CSS file is in the same directory

const ReviewPage = () => {
  const [heading, setHeading] = useState('Review');
  const [editingHeading, setEditingHeading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    rating: '', // Keep as string for select, convert to number for API
    comment: '',
  });
  const [editingId, setEditingId] = useState(null); // Changed to editingId to match backend
  const [darkMode, setDarkMode] = useState(false);

  const API_BASE_URL = 'http://localhost:8080/api/reviews'; // Your Spring Boot API endpoint

  // --- Theme Toggle ---
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    document.body.classList.toggle('light', !darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  
  const handleHeadingClick = () => setEditingHeading(true);
  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleHeadingBlur = () => setEditingHeading(false);


  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // --- Modal Open/Close ---
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', rating: '', comment: '' });
    setEditingId(null);
  };

  // --- Form Input Change 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Submit Review (Add/Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.rating.trim() || !formData.comment.trim()) {
      alert('Please fill all fields.');
      return;
    }

    const reviewToSave = {
      ...formData,
      rating: Number(formData.rating), // Convert rating to number for backend
    };

    try {
      let response;
      if (editingId) {
        // Update existing review
        response = await fetch(`${API_BASE_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewToSave),
        });
      } else {
        // Add new review
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewToSave),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Re-fetch reviews to update the UI
      fetchReviews();
      closeModal();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // --- Edit Review ---
  const handleEdit = (review) => {
    setFormData({
      name: review.name,
      rating: String(review.rating), // Convert rating back to string for select input
      comment: review.comment,
    });
    setEditingId(review.id);
    setShowModal(true);
  };

  // --- Delete Review ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Filter out the deleted review from the state
        setReviews((prev) => prev.filter((review) => review.id !== id));
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  // --- Render Stars ---
  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? 'star filled' : 'star'}>
        ★
      </span>
    ));
  };

  return (
    <div className="page">
      <div className="theme-toggle">
        <button onClick={toggleTheme} className="theme-switch-btn">
          Switch to {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <div className="heading-box">
        {editingHeading ? (
          <input
            type="text"
            className="heading-input"
            value={heading}
            onChange={handleHeadingChange}
            onBlur={handleHeadingBlur}
            autoFocus
          />
        ) : (
          <h1 className="heading-text" onClick={handleHeadingClick}>
            {heading}
          </h1>
        )}
      </div>

      <button className="add-btn" onClick={openModal}>
        Add Review
      </button>

      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Review' : 'Add Your Review'}</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  autoFocus
                />
              </label>

              <label>
                Rating (1–5):
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select rating
                  </option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Comment:
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  {editingId ? 'Update Review' : 'Submit Review'}
                </button>
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="reviews">
        {reviews.map((review) => (
          <div className="card" key={review.id}> {/* Use review.id for unique key */}
            <div className="card-actions">
              <button onClick={() => handleEdit(review)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(review.id)} className="delete-btn">
                Delete
              </button>
            </div>
            <h3>{review.name}</h3>
            <div className="stars">{renderStars(review.rating)}</div>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;