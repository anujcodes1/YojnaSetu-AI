const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('crypto').randomUUID ? { v4: () => require('crypto').randomUUID() } : require('crypto');
const { ChatHistory } = require('../models/Supporting');
const ApiResponse = require('../utils/ApiResponse');
const { chatWithAssistant } = require('../services/geminiService');

// @desc    Send chat message
// @route   POST /api/v1/chat/message
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || message.trim().length === 0) {
    return ApiResponse.error(res, 400, 'Message cannot be empty');
  }

  const sid = sessionId || require('crypto').randomUUID();

  // Get or create chat history
  let chatDoc = await ChatHistory.findOne({ user: req.user._id, sessionId: sid });
  if (!chatDoc) {
    chatDoc = await ChatHistory.create({ user: req.user._id, sessionId: sid, messages: [] });
  }

  // Add user message
  chatDoc.messages.push({ role: 'user', content: message.trim() });

  // Get AI response
  const aiResponse = await chatWithAssistant(message.trim(), req.user, chatDoc.messages.slice(-10));

  // Add assistant message
  chatDoc.messages.push({ role: 'assistant', content: aiResponse });
  await chatDoc.save();

  return ApiResponse.ok(res, 'Message sent', {
    userMessage: message.trim(),
    assistantMessage: aiResponse,
    sessionId: sid
  });
});

// @desc    Get chat history
// @route   GET /api/v1/chat/history
// @access  Private
const getChatHistory = asyncHandler(async (req, res) => {
  const chatDocs = await ChatHistory.find({ user: req.user._id })
    .sort('-updatedAt')
    .limit(1);

  const messages = chatDocs.length > 0 ? chatDocs[0].messages : [];
  const sessionId = chatDocs.length > 0 ? chatDocs[0].sessionId : null;

  return ApiResponse.ok(res, 'Chat history fetched', { messages, sessionId });
});

// @desc    Clear chat history
// @route   DELETE /api/v1/chat/history
// @access  Private
const clearHistory = asyncHandler(async (req, res) => {
  await ChatHistory.deleteMany({ user: req.user._id });
  return ApiResponse.ok(res, 'Chat history cleared');
});

module.exports = { sendMessage, getChatHistory, clearHistory };
