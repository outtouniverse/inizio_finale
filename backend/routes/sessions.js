const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { authenticateToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { getUserSessions, revokeAllUserTokens } = require('../utils/tokenUtils');

/**
 * @route   GET /api/v1/sessions
 * @desc    Get all active sessions for current user
 * @access  Private
 */
router.get('/', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const sessions = await getUserSessions(req.user._id);

    res.json({
      success: true,
      data: {
        sessions: sessions.map(session => ({
          id: session._id,
          deviceInfo: session.deviceInfo,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          lastActivity: session.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sessions'
    });
  }
});

/**
 * @route   DELETE /api/v1/sessions/:id
 * @desc    Revoke a specific session
 * @access  Private
 */
router.delete('/:id', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;

    // Find and revoke the session
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, userId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or already revoked'
      });
    }

    res.json({
      success: true,
      message: 'Session revoked successfully'
    });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke session'
    });
  }
});

/**
 * @route   DELETE /api/v1/sessions/all
 * @desc    Revoke all sessions for current user
 * @access  Private
 */
router.delete('/all', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const userId = req.user._id;

    await revokeAllUserTokens(userId);

    // Clear current session cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'All sessions revoked successfully. Please login again.'
    });
  } catch (error) {
    console.error('Revoke all sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke all sessions'
    });
  }
});

/**
 * @route   GET /api/v1/sessions/current
 * @desc    Get current session info
 * @access  Private
 */
router.get('/current', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No active session'
      });
    }

    const session = await Session.findActiveByToken(refreshToken);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: {
        session: {
          id: session._id,
          deviceInfo: session.deviceInfo,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          lastActivity: session.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get current session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get current session'
    });
  }
});

module.exports = router;
