const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getSavedSchemes, saveScheme, removeSavedScheme, getSavedIds } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/saved-schemes', getSavedSchemes);
router.get('/saved-ids', getSavedIds);
router.post('/save-scheme/:id', saveScheme);
router.delete('/save-scheme/:id', removeSavedScheme);

module.exports = router;
