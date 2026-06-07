const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, clearHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/message', sendMessage);
router.get('/history', getChatHistory);
router.delete('/history', clearHistory);

module.exports = router;
