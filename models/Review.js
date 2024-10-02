const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  reviewerName: { type: String, required: false },
  rating: { type: Number, required: true, min: 0, max: 10 },
  comments: { type: String, required: true }
});

module.exports = mongoose.model('Review', ReviewSchema);
