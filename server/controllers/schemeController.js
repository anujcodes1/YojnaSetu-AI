const asyncHandler = require('express-async-handler');
const Scheme = require('../models/Scheme');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all schemes with filter/search/pagination
// @route   GET /api/v1/schemes
// @access  Public
const getSchemes = asyncHandler(async (req, res) => {
  const { search, category, state, gender, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) {
    query.category = { $in: [category] };
  }
  if (state) {
    query.$or = [
      { 'eligibility.states': { $size: 0 } },
      { 'eligibility.states': state }
    ];
  }
  if (gender && gender !== 'any') {
    query.$or = [
      { 'eligibility.gender': 'any' },
      { 'eligibility.gender': gender }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Scheme.countDocuments(query);
  const schemes = await Scheme.find(query)
    .sort(search ? { score: { $meta: 'textScore' } } : '-createdAt')
    .skip(skip)
    .limit(Number(limit));

  return ApiResponse.ok(res, 'Schemes fetched', schemes, {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    limit: Number(limit)
  });
});

// @desc    Get single scheme
// @route   GET /api/v1/schemes/:id
// @access  Public
const getSchemeById = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!scheme || !scheme.isActive) {
    return ApiResponse.error(res, 404, 'Scheme not found');
  }

  return ApiResponse.ok(res, 'Scheme fetched', scheme);
});

// @desc    Get categories list
// @route   GET /api/v1/schemes/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = [
    { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'women', label: 'Women', icon: '👩' },
    { value: 'startup', label: 'Startup', icon: '🚀' },
    { value: 'housing', label: 'Housing', icon: '🏠' },
    { value: 'employment', label: 'Employment', icon: '💼' },
    { value: 'pension', label: 'Pension', icon: '👴' },
    { value: 'disability', label: 'Disability', icon: '♿' },
    { value: 'minority', label: 'Minority', icon: '🤝' },
    { value: 'youth', label: 'Youth', icon: '🎯' },
    { value: 'rural', label: 'Rural', icon: '🏡' },
    { value: 'urban', label: 'Urban', icon: '🏙️' },
    { value: 'finance', label: 'Finance', icon: '💰' },
    { value: 'skill_development', label: 'Skill Development', icon: '🛠️' }
  ];
  return ApiResponse.ok(res, 'Categories fetched', categories);
});

module.exports = { getSchemes, getSchemeById, getCategories };
