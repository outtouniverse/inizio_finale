const geminiService = require('../services/geminiService');
const { generatePromptForStep, cleanAndParseArray } = require('../utils/aiPrompts');

// Track user AI usage for cost management (basic implementation)
const updateUserAIUsage = async (userId, tokensUsed = 1) => {
  // TODO: Implement proper usage tracking
  // This could store in User model or separate analytics collection
  console.log(`User ${userId} used ${tokensUsed} AI tokens`);
};

const runAgent = async (req, res) => {
  try {
    const { step, context } = req.body;
    const userId = req.user.id;

    if (!step || !context) {
      return res.status(400).json({
        success: false,
        message: 'Step and context are required'
      });
    }

    // Generate appropriate prompt based on step
    const prompt = generatePromptForStep(step, context);
    const response = await geminiService.generateContent(prompt, { jsonResponse: true });

    // Update usage tracking
    await updateUserAIUsage(userId);

    let result;
    try {
      result = JSON.parse(response);

      // Handle array responses for certain steps
      if (['ROADMAP', 'MVP', 'DECK', 'RISK'].includes(step)) {
        result = cleanAndParseArray(response);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(500).json({
        success: false,
        message: 'AI response parsing failed'
      });
    }

    res.json({
      success: true,
      data: result,
      step: step
    });
  } catch (error) {
    console.error('AI Agent error:', error);

    // Handle quota exceeded
    if (error.message?.includes('429') || error.status === 429 || error.message?.includes('quota')) {
      return res.status(429).json({
        success: false,
        message: 'AI quota exceeded. Please try again later.',
        code: 'QUOTA_EXCEEDED'
      });
    }

    res.status(500).json({
      success: false,
      message: 'AI processing failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const rethinkNode = async (req, res) => {
  try {
    const { step, currentData, context, feedback, constraints } = req.body;
    const userId = req.user.id;

    if (!step || !currentData || !context || !feedback) {
      return res.status(400).json({
        success: false,
        message: 'Step, currentData, context, and feedback are required'
      });
    }

    const ai = await import('../services/geminiService.js');
    const basePrompt = `
      You are Inizio, the AI Cofounder. You are RETHINKING the node: "${step}".
      The founder has provided critique. You must iterate to produce a stronger, sharper version.

      CURRENT DATA JSON:
      ${JSON.stringify(currentData)}

      USER FEEDBACK: "${feedback}"
      ADDITIONAL CONSTRAINTS: "${constraints || ''}"

      REQUIREMENTS:
      1. Analyze the feedback critically. Do not just accept it if it destroys value, but try to satisfy the founder's intent.
      2. Modify the CURRENT DATA to address the feedback.
      3. Maintain the exact same JSON structure as the input.
      4. Provide a "rationale" string explaining your strategic shift.
      5. Provide a "changes" array of strings listing specific edits (e.g., "Tightened the value prop", "Increased price to $29").

      OUTPUT FORMAT (JSON ONLY):
      {
        "data": { ...same structure as input... },
        "rationale": "Brief explanation of strategy shift.",
        "changes": ["Changed X to Y", "Added Z"]
      }
    `;

    const response = await geminiService.generateContent(basePrompt, { jsonResponse: true });

    // Update usage tracking
    await updateUserAIUsage(userId);

    const result = JSON.parse(response || '{}');

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Rethink error:', error);

    if (error.message?.includes('429') || error.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'AI quota exceeded. Please try again later.',
        code: 'QUOTA_EXCEEDED'
      });
    }

    res.status(500).json({
      success: false,
      message: 'AI rethink processing failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const generateValidationPlan = async (req, res) => {
  try {
    const { idea, target, metric } = req.body;
    const userId = req.user.id;

    if (!idea || !target || !metric) {
      return res.status(400).json({
        success: false,
        message: 'Idea, target, and metric are required'
      });
    }

    const prompt = `Create validation plan for ${idea} targeting ${target} with metric ${metric}.
      Return JSON {hypothesis, experiments[], metricTarget}`;

    const response = await geminiService.generateContent(prompt, { jsonResponse: true });

    // Update usage tracking
    await updateUserAIUsage(userId);

    const result = JSON.parse(response || '{}');

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Validation plan error:', error);

    if (error.message?.includes('429') || error.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'AI quota exceeded. Please try again later.',
        code: 'QUOTA_EXCEEDED'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Validation plan generation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const speakText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for TTS'
      });
    }

    // For now, just acknowledge - TTS would be implemented with a proper TTS service
    console.log('TTS requested for:', text.substring(0, 100) + '...');

    res.json({
      success: true,
      message: 'TTS request acknowledged'
    });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({
      success: false,
      message: 'TTS processing failed'
    });
  }
};

module.exports = {
  runAgent,
  rethinkNode,
  generateValidationPlan,
  speakText
};
