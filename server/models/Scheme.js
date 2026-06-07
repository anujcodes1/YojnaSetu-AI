const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Scheme title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  ministry: {
    type: String,
    required: [true, 'Ministry is required'],
    trim: true
  },
  category: {
    type: [String],
    required: [true, 'At least one category is required'],
    enum: ['agriculture', 'education', 'health', 'women', 'startup', 'housing', 'employment',
      'pension', 'disability', 'minority', 'youth', 'rural', 'urban', 'finance', 'skill_development']
  },
  eligibility: {
    minAge: { type: Number, default: 0 },
    maxAge: { type: Number, default: 100 },
    gender: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
    incomeLimitAnnual: { type: Number, default: 0 }, // 0 means no limit
    states: { type: [String], default: [] }, // empty = all India
    targetCategories: {
      type: [String],
      enum: ['general', 'sc', 'st', 'obc', 'all'],
      default: ['all']
    },
    occupations: { type: [String], default: [] }, // empty = all
    isDisabledRequired: { type: Boolean, default: false },
    educationRequired: { type: String, default: '' }
  },
  benefits: {
    type: String,
    required: [true, 'Benefits information is required']
  },
  benefitAmount: { type: String, default: '' }, // e.g., "₹6,000/year", "Up to ₹10 lakh"
  documentsRequired: { type: [String], default: [] },
  applicationProcess: { type: String, default: '' },
  applicationLink: { type: String, default: '' },
  officialWebsite: { type: String, default: '' },
  tags: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  launchYear: { type: Number },
  deadline: { type: Date }
}, {
  timestamps: true
});

schemeSchema.index({ title: 'text', description: 'text', tags: 'text' });
schemeSchema.index({ category: 1 });
schemeSchema.index({ isActive: 1 });

module.exports = mongoose.model('Scheme', schemeSchema);
