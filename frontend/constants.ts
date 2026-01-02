
import { AgentStep, UserProfile, NamingData, CompetitorData, RealityData, RoadmapItem, ValidationData, MarketPulseData, BreakDownData, ExperimentData, TimelineData, LaunchData, CreativeData, FounderFitData, CustomerPersonaData, TechStackData, MemoryNode, TimelineEvent, HeatmapDay, PlaygroundItem, CallPersona, FinderResult } from './types';
import { User, AlertTriangle, ShoppingBag, Camera, HelpCircle, ShieldAlert } from 'lucide-react';

export const STEPS_ORDER: AgentStep[] = [
  'PULSE',
  'VALIDATION',
  'FOUNDER_FIT', 
  'CUSTOMER',    
  'COMPETITORS',
  'BREAKDOWN',
  'EXPERIMENTS',
  'REALITY',
  'NAMING',
  'CREATIVE',
  'ROADMAP',
  'MVP',
  'STACK',
  'TIMELINE',
  'GEO',
  'LAUNCH',
  'DECK',
  'RISK',
  'SCORE'
];

export const INDUSTRIES = ['Tech', 'Fashion', 'Food', 'Creator', 'Service', 'Hardware', 'Community', 'Art' ,'Other'];

// Mock Data Generators

export const MOCK_PULSE: MarketPulseData = {
  heatIndex: 87,
  trendOverlap: 92,
  culturalMomentum: "Rising Fast",
  marketFriction: "Low barriers, high noise",
  sentiment: "Hype",
  trends: [
    { name: "AI Automation", force: 9, description: "Integrated workflows are peaking." },
    { name: "Minimalism", force: 7, description: "Users fatigue from complex UIs." },
    { name: "Privacy", force: 6, description: "Data sovereignty concern." }
  ]
};

export const MOCK_VALIDATION: ValidationData = {
  marketSize: "Large & Growing",
  problemClarity: {
    statement: "Users are overwhelmed by fragmented tools.",
    rating: 'Signal' as const,
    explanation: "Consistent feedback from user interviews indicates this is a top priority pain point."
  },
  verdict: "Go for it.",
  score: 85,
  competitors: [
    { name: "Incumbent Corp", weakness: "Bloated & Slow" },
    { name: "Excel/Notion", weakness: "Too manual" }
  ],
  swot: {
    strength: "Integrated workflow",
    weakness: "High initial build complexity",
    opportunity: "Capture underserved prosumers",
    threat: "Big tech consolidation"
  }
};

export const MOCK_FOUNDER_FIT: FounderFitData = {
  verdict: "High Alignment",
  whyYou: "Your background in design gives you a leverage point in a typically ugly market.",
  blindSpots: ["No enterprise sales experience", "Over-indexing on aesthetics vs utility"],
  skillBridge: [
    { required: "Product Design", status: "Have", strategy: "Double down, make it your moat." },
    { required: "B2B Sales", status: "Gap", strategy: "Hire a fractional Head of Sales or automate outreach." },
    { required: "Backend Eng", status: "Outsource", strategy: "Use Supabase/Firebase to defer hiring." }
  ]
};

export const MOCK_CUSTOMER: CustomerPersonaData = {
  segments: [
    { 
      name: "The Overwhelmed Freelancer", 
      quote: "I spend more time managing my tools than doing my work.",
      psychology: "Desires control but lacks the energy to build systems.",
      trigger: "Losing a client due to disorganization.",
      barrier: "Fear of learning another new tool."
    },
    { 
      name: "The Agency Owner", 
      quote: "My team is bleeding hours on admin.",
      psychology: "Driven by margin and efficiency.",
      trigger: "Monthly P&L review showing wasted hours.",
      barrier: "Migration cost of moving 10 people."
    }
  ],
  deepInsight: "Users don't want a 'better' calendar. They want a personal assistant that doesn't sleep."
};

export const MOCK_BREAKDOWN: BreakDownData = {
  weaknesses: ["Relies too heavily on API availability", "Low switching costs for users"],
  blindSpots: ["Regulatory shifts in AI data usage", "Competitor pricing wars"],
  contradictions: "You want 'Enterprise Grade' security with 'Consumer' ease of use.",
  vcDoubt: "Where is the moat? It looks like a wrapper.",
  customerFeeling: "Cool demo, but will I trust it with my life?",
  recoveryPlan: "Focus on proprietary data models to build a defensible moat."
};

