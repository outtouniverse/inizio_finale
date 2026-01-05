const mongoose = require('mongoose');

/**
 * User Settings Model
 * Handles user application settings and preferences
 */

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
  },
  theme: {
    type: String,
    default: 'cyberwave',
    enum: ['cyberwave', 'dark', 'light', 'neon', 'minimal'],
  },
  aiPersonality: {
    creativity: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    risk: {
      type: Number,
      min: 0,
      max: 100,
      default: 40,
    },
    verbosity: {
      type: Number,
      min: 0,
      max: 100,
      default: 20,
    },
    archetype: {
      type: String,
      default: 'Strategic',
      enum: ['Strategic', 'Creative', 'Analytical', 'Bold', 'Conservative'],
    },
  },
  privacyMode: {
    type: Boolean,
    default: false,
  },
  soundEnabled: {
    type: Boolean,
    default: true,
  },
  notifications: {
    email: {
      type: Boolean,
      default: true,
    },
    push: {
      type: Boolean,
      default: false,
    },
    projectUpdates: {
      type: Boolean,
      default: true,
    },
    aiInsights: {
      type: Boolean,
      default: true,
    },
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko'],
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  accessibility: {
    highContrast: {
      type: Boolean,
      default: false,
    },
    largeText: {
      type: Boolean,
      default: false,
    },
    reducedMotion: {
      type: Boolean,
      default: false,
    },
  },
}, {
  timestamps: true,
});

// Indexes
settingsSchema.index({ userId: 1 });

// Static methods
settingsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

settingsSchema.statics.upsertByUserId = function(userId, settingsData) {
  return this.findOneAndUpdate(
    { userId },
    { ...settingsData, userId },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// Instance methods
settingsSchema.methods.updateSettings = function(newSettings) {
  Object.assign(this, newSettings);
  return this.save();
};

// Transform function to clean up the output
settingsSchema.methods.toJSON = function() {
  const settingsObject = this.toObject();
  delete settingsObject.__v;
  delete settingsObject._id;
  return settingsObject;
};

module.exports = mongoose.model('Settings', settingsSchema);
