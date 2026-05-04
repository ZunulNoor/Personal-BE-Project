const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  displayName: String,
  avatar: String, // Optional: URL to profile image
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