export const MOCK_EXPERIMENTS: ExperimentData = {
  experiments: [
    { type: "Smoke Test", name: "Landing Page Waitlist", duration: "48h", cost: "Low", difficulty: "Easy", impact: 8, steps: ["Build landing page", "Run $50 ads", "Measure CTR"] },
    { type: "Outreach", name: "Cold DM Campaign", duration: "1 week", cost: "Low", difficulty: "Moderate", impact: 7, steps: ["Scrape leads", "Draft scripts", "Send 100 DMs"] },
    { type: "Prototype", name: "Figma Click-Through", duration: "3 days", cost: "Medium", difficulty: "Moderate", impact: 9, steps: ["Design core flows", "User testing sessions"] }
  ]
};

export const MOCK_NAMING: NamingData = {
  brandArchetype: "The Ruler",
  colorPalette: ["#000000", "#FFD700", "#FFFFFF"],
  options: [
    { name: "Aura", tagline: "Presence redefined.", rationale: "Short, punchy, atmospheric.", available: true, vibe: "Luxury" },
    { name: "Nexus", tagline: "Connect everything.", rationale: "implies central connection.", available: false, vibe: "Tech" },
    { name: "Velvet", tagline: "Soft power.", rationale: "Tactile, smooth.", available: true, vibe: "Fashion" }
  ]
};

export const MOCK_CREATIVE: CreativeData = {
    assets: [
        { id: '1', type: 'LOGO', title: 'Logomark Concept', content: 'https://via.placeholder.com/150', variant: 'Monochrome' },
        { id: '2', type: 'COLOR', title: 'Primary Palette', content: '#2EC7FF', variant: 'Neon' },
        { id: '3', type: 'UI', title: 'Hero Section', content: 'Wireframe of main landing area', variant: 'v1.0' },
        { id: '4', type: 'SCRIPT', title: 'Launch Video Script', content: 'Fade in to black. Text appears: "Ready?"', variant: 'Teaser' }
    ],
    brandVoice: "Futuristic, Direct, Premium"
};

export const MOCK_COMPETITORS: CompetitorData = {
  landscape: "Crowded but low quality.",
  competitors: [
    { name: "Giant Corp", type: 'Direct', strength: "Distribution", weakness: "Slow & Ugly" },
    { name: "Indie App", type: 'Direct', strength: "Fast", weakness: "Buggy" }
  ],
  opportunityGap: "Premium design with AI automation."
};

export const MOCK_REALITY: RealityData = {
  brutalTruth: "This is a crowded market. You need a distinct voice or you will die.",
  hardestChallenge: "Customer Acquisition Cost (CAC) is rising.",
  financialOutlook: "Burn heavy for 6 months.",
  survivalProbability: 65
};

export const MOCK_ROADMAP: RoadmapItem[] = [
  { phase: "Phase 1", timing: "Weeks 1-4", tasks: ["Landing Page", "Waitlist"], milestone: "100 Signups" },
  { phase: "Phase 2", timing: "Weeks 5-8", tasks: ["MVP Build", "Alpha Test"], milestone: "First User" }
];

export const MOCK_TIMELINE: TimelineData = {
  scenarios: [
    { 
      name: 'Conservative', 
      description: 'Slow organic growth, bootstrapping.', 
      revenueProjection: '$5k MRR by Month 12', 
      milestones: ['First 10 Customers', 'Break Even'], 
      obstacles: ['Marketing Fatigue', 'Slow Dev'],
      probability: 60
    },
    { 
      name: 'Smart', 
      description: 'Viral loop activation + solid product.', 
      revenueProjection: '$25k MRR by Month 12', 
      milestones: ['Product Hunt #1', 'Seed Round'], 
      obstacles: ['Server Costs', 'Support Load'],
      probability: 30
    },
    { 
      name: 'Insane', 
      description: 'Lightning in a bottle. Unicorn path.', 
      revenueProjection: '$100k MRR by Month 12', 
      milestones: ['Series A', 'Global Expansion'], 
      obstacles: ['Regulatory Hammer', 'Competitor Copycats'],
      probability: 10
    }
  ]
};

export const MOCK_MVP = [
  { id: '1', name: 'Core Loop', description: 'The main value prop', complexity: 'Medium', category: 'Core' },
  { id: '2', name: 'Onboarding', description: 'User entry flow', complexity: 'Low', category: 'Experience' }
] as const;

