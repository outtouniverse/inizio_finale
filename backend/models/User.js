const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Handles user authentication, profiles, and role management
 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: function() {
      // Password required only if not using Google OAuth
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Don't include password in queries by default
  },
  googleId: {
    type: String,
    sparse: true, // Allow multiple null values
  },
  profilePicture: {
    type: String,
    default: null,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
  // Extended Profile Fields
  archetype: {
    type: String,
    default: 'Visionary Architect',
    enum: ['Visionary Architect', 'Strategic Builder', 'Creative Innovator', 'Technical Founder', 'Market Pioneer'],
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100,
  },
  mission: {
    type: String,
    default: 'Building the future.',
    maxlength: [200, 'Mission cannot exceed 200 characters'],
  },
  badges: [{
    type: String,
    maxlength: [50, 'Badge name cannot exceed 50 characters'],
  }],
  traits: [{
    name: {
      type: String,
      required: true,
      maxlength: [30, 'Trait name cannot exceed 30 characters'],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  }],
  // Activity Tracking
  buildStreak: {
    type: Number,
    default: 0,
  },
  lastActivity: Date,
  activityCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Note: Indexes are automatically created for unique fields (email, username)
// and sparse fields (googleId). No additional explicit indexes needed.

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and not using OAuth
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = require('crypto').randomBytes(32).toString('hex');

  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Instance method to generate email verification token
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = require('crypto').randomBytes(32).toString('hex');

  this.emailVerificationToken = require('crypto')
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Static method to find user by email or username
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  });
};

// Instance method to initialize profile data
userSchema.methods.initializeProfile = function() {
  // Set default archetype based on user creation time (for variety)
  const archetypes = ['Visionary Architect', 'Strategic Builder', 'Creative Innovator', 'Technical Founder', 'Market Pioneer'];
  const archetypeIndex = Math.floor(Math.random() * archetypes.length);
  this.archetype = archetypes[archetypeIndex];

  // Set default level
  this.level = 1;

  // Set default mission
  this.mission = 'Building something amazing.';

  // Set default badges
  this.badges = ['First Steps'];

  // Set default traits with random scores
  this.traits = [
    { name: 'Vision', score: Math.floor(Math.random() * 40) + 60 }, // 60-100
    { name: 'Execution', score: Math.floor(Math.random() * 40) + 40 }, // 40-80
    { name: 'Resilience', score: Math.floor(Math.random() * 30) + 50 }, // 50-80
    { name: 'Creativity', score: Math.floor(Math.random() * 40) + 50 }, // 50-90
    { name: 'Technical', score: Math.floor(Math.random() * 50) + 30 }, // 30-80
  ];

  // Set initial activity tracking
  this.buildStreak = 0;
  this.activityCount = 0;
  this.lastActivity = new Date();

  return this;
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpires;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
