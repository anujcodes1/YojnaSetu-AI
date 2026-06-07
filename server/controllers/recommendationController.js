const asyncHandler = require('express-async-handler');
const ApiResponse = require('../utils/ApiResponse');
const { getRecommendationsForUser } = require('../services/recommendationEngine');
const { generateSchemeExplanations } = require('../services/geminiService');

// @desc    Get personalized recommendations
// @route   GET /api/v1/recommendations
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
  if (!req.user.profileComplete) {
    return ApiResponse.ok(res, 'Please complete your profile for personalized recommendations', [], {
      profileIncomplete: true
    });
  }

  const recommendations = await getRecommendationsForUser(req.user, 20);

  // Enrich top 5 with AI explanations
  let explanations = [];
  if (recommendations.length > 0) {
    explanations = await generateSchemeExplanations(req.user, recommendations);
  }

  // Merge explanations
  const enriched = recommendations.map((scheme, index) => {
    const exp = explanations.find(e => e.index === index + 1);
    return {
      ...scheme,
      aiExplanation: exp ? exp.explanation : null
    };
  });

  return ApiResponse.ok(res, 'Recommendations generated', enriched, {
    total: enriched.length,
    profileComplete: req.user.profileComplete
  });
});

// @desc    Get quick top 5 recommendations (for dashboard)
// @route   GET /api/v1/recommendations/quick
// @access  Private
const getQuickRecommendations = asyncHandler(async (req, res) => {
  if (!req.user.profileComplete) {
    return ApiResponse.ok(res, 'Complete your profile', [], { profileIncomplete: true });
  }

  const recommendations = await getRecommendationsForUser(req.user, 5);
  return ApiResponse.ok(res, 'Quick recommendations', recommendations);
});

module.exports = { getRecommendations, getQuickRecommendations };
