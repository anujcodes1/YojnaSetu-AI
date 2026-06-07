const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const { generateToken } = require('../middleware/authMiddleware');

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return ApiResponse.error(res, 400, 'Please provide name, email and password');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return ApiResponse.error(res, 400, 'Email already registered');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return ApiResponse.created(res, 'Account created successfully', {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileComplete: user.profileComplete
    }
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ApiResponse.error(res, 400, 'Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return ApiResponse.error(res, 401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  return ApiResponse.ok(res, 'Login successful', {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileComplete: user.profileComplete
    }
  });
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.ok(res, 'User fetched', req.user);
});

module.exports = { register, login, getMe };
