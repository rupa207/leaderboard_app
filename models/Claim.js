const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  points: Number,
  time: Date
});

module.exports = mongoose.model('Claim', claimSchema);
