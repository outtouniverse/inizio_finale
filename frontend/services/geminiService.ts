
import { GoogleGenAI } from "@google/genai";
import { AgentStep, IdeaContext, ValidationData, NamingData, CompetitorData, RealityData, RoadmapItem, MVPBlock, TechStackData, GeoData, DeckSlide, RiskItem, ScoreData, RethinkResponse, MarketPulseData, BreakDownData, ExperimentData, TimelineData, LaunchData, CreativeData, FounderFitData, CustomerPersonaData, FinderResult } from "../types";
import { MOCK_VALIDATION, MOCK_NAMING, MOCK_COMPETITORS, MOCK_REALITY, MOCK_ROADMAP, MOCK_MVP, MOCK_TECH_STACK, MOCK_RISKS, MOCK_PULSE, MOCK_BREAKDOWN, MOCK_EXPERIMENTS, MOCK_TIMELINE, MOCK_GEO, MOCK_LAUNCH, MOCK_CREATIVE, MOCK_FOUNDER_FIT, MOCK_CUSTOMER, MOCK_FINDER_RESULTS } from "../constants";

const apiKey = process.env.API_KEY || '';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const triggerQuotaError = () => {
  const event = new CustomEvent('inizio-quota-error');
  window.dispatchEvent(event);
};

