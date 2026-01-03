
import { AgentStep, IdeaContext, ValidationData, NamingData, CompetitorData, RealityData, RoadmapItem, MVPBlock, TechStackData, GeoData, DeckSlide, RiskItem, ScoreData, RethinkResponse, MarketPulseData, BreakDownData, ExperimentData, TimelineData, LaunchData, CreativeData, FounderFitData, CustomerPersonaData, FinderResult } from "../types";
import { MOCK_VALIDATION, MOCK_NAMING, MOCK_COMPETITORS, MOCK_REALITY, MOCK_ROADMAP, MOCK_MVP, MOCK_TECH_STACK, MOCK_RISKS, MOCK_PULSE, MOCK_BREAKDOWN, MOCK_EXPERIMENTS, MOCK_TIMELINE, MOCK_GEO, MOCK_LAUNCH, MOCK_CREATIVE, MOCK_FOUNDER_FIT, MOCK_CUSTOMER, MOCK_FINDER_RESULTS } from "../constants";

const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const triggerQuotaError = () => {
  const event = new CustomEvent('inizio-quota-error');
  window.dispatchEvent(event);
};

export const runAgent = async (step: AgentStep, context: IdeaContext): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE}/ai/run-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // For cookies
      body: JSON.stringify({ step, context })
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 'QUOTA_EXCEEDED' || response.status === 429) {
        triggerQuotaError();
        throw new Error("QUOTA_EXCEEDED");
      }
      throw new Error(errorData.message || 'AI request failed');
    }

    const result = await response.json();
    return result.data;
  } catch (error: any) {
    console.error(`Agent ${step} failed:`, error);

    if (error.message?.includes('429') || error.message?.includes('QUOTA_EXCEEDED')) {
        triggerQuotaError();
        throw new Error("QUOTA_EXCEEDED");
    }

    console.warn(`Falling back to mock data for ${step}`);
    return getMockData(step, context); 
  }
};

export const rethinkNode = async (
  step: AgentStep, 
  currentData: any, 
  context: IdeaContext, 
  feedback: string,
  constraints: string
): Promise<RethinkResponse> => {
  try {
    const response = await fetch(`${API_BASE}/ai/rethink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // For cookies
      body: JSON.stringify({ step, currentData, context, feedback, constraints })
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 'QUOTA_EXCEEDED' || response.status === 429) {
        triggerQuotaError();
        throw new Error("QUOTA_EXCEEDED");
      }
      throw new Error(errorData.message || 'Rethink request failed');
    }

    const result = await response.json();
    return result.data;
  } catch (error: any) {
    console.error("Rethink failed", error);

    if (error.message?.includes('429') || error.message?.includes('QUOTA_EXCEEDED')) {
      triggerQuotaError();
      throw new Error("QUOTA_EXCEEDED");
    }

    // Fallback to mock rethink
    await delay(2000);
    return {
      data: currentData,
      rationale: "Mock Rethink: Adjusted parameters based on feedback.",
      changes: ["Updated tone", "Refined metrics"]
    };
  }
};

// --- TTS FUNCTION ---
export const speakStreaming = async (text: string) => {
  try {
    // Call backend TTS endpoint
    await fetch(`${API_BASE}/ai/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ text })
    });

    // Use browser TTS as primary implementation for now
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    window.speechSynthesis.speak(utterance);
    
    return new Promise((resolve) => {
        utterance.onend = resolve;
    });
    }
  } catch (error) {
    console.error("TTS failed:", error);
    // Fallback to browser TTS
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      return new Promise((resolve) => {
          utterance.onend = resolve;
      });
    }
  }
  return Promise.resolve();
};

// Export alias for playTTS as it's used in components
export const playTTS = speakStreaming;

// --- MOCK FINDER SCAN ---
export const scanForUsers = async (query: string): Promise<FinderResult[]> => {
    await delay(3000); // Simulate scanning
    return MOCK_FINDER_RESULTS.map(r => ({...r, id: Math.random().toString()}));
};

// --- Mock Data Fallback ---

// --- Helper for Plan Generation (Quick Modal) ---
export const generateValidationPlan = async (idea: string, target: string, metric: string) => {
  try {
    const response = await fetch(`${API_BASE}/ai/validate-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // For cookies
      body: JSON.stringify({ idea, target, metric })
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 'QUOTA_EXCEEDED' || response.status === 429) {
        triggerQuotaError();
        throw new Error("QUOTA_EXCEEDED");
      }
      throw new Error(errorData.message || 'Validation plan request failed');
    }

    const result = await response.json();
    return result.data;
  } catch (error: any) {
    console.error("Validation plan failed", error);

    if (error.message?.includes('429') || error.message?.includes('QUOTA_EXCEEDED')) {
      triggerQuotaError();
      throw new Error("QUOTA_EXCEEDED");
    }

    // Fallback to mock data
    await delay(2000);
    return { hypothesis: "Mock Hypothesis", experiments: ["Ads", "Cold Email"], metricTarget: "100 users" };
  }
};

// --- Mocks ---
function getMockData(step: AgentStep, context: IdeaContext): any {
  switch (step) {
    case 'PULSE': return MOCK_PULSE;
    case 'VALIDATION': return MOCK_VALIDATION;
    case 'FOUNDER_FIT': return MOCK_FOUNDER_FIT;
    case 'CUSTOMER': return MOCK_CUSTOMER;
    case 'BREAKDOWN': return MOCK_BREAKDOWN;
    case 'EXPERIMENTS': return MOCK_EXPERIMENTS;
    case 'NAMING': return MOCK_NAMING;
    case 'COMPETITORS': return MOCK_COMPETITORS;
    case 'REALITY': return MOCK_REALITY;
    case 'CREATIVE': return MOCK_CREATIVE;
    case 'ROADMAP': return MOCK_ROADMAP;
    case 'TIMELINE': return MOCK_TIMELINE;
    case 'MVP': return MOCK_MVP;
    case 'STACK': return MOCK_TECH_STACK;
    case 'GEO': return MOCK_GEO;
    case 'LAUNCH': return MOCK_LAUNCH;
    case 'DECK': return [{ title: "Vision", content: [context.description] }];
    case 'RISK': return MOCK_RISKS;
    default: return {};
  }
}