const mongoose = require('mongoose');

/**
 * Session Model
 * Tracks user sessions for security and management
 */

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  refreshToken: {
    type: String,
    required: [true, 'Refresh token is required'],
    unique: true,
  },
  deviceInfo: {
    userAgent: String,
    ip: String,
    device: String,
    browser: String,
    os: String,
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required'],
    index: { expires: 0 }, // TTL index - automatically delete expired sessions
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
sessionSchema.index({ userId: 1 });
sessionSchema.index({ refreshToken: 1 });
// Note: expiresAt already has a TTL index defined in the schema

// Static method to clean up expired sessions
sessionSchema.statics.cleanupExpired = function() {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

// Instance method to revoke session
sessionSchema.methods.revoke = function() {
  this.isActive = false;
  return this.save();
};

// Static method to revoke all user sessions
sessionSchema.statics.revokeUserSessions = function(userId) {
  return this.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
};

// Static method to find active session by refresh token
sessionSchema.statics.findActiveByToken = function(refreshToken) {
  return this.findOne({
    refreshToken,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('userId');
};

module.exports = mongoose.model('Session', sessionSchema);
