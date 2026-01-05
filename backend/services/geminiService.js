const { GoogleGenAI } = require('@google/genai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    console.log('Gemini API Key present:', !!this.apiKey);
    if (this.apiKey) {
      // GoogleGenAI automatically reads GEMINI_API_KEY from environment
      this.ai = new GoogleGenAI({});
    }
  }

  async generateContent(prompt, options = {}) {
    if (!this.apiKey || !this.ai) {
      console.error('Gemini API key not configured:', {
        hasApiKey: !!this.apiKey,
        hasAI: !!this.ai
      });
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY environment variable.');
    }

    try {
      console.log('Making Gemini API call with prompt length:', prompt.length);

      const response = await this.ai.models.generateContent({
        model: options.model || 'gemini-2.0-flash',
        contents: prompt,
        generationConfig: {
          temperature: options.temperature || 0.7,
          responseMimeType: options.jsonResponse ? 'application/json' : 'text/plain',
        }
      });

      const text = response.text || '';
      console.log('Gemini API response received, length:', text.length);
      return text;
    } catch (error) {
      console.error('Gemini API error details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        details: error.details
      });
      throw error;
    }
  }
}

module.exports = new GeminiService();
