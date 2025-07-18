const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Claim = require('../models/Claim');
const {
  createUser,
  getUsers,
  claimPoints,
  getHistory,
  deleteUser
} = require('../controllers/userController');

// POST /api/users - add new user
router.post('/users', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const existing = await User.findOne({ name });
    if (existing) return res.json({ message: "User already exists" });

    const newUser = new User({ name, totalPoints: 0 });
    await newUser.save();
    res.json({ message: 'User added', user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users - list users sorted by points
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/claim - claim random points for a user
router.post('/claim', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: "User not found" });

    const points = Math.floor(Math.random() * 10) + 1;
    user.totalPoints += points;
    await user.save();

    const claim = new Claim({
      userId: user._id,
      userName: user.name,
      points,
      time: new Date()
    });
    await claim.save();

    res.json({ message: `${name} claimed ${points} points`, points });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/history - return all claim history
router.get('/history', async (req, res) => {
  try {
    const history = await Claim.find().sort({ time: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
router.delete('/delete', deleteUser);
