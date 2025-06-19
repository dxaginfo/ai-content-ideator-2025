const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Could not register user'
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Could not log in user'
    });
  }
};

/**
 * Get current user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Could not find user'
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Profile retrieval failed',
      message: 'Could not retrieve user profile'
    });
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, preferences } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Could not find user'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (preferences) user.preferences = preferences;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'Could not update user profile'
    });
  }
};