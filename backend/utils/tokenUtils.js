const jwt = require('jsonwebtoken');
const Session = require('../models/Session');

/**
 * JWT Token Utilities
 * Handles token generation, validation, and session management
 */

// Generate access and refresh tokens
const generateTokens = async (userId, deviceInfo = {}) => {
  try {
    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
    );

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );

    // Calculate refresh token expiration
    const refreshTokenExpire = new Date();
    refreshTokenExpire.setDate(refreshTokenExpire.getDate() + 7); // 7 days

    // Create session in database
    const session = new Session({
      userId,
      refreshToken,
      deviceInfo,
      expiresAt: refreshTokenExpire,
    });

    await session.save();

    return {
      accessToken,
      refreshToken,
      sessionId: session._id
    };
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate tokens');
  }
};

// Refresh access token using refresh token
const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find active session
    const session = await Session.findActiveByToken(refreshToken);
    if (!session) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
    );

    return {
      accessToken: newAccessToken,
      user: session.userId
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

// Revoke refresh token (logout)
const revokeToken = async (refreshToken) => {
  try {
    const session = await Session.findOneAndUpdate(
      { refreshToken },
      { isActive: false },
      { new: true }
    );

    return session !== null;
  } catch (error) {
    console.error('Token revocation error:', error);
    throw new Error('Failed to revoke token');
  }
};

// Revoke all user sessions
const revokeAllUserTokens = async (userId) => {
  try {
    await Session.revokeUserSessions(userId);
    return true;
  } catch (error) {
    console.error('Bulk token revocation error:', error);
    throw new Error('Failed to revoke all tokens');
  }
};

// Get all active sessions for a user
const getUserSessions = async (userId) => {
  try {
    const sessions = await Session.find({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).select('-refreshToken').sort({ createdAt: -1 });

    return sessions;
  } catch (error) {
    console.error('Get user sessions error:', error);
    throw new Error('Failed to get user sessions');
  }
};

// Clean up expired sessions (can be called periodically)
const cleanupExpiredSessions = async () => {
  try {
    const result = await Session.cleanupExpired();
    console.log(`Cleaned up ${result.deletedCount} expired sessions`);
    return result.deletedCount;
  } catch (error) {
    console.error('Session cleanup error:', error);
    throw new Error('Failed to cleanup expired sessions');
  }
};

// Extract device info from request
const extractDeviceInfo = (req) => {
  const userAgent = req.get('User-Agent') || '';
  const ip = req.ip || req.connection.remoteAddress || '';

  // Simple device detection (can be enhanced with libraries like device-detector)
  let device = 'Unknown';
  let browser = 'Unknown';
  let os = 'Unknown';

  if (userAgent.includes('Mobile')) {
    device = 'Mobile';
  } else if (userAgent.includes('Tablet')) {
    device = 'Tablet';
  } else {
    device = 'Desktop';
  }

  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';

  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';

  return {
    userAgent,
    ip,
    device,
    browser,
    os
  };
};

module.exports = {
  generateTokens,
  refreshAccessToken,
  revokeToken,
  revokeAllUserTokens,
  getUserSessions,
  cleanupExpiredSessions,
  extractDeviceInfo
};
