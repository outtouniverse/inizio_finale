const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/aiLimiter');
const {
  runAgent,
  rethinkNode,
  generateValidationPlan,
  speakText
} = require('../controllers/aiController');

/**
 * @route   POST /api/v1/ai/run-agent
 * @desc    Run AI agent for specific step
 * @access  Private (authenticated users)
 */
router.post('/run-agent', authenticateToken, aiLimiter, runAgent);

/**
 * @route   POST /api/v1/ai/rethink
 * @desc    Rethink and improve existing AI-generated content
 * @access  Private (authenticated users)
 */
router.post('/rethink', authenticateToken, aiLimiter, rethinkNode);

/**
 * @route   POST /api/v1/ai/validate-plan
 * @desc    Generate validation plan for ideas
 * @access  Private (authenticated users)
 */
router.post('/validate-plan', authenticateToken, aiLimiter, generateValidationPlan);

/**
 * @route   GET /api/v1/ai/config
 * @desc    Get AI configuration status
 * @access  Private (authenticated users)
 */
router.get('/config', authenticateToken, (req, res) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  res.json({
    success: true,
    data: {
      geminiApiKeyConfigured: !!geminiApiKey,
      geminiApiKeyLength: geminiApiKey ? geminiApiKey.length : 0
    }
  });
});

/**
 * @route   POST /api/v1/ai/speak
 * @desc    Text-to-speech functionality
 * @access  Private (authenticated users)
 */
router.post('/speak', authenticateToken, aiLimiter, speakText);

module.exports = router;
