const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  averageRating: { type: Number, min: 0, max: 10, default: null }
});

module.exports = mongoose.model('Movie', MovieSchema);
