const mongoose = require('mongoose');

// SavedScheme model
const savedSchemeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
}, { timestamps: true });

savedSchemeSchema.index({ user: 1, scheme: 1 }, { unique: true });

// ChatHistory model
const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [chatMessageSchema],
  sessionId: { type: String, required: true }
}, { timestamps: true });

// EligibilityCheck model
const eligibilityCheckSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  result: { type: String, enum: ['eligible', 'partial', 'ineligible'], required: true },
  matchScore: { type: Number, default: 0 },
  matchedCriteria: { type: [String], default: [] },
  missedCriteria: { type: [String], default: [] },
  aiExplanation: { type: String, default: '' }
}, { timestamps: true });

// Application Tracker model
const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  status: {
    type: String,
    enum: ['interested', 'documents_collecting', 'applied', 'under_review', 'approved', 'rejected'],
    default: 'interested'
  },
  notes: { type: String, default: '' },
  appliedDate: { type: Date },
}, { timestamps: true });

module.exports = {
  SavedScheme: mongoose.model('SavedScheme', savedSchemeSchema),
  ChatHistory: mongoose.model('ChatHistory', chatHistorySchema),
  EligibilityCheck: mongoose.model('EligibilityCheck', eligibilityCheckSchema),
  Application: mongoose.model('Application', applicationSchema),
};