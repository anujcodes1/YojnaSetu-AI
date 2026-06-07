const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Profile fields for recommendation engine
  age: { type: Number, min: 1, max: 120 },
  gender: { type: String, enum: ['male', 'female', 'other', ''] },
  state: { type: String, default: '' },
  district: { type: String, default: '' },
  income: { type: Number, default: 0 }, // Annual income in INR
  occupation: {
    type: String,
    enum: ['student', 'farmer', 'self-employed', 'salaried', 'unemployed', 'retired', 'other', ''],
    default: ''
  },
  category: {
    type: String,
    enum: ['general', 'sc', 'st', 'obc', ''],
    default: ''
  },
  education: {
    type: String,
    enum: ['below_10th', '10th', '12th', 'graduate', 'postgraduate', 'other', ''],
    default: ''
  },
  isDisabled: { type: Boolean, default: false },
  hasLand: { type: Boolean, default: false },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'widowed', 'divorced', ''],
    default: ''
  },
  profileComplete: { type: Boolean, default: false },
}, {
  timestamps: true
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check if profile is sufficiently complete
userSchema.pre('save', function (next) {
  const requiredFields = ['age', 'gender', 'state', 'income', 'occupation', 'category'];
  this.profileComplete = requiredFields.every(field => this[field] !== undefined && this[field] !== '' && this[field] !== null);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