export const MOCK_TECH_STACK: TechStackData = {
  category: "SaaS",
  description: "High-velocity web application stack optimized for speed and scale.",
  core: {
    title: "The Modern Vercel Stack",
    tools: [
      { name: "Next.js", desc: "React framework for production." },
      { name: "Supabase", desc: "Auth, Database, and Realtime in one." },
      { name: "Tailwind CSS", desc: "Rapid UI development." }
    ],
    reasoning: "Eliminates DevOps overhead so you can focus on product logic."
  },
  ai: {
    tools: [
      { name: "Gemini API", desc: "Multimodal reasoning." },
      { name: "LangChain", desc: "Orchestration layer." }
    ]
  },
  brand: {
    tools: [
      { name: "Figma", desc: "Interface design." },
      { name: "Framer", desc: "Landing page." }
    ]
  },
  ops: {
    tools: [
      { name: "Resend", desc: "Transactional email." },
      { name: "Stripe", desc: "Payments." }
    ]
  },
  infra: {
    tools: [
      { name: "Vercel", desc: "Edge deployment." },
      { name: "GitHub", desc: "Version control." }
    ]
  },
  budget: {
    lean: "$0/mo (Free tiers)",
    balanced: "$40/mo (Pro plans)",
    premium: "$200/mo (Team scale)"
  },
  metrics: {
    difficulty: 3,
    timeline: ["Day 1: Setup", "Day 3: Core Loop", "Day 7: Launch"]
  },
  recommendation: {
    now: "Deploy the Next.js starter template on Vercel.",
    later: "Add Redis for caching once you hit 1k users."
  }
};

export const MOCK_GEO = { region: 'Global', reason: 'Digital first', tam: '$1B', complexity: 'Low' };

export const MOCK_LAUNCH: LaunchData = {
  headline: "The Future of Work is Here.",
  channels: [
    { name: "Product Hunt", strategy: "Launch day blitz", type: "Viral" },
    { name: "LinkedIn", strategy: "Founder stories", type: "Organic" }
  ],
  contentPillars: ["Build in Public", "Thought Leadership", "User Stories"],
  timeline: ["Teaser (Week 1)", "Beta (Week 3)", "Public (Week 6)"]
};

export const MOCK_RISKS = [
  { risk: 'Platform Dependency', impact: 8, probability: 4, mitigation: 'Diversify APIs' }
];

// Dashboard Mocks
export const MOCK_DASHBOARD_EXPERIMENTS = [
  { id: '1', type: 'Landing Page', name: 'Waitlist "Fake Door"', status: 'Completed', visitors: 1240, conversionRate: 12.4 },
  { id: '2', type: 'Ads', name: 'Instagram "Problem" Ad', status: 'Active', visitors: 450, conversionRate: 3.2 },
  { id: '3', type: 'Outreach', name: 'Cold DM Campaign', status: 'Pending', visitors: 0, conversionRate: 0 }
];

export const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'NeoSync',
    pitch: 'AI-powered calendar that negotiates meeting times automatically.',
    lastEdited: '2h ago',
    validationScore: 72,
    stage: 'Validation',
    tags: ['Tech'],
    revenue: '$0'
  }
];

export const MOCK_MVP_FEATURES = [
  { id: '1', name: 'Feature A', priority: 'High', effort: 'Medium', status: 'Done' }
];

export const STACKS = [
  { name: 'Vercel Ship', tech: 'Next.js + Supabase', desc: 'Best for speed and realtime features.' }
];

export const MOCK_PROFILE: UserProfile = {
  name: "Founder",
  archetype: "Visionary Architect",
  level: 12,
  mission: "Building the future.",
  badges: ["First Idea"],
  traits: [
    { name: "Vision", score: 90 },
    { name: "Execution", score: 65 },
    { name: "Resilience", score: 80 }
  ]
};

// --- ADVANCED LAYER MOCKS ---

