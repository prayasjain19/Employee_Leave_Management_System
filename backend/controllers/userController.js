const User = require('../models/User');

// Get logged-in user's profile
exports.getProfile = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  res.status(200).json(req.user);
};

// Manager: Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees', error: err.message });
  }
};
