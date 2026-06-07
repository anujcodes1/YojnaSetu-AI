const express = require('express');
const router = express.Router();
const { checkEligibility, getEligibilityHistory } = require('../controllers/eligibilityController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/check/:schemeId', checkEligibility);
router.get('/history', getEligibilityHistory);

module.exports = router;