export const MOCK_MEMORY_GRAPH_NODES: MemoryNode[] = [
  { id: '1', label: 'Visionary', type: 'TRAIT', value: 90, x: 50, y: 50, connections: ['2', '3'] },
  { id: '2', label: 'Tech Stack', type: 'INTEREST', value: 70, x: 30, y: 70, connections: ['1'] },
  { id: '3', label: 'B2B Sales', type: 'WEAKNESS', value: 40, x: 70, y: 30, connections: ['1', '4'] },
  { id: '4', label: 'Marketing', type: 'INTEREST', value: 60, x: 80, y: 60, connections: ['3'] },
  { id: '5', label: 'Product Design', type: 'STRENGTH', value: 95, x: 20, y: 20, connections: ['1', '2'] }
];

export const MOCK_FOUNDER_TIMELINE_EVENTS: TimelineEvent[] = [
  { id: '1', date: 'Oct 10, 2024', title: 'First Spark', type: 'IDEA', description: 'Created Inizio Project.' },
  { id: '2', date: 'Oct 15, 2024', title: 'Validation Spike', type: 'EXECUTION', description: 'Ran 3 experiments in 24 hours.' },
  { id: '3', date: 'Oct 20, 2024', title: 'Pricing Pivot', type: 'PIVOT', description: 'Shifted from Freemium to Paid.' },
  { id: '4', date: 'Nov 01, 2024', title: 'First 10 Users', type: 'MILESTONE', description: 'Crossed the double digit mark.' }
];

// Generate Heatmap Data
export const MOCK_EXECUTION_HEATMAP_DATA: HeatmapDay[] = Array.from({ length: 365 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (364 - i));
  const intensity = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
  return {
    date: date.toISOString().split('T')[0],
    intensity,
    count: intensity * 2
  };
});

export const MOCK_PLAYGROUND_ITEMS: PlaygroundItem[] = [
  { id: '1', type: 'NOTE', content: 'What if we target niche communities instead of broad social?', x: 100, y: 100, color: '#2EC7FF' },
  { id: '2', type: 'SKETCH', content: '', x: 300, y: 150, width: 200, height: 150 }, // Placeholder for SVG path
  { id: '3', type: 'NOTE', content: 'Competitor X is weak on mobile.', x: 150, y: 300, color: '#FFD60A' }
];

// --- AUDIO AGENT MOCKS ---

export const MOCK_PERSONAS: CallPersona[] = [
  { 
    id: '1', 
    name: 'Curious Customer', 
    icon: HelpCircle, 
    description: 'Open-minded but needs convincing.', 
    tone: 'Warm',
    instructions: 'You are a potential customer interested in the product but need to understand the value proposition clearly. Ask questions about how it works and what benefits it offers.'
  },
  { 
    id: '2', 
    name: 'Skeptical Buyer', 
    icon: AlertTriangle, 
    description: 'Pushes on price and trust.', 
    tone: 'Critical',
    instructions: 'You are a tough buyer who has seen many similar products fail. Question the pricing model, data privacy, and long-term viability. Be hard to convince.'
  },
  { 
    id: '3', 
    name: 'Retail Buyer', 
    icon: ShoppingBag, 
    description: 'Asks about margins & scale.', 
    tone: 'Professional',
    instructions: 'You represent a retail chain or enterprise looking for bulk adoption. Focus on margins, scalability, support SLAs, and implementation timeframes.'
  },
  { 
    id: '4', 
    name: 'Creator', 
    icon: Camera, 
    description: 'Focuses on vibes and aesthetic.', 
    tone: 'Excited',
    instructions: 'You are a content creator who cares about aesthetics, user experience, and brand alignment. Ask about customization, design features, and community vibes.'
  }
];

// --- USER FINDER MOCKS ---

export const MOCK_FINDER_RESULTS: FinderResult[] = [
  { id: '1', platform: 'Reddit', username: 'tech_guy_99', snippet: 'I hate how fragmented my tools are. Is there anything that combines Notion and Linear?', relevance: 95, url: '#', date: '2h ago' },
  { id: '2', platform: 'X (Twitter)', username: '@startup_sarah', snippet: 'Building in public is hard when you have to manage 10 different SaaS subscriptions.', relevance: 88, url: '#', date: '5h ago' },
  { id: '3', platform: 'IndieHackers', username: 'bootstrapper1', snippet: 'Looking for a co-founder who can handle the product side while I do sales.', relevance: 70, url: '#', date: '1d ago' },
  { id: '4', platform: 'YouTube', username: 'ProductReviewer', snippet: 'Top 10 productivity tools for 2025 (and why most fail)', relevance: 65, url: '#', date: '2d ago' },
];
