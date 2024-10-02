const express = require("express");
const Review = require("../models/Review");
const Movie = require("../models/Movie");

const router = express.Router();

// Calculate average rating after adding/updating/deleting a review
const calculateAverageRating = async (movieId) => {
  const reviews = await Review.find({ movieId });
  if (reviews.length === 0) {
    await Movie.findByIdAndUpdate(movieId, { averageRating: null });
    return;
  }
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  await Movie.findByIdAndUpdate(movieId, { averageRating });
};

// Get all reviews for a movie
router.get("/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).select(
      "reviewerName rating comments"
    );

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this movie." });
    }
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new review
router.post("/", async (req, res) => {
  const review = new Review(req.body);
  try {
    const newReview = await review.save();
    await calculateAverageRating(review.movieId);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a review
router.put("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    await calculateAverageRating(review.movieId);
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a review
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    await Review.findByIdAndDelete(req.params.id);
    await calculateAverageRating(review.movieId); 
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
