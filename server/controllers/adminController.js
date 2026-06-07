const asyncHandler = require('express-async-handler');
const Scheme = require('../models/Scheme');
const User = require('../models/User');
const { EligibilityCheck, SavedScheme } = require('../models/Supporting');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Admin
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalSchemes, totalChecks, recentUsers] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Scheme.countDocuments({ isActive: true }),
    EligibilityCheck.countDocuments(),
    User.find({ role: 'user' }).sort('-createdAt').limit(5).select('name email createdAt')
  ]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const checksToday = await EligibilityCheck.countDocuments({ createdAt: { $gte: todayStart } });

  const topSchemes = await Scheme.find({ isActive: true })
    .sort('-views')
    .limit(5)
    .select('title views ministry');

  return ApiResponse.ok(res, 'Stats fetched', {
    totalUsers, totalSchemes, totalChecks, checksToday, recentUsers, topSchemes
  });
});

// @desc    Create scheme
// @route   POST /api/v1/admin/schemes
// @access  Admin
const createScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.create({ ...req.body, addedBy: req.user._id });
  return ApiResponse.created(res, 'Scheme created successfully', scheme);
});

// @desc    Update scheme
// @route   PUT /api/v1/admin/schemes/:id
// @access  Admin
const updateScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true
  });
  if (!scheme) return ApiResponse.error(res, 404, 'Scheme not found');
  return ApiResponse.ok(res, 'Scheme updated', scheme);
});

// @desc    Delete scheme (soft delete)
// @route   DELETE /api/v1/admin/schemes/:id
// @access  Admin
const deleteScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!scheme) return ApiResponse.error(res, 404, 'Scheme not found');
  return ApiResponse.ok(res, 'Scheme deleted');
});

// @desc    Get all schemes for admin
// @route   GET /api/v1/admin/schemes
// @access  Admin
const getAllSchemesAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = {};
  if (search) query.$text = { $search: search };

  const total = await Scheme.countDocuments(query);
  const schemes = await Scheme.find(query)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return ApiResponse.ok(res, 'Schemes fetched', schemes, { total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const total = await User.countDocuments({ role: 'user' });
  const users = await User.find({ role: 'user' })
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select('-password');

  return ApiResponse.ok(res, 'Users fetched', users, { total, page: Number(page), pages: Math.ceil(total / limit) });
});

module.exports = { getStats, createScheme, updateScheme, deleteScheme, getAllSchemesAdmin, getAllUsers };
