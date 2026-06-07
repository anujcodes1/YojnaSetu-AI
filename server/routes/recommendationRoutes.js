const express = require('express');
const router = express.Router();
const { getRecommendations, getQuickRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getRecommendations);
router.get('/quick', getQuickRecommendations);

module.exports = router;
