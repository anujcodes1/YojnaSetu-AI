const asyncHandler = require('express-async-handler');
const { Application } = require('../models/Supporting');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all applications for logged in user
// @route   GET /api/v1/applications
// @access  Private
const getApplications = asyncHandler(async (req, res) => {
  const apps = await Application.find({ user: req.user._id })
    .populate('scheme', 'title ministry category benefitAmount')
    .sort('-updatedAt');
  return ApiResponse.ok(res, 'Applications fetched', apps);
});

// @desc    Add or update application status
// @route   POST /api/v1/applications
// @access  Private
const upsertApplication = asyncHandler(async (req, res) => {
  const { schemeId, status, notes, appliedDate } = req.body;

  if (!schemeId) {
    return ApiResponse.error(res, 400, 'Scheme ID is required');
  }

  const app = await Application.findOneAndUpdate(
    { user: req.user._id, scheme: schemeId },
    {
      status: status || 'interested',
      notes: notes || '',
      appliedDate: appliedDate || null,
      user: req.user._id,
      scheme: schemeId
    },
    { upsert: true, new: true, runValidators: true }
  ).populate('scheme', 'title ministry');

  return ApiResponse.ok(res, 'Application updated', app);
});

// @desc    Delete application from tracker
// @route   DELETE /api/v1/applications/:id
// @access  Private
const deleteApplication = asyncHandler(async (req, res) => {
  const app = await Application.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!app) {
    return ApiResponse.error(res, 404, 'Application not found');
  }

  return ApiResponse.ok(res, 'Removed from tracker');
});

module.exports = { getApplications, upsertApplication, deleteApplication };