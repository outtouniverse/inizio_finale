const { GoogleGenAI } = require('@google/genai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  async generateContent(prompt, options = {}) {
    if (!this.apiKey || !this.ai) {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY environment variable.');
    }

    try {
      const response = await this.ai.models.generateContent({
        model: options.model || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: options.jsonResponse ? 'application/json' : 'text/plain',
          ...options.config
        }
      });
      return response.text || '';
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}

module.exports = new GeminiService();