export const runAgent = async (step: AgentStep, context: IdeaContext): Promise<any> => {
  if (!apiKey) {
    console.log(`[Demo Mode] Running agent for ${step}`);
    await delay(1500 + Math.random() * 1000);
    return getMockData(step, context);
  }

  try {
    switch (step) {
      case 'PULSE': return await generatePulse(context);
      case 'VALIDATION': return await generateValidation(context);
      case 'FOUNDER_FIT': return await generateFounderFit(context);
      case 'CUSTOMER': return await generateCustomerDeepDive(context);
      case 'NAMING': return await generateNaming(context);
      case 'COMPETITORS': return await generateCompetitors(context);
      case 'BREAKDOWN': return await generateBreakdown(context);
      case 'EXPERIMENTS': return await generateExperiments(context);
      case 'REALITY': return await generateReality(context);
      case 'CREATIVE': return await generateCreative(context);
      case 'ROADMAP': return await generateRoadmap(context);
      case 'TIMELINE': return await generateTimeline(context);
      case 'MVP': return await generateMVP(context);
      case 'STACK': return await generateStack(context);
      case 'GEO': return await generateGeo(context);
      case 'LAUNCH': return await generateLaunch(context);
      case 'DECK': return await generateDeck(context);
      case 'RISK': return await generateRisk(context);
      case 'SCORE': return { total: 85, breakdown: { market: 80, feasibility: 90, tech: 80, moat: 70 }, verdict: "Solid foundation." }; // Simplified
      default: return {};
    }
  } catch (error: any) {
    console.error(`Agent ${step} failed:`, error);
    if (error.message?.includes('429') || error.status === 429 || error.message?.includes('quota')) {
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
  if (!apiKey) {
    await delay(2000);
    return {
      data: currentData,
      rationale: "Mock Rethink: Adjusted parameters based on feedback.",
      changes: ["Updated tone", "Refined metrics"]
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const basePrompt = getBaseSystemPrompt(context);
  
  const prompt = `
    ${basePrompt}
    
    SYSTEM TASK: You are Inizio, the AI Cofounder. You are RETHINKING the node: "${step}".
    The founder has provided critique. You must iterate to produce a stronger, sharper version.
    
    CURRENT DATA JSON:
    ${JSON.stringify(currentData)}
    
    USER FEEDBACK: "${feedback}"
    ADDITIONAL CONSTRAINTS: "${constraints}"
    
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Rethink failed", error);
    throw error;
  }
};

// --- MOCK TTS FUNCTION ---
export const speakStreaming = async (text: string) => {
  // This is a stub for the Gemini TTS feature.
  // In a real implementation, this would stream audio bytes.
  // Here we just log it or use browser TTS as fallback for demo.
  console.log("Gemini Speaking:", text);
  
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
  return Promise.resolve();
};

// Export alias for playTTS as it's used in components
export const playTTS = speakStreaming;

// --- MOCK FINDER SCAN ---
export const scanForUsers = async (query: string): Promise<FinderResult[]> => {
    await delay(3000); // Simulate scanning
    return MOCK_FINDER_RESULTS.map(r => ({...r, id: Math.random().toString()}));
};

// --- Base Prompt Generator to set Persona ---
const getBaseSystemPrompt = (ctx: IdeaContext) => {
    return `
    You are Inizio, an elite AI Co-Founder. 
    You are NOT a chatbot. You are NOT a generic text generator.
    You are a thinking partner. You live inside the founder's head.
    
    You are analyzing a ${ctx.industry} venture described as: "${ctx.description}".
    User Goal: "${ctx.userGoal}".
    Constraints: "${ctx.constraints}".
    Stage: "${ctx.stage}".
    
    YOUR VOICE:
    - Calm, clear, sharp, insightful.
    - Direct but caring. 
    - Zero generic fluff. Zero corporate jargon. Human-level clarity.
    - If the idea is weak, say it kindly but firmly.
    - If the idea is great, hype it up but point out the risks.
    
    Output pure JSON only.
    `;
};

// Helper to safely parse array responses that might be wrapped
const cleanAndParseArray = (text: string | undefined): any[] => {
    if (!text) return [];
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed;
        // Handle wrapped objects
        const keys = Object.keys(parsed);
        for (const key of keys) {
            if (Array.isArray(parsed[key])) return parsed[key];
        }
        return [];
    } catch (e) {
        console.error("Failed to parse array JSON", e);
        return [];
    }
};

// --- Generators ---

async function generatePulse(ctx: IdeaContext): Promise<MarketPulseData> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ${getBaseSystemPrompt(ctx)}
    Task: Analyze the market pulse/vibe for this idea. Dig into the cultural zeitgeist.
    
    JSON Schema:
    {
      "heatIndex": number (0-100),
      "trendOverlap": number (0-100),
      "culturalMomentum": "String describing if it's rising/falling",
      "marketFriction": "String describing barriers",
      "sentiment": "Positive" | "Neutral" | "Skeptical" | "Hype",
      "trends": [
        { "name": "Trend Name", "force": number (1-10), "description": "Short desc" }
      ]
    }
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}');
}

async function generateValidation(ctx: IdeaContext): Promise<ValidationData> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ${getBaseSystemPrompt(ctx)}
    Task: Analyze the viability of this idea. Be a harsh but fair critic.
    
    JSON Schema:
    {
      "marketSize": "Short TAM description",
      "problemClarity": {
        "statement": "Crystallized user pain point",
        "rating": "Signal" | "Noise" | "Opportunity",
        "explanation": "Why this rating?"
      },
      "verdict": "A 1-sentence brutal but encouraging verdict",
      "score": number (0-100),
      "competitors": [
          { "name": "Competitor Name", "weakness": "Weakness" }
      ],
      "swot": {
          "strength": "Primary strength",
          "weakness": "Primary weakness",
          "opportunity": "Primary opportunity",
          "threat": "Primary threat"
      }
    }
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}');
}

async function generateFounderFit(ctx: IdeaContext): Promise<FounderFitData> {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      ${getBaseSystemPrompt(ctx)}
      Task: Assess "Founder-Market Fit". Why is THIS founder the one to build THIS?
      Identify skill gaps based on the industry type.
      
      JSON Schema:
      {
        "verdict": "High Alignment" | "Moderate" | "Low Alignment",
        "whyYou": "A concise reason why this founder might win (or lose).",
        "blindSpots": ["Blindspot 1", "Blindspot 2"],
        "skillBridge": [
           { "required": "Skill Name", "status": "Have" | "Gap" | "Outsource", "strategy": "How to bridge it" }
        ]
      }
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
}

async function generateCustomerDeepDive(ctx: IdeaContext): Promise<CustomerPersonaData> {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      ${getBaseSystemPrompt(ctx)}
      Task: Perform a deep psychological dive into the target customer. 
      Find the triggers, fears, and secret desires.
      
      JSON Schema:
      {
        "segments": [
          { 
            "name": "Persona Name", 
            "quote": "A realistic quote representing their pain", 
            "psychology": "Deep internal motive", 
            "trigger": "Event that causes them to buy", 
            "barrier": "Why they might say no"
          }
        ],
        "deepInsight": "One counter-intuitive insight about this customer base."
      }
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
}

async function generateBreakdown(ctx: IdeaContext): Promise<BreakDownData> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ${getBaseSystemPrompt(ctx)}
    Task: Break the idea. Be brutally honest. Simulate a VC rejection.
    
    JSON Schema:
    {
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "blindSpots": ["Blindspot 1", "Blindspot 2"],
      "contradictions": "Core contradiction in the premise",
      "vcDoubt": "What a VC would say to reject you",
      "customerFeeling": "The raw emotional reaction of a skeptic customer",
      "recoveryPlan": "How to fix the biggest flaw"
    }
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}');
}

async function generateExperiments(ctx: IdeaContext): Promise<ExperimentData> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ${getBaseSystemPrompt(ctx)}
    Task: Create 3 micro-experiments to validate the idea in 48 hours. 
    Focus on "Fake Door" tests and smoke tests.
    
    JSON Schema:
    {
      "experiments": [
        { 
          "type": "Smoke Test" | "Outreach" | "Prototype", 
          "name": "Experiment Name", 
          "duration": "Duration", 
          "cost": "Low" | "Medium" | "High", 
          "difficulty": "Easy" | "Moderate" | "Hard",
          "impact": number (1-10),
          "steps": ["Step 1", "Step 2", "Step 3"]
        }
      ]
    }
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}');
}

async function generateNaming(ctx: IdeaContext): Promise<NamingData> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ${getBaseSystemPrompt(ctx)}
    Task: Generate 3 distinct brand identity concepts. 
    Also suggest a Brand Archetype (e.g. The Rebel, The Sage, The Magician).
    
    JSON Schema:
    {
      "brandArchetype": "string",
      "colorPalette": ["hex", "hex", "hex"],
      "options": [
        { 
          "name": "Brand Name", 
          "tagline": "Short tagline", 
          "rationale": "Why this works", 
          "available": boolean (guess based on uniqueness), 
          "vibe": "e.g. Minimalist, Bold, Retro" 
        }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}');
}

async function generateCompetitors(ctx: IdeaContext): Promise<CompetitorData> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ${getBaseSystemPrompt(ctx)}
    Task: Identify competitors or mental models. Find the opportunity gap.
    
    JSON Schema:
    {
      "landscape": "1 sentence summary of the market state (e.g. 'Crowded with low-quality incumbents')",
      "competitors": [
        { "name": "string", "type": "Direct" | "Indirect" | "Mental Model", "strength": "string", "weakness": "string" }
      ],
      "opportunityGap": "Where the user can win"
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}');
}

async function generateReality(ctx: IdeaContext): Promise<RealityData> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ${getBaseSystemPrompt(ctx)}
    Task: Give a brutal reality check. Identify the single hardest thing.
    
    JSON Schema:
    {
      "brutalTruth": "The uncomfortable truth about this industry/idea",
      "hardestChallenge": "The bottleneck",
      "financialOutlook": "Cash flow prediction (e.g. 'Burn heavy for 6 months')",
      "survivalProbability": number (0-100, be realistic)
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}');
}

async function generateCreative(ctx: IdeaContext): Promise<CreativeData> {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      ${getBaseSystemPrompt(ctx)}
      Task: Generate 4 creative assets to kickstart execution.
      1 Logo concept, 1 Color Palette concept, 1 UI idea, 1 Merch/Ad idea.
      
      JSON Schema:
      {
        "assets": [
           { "id": "string", "type": "LOGO" | "COLOR" | "UI" | "MERCH", "title": "string", "content": "description or value", "variant": "string" }
        ],
        "brandVoice": "3 words describing tone"
      }
    `;
  
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
  }

async function generateRoadmap(ctx: IdeaContext): Promise<RoadmapItem[]> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ${getBaseSystemPrompt(ctx)}
    Task: Create a 3-phase execution roadmap suitable for a ${ctx.stage} founder.
    
    JSON Schema Array:
    [
      { "phase": "Phase Name", "timing": "e.g. Month 1", "tasks": ["task1", "task2"], "milestone": "Success definition" }
    ]
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return cleanAndParseArray(response.text);
}

async function generateTimeline(ctx: IdeaContext): Promise<TimelineData> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ${getBaseSystemPrompt(ctx)}
    Task: Project 3 possible future timelines: Conservative, Smart, and Insane.
    
    JSON Schema:
    {
      "scenarios": [
        { 
          "name": "Conservative" | "Smart" | "Insane", 
          "description": "Scenario description", 
          "revenueProjection": "Revenue forecast", 
          "milestones": ["m1", "m2"], 
          "obstacles": ["obs1", "obs2"], 
          "probability": number (0-100) 
        }
      ]
    }
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}');
}

async function generateMVP(ctx: IdeaContext): Promise<MVPBlock[]> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ${getBaseSystemPrompt(ctx)}
    Task: Define the Minimum Viable Product/Service. Focus on core value only.
    
    JSON Schema Array:
    [
      {
        "id": "string",
        "name": "Module Name",
        "description": "What it is",
        "complexity": "Low" | "Medium" | "High",
        "category": "Core" | "Experience" | "Ops" | "Admin"
      }
    ]
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return cleanAndParseArray(response.text);
}

