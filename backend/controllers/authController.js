const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LeaveBalance = require('../models/LeaveBalance');

// Utility to generate token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role}, // ✅ include role
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Helper to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    res.status(200).json({
      token: generateToken(user),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const allowedRoles = ['employee', 'manager'];
  if (!allowedRoles.includes(role.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid role. Must be employee or manager' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role.toLowerCase(),
    });

    // Initialize leave balance
    await LeaveBalance.create({
      user: user._id,
      vacation: 10,
      sick: 10,
      other: 5,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};
