const express = require('express');
const router = express.Router();
const { getStats, createScheme, updateScheme, deleteScheme, getAllSchemesAdmin, getAllUsers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/schemes', getAllSchemesAdmin);
router.post('/schemes', createScheme);
router.put('/schemes/:id', updateScheme);
router.delete('/schemes/:id', deleteScheme);
router.get('/users', getAllUsers);

module.exports = router;
