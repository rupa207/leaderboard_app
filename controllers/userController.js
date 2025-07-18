const User = require('../models/User');
const ClaimHistory = require('../models/ClaimHistory');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name } = req.body;
    const user = new User({ name, totalPoints: 0 }); // initialize totalPoints
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Get all users sorted by total points
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Claim fixed 20 points for a user
exports.claimPoints = async (req, res) => {
  try {
    const { userId } = req.body;
    const points = 20; // ✅ FIXED POINT VALUE

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.totalPoints += points;
    await user.save();

    const history = new ClaimHistory({ userId, points });
    await history.save();

    res.json({ message: `${user.name} claimed ${points} points!`, user, points });
  } catch (error) {
    res.status(500).json({ error: 'Error claiming points' });
  }
};

// Get claim history
exports.getHistory = async (req, res) => {
  try {
    const history = await ClaimHistory.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching history' });
  }
};
// Delete a user

exports.deleteUser = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findOneAndDelete({ name });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: delete related claim history too
    await ClaimHistory.deleteMany({ userId: user._id });

    res.json({ message: `${name} deleted` });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};
