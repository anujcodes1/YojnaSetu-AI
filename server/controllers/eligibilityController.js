const asyncHandler = require('express-async-handler');
const Scheme = require('../models/Scheme');
const { EligibilityCheck } = require('../models/Supporting');
const ApiResponse = require('../utils/ApiResponse');
const { scoreSchemeForUser } = require('../services/recommendationEngine');
const { analyzeEligibility } = require('../services/geminiService');

// @desc    Check eligibility for a scheme
// @route   POST /api/v1/eligibility/check/:schemeId
// @access  Private
const checkEligibility = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.schemeId);
  if (!scheme) {
    return ApiResponse.error(res, 404, 'Scheme not found');
  }

  const { score, matched, missed } = scoreSchemeForUser(scheme, req.user);

  let result;
  if (score >= 80) result = 'eligible';
  else if (score >= 50) result = 'partial';
  else result = 'ineligible';

  // Get AI explanation
  const aiExplanation = await analyzeEligibility(req.user, scheme, matched, missed, score);

  // Save result
  await EligibilityCheck.findOneAndUpdate(
    { user: req.user._id, scheme: scheme._id },
    { user: req.user._id, scheme: scheme._id, result, matchScore: score, matchedCriteria: matched, missedCriteria: missed, aiExplanation },
    { upsert: true, new: true }
  );

  return ApiResponse.ok(res, 'Eligibility checked', {
    scheme: { _id: scheme._id, title: scheme.title, ministry: scheme.ministry },
    result,
    matchScore: score,
    matchedCriteria: matched,
    missedCriteria: missed,
    aiExplanation
  });
});

// @desc    Get eligibility check history
// @route   GET /api/v1/eligibility/history
// @access  Private
const getEligibilityHistory = asyncHandler(async (req, res) => {
  const history = await EligibilityCheck.find({ user: req.user._id })
    .populate('scheme', 'title ministry category')
    .sort('-createdAt')
    .limit(20);

  return ApiResponse.ok(res, 'History fetched', history);
});

module.exports = { checkEligibility, getEligibilityHistory };
