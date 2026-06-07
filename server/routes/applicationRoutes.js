const express = require('express');
const router = express.Router();
const {
  getApplications,
  upsertApplication,
  deleteApplication
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getApplications);
router.post('/', upsertApplication);
router.delete('/:id', deleteApplication);

module.exports = router;