const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
  getSettings,
  updateSettings,
  resetSettings
} = require('../controllers/settingsController');

/**
 * @route   GET /api/v1/settings
 * @desc    Get user settings
 * @access  Private
 */
router.get('/', authenticateToken, apiLimiter, getSettings);

/**
 * @route   PUT /api/v1/settings
 * @desc    Update user settings
 * @access  Private
 */
router.put('/', authenticateToken, apiLimiter, updateSettings);

/**
 * @route   POST /api/v1/settings/reset
 * @desc    Reset settings to defaults
 * @access  Private
 */
router.post('/reset', authenticateToken, apiLimiter, resetSettings);

module.exports = router;
