const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { SavedScheme } = require('../models/Supporting');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get user profile
// @route   GET /api/v1/user/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  return ApiResponse.ok(res, 'Profile fetched', req.user);
});

// @desc    Update user profile
// @route   PUT /api/v1/user/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name', 'age', 'gender', 'state', 'district', 'income',
    'occupation', 'category', 'education', 'isDisabled', 'hasLand', 'maritalStatus'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  return ApiResponse.ok(res, 'Profile updated successfully', user);
});

// @desc    Get saved schemes
// @route   GET /api/v1/user/saved-schemes
// @access  Private
const getSavedSchemes = asyncHandler(async (req, res) => {
  const saved = await SavedScheme.find({ user: req.user._id })
    .populate('scheme')
    .sort('-createdAt');

  const schemes = saved
    .filter(s => s.scheme && s.scheme.isActive)
    .map(s => s.scheme);

  return ApiResponse.ok(res, 'Saved schemes fetched', schemes);
});

// @desc    Save a scheme
// @route   POST /api/v1/user/save-scheme/:id
// @access  Private
const saveScheme = asyncHandler(async (req, res) => {
  const existing = await SavedScheme.findOne({ user: req.user._id, scheme: req.params.id });
  if (existing) {
    return ApiResponse.error(res, 400, 'Scheme already saved');
  }

  await SavedScheme.create({ user: req.user._id, scheme: req.params.id });
  return ApiResponse.created(res, 'Scheme saved successfully');
});

// @desc    Remove saved scheme
// @route   DELETE /api/v1/user/save-scheme/:id
// @access  Private
const removeSavedScheme = asyncHandler(async (req, res) => {
  const result = await SavedScheme.findOneAndDelete({ user: req.user._id, scheme: req.params.id });
  if (!result) {
    return ApiResponse.error(res, 404, 'Saved scheme not found');
  }
  return ApiResponse.ok(res, 'Scheme removed from saved');
});

// @desc    Get saved scheme IDs (for quick lookup)
// @route   GET /api/v1/user/saved-ids
// @access  Private
const getSavedIds = asyncHandler(async (req, res) => {
  const saved = await SavedScheme.find({ user: req.user._id }).select('scheme');
  const ids = saved.map(s => s.scheme.toString());
  return ApiResponse.ok(res, 'Saved IDs fetched', ids);
});

module.exports = { getProfile, updateProfile, getSavedSchemes, saveScheme, removeSavedScheme, getSavedIds };
