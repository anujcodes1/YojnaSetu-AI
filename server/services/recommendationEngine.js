const Scheme = require('../models/Scheme');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

/**
 * Score a scheme against a user profile (0-100)
 */
const scoreSchemeForUser = (scheme, user) => {
  let score = 0;
  const matched = [];
  const missed = [];

  const e = scheme.eligibility;

  // Age check (20 points)
  if (user.age) {
    const minAge = e.minAge || 0;
    const maxAge = e.maxAge || 100;
    if (user.age >= minAge && user.age <= maxAge) {
      score += 20;
      matched.push(`Age ${user.age} is within range (${minAge}-${maxAge})`);
    } else {
      missed.push(`Age ${user.age} not in range (${minAge}-${maxAge})`);
    }
  }

  // State check (15 points)
  if (e.states && e.states.length > 0) {
    if (user.state && e.states.includes(user.state)) {
      score += 15;
      matched.push(`Available in your state (${user.state})`);
    } else {
      missed.push(`Not available in ${user.state || 'your state'}`);
    }
  } else {
    // All-India scheme
    score += 15;
    matched.push('Available across all India');
  }

  // Category check (20 points)
  const targetCats = e.targetCategories || ['all'];
  if (targetCats.includes('all')) {
    score += 20;
    matched.push('Open to all categories');
  } else if (user.category && targetCats.includes(user.category)) {
    score += 20;
    matched.push(`Available for ${user.category.toUpperCase()} category`);
  } else {
    missed.push(`For ${targetCats.join('/')} categories only`);
  }

  // Occupation check (15 points)
  const occupations = e.occupations || [];
  if (occupations.length === 0) {
    score += 15;
    matched.push('Open to all occupations');
  } else if (user.occupation && occupations.includes(user.occupation)) {
    score += 15;
    matched.push(`Relevant for ${user.occupation}`);
  } else {
    missed.push(`For ${occupations.join('/')} only`);
  }

  // Income check (15 points)
  const incomeLimit = e.incomeLimitAnnual || 0;
  if (incomeLimit === 0) {
    score += 15;
    matched.push('No income restriction');
  } else if (user.income && user.income <= incomeLimit) {
    score += 15;
    matched.push(`Income ₹${user.income.toLocaleString('en-IN')} is within limit`);
  } else if (user.income) {
    missed.push(`Income limit is ₹${incomeLimit.toLocaleString('en-IN')}/year`);
  }

  // Gender check (10 points)
  if (e.gender === 'any' || !e.gender) {
    score += 10;
    matched.push('Open to all genders');
  } else if (user.gender && e.gender === user.gender) {
    score += 10;
    matched.push(`Specifically for ${e.gender === 'female' ? 'women' : 'men'}`);
  } else {
    missed.push(`Only for ${e.gender === 'female' ? 'women' : 'men'}`);
  }

  // Disability check (5 points)
  if (e.isDisabledRequired) {
    if (user.isDisabled) {
      score += 5;
      matched.push('Disability benefit applicable');
    } else {
      missed.push('Requires disability certificate');
    }
  } else {
    score += 5;
    matched.push('No disability requirement');
  }

  return { score, matched, missed };
};

/**
 * Get recommendations for a user
 */
const getRecommendationsForUser = async (user, limit = 20) => {
  const cacheKey = `rec_${user._id}_${user.updatedAt ? user.updatedAt.getTime() : 'new'}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const schemes = await Scheme.find({ isActive: true });

  const scored = schemes.map(scheme => {
    const { score, matched, missed } = scoreSchemeForUser(scheme, user);
    return { scheme, score, matched, missed };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, limit).map(item => ({
    ...item.scheme.toObject(),
    matchScore: item.score,
    matchedCriteria: item.matched,
    missedCriteria: item.missed,
    matchLevel: item.score >= 80 ? 'high' : item.score >= 50 ? 'medium' : 'low'
  }));

  cache.set(cacheKey, top);
  return top;
};

module.exports = { getRecommendationsForUser, scoreSchemeForUser };