async function generateStack(ctx: IdeaContext): Promise<TechStackData> {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      ${getBaseSystemPrompt(ctx)}
      Task: Architect the complete "Tech & Ops Stack" for this specific idea.
      
      CRITICAL: You must detect if this is a Software Business (SaaS, App) or a Physical/Service Business (Brand, Cafe, Agency).
      - If SaaS/App: Recommend code stacks (Next.js, Supabase, Python, AWS, etc).
      - If Brand/Service/Physical: Recommend OPS stacks (Shopify, Notion, Klaviyo, Zapier, manufacturing, packaging).
      
      NEVER return empty arrays. If a category is not strictly applicable, suggest the "next best alternative" (e.g., if no AI is needed, suggest an Automation tool like Zapier in the AI section).
      
      JSON Schema:
      {
        "category": "String (e.g. SaaS, Ecommerce, D2C Brand, Agency)",
        "description": "One sentence describing the build philosophy (e.g. 'Low-code velocity' or 'High-scale custom infra').",
        "core": { "title": "Core Build Stack", "tools": [{ "name": "Tool Name", "desc": "Why" }], "reasoning": "Why this stack?" },
        "ai": { "tools": [{ "name": "Tool Name", "desc": "Use case" }] },
        "brand": { "tools": [{ "name": "Tool Name", "desc": "Use case" }] },
        "ops": { "tools": [{ "name": "Tool Name", "desc": "Use case" }] },
        "infra": { "tools": [{ "name": "Tool Name", "desc": "Use case" }] },
        "budget": {
           "lean": "Cost string (e.g. '$0/mo')",
           "balanced": "Cost string",
           "premium": "Cost string"
        },
        "metrics": {
           "difficulty": number (1-4),
           "timeline": ["Phase 1", "Phase 2", "Phase 3"]
        },
        "recommendation": {
           "now": "Immediate first step",
           "later": "Future upgrade"
        }
      }
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
}

async function generateGeo(ctx: IdeaContext): Promise<GeoData> {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      ${getBaseSystemPrompt(ctx)}
      Task: Best launch location (City or Digital Platform).
      JSON Schema of GeoData.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
}

async function generateLaunch(ctx: IdeaContext): Promise<LaunchData> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    ${getBaseSystemPrompt(ctx)}
    Task: Create a Go-To-Market launch strategy. 
    
    JSON Schema:
    {
      "headline": "Launch Headline",
      "channels": [
        { "name": "Channel", "strategy": "Tactics", "type": "Paid" | "Organic" | "Viral" }
      ],
      "contentPillars": ["topic1", "topic2"],
      "timeline": ["Week 1 activity", "Week 2 activity"]
    }
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}');
}

async function generateDeck(ctx: IdeaContext): Promise<DeckSlide[]> {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      ${getBaseSystemPrompt(ctx)}
      Task: 6 Slide Pitch Deck structure. Problem, Solution, Market, Product, Traction, Ask.
      JSON Schema Array:
      [
        { "title": "Slide Title", "content": ["Bullet 1", "Bullet 2"] }
      ]
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return cleanAndParseArray(response.text);
}

async function generateRisk(ctx: IdeaContext): Promise<RiskItem[]> {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      ${getBaseSystemPrompt(ctx)}
      Task: Identify 3-5 critical risks that could kill this specific idea.
      
      JSON Schema Array:
      [
        { "risk": "Name", "impact": number (1-10), "probability": number (1-10), "mitigation": "Action" }
      ]
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return cleanAndParseArray(response.text);
}

// --- Helper for Plan Generation (Quick Modal) ---
export const generateValidationPlan = async (idea: string, target: string, metric: string) => {
  if (!apiKey) {
    await delay(2000);
    return { hypothesis: "Mock Hypothesis", experiments: ["Ads", "Cold Email"], metricTarget: "100 users" };
  }
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Create validation plan for ${idea}. Return JSON {hypothesis, experiments[], metricTarget}`;
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}');
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